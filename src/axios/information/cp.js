import api from "../api";

// 정보관리 > CP 목록 조회
export async function getCpkList(data) {
  return await api.get(`information/cp/list`, { params: data }).then((result) => {
    return result;
  });
}

// 정보관리 > CP 목록 CSV 다운로드 (=내보내기)
export async function getCpkListCsvExport(data) {
  return await api.get(`information/cp/csvExport`, { params: data }).then((result) => {
    return result;
  });
}

// 정보관리 > CP_단일 신규코드 발급 (등록 페이지 이동시)
export async function postCreateGcOld(data) {
  return await api.post(`information/cp/singleCps/createGcOld`).then((result) => {
    return result;
  });
}

// 정보관리 > CP_단일 신규코드 삭제 (등록 페이지에서 취소 이동시 CP 단일코드 + CP 단일상세코드 전부 삭제됨)
export async function deleteGcOld(data) {
  return await api.delete(`information/cp/singleCps/deleteGcOld/${data}`).then((result) => {
    return result;
  });
}

// 정보관리 > CP_단일 상세코드 발급 (등록 페이지의 상세코드 추가 클릭 시)
export async function postCreateGcOldDetail(data) {
  return await api.post(`information/cp/singleCps/createGcOld/${data}/createGcOldDetail`).then((result) => {
    return result;
  });
}

// 정보관리 > CP_단일 상세
export async function getCpSingleDetail(data) {
  console.log(data);
  return await api.get(`information/cp/singleCps/${data.param}`, { params: data }).then((result) => {
    return result;
  });
}

// 정보관리 > CP_단일 상세 (신규)
export async function getNewCpSingleDetail(gpIdx) {
  return await api.get(`information/cp/singleCps/${gpIdx}`).then((result) => {
    return result;
  });
}

// 정보관리 > CP 목록 조회 (팝업)
export async function getCpPopupCps(data) {
  return await api.get(`information/cp/popupCps?searchKeyword=${data.searchKeyword}`).then((result) => {
    return result;
  });
}

// 정보관리 > CP 그룹 목록 조회 (팝업)
export async function getCpPopupGroupCps(data) {
  return await api.get(`information/cp/popupGroupCps?searchKeyword=${data.searchKeyword}`).then((result) => {
    return result;
  });
}

// 정보관리 > CP_단일 등록
export async function postCpkSingleDetail(data) {
  return await api.post(`information/cp/singleCps`, data).then((result) => {
    return result;
  });
}

// 정보관리 > CP_단일 수정
export async function putCpkSingleDetail(data) {
  return await api.put(`information/cp/singleCps/${data.gcOld}`, data).then((result) => {
    return result;
  });
}

// 정보관리 > CP_그룹 신규코드 발급 (등록 페이지 이동시)
export async function postCreateGcgOldGroup(data) {
  return await api.post(`information/cp/groupCps/createGcgOldGroup`, { params: data }).then((result) => {
    return result;
  });
}

// 정보관리 > CP_그룹 신규코드 삭제 (등록 페이지에서 취소 이동시)
export async function deleteGcgOldGroup(data) {
  return await api.delete(`information/cp/groupCps/deleteGcgOldGroup/${data}`, { params: data }).then((result) => {
    return result;
  });
}

// 정보관리 > CP_그룹 등록
export async function postGroupCps(data) {
  return await api.post(`information/cp/groupCps`, data).then((result) => {
    return result;
  });
}

// 정보관리 > CP_그룹 상세
export async function getGroupCps(data) {
  return await api.get(`information/cp/groupCps/${data.param}`, { params: data }).then((result) => {
    return result;
  });
}

// 정보관리 > CP_그룹 상세 (신규)
export async function getNewGroupCps(gcgOldGroup) {
  return await api.get(`information/cp/groupCps/${gcgOldGroup}`).then((result) => {
    return result;
  });
}

// 정보관리 > CP_그룹 수정
export async function putGroupCps(data) {
  return await api.put(`information/cp/groupCps/${data.param}`, data).then((result) => {
    return result;
  });
}

// 정보관리 > CP_단일 매출반영월 업데이트
export async function patchRevenueUpdateMonth(data) {
  return await api.patch(`information/cp/singleCps/revenueUpdateMonth`, data).then((result) => {
    return result;
  });
}

// 정보관리 > CP_그룹 매출반영월 업데이트
export async function patchGroupRevenueUpdateMonth(data) {
  return await api.patch(`information/cp/groupCps/revenueUpdateMonth`, data).then((result) => {
    return result;
  });
}
