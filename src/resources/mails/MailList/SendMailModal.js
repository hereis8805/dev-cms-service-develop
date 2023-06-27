import { useCallback, useState, useEffect } from "react";
import { useListContext, useNotify, useGetList } from "react-admin";
import MuiTextField from "@material-ui/core/TextField";
import { Box } from "@mui/material";

import { useQuery, useMutation } from "react-query";

import { getMails, createSendMail } from "api/mails";

import { isEmpty, isDev, stringToArray } from "utils/commonUtils";

import Modal from "component/Modal";

const IS_DEV = isDev();
const TEST_MAIL = "dev@mstoryhub.com";
const BCCEMAILADDR = IS_DEV ? ["", ""] : ["tax@mstoryhub.com", "dev@mstoryhub.com"];
const SENDEMAILADDR = "tax@mstoryhub.com";
const RECVMAILADDR = IS_DEV ? "gaejoon.ahn@mstoryhub.com" : "";

function getMailTitleBasedOnEnv(mailTitle, cpType) {
  return IS_DEV ? `[테스트-${cpType}] ${mailTitle}` : mailTitle;
}

function SendMailModal({ isShowing, isTestMode, selectedIds, onClose }) {
  const {
    data: getMailsData,
    isLoading: isGetMailsLoading,
    refetch: onGetMails
  } = useQuery("", getMails, {
    enabled: false
  });
  const { isLoading: isCreateSendMailLoading, mutateAsync } = useMutation(createSendMail);
  const { total, filterValues } = useListContext();
  const notify = useNotify();
  const { data } = useGetList("mail", { page: 1, perPage: total }, { field: "id", order: "DESC" }, { id: selectedIds });
  const [recvMails, setRecevMails] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [testMail, setTestMail] = useState(TEST_MAIL);
  const [mailTitle, setMailTitle] = useState("");
  const [mailBody, setMailBody] = useState("");

  const getSelectedData = useCallback(() => {
    if (!data || !selectedIds) return null;

    const nextData = {};

    /**
     * data의 아이템 형식이 아래와 같이 되어 있다
     *   {
     *     key: {
     *      key: value,
     *      ...
     *     }, {
     *     key: {
     *      key: value,
     *      ...
     *     }
     *   },
     * }
     */
    const recvEmails = Object.entries(data).map(([key, value]) => {
      const email = IS_DEV ? RECVMAILADDR : value.recv_email;

      nextData[key] = {
        ...value,
        recv_email: email
      };

      return email;
    });

    if (isEmpty(selectedIds)) {
      return {
        selectedData: nextData,
        recvEmails
      };
    }

    // 선택한 데이터만 추출한다
    const selectedData = Object.keys(nextData)
      .filter((key) => selectedIds.includes(Number(key)))
      .reduce((obj, key) => {
        obj[key] = nextData[key];
        return obj;
      }, {});

    return { selectedData, recvEmails };
  }, [data, selectedIds]);

  function handleChangeMailTitle(e) {
    setMailTitle(e.target.value);
  }

  function handleChangeMailBody(e) {
    setMailBody(e.target.value);
  }

  function handleChangeTestMail(e) {
    setTestMail(e.target.value);
  }

  async function handleConfirm() {
    if (isEmpty(filterValues.cp_type_code)) {
      notify("필터로 CP타입을 지정해야합니다. 개인/사업자", { type: "warning" });

      return;
    }

    const convert = [];
    const cpType = filterValues.cp_type_code === "C" ? "사업자" : "개인";

    Object.entries(selectedData).forEach(([_, value]) => {
      const {
        attach_bucket_path,
        attach_files,
        recv_email, // 임시
        date_send,
        status_sending,
        id
      } = value;

      if (!date_send && status_sending === 0) {
        const attachFilesArray = stringToArray(attach_files);
        const contactEmailArray = stringToArray(recv_email);

        const res = {
          sendEmailAddr: SENDEMAILADDR,
          recvEmailAddr: isTestMode ? testMail : contactEmailArray,
          ccEmailAddr: "",
          bccEmailAddr: BCCEMAILADDR,
          mailSubject: mailTitle,
          mailBody: mailBody
            ? `<p><span style="font-family: Arial; font-size: 13px; white-space: pre-wrap; background-color: rgb(255, 255, 255);">${mailBody}</span><br/></p>`
            : "",
          targetBucket: attach_bucket_path,
          targetFile: attachFilesArray,
          dbId: id,
          flagTest: isTestMode ? true : false
        };

        convert.push(res);
      }
    });

    if (convert.length === 0) {
      notify("신규 메일 전송할 대상", { type: "warning" });
      return;
    }

    try {
      await mutateAsync({
        data: convert,
        cpType: cpType
      });

      notify(`메일전송 성공 ${convert.length}개`, { type: "success" });
      onClose();
    } catch (err) {
      notify("메일전송 실패", { type: "error" });
    }
  }

  useEffect(() => {
    onGetMails();
  }, [onGetMails]);

  useEffect(() => {
    if (!getMailsData) return;
    if (!filterValues.cp_type_code) return;

    const cpType = filterValues.cp_type_code === "C" ? "사업자" : "개인";
    const findCpTypeCode = getMailsData.data.findIndex((item) => filterValues.cp_type_code === item.cp_type_code);

    if (findCpTypeCode < 0) {
      setMailTitle(getMailTitleBasedOnEnv(getMailsData.data[0].mail_title, cpType));
      setMailBody(getMailsData.data[0].mail_body);

      return;
    }

    const findMonthCalculation = getMailsData.data.findIndex(
      (item) => filterValues.cp_type_code === item.cp_type_code && filterValues.month_calculate === item.month_calculate
    );

    if (findMonthCalculation < 0) {
      setMailTitle(getMailTitleBasedOnEnv(getMailsData.data[findCpTypeCode].mail_title, cpType));
      setMailBody(getMailsData.data[findCpTypeCode].mail_body);

      return;
    }

    setMailTitle(getMailTitleBasedOnEnv(getMailsData.data[findMonthCalculation].mail_title, cpType));
    setMailBody(getMailsData.data[findMonthCalculation].mail_body);
  }, [getMailsData, filterValues]);

  useEffect(() => {
    const selectedData = getSelectedData();

    if (!selectedData) return;

    setRecevMails(selectedData.recvEmails);
    setSelectedData(selectedData.selectedData);
  }, [getSelectedData]);

  return (
    <Modal isOpen={isShowing} onClose={onClose} onConfirm={handleConfirm}>
      <Box sx={{ width: 500 }}>
        <div>
          <ul>
            <li>환경: {`${IS_DEV ? "DEV" : "PROD"}`}</li>
            <li>CP 타입: {` ${filterValues.cp_type_code === "C" ? "사업자" : "개인"}`}</li>
            <li>메일제목: {mailTitle}</li>
            <li>보낸 사람: {`${SENDEMAILADDR}`}</li>
            <li>숨은참조 : {`${IS_DEV ? "없음 (DEV)" : `[${BCCEMAILADDR[0]}, ${BCCEMAILADDR[1]}]`}`}</li>
          </ul>
        </div>
        {isTestMode ? (
          <div>
            <MuiTextField
              label="받는사람"
              value={testMail}
              onChange={handleChangeTestMail}
              variant="outlined"
              margin="normal"
              fullWidth
              multiline
            />
          </div>
        ) : (
          <ul>
            <li>
              받는사람:
              <ul>
                {recvMails.map((recvMail) => (
                  <li key={recvMail}>{recvMail}</li>
                ))}
              </ul>
            </li>
          </ul>
        )}
        <div>
          <MuiTextField
            autoFocus
            id="outlined-mailSubject"
            label="메일제목"
            value={mailTitle}
            onChange={handleChangeMailTitle}
            variant="outlined"
            margin="normal"
            fullWidth
            multiline
          />
        </div>
        <div>
          <MuiTextField
            id="outlined-mailBody"
            label="메일내용"
            value={mailBody}
            onChange={handleChangeMailBody}
            variant="outlined"
            margin="normal"
            fullWidth
            multiline
          />
        </div>
      </Box>
    </Modal>
  );
}

export default SendMailModal;
