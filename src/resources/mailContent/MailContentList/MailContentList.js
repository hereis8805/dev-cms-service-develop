import React from "react";
import { Datagrid, List, TextField } from "react-admin";
import { makeStyles } from "@material-ui/core/styles";
import { format } from "date-fns";

import MailContentListFilter from "./MailContentListFilter";

const useStyles = makeStyles({
  root: {
    width: "100%",
    "& th": {
      textAlign: "center"
    }
  },
  mailTitle: {
    maxWidth: 220,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  }
});

const SORT = { field: "month_calculate", order: "DESC" };

function MailContentList(props) {
  const classes = useStyles();

  return (
    <List
      {...props}
      actions={null}
      title="정산 메일 콘텐츠"
      sort={SORT}
      filterDefaultValues={{
        month_calculate: format(new Date(), "yyyy-MM")
      }}
      filters={<MailContentListFilter />}
    >
      <Datagrid rowClick="edit" size="small" className={classes.root}>
        <TextField source="month_calculate" label="정산월" />
        <TextField source="cp_type_text" label="CP 타입" />
        <TextField source="mail_title" label="메일 제목" cellClassName={classes.mailTitle} />
      </Datagrid>
    </List>
  );
}

export default MailContentList;
