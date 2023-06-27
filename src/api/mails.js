import apiClient from "./apiClient";

export function getMails() {
  return apiClient.get("/mailContent");
}

export function createMails(data) {
  return apiClient.post("/mailContent", {
    ...data
  });
}

export function createMailList(data) {
  return apiClient.post("/mail/list", data);
}

export function createMailValidation(data) {
  return apiClient.post("/mail/mail-validate", data);
}

export function createSendMail(data) {
  return apiClient.post("/mail/send", data);
}
