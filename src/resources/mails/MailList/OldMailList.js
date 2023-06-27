import { Fragment, useState, useEffect, useLayoutEffect, useMemo } from "react";
import { cloneElement } from "react";
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  DateField,
  ReferenceField,
  BulkExportButton,
  BulkDeleteButton,
  Show,
  SimpleShowLayout,
  RichTextField,
  useListContext,
  TopToolbar,
  CreateButton,
  ExportButton,
  // Button,
  sanitizeListRestProps,
  Filter,
  SelectInput,
  useNotify,
  Confirm,
  Pagination,
  useGetList,
} from "react-admin";
import EventIcon from "@material-ui/icons/Event";
import Button from "@material-ui/core/Button";
import MuiTextField from "@material-ui/core/TextField";

import axios from "axios";

import { isEmpty, isDev, stringToArray } from "../../utils/commonUtils";
import Modal from "../../component/Modal";

import MailFilterSidebar from "./MailFilterSidebar";
import MailContent from "./MailContent";
import MailContentDev from "./MailContentDev";

import MailContentProd from "./MailContentProd";

const MAILCONTENT = isDev() ? MailContentDev : MailContentProd;
const MAILSUBJECT = isDev()
  ? "[테스트]엠스토리허브_9월 정산 내역입니다."
  : "엠스토리허브_9월 정산 내역입니다.";
const BCCEMAILADDR = isDev()
  ? ["", ""]
  : ["tax@mstoryhub.com", "dev@mstoryhub.com"];
const SENDEMAILADDR = "tax@mstoryhub.com";
const RECVMAILADDR = isDev() ? "gaejoon.ahn@mstoryhub.com" : "";

const MailList = (props) => {
  return (
    <List
      {...props}
      actions={<ListActions />}
      // filter={{ month_calculate: props.date }}
      // filters={<MailFilter />}
      // filterDefaultValues={{ month_calculate: "2021-07" }}
      bulkActionButtons={<MailBulkActionButtons />}
      pagination={<Pagination rowsPerPageOptions={[10, 30, 50, 100]} />}
      aside={<MailFilterSidebar {...props} />}
    >
      <Datagrid rowClick="edit">
        {/* <TextField source="Cp.cp_name" />
      <TextField source="Cp.cp_type" />
      <TextField source="Cp.contact_email" /> */}
        <TextField source="recv_email" />
        <TextField source="attach_bucket_path" />
        <TextField source="attach_files" />
        <TextField source="month_calculate" />
        <TextField source="status_sending" />
        <TextField source="cp_type" />
        <DateField source="date_create" />
        {/* <DateField source="date_send" />
        <DateField source="date_update" /> */}
      </Datagrid>
    </List>
  );
};

const getSelectedData = (data, selectedIds) => {
  console.log(`getSelectedData`);
  console.log("data", data);
  console.log("selectedIds", selectedIds);

  // 1. data복사
  const recvEmailList = [];
  let cloneData = JSON.parse(JSON.stringify(data));

  // 2. 복사한데이터에 받는메일주소 수정
  for (let i in data) {
    const { recv_email } = data[i];

    if (isDev()) {
      recvEmailList.push(RECVMAILADDR);
      cloneData[i].recv_email = RECVMAILADDR;
    } else {
      recvEmailList.push(recv_email);
    }
  }

  // 3. 스테이지에따라 복사데이터 원본데이터 선택
  const finalData = isDev() ? cloneData : data;

  if (isEmpty(selectedIds)) {
    return { selectedData: finalData, recvEmailList };
  }

  // 4. 선택한데이터만 추출
  const selectedData = Object.keys(finalData)
    .filter((key) => selectedIds.includes(Number(key)))
    .reduce((obj, key) => {
      obj[key] = finalData[key];
      return obj;
    }, {});

  return { selectedData, recvEmailList };
};

const ListActions = (props) => {
  const notify = useNotify();
  const [isOpen, setOpen] = useState(false);
  const [recvEmailList, setRecvEmailList] = useState([]);
  const [selectedData, setSelectedData] = useState({});
  // const [mailSubject, setMailSubject] = useState(MailContent.mailSubject);
  // const [mailBody, setMailBody] = useState(MailContent.mailBody);

  const { className, filters, maxResults, data, ...rest } = props;
  const {
    currentSort,
    resource,
    displayedFilters,
    filterValues,
    basePath,
    selectedIds,
    showFilter,
    total,
    //setFilters,
  } = useListContext();

  useLayoutEffect(() => {
    console.log("ListActions - useLayoutEffect ** - 1");

    // setFilters({month_calculate:"2021-07"});
    // console.log("ListActions - useLayoutEffect ** >>> **");
    let { recvEmailList, selectedData } = getSelectedData(
      data || {},
      selectedIds
    );
    setRecvEmailList(recvEmailList);
    setSelectedData(selectedData);
  }, [data, selectedIds]);

  return (
    <TopToolbar className={className} {...sanitizeListRestProps(rest)}>
      {filters &&
        cloneElement(filters, {
          resource,
          showFilter,
          displayedFilters,
          filterValues,
          context: "button",
        })}
      {/* <CreateButton basePath={basePath} /> */}
      <ExportButton
        disabled={total === 0}
        resource={resource}
        sort={currentSort}
        filterValues={filterValues}
        maxResults={maxResults}
      />
      {/* <Button
        color="primary"
        size="small"
        startIcon={<EventIcon />}
        onClick={() => {
          setOpen(true);
        }}
      >
        메일 전송 팝업
      </Button> */}
      <Modal
        isOpen={isOpen}
        onConfirm={() => {
          exporter({ data: selectedData, filterValues, notify });
          setOpen(false);
        }}
        onClose={() => {
          setOpen(false);
        }}
      >
        {`환경 : ${isDev() ? "DEV" : "PROD"}
          ${
            isDev() &&
            "DEV환경 이므로 받는사람은 gaejoon.ahn@mstoryhub.com으로 대체"
          }
          보낸사람 : ${SENDEMAILADDR}
          메일제목 : ${MAILSUBJECT}
          숨은참조 : ["${BCCEMAILADDR[0]}","${BCCEMAILADDR[1]}"]

          받는사람 : ${
            recvEmailList &&
            recvEmailList.map((recv, i) => {
              return `\n${i}. ${recv}`;
            })
          }

          cp타입 : ${JSON.stringify(filterValues)}

          메일전송?  
        `}
        {/* <div>
          <MuiTextField
            autoFocus
            id="outlined-mailSubject"
            label="메일제목"
            value={mailSubject}
            onChange={(e) => setMailSubject(e.target.value)}
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
            onChange={(e) => setMailBody(e.target.value)}
            variant="outlined"
            margin="normal"
            fullWidth
            multiline
          />
        </div> */}
      </Modal>
    </TopToolbar>
  );
};

const MailBulkActionButtons = (props) => {
  const { selectedIds, filterValues } = props;
  let cpType = "";
  const notify = useNotify();
  const [isOpen, setOpen] = useState(false);
  const [recvEmailList, setRecvEmailList] = useState([]);
  const [selectedData, setSelectedData] = useState({});
  const [mailSubject, setMailSubject] = useState(
    MAILCONTENT(cpType)?.mailSubject
  );
  const [mailBody, setMailBody] = useState(MAILCONTENT(cpType)?.mailBody);

  const { total, onUnselectItems } = useListContext();
  const { data } = useGetList(
    "mail",
    { page: 1, perPage: total },
    { field: "id", order: "DESC" },
    { id: selectedIds }
  );

  useEffect(() => {
    console.log("mailsubject, mailbody update");
    // filterValues.month_calculate = "2021-07";
    // filterValues.cp_type_code = "P";
    console.log(
      "--- filterValues.month_calculate =",
      filterValues.month_calculate
    );
    if (filterValues.cp_type_code === "P") {
      setMailSubject(MAILCONTENT("Person")?.mailSubject);
      setMailBody(MAILCONTENT("Person")?.mailBody);
    }
    if (filterValues.cp_type_code === "C") {
      setMailSubject(MAILCONTENT("Company")?.mailSubject);
      setMailBody(MAILCONTENT("Company")?.mailBody);
    }
  }, [filterValues.cp_type_code, filterValues.month_calculate]);
  // [filterValues.cp_type_code, filterValues.month_calculate]);
  useLayoutEffect(() => {
    console.log("recvEmailList, update");
    let { recvEmailList, selectedData } = getSelectedData(
      data || {},
      selectedIds
    );
    setRecvEmailList(recvEmailList);
    setSelectedData(selectedData);
  }, [data]);
  // [Object.keys(data).length]);

  return (
    <Fragment>
      <BulkDeleteButton {...props} />
      <Button
        color="primary"
        size="small"
        startIcon={<EventIcon />}
        onClick={() => {
          setOpen(true);
        }}
      >
        메일 전송 팝업
      </Button>
      <Modal
        isOpen={isOpen}
        onConfirm={() => {
          exporter({
            data: selectedData,
            filterValues,
            notify,
            mailSubject,
            mailBody,
          });
          setOpen(false);
        }}
        onClose={() => {
          setOpen(false);
        }}
      >
        {`환경 : ${isDev() ? "DEV" : "PROD"}
          ${
            isDev()
              ? "DEV환경 이므로 받는사람은 gaejoon.ahn@mstoryhub.com으로 대체"
              : ""
          }
          보낸사람 : ${SENDEMAILADDR}
          메일제목 : ${MAILSUBJECT}
          숨은참조 : ["${BCCEMAILADDR[0]}","${BCCEMAILADDR[1]}"]

          받는사람 : ${
            recvEmailList &&
            recvEmailList.map((recv, i) => {
              return `\n${i}. ${recv}`;
            })
          }

          cp타입 : ${JSON.stringify(filterValues)}

          메일전송?  
        `}
        <div>
          <MuiTextField
            autoFocus
            id="outlined-mailSubject"
            label="메일제목"
            value={mailSubject}
            onChange={(e) => setMailSubject(e.target.value)}
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
            onChange={(e) => setMailBody(e.target.value)}
            variant="outlined"
            margin="normal"
            fullWidth
            multiline
          />
        </div>
      </Modal>
    </Fragment>
  );
};

const MailFilter = (props) => {
  return (
    <Filter {...props}>
      <SelectInput
        label="타입"
        source="Cp.cp_type"
        choices={[
          { id: "개인", name: "개인" },
          { id: "사업자", name: "사업자" },
        ]}
        alwaysOn
      />
    </Filter>
  );
};

const exporter = ({ data, filterValues, notify, mailSubject, mailBody }) => {
  console.log(`... exporter  ..`);
  let cpType = "";

  // temp - 21.07.27
  // filterValues.cp_type_code = "P";

  if (isEmpty(filterValues.cp_type_code)) {
    notify("필터로 CP타입을 지정해야합니다. 개인/사업자", "warning");
    return;
  }

  /*
  if (filterValues.cp_type_code === "P") {
    cpType = "person";
  }
  if (filterValues.cp_type_code === "C") {
    cpType = "company";
  }

  if (filterValues.Cp.cp_type === "개인") {
    cpType = "person";
  }
  if (filterValues.Cp.cp_type === "사업자") {
    cpType = "company";
  }
  */

  const convert = [];

  for (var i in data) {
    const {
      // Cp,
      attach_bucket_path,
      attach_files,
      recv_email, // 임시
      date_send,
      status_sending,
    } = data[i];

    // check - sended mail, add by gjahn, 21.05.12
    if (!date_send && status_sending === 0) {
      // const attachFilesArray = stringToArray(attach_files);
      // const contactEmailArray = stringToArray(Cp.contact_email);

      const attachFilesArray = stringToArray(attach_files);
      const contactEmailArray = stringToArray(recv_email);

      const res = {
        sendEmailAddr: SENDEMAILADDR,
        recvEmailAddr: contactEmailArray,
        ccEmailAddr: "",
        bccEmailAddr: BCCEMAILADDR,
        mailSubject: mailSubject || MAILSUBJECT,
        mailBody: mailBody || "",
        targetBucket: attach_bucket_path,
        targetFile: attachFilesArray,
      };

      convert.push(res);
    }
  }
  console.log("convert", convert);

  if (convert.length === 0) {
    notify("신규 메일 전송할 대상", "warning");
    return;
  }

  axios
    .post(`${process.env.REACT_APP_API_PATH}/mail/send`, {
      data: convert,
      cpType: cpType,
    })
    .then((response) => {
      console.log(response);
      notify(`메일전송 성공 ${convert.length}개`, "info");
    })
    .catch((error) => {
      console.log(error);
      notify("메일전송 실패", "warning");
    });
};

export default MailList;
