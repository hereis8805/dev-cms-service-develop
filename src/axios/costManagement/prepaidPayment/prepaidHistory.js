import api from "axios/api";

// 비용관리 > 선급금 내역 목록 조회
export async function getPrepaidPaymentHistory(param) {
  return await api
    .get(`/cost/advancePayments/${param.GP_PREPAID_SEQ}/histories`, { params: { selectYear: param.selectYear } })
    .then((result) => {
      return result;
    });
}

// 비용관리 > 선급금 내역 > 최초 지급액 입력
export async function updateFirstPayoutInput(param) {
  return await api
    .patch(`/cost/advancePayments/${param.GP_PREPAID_SEQ}/histories/${param.GP_IDX}/firstPayoutInput`, {
      GP_BASE_BALANCE: param.GP_BASE_BALANCE,
      GP_REAL_BALANCE: param.GP_REAL_BALANCE
    })
    .then((result) => {
      return result;
    });
}

// 비용관리 > 선급금 내역 > 기초수정
export async function updateBasePriceUpdate(param) {
  return await api
    .patch(`/cost/advancePayments/${param.GP_PREPAID_SEQ}/histories/${param.GP_IDX}/basePriceUpdate`, {
      GP_BASE_MODIFY: param.GP_BASE_MODIFY,
      GP_REAL_MODIFY: param.GP_REAL_MODIFY
    })
    .then((result) => {
      return result;
    });
}

// 비용관리 > 선급금 내역 > 선택한 월 내역 정보 수정
export async function updateMonthHistory(param) {
  return await api
    .put(`/cost/advancePayments/${param.GP_PREPAID_SEQ}/histories/${param.GPM_IDX}`, {
      GPM_CONTACT: param.GPM_CONTACT,
      GPM_REAL: param.GPM_REAL,
      GPM_CONTACT_TERMINATION: param.GPM_CONTACT_TERMINATION,
      GPM_REAL_TERMINATION: param.GPM_REAL_TERMINATION,
      GPM_DESCRIPTION: param.GPM_DESCRIPTION
    })
    .then((result) => {
      return result;
    });
}
