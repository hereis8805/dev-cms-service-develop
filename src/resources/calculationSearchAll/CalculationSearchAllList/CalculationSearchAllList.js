import React from "react";
import { Datagrid, FileField, List, Pagination, TextField, UrlField } from "react-admin";
import { makeStyles } from "@material-ui/core/styles";
import CalculationSearchAllListFilter from "./CalculationSearchAllListFilter";
const useStyles = makeStyles({
  root: {
    width: "100%",
    "& th": {
      textAlign: "center"
    }
  }
});
function CalculationSearchAllList(props) {
  console.log(props);
  const classes = useStyles();

  return (
    <List
      {...props}
      actions={null}
      filters={<CalculationSearchAllListFilter />}
      title="정산조회 종합"
      empty={false}
      pagination={<Pagination rowsPerPageOptions={[10, 30, 50, 100]} />}
    >
      <Datagrid rowClick="" size="small" className={classes.root}>
        <TextField source="ROW_NUM" label="No" textAlign="center" />
        <TextField source="GCD_SALE_MONTH" label="매출반영월" textAlign="center" />
        <TextField source="OLD_DETAIL_SUM" label="플랫폼수" textAlign="left" />
        <TextField source="OLD_SUM" label="CP수" textAlign="center" />
        <TextField source="TOTAL_AMOUNT_SUM" label="총매출" textAlign="center" />
        <TextField source="NET_AMOUNT_SUM" label="순매출" textAlign="center" />
        <TextField source="GCD_AMOUNT" label="정산액" textAlign="center" />
        {/* <TextField source="" label="CP명" textAlign="center" /> */}
      </Datagrid>
    </List>
  );
}

export default CalculationSearchAllList;
