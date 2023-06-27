import React from "react";
import { Datagrid, FileField, List, Pagination, TextField, UrlField } from "react-admin";
import { makeStyles } from "@material-ui/core/styles";
import CalculationMonthlyWorkListFilter from "./CalculationMonthlyWorkListFilter";
const useStyles = makeStyles({
  root: {
    width: "100%",
    "& th": {
      textAlign: "center"
    }
  }
});
function CalculationMonthlyWorkList(props) {
  console.log(props);
  const classes = useStyles();

  return (
    <List
      {...props}
      actions={null}
      filters={<CalculationMonthlyWorkListFilter />}
      title="정산조회_작품별(월별)"
      empty={false}
      pagination={<Pagination rowsPerPageOptions={[10, 30, 50, 100]} />}
    >
      <Datagrid rowClick="" size="small" className={classes.root}>
        <TextField source="row_num" label="No" textAlign="center" />
        <TextField source="ROW_TYPE" label="구분" textAlign="center" />
        <TextField source="GCM_SERIES_NAME" label="작품명" textAlign="left" />
        <TextField source="GCM_MANAGE_ID" label="작품코드" textAlign="center" />
        <TextField source="TOTAL_AMOUNT_SUM" label="총매출" textAlign="center" />
        <TextField source="NET_AMOUNT_SUM" label="순매출" textAlign="center" />
        <TextField source="AMOUNT_SUM" label="정산액" textAlign="center" />
        <TextField source="GC_NAMES" label="CP명" textAlign="center" />
      </Datagrid>
    </List>
  );
}

export default CalculationMonthlyWorkList;
