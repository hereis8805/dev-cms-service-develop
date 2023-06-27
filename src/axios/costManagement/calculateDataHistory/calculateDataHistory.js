import api from "../../api";

// 비용관리 > 정산조회 > 정산 데이터 내역
export async function getSettlementDatas(data) {
  return await api.get(`/cost/calculateManageGenerals/datas`, { params: data }).then((result) => {
    return result;
  });
}
