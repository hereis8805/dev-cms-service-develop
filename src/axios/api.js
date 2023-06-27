import axios from "axios";

// 쿠키 읽기
const getCookie = (key) => {
  key = new RegExp(key + "=([^;]*)"); // 쿠키들을 세미콘론으로 구분하는 정규표현식 정의
  return key.test(document.cookie) ? unescape(RegExp.$1) : ""; // 인자로 받은 키에 해당하는 키가 있으면 값을 반환
};

export default axios.create({
  baseURL: process.env.REACT_APP_API_PATH,
  headers: { "x-auth-token": getCookie("token") }
});

axios.interceptors.response.use((config) => {
  console.log("config : ", config);
});
