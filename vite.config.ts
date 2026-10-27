import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig, type Plugin } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { STATIC_PAGES } from './src/pages/policy/staticPages'

// 빌드 후 서비스 안내 · 정책 페이지를 내용이 들어간 HTML로 만들어 둠 (dist/terms.html 등)
// Paddle 심사 스캐너는 자바스크립트를 실행하지 않아서 빈 화면으로 보이기 때문
// Vercel은 cleanUrls로 /terms 요청에 terms.html을 줌 (vercel.json)
function prerenderPolicyPages(): Plugin {
  let outDir = 'dist'
  return {
    name: 'prerender-policy-pages',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.outDir
    },
    async closeBundle() {
      const shell = await readFile(join(outDir, 'index.html'), 'utf-8')
      for (const page of STATIC_PAGES) {
        // 바꿀 내용에 $가 있어도 그대로 들어가게 함수로 넘김
        const html = shell
          .replace(/<html lang="[^"]*">/, () => `<html lang="${page.lang}">`)
          .replace(/<title>.*<\/title>/, () => `<title>${page.title}</title>\n    <meta name="description" content="${page.description}" />`)
          .replace('<div id="root"></div>', () => `<div id="root">${page.body}</div>`)
        const file = join(outDir, page.file)
        await mkdir(dirname(file), { recursive: true })
        await writeFile(file, html)
      }
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] }),
    prerenderPolicyPages(),
  ],
  server: {
    port: 5173,
    strictPort: true,
  },
})
