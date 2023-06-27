import api from "../api";

// 히스토리 > 작업내역(Main)
export async function getHistoriesMain(data) {
  return await api.get(`history/main`, { params: data }).then((result) => {
    return result;
  });
}

// 히스토리 > 작업내역 상세(페이지별 상세 페이지 하단 사용 용도)
export async function getHistoryDetailList(data) {
  return await api.get(`history/main`, { params: data }).then((result) => {
    return result;
  });
}

// 히스토리 > 계정접속정보 리스트
export async function getLoginHistories(data) {
  return await api.get(`history/account/loginHistories`, { params: data }).then((result) => {
    return result;
  });
}

// 히스토리 > 접속 히스토리 저장
export async function setLoginHistories(data) {
  return await api.post(`history/account/loginHistories`, data).then((result) => {
    return result;
  });
}

// 히스토리 > 계정발급정보
export async function getAccountIssuances(data) {
  return await api.get(`/history/account/accountIssuances`, { params: data }).then((result) => {
    return result;
  });
}
