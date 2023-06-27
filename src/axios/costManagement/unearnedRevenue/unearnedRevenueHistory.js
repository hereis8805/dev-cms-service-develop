import api from "axios/api";

// 비용관리 > 선수금 내역 목록 조회
export async function getUnearnedRevenueHistory(param) {
  return await api
    .get(`/cost/unearnedRevenues/${param.GPM_PREPAID_SEQ}/histories`, { params: { selectYear: param.selectYear } })
    .then((result) => {
      return result;
    });
}
