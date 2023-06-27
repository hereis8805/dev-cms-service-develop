import api from "../../api";

// 비용관리 > 선급금 내역 > 선수금 관리 목록 조회
export async function unearnedRevenuesList(data) {
  return await api.get(`/cost/unearnedRevenues`, { params: data }).then((result) => {
    return result;
  });
}

// 비용관리 > 선급금 내역 > 선수금 관리 목록 조회 (Excel)
export async function unearnedRevenuesCSV(data) {
  return await api.get(`/cost/unearnedRevenues/csvExport`, { params: data }).then((result) => {
    return result;
  });
}

// 비용관리 > 선급금 내역 > 선수금 관리 상세
export async function getUnearnedRevenue(gpIdx) {
  return await api.get(`/cost/unearnedRevenues/${gpIdx}`).then((result) => {
    return result;
  });
}

// 비용관리 > 선급금 내역 > 선수금 관리 상세 수정
export async function putUnearnedRevenue(data) {
  return await api.put(`/cost/unearnedRevenues/${data.GP_IDX}`, data).then((result) => {
    return result;
  });
}

// 비용관리 > 선급금 내역 > 선수금 관리 상세 등록
export async function setUnearnedRevenue(data) {
  return await api.post(`/cost/unearnedRevenues`, data).then((result) => {
    return result;
  });
}

// 비용관리 > 선급금 내역 > 선수금 관리 신규 코드 발급
export async function createGpPrepaidSeq() {
  return await api.post(`/cost/unearnedRevenues/createGpPrepaidSeq`).then((result) => {
    return result;
  });
}

// TODO : 비용관리 > 선급금 내역 > 선수금 월별 상세 목록 조회
// export async function prepaidPaymentMonthDetailsList(data) {
//   return await api.get(`/cost/advancePayments/${data.param}/monthDetails`, { params: data }).then((result) => {
//     return result;
//   });
// }
