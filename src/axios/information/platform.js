import api from "../api";

// 정보관리 > 플랫폼 목록 조회
export async function getPlatformList(data) {
  return await api.get(`information/platform/list`, { params: data }).then((result) => {
    return result;
  });
}

// 정보관리 > 플랫폼 목록 CSV 다운로드 (=내보내기)
export async function getCsvExport(data) {
  return await api.get(`information/platform/csvExport`, { params: data }).then((result) => {
    return result;
  });
}

// 정보관리 > 플랫폼 코드값 조회 (팝업)
export async function getPopupGpOldPlatforms(data) {
  return await api
    .get(`information/platform/popupGpOldPlatforms?searchKeyword=${data.searchKeyword}`)
    .then((result) => {
      return result;
    });
}

// TODO 정보관리 > 플랫폼_단일 최근등록된 플랫폼 코드값 조회 (등록 시 기 등록된 플랫폼코드 조회/신규코드 발급 용도)
// TODO 정보관리 > 플랫폼_단일 최근등록된 플랫폼 상세 코드값 조회 (등록 시 기 등록된 플랫폼코드2 신규코드 발급 용도)
// 정보관리 > 플랫폼_단일 신규코드 발급 (등록 페이지 이동시)
export async function postCreateGpOldPlatform(data) {
  return await api.post(`information/platform/singlePlatforms/createGpOldPlatform`, { params: data }).then((result) => {
    return result;
  });
}

// 정보관리 > 플랫폼_단일 신규코드 삭제 (등록 페이지에서 취소 이동시 플랫폼 단일코드 삭제)
export async function deleteGcmManageId(data) {
  return await api.delete(`information/platform/singleWorks/deleteGcmManageId/${data}`).then((result) => {
    return result;
  });
}

// 정보관리 > 플랫폼_단일 플랫폼 2코드 신규코드 발급 (등록 페이지에서 플랫폼 2코드 추가 버튼 클릭 시)
export async function postCreateGpOldDetail(data) {
  return await api.post(`information/platform/singlePlatforms/${data}/createGpOldDetail`).then((result) => {
    return result;
  });
}

// 정보관리 > 플랫폼_단일 등록
export async function postSinglePlatforms(data) {
  return await api.post(`information/platform/singlePlatforms`, data).then((result) => {
    return result;
  });
}

// 정보관리 > 플랫폼_단일 상세
export async function getSinglePlatforms(data) {
  return await api.get(`information/platform/singlePlatforms/${data.param}`).then((result) => {
    return result;
  });
}

// TODO 정보관리 > 플랫폼_단일 상세 (팝업용)
export async function getPopupSinglePlatforms(gpIdx) {
  return await api.get(`information/platform/singlePlatforms/${gpIdx}`).then((result) => {
    return result;
  });
}

// 정보관리 > 플랫폼_단일 수정
export async function putSinglePlatforms(data) {
  return await api.put(`information/platform/singlePlatforms/${data.GP_IDX}`, data).then((result) => {
    return result;
  });
}

// 정보관리 > 작품_단일 매출반영월 업데이트
export async function patchRevenueUpdateMonth(data) {
  return await api.patch(`information/platform/singlePlatforms/revenueUpdateMonth`, data).then((result) => {
    return result;
  });
}

// 정보관리 > 작품_그룹 매출반영월 업데이트
export async function patchGroupRevenueUpdateMonth(data) {
  return await api.patch(`information/platform/groupPlatforms/revenueUpdateMonth`, data).then((result) => {
    return result;
  });
}

// 정보관리 > 플랫폼 그룹 신규코드 발급 (등록 페이지 이동시)
export async function postCreateGpgOldPlatform(data) {
  return await api.post(`information/platform/groupPlatforms/createGpgOldPlatform`, { params: data }).then((result) => {
    return result;
  });
}

// 정보관리 > 플랫폼 그룹 신규코드 삭제 (등록 페이지에서 취소 이동시)
export async function deleteGpgOldPlatform(data) {
  return await api.delete(`information/platform/groupPlatforms/deleteGpgOldPlatform/${data}`).then((result) => {
    return result;
  });
}

// 정보관리 > 플랫폼 그룹 등록
export async function postGroupPlatforms(data) {
  return await api.post(`information/platform/groupPlatforms`, data).then((result) => {
    return result;
  });
}

// 정보관리 > 플랫폼 그룹 상세
export async function getGroupPlatforms(data) {
  return await api.get(`information/platform/groupPlatforms/${data.param}`, { params: data }).then((result) => {
    return result;
  });
}

// 정보관리 > 플랫폼 그룹 상세 (팝업용)
export async function getPopupGroupPlatforms(gpgIdx) {
  return await api.get(`information/platform/groupPlatforms/${gpgIdx}`).then((result) => {
    return result;
  });
}

// 정보관리 > 플랫폼 그룹 상세 수정
export async function putGroupPlatforms(data) {
  return await api.put(`information/platform/groupPlatforms/${data.param}`, data).then((result) => {
    return result;
  });
}
