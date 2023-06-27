import api from "../api";
import axios from "axios";

// 비용관리 > 메일 발송 관리 > 메일 발송 관리 목록조회
export async function getMailManageSendHistories(data) {
  return await api.get(`/cost/mailManage/sendHistories`, { params: data }).then((result) => {
    return result;
  });
}

// TODO : 비용관리 > 메일 발송 관리 > 메일 발송
export async function postMailManageMailSend(data) {
  return await api.post(`/cost/mailManage/mailSend`, { gmhIdxs: data.gmhIdxs }).then((result) => {
    return result;
  });
}

// TODO : 비용관리 > 메일 발송 관리 > 메일 발송 관리 파일첨부
export async function postMailManageSendHistories(gmhIdx, gmtIdx, data) {
  const customAxios = axios.create({});

  return await customAxios
    .post(`${process.env.REACT_APP_API_PATH}/cost/mailManage/sendHistories/${gmhIdx}/uploadFile/${gmtIdx}`, data, {
      mode: "cors",
      headers: {
        "Content-Type": "multipart/form-data; charset=null"
      }
    })
    .then((result) => {
      return result;
    });
}

// 비용관리 > 메일 발송 관리 > 메일 템플릿 관리
export async function getMailManageTemplates() {
  return await api.get(`/cost/mailManage/templates`).then((result) => {
    return result;
  });
}

// 비용관리 > 메일 발송 관리 > 메일 템플릿 관리(삭제)
export async function putMailManageTemplates(data) {
  return await api.put(`/cost/mailManage/sendHistories`, data).then((result) => {
    return result;
  });
}

// 비용관리 > 메일 발송 관리 > 메일 템플릿 상세
export async function getMailManageTemplatesDetail(data) {
  return await api.get(`/cost/mailManage/templates/${data.param}`).then((result) => {
    return result;
  });
}

// 비용관리 > 메일 발송 관리 > 메일 템플릿 등록
export async function postMailManageTemplatesCreate(data) {
  return await api.post(`/cost/mailManage/templates`, data).then((result) => {
    return result;
  });
}

// 비용관리 > 메일 발송 관리 > 메일 템플릿 수정
export async function putMailManageTemplatesModify(gmtIdx, data) {
  return await api.put(`/cost/mailManage/templates/${gmtIdx}`, data).then((result) => {
    return result;
  });
}
