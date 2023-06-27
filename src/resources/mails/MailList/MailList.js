import React, { useCallback } from "react";
import { Datagrid, List, FunctionField, TextField } from "react-admin";
import { format } from "date-fns";
import { Tooltip, Typography } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import { red, green, grey } from "@mui/material/colors";
import CircleIcon from "@mui/icons-material/Circle";

import MailListFilter from "./MailListFilter";
import MailListPagination from "./MailListPagination";
import MailListBulkActionButtons from "./MailListBulkActionButtons";

const useStyles = makeStyles({
  root: {
    width: "100%",
    "& th": {
      textAlign: "center"
    }
  },
  recevName: {
    maxWidth: 200
  },
  recvEmail: {
    maxWidth: 210
  },
  attachFiles: {
    maxWidth: 230
  }
});

function MailList(props) {
  const classes = useStyles();
  const getSendingStatus = useCallback((record) => {
    const WATING = 0;
    const SUCCESS = 2;

    if (record.status_sending === WATING) {
      return <CircleIcon sx={{ color: grey[200] }} />;
    }

    if (record.status_sending === SUCCESS) {
      return <CircleIcon sx={{ color: green[500] }} />;
    }

    // 그 외에는 실패로 간주한다
    return (
      <>
        <CircleIcon sx={{ color: red[500] }} />
        <br />
        <Tooltip placement="top" title={record.msg_fail}>
          <Typography variant="caption">실패사유</Typography>
        </Tooltip>
      </>
    );
  }, []);

  const getLineBreak = useCallback(
    (key) => (record) => {
      if (!record[key]) return null;

      const splitTexts = record[key].split(";");

      if (splitTexts.length <= 0) {
        return <span>{splitTexts}</span>;
      }

      const texts = splitTexts.map((splitText, index) => (
        <span>
          {splitText}
          {index + 1 < splitText.length && <br />}
        </span>
      ));

      return <>{texts}</>;
    },
    []
  );

  const getAttachFiles = useCallback(
    (record) => {
      const nextRecord = {
        ...record,
        attach_files: record.attach_files?.replace(/\d{4}-\d{2}-(COM|PER)\//g, "") || ""
      };

      return getLineBreak("attach_files")(nextRecord);
    },
    [getLineBreak]
  );

  return (
    <List
      {...props}
      actions={null}
      perPage={30}
      title="정산 메일 전송"
      filterDefaultValues={{
        month_calculate: format(new Date(), "yyyy-MM"),
        cp_type_code: "C"
      }}
      bulkActionButtons={<MailListBulkActionButtons />}
      filters={<MailListFilter />}
      pagination={<MailListPagination />}
    >
      <Datagrid rowClick="edit" size="small" className={classes.root}>
        <TextField source="month_calculate" label="정산월" textAlign="center" />
        <FunctionField label="전송 상태" render={getSendingStatus} textAlign="center" />
        <TextField source="flag_exist_attach_files_text" label="검증상태" textAlign="center" />
        <TextField source="recv_name" name="수신자" label="수신자" textAlign="center" />
        <FunctionField
          label="수신 이메일"
          render={getLineBreak("recv_email")}
          cellClassName={classes.recvEmail}
          textAlign="left"
        />
        <FunctionField label="첨부 파일" render={getAttachFiles} cellClassName={classes.attachFiles} textAlign="left" />
        <TextField source="cp_type" label="CP 타입" textAlign="center" />
        <TextField source="format_date_create" label="등록일시" textAlign="center" />
      </Datagrid>
    </List>
  );
}

export default MailList;
