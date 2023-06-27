import api from "axios/api";

// 비용관리 > 정산 관리 종합 > 목록 조회
export async function getCalculateManageGeneralList(data) {
  return await api.get(`/cost/calculateManageGenerals`, { params: data }).then((result) => {
    return result;
  });
}

// 비용관리 > 정산 관리 종합 > Excel 추출용 리스트
export async function getCalculateManageGeneralcsvExportList(data) {
  return await api.get(`/cost/calculateManageGenerals/csvExportList`, { params: data }).then((result) => {
    return result;
  });
}

// 비용관리 > 정산 관리 종합 > 정산정보 등록
export async function postCalculateManageGeneralCreate(data) {
  return await api.post(`/cost/calculateManageGenerals`, data).then((result) => {
    return result;
  });
}

// TODO: 비용관리 > 정산 관리 종합 > 정산정보 수정
export async function putCalculateManageGeneralModify(data) {
  return await api.put(`/cost/calculateManageGenerals/${data.info.GC_MANAGE_ID}`, data).then((result) => {
    return result;
  });
}

// 비용관리 > 정산 관리 종합 > 정산정보 상세
export async function getCalculateManageGeneralDetail(data) {
  return await api.get(`/cost/calculateManageGenerals/${data.param}`).then((result) => {
    return result;
  });
}
