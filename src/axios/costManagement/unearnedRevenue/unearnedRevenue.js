import api from "axios/api";

// 비용관리 > 선급금 내역 > 선급금 월별 상세 목록 조회
export async function unearnedRevenueMonthDetailsList(data) {
  return await api.get(`/cost/unearnedRevenues/${data.param}/monthDetails`, { params: data }).then((result) => {
    return result;
  });
}

// 비용관리 > 선급금 내역 > 선급금 월별 상세 목록 조회 (Excel)
export async function unearnedRevenueMonthDetailsListExcel(data) {
  return await api
    .get(`/cost/unearnedRevenues/${data.param}/monthDetails/excelDown`, { params: data })
    .then((result) => {
      return result;
    });
}

// 비용관리 > 선급금 내역 > 선급금 월별 팝업
export async function unearnedRevenuePopupList(data) {
  return await api.get(`/cost/unearnedRevenues/popup`, { params: data }).then((result) => {
    return result;
  });
}
