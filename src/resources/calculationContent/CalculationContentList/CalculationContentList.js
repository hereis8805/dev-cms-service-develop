import React from "react";
import { Datagrid, List, Pagination, TextField } from "react-admin";
import { makeStyles } from "@material-ui/core/styles";
import CalculationContentListFilter from "./CalculationContentListFilter";

const useStyles = makeStyles({
  root: {
    width: "100%",
    "& th": {
      textAlign: "center"
    }
  }
});

const SORT = { field: "content_code", order: "ASC" };

function CalculationContentList(props) {
  const classes = useStyles();

  return (
    <List
      {...props}
      actions={null}
      filters={<CalculationContentListFilter />}
      title="정산데이터 내역"
      pagination={<Pagination rowsPerPageOptions={[10, 30, 50, 100]} />}
    >
      <Datagrid rowClick="" size="small" className={classes.root}>
        <TextField source="isGroup" label="구분" textAlign="center" />
        <TextField source="" label="유형" textAlign="center" />
        <TextField source="GCM_SERIES_NAME" label="작품명" textAlign="left" />
        <TextField source="GCM_MANAGE_ID" label="작품코드" textAlign="center" />
        <TextField source="cpCnt" label="CP수" textAlign="center" />
        <TextField source="" label="대표CP명" textAlign="center" />
        <TextField source="GCM_CONTRACT" label="계약상태" textAlign="center" />
      </Datagrid>
    </List>
  );
}

export default CalculationContentList;
