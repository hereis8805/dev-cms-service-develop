import React from "react";
import { Datagrid, List, TextField } from "react-admin";
import { makeStyles } from "@material-ui/core/styles";
import { format } from "date-fns";

import MgPayoutDetailsListFilter from "./MgPayoutDetailsListFilter";

const useStyles = makeStyles({
  root: {
    width: "100%",
    "& th": {
      textAlign: "center"
    }
  },
  content: {
    maxWidth: 220,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  }
});

const SORT = { field: "month_sales", order: "DESC" };

function MgPayoutDetailsList(props) {
  const classes = useStyles();

  return (
    <List
      {...props}
      actions={null}
      title="선급원가 내역"
      sort={SORT}
      filterDefaultValues={{
        month_sales: format(new Date(), "yyyy-MM")
      }}
      filters={<MgPayoutDetailsListFilter />}
    >
      <Datagrid rowClick="edit" size="small" className={classes.root}>
        <TextField source="month_sales" label="판매월" />
        <TextField source="cp_name" label="저작권자" />
        <TextField source="cp_code" label="저작권자 코드" />
        <TextField source="content_title" label="내용" cellClassName={classes.content} />
        <TextField source="amount_text" label="금액" textAlign="right" />
      </Datagrid>
    </List>
  );
}

export default MgPayoutDetailsList;
