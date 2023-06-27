import { isDev } from "../../utils/commonUtils";

const MailContentDev = {
  mailSubject: "[테스트]엠스토리허브_9월 정산 내역입니다.",
  mailBody: `<p><span style="font-family: Arial; font-size: 13px; white-space: pre-wrap; background-color: rgb(255, 255, 255);">[테스트입니다]</span><br></p>`,
};

const MailContentProd = {
  mailSubject: "엠스토리허브_9월 정산 내역입니다.",
  mailBody: `<p><span style="font-family: Arial; font-size: 13px; white-space: pre-wrap; background-color: rgb(255, 255, 255);">안녕하세요. 엠스토리허브 정산팀입니다.
  9월 정산 내역을 보내드립니다.
    
  9월 정산의 입금 예정일은 10월 말일입니다.
    
  개인 저자 정산의 경우 원천징수(3.3%)를 위해 정산금이 33,400원 이상일 경우 정산금이 지급됩니다.
  정산금이 33,400원 미만이면 정산금 지급이 다음달로 이월되오니 참고 바랍니다.
  
  궁금한 내용이 있을 경우 정산팀(tax@mstoryhub.com)으로 문의주시기 바랍니다.
  감사합니다.
  
  오늘도 좋은 하루 되세요. :D</span><br></p>`,
};
console.log("is Dev?? ", isDev());
const MailContent = isDev() ? MailContentDev : MailContentProd;

export default MailContent;
