export const paths = {
  home: "/",
  jury: "/jury",
  juryExplore: "/jury/explore",
  my: "/my",
  myJuryActivity: "/my/jury-activity",
  myCases: "/my/cases",
  myCaseDetail: (caseId: number | string) => `/my/cases/${caseId}`,
  myCaseDetailPattern: "/my/cases/:caseId",
  upload: "/judgment/upload",
  received: "/judgment/received",
  confirm: "/judgment/confirm",
  login: "/login",
} as const;
