import api from "../api";

// 계정관리 > 계정 목록조회
export async function getAccountsList(data) {
  return await api.get(`/accountManage/accounts`, { params: data }).then((result) => {
    return result;
  });
}

export async function getAccountsListGrade() {
  return await api.get(`/accountManage/accountsGrade`).then((result) => {
    return result;
  });
}

// 계정관리 > 계정 정보 상세
export async function getAccountsDetail(guIdx) {
  return await api.get(`/accountManage/accounts/${guIdx}`).then((result) => {
    return result;
  });
}

// 계정관리 > 계정 정보 상세 수정
export async function putAccountsDetail(param) {
  return await api.put(`/accountManage/accounts/${param.GU_IDX}`, param).then((result) => {
    return result;
  });
}

export async function delAccounts(guIdx) {
  return await api.delete(`/accountManage/accounts/${guIdx}`).then((result) => {
    return result;
  });
}

// 계정관리 > 계정 정보 상세 > 비밀번호 변경
export async function patchAccountsPassword(param) {
  return await api.patch(`/accountManage/accounts/${param.GU_IDX}`, param).then((result) => {
    return result;
  });
}

// 계정관리 > 로그인
export async function isLogin(param) {
  return await api.post(`/accountManage/login`, param).then((result) => {
    return result;
  });
}

// 계정관리 > 회원가입
export async function isSignUp(param) {
  return await api.post(`/accountManage/accounts`, param).then((result) => {
    return result;
  });
}

// 등급조회
export async function isGrade(param) {
  return await api.post(`/accountManage/gradeInfo`, param).then((result) => {
    return result;
  });
}
