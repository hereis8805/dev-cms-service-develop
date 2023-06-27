import api from "../api";

// 비용관리 > 정산조회 > CP 정산내역서 조회
export async function getCpSettlements(data) {
  return await api.get(`/cost/cpSettlements/histories`, { params: data }).then((result) => {
    return result;
  });
}

// 비용관리 > 정산조회 > CP 정산내역서 파일 조회
export async function getCpSettlementsFiles(data) {
  return await api.get(`/cost/cpSettlements/files`, { params: data }).then((result) => {
    return result;
  });
}
