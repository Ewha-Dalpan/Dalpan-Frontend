// AI 판결 결과 가짜 데이터 (판결문 전체 화면, 공유 받은 화면에서 같이 사용)
// TODO: API 연동 시 사건별 판결 결과로 교체

export const mockVerdict = {
  shareId: '0241', // 공유 주소에 들어가는 사건 구분값
  caseNumber: '月 제0241호',
  relation: '연인',
  title: '약속 직전 연락 공백 사건',
  reply: '다음부터 늦어질 것 같으면 미리 한마디만 해줬으면 좋겠어. 약속이 어떻게 되는지 몰라서 좀 서운했어.',
  myReasons: ['내 과실 근거'],
  otherReasons: ['약속 전 연락 공백', '일정의 불확실성', '응답성 부족'],
  myRatio: 10,
  otherRatio: 90,
}
