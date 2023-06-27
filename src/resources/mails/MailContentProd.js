const MailContentPerson = {
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

const MailContentCompany = {
  mailSubject: "엠스토리허브_9월 정산 내역입니다.",
  mailBody: `<p><span style="font-family: Arial; font-size: 13px; white-space: pre-wrap; background-color: rgb(255, 255, 255);">안녕하세요. 엠스토리허브 정산팀입니다.

9월 정산 내역을 보내드립니다.
  
상세 내역을 확인하신 후 계산서를 발행해주세요.
  
- 계산서 발행일 : 9월 24일에서 9월 30일 중 가능한 날짜
- 계산서 발송 주소 : tax@mstoryhub.com
- 계산서가 미행발될 경우 지급이 이월될 수 있습니다.
- 계산서는 10월 11일까지 발행 부탁드립니다.

궁금한 내용이 있을 경우 정산팀(tax@mstoryhub.com)으로 문의주시기 바랍니다.
감사합니다.
오늘도 좋은 하루 되세요. :D</span><br></p>`,
};

const MailContent = (type) => {
  if (type === "Person") {
    return MailContentPerson;
  }

  if (type === "Company") {
    return MailContentCompany;
  }

  return;
};

export default MailContent;
