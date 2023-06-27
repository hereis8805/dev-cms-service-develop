import { atom } from "recoil";
import { getToday } from "utils/date";

export const forexRatiosAtom = atom({
  key: `forexRatiosAtom${Math.random()}`,
  default: undefined
});

export const initSearchMont = {
  settleManageWork: {
    selectDate: getToday("yyyy-MM"),
    searchKeyword: "",
    searchType: 1,
    page: 0
  },
  // settleManageWork: getToday("yyyy-MM"),
  settleManageCp: {
    selectDate: getToday("yyyy-MM"),
    searchKeyword: "",
    searchType: 1,
    page: 0
  },
  advancesMonthly: {
    searchKeyword: "",
    searchType: 1,
    startDate: getToday("yyyy-MM"),
    endDate: getToday("yyyy-MM"),
    page: 0
  },
  advances: {
    searchKeyword: "",
    searchType: 1,
    page: 0
  },
  prepaid: {
    searchKeyword: "",
    searchType: 1,
    page: 0
  },

  // 정산 데이터 내역
  calculateDataHistory: {
    searchDate: getToday("yyyy-MM"),
    page: 0
  },

  // 정산 관리 종합
  calculateManageGenerals: {
    searchKeyword: "",
    searchType: 1,
    page: 0
  },
  prepaidMonthly: {
    searchKeyword: "",
    searchType: 1,
    startDate: getToday("yyyy-MM"),
    endDate: getToday("yyyy-MM"),
    page: 0
  }
};

export const searchMonthAtom = atom({
  key: `searchMonthAtom${Math.random()}`,
  default: {
    // calculateDataHistory: getToday("yyyy-MM"),
    ...initSearchMont
  }
});
