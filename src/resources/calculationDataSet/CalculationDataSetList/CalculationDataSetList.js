import React from "react";
import { Datagrid, FileField, List, Pagination, TextField, UrlField } from "react-admin";
import { makeStyles } from "@material-ui/core/styles";
import CalculationDataSetListFilter from "./CalculationDataSetListFilter";
const useStyles = makeStyles({
  root: {
    width: "100%",
    "& th": {
      textAlign: "center"
    }
  }
});

function CalculationDataSetList(props) {
  console.log("props : ", props);
  const classes = useStyles();

  return (
    <List
      {...props}
      actions={null}
      empty={false}
      filters={<CalculationDataSetListFilter />}
      title="정산데이터 내역"
      pagination={<Pagination rowsPerPageOptions={[5, 10, 20]} />}
      bulkActionButtons={false}
    >
      <Datagrid size="small" className={classes.root}>
        <TextField source="ROWNUM" label="No" textAlign="center" />
        <TextField source="GRF_ACTUAL_DATE" label="매출반영월" textAlign="center" />
        <TextField source="work_history" label="작업 히스토리" textAlign="left" />
        <TextField source="GF_FILE_NAME" label="파일명" textAlign="center" />
        <FileField source="DOWNLOAD_LINK" title="File" label="파일 다운로드" textAlign="center" />
      </Datagrid>
    </List>
  );
}

export default CalculationDataSetList;
