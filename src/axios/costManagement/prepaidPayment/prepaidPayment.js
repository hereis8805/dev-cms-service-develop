import api from "axios/api";

// 비용관리 > 선급금 > 목록 조회
export async function prepaidPaymentList(data) {
  return await api.get(`/cost/advancePayments`, { params: data }).then((result) => {
    return result;
  });
}

// 비용관리 > 선급금 > 목록 조회 CSV Export Data
export async function prepaidPaymentCSV(data) {
  return await api.get(`/cost/advancePayments/csvExport`, { params: data }).then((result) => {
    return result;
  });
}

// 비용관리 > 선급금 > 등록
export async function setPrepaidPaymentDetail(data) {
  return await api.post(`/cost/advancePayments`, data).then((result) => {
    return result;
  });
}

// 비용관리 > 선급금 > 신규 코드 발급
export async function setPrepaidPaymentCreateGpSeq() {
  return await api.post(`/cost/advancePayments/createGpPrepaidSeq`).then((result) => {
    return result;
  });
}

// 비용관리 > 선급금 > 상세
export async function getPrepaidPaymentDetail(gpIdx) {
  return await api.get(`/cost/advancePayments/${gpIdx}`).then((result) => {
    return result;
  });
}

// 비용관리 > 선급금 > 상세수정
export async function putPrepaidPaymentDetail(data) {
  return await api.put(`/cost/advancePayments/${data.GP_IDX}`, data).then((result) => {
    return result;
  });
}

// 비용관리 > 선급금 내역 > 선급금 월별 상세 목록 조회
export async function prepaidPaymentMonthDetailsList(data) {
  return await api.get(`/cost/advancePayments/${data.param}/monthDetails`, { params: data }).then((result) => {
    return result;
  });
}

// 비용관리 > 선급금 내역 > 선급금 월별 상세 목록 조회 (Excel)
export async function prepaidPaymentMonthDetailsListExcelDown(data) {
  return await api
    .get(`/cost/advancePayments/${data.param}/monthDetails/excelDown`, { params: data })
    .then((result) => {
      return result;
    });
}
