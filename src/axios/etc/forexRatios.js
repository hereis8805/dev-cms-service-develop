import api from "../api";

// 비용관리 > 기타관리 > 외환비율관리 목록
export async function getForexRatios(data) {
  return await api.get(`/cost/etc/forexRatios`, { params: data }).then((result) => {
    return result;
  });
}

// 상세
export async function getForexRatiosDetail(gerActual) {
  return await api.get(`/cost/etc/forexRatios/${gerActual}`).then((result) => {
    return result;
  });
}

// 비용관리 > 기타관리 > 외환비율관리 등록
export async function postForexRatios(data) {
  return await api.post(`/cost/etc/forexRatios`, { datas: data }).then((result) => {
    return result;
  });
}

// 수정
export async function putForexRatios(gerActual, data) {
  return await api.put(`/cost/etc/forexRatios/${gerActual}`, { datas: data }).then((result) => {
    return result;
  });
}
