import api from "../api";

// export function getWorkList(data) {
//   return api.get(`information/work/list`, { params: data });
// }

// export function getWorkListCsvExport(data) {
//   return api.get(`information/work/csvExport`, { params: data });
// }

// 정보관리 > 작품 목록 조회
export async function getWorkList(data) {
  return await api.get(`information/work/list`, { params: data }).then((result) => {
    return result;
  });
}

// TODO 정보관리 > 작품 목록 CSV 다운로드 (=내보내기)
export async function getCsvExport(data) {
  return await api.get(`information/work/csvExport`, { params: data }).then((result) => {
    return result;
  });
}

// 정보관리 > 작품 코드값 조회 (팝업)
// export async function getPopupGpOldWorks(data) {
//   return await api.get(`information/popupGpOldWorks`, { params: data }).then((result) => {
//     return result;
//   });
// }

// 정보관리 > 작품_단일 최근등록된 작품 코드값 조회 (등록 시 기 등록된 작품코드 조회/신규코드 발급 용도)
// 정보관리 > 작품_단일 최근등록된 작품 상세 코드값 조회 (등록 시 기 등록된 작품코드2 신규코드 발급 용도)

//  정보관리 > 작품_단일 신규코드 발급 (등록 페이지 이동시)
export async function postCreateGcmManageId(data) {
  return await api
    .post(`information/work/singleWorks/createGcmManageId?gcmTypeCode=${data.param}`, { params: data })
    .then((result) => {
      return result;
    });
}

//  정보관리 > 작품_단일 신규코드 삭제 (등록 페이지에서 취소 이동시 작품 단일코드 삭제)
export async function deleteGcmManageId(data) {
  return await api.delete(`information/work/singleWorks/deleteGcmManageId/${data.param}`).then((result) => {
    return result;
  });
}

// TODO 정보관리 > 작품_단일 작품 2코드 신규코드 발급 (등록 페이지에서 작품 2코드 추가 버튼 클릭 시)
// export async function postCreateGpOldDetail(data) {
//   return await api
//     .post(`information/singleWorks/${data.param}/createGpOldDetail`, { params: data })
//     .then((result) => {
//       return result;
//     });
// }

// TODO 정보관리 > 작품_단일 등록
export async function postSingleWorks(data) {
  return await api.post(`information/work/singleWorks`, data).then((result) => {
    return result;
  });
}

// 정보관리 > 작품_단일 상세
export async function getSingleWorks(data) {
  return await api.get(`information/work/singleWorks/${data.param}`, { params: data }).then((result) => {
    return result;
  });
}

//  정보관리 > 작품_단일 상세 수정
export async function putSingleWorks(data) {
  console.log("data : ", data);
  return await api.put(`information/work/singleWorks/${data.gcmIdx}`, data).then((result) => {
    return result;
  });
}

// 정보관리 > 작품_단일 매출반영월 업데이트
export async function patchRevenueUpdateMonth(data) {
  return await api.patch(`information/work/singleWorks/revenueUpdateMonth`, data).then((result) => {
    return result;
  });
}

// 정보관리 > 작품 그룹 신규코드 발급 (등록 페이지 이동시)
export async function postCreateGcgOldGroup(data) {
  return await api.post(`information/work/groupWorks/createGcgOldGroup`, { params: data }).then((result) => {
    return result;
  });
}

// 정보관리 > 작품 그룹 신규코드 삭제 (등록 페이지에서 취소 이동시)
export async function deleteGcgOldGroup(data) {
  return await api
    .delete(`information/work/groupWorks/deleteGcgOldGroup/${data.param}`, { params: data })
    .then((result) => {
      return result;
    });
}

// 정보관리 > 작품 그룹 등록
export async function postGroupWorks(data) {
  return await api.post(`information/work/groupWorks`, data).then((result) => {
    return result;
  });
}

// 정보관리 > 작품 그룹 상세
export async function getGroupWorks(data) {
  return await api.get(`information/work/groupWorks/${data.param}`, { params: data }).then((result) => {
    return result;
  });
}

// 정보관리 > 작품 그룹 상세 수정
export async function putGroupWorks(data) {
  return await api.put(`information/work/groupWorks/${data.param}`, data).then((result) => {
    return result;
  });
}

// 정보관리 > 작품_그룹 매출반영월 업데이트
export async function patchGroupRevenueUpdateMonth(data) {
  return await api.patch(`information/work/groupWorks/revenueUpdateMonth`, data).then((result) => {
    return result;
  });
}

// 정보관리 > 작품 목록 조회 (팝업)
export async function getPopupWorks(data) {
  return await api.get(`information/work/popupWorks?searchKeyword=${data.searchKeyword}`).then((result) => {
    return result;
  });
}

// TODO 정보관리 > 작품그룹 목록 조회 (팝업)
export async function getPopupGroupWorks(data) {
  return await api.get(`information/work/popupGroupWorks?searchKeyword=${data.searchKeyword}`).then((result) => {
    return result;
  });
}
// 정보관리 > 계약서관리 목록 조회 (팝업)
export async function getPopupContract(data) {
  return await api.get(`cost/etc/popupContracts?searchKeyword=${data.searchKeyword}`).then((result) => {
    return result;
  });
}
