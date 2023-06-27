import React from "react";
import { Datagrid, FileField, List, Pagination, TextField, UrlField } from "react-admin";
import { makeStyles } from "@material-ui/core/styles";
import CalculationMonthlyCpFilter from "./CalculationMonthlyCpFilter";
const useStyles = makeStyles({
  root: {
    width: "100%",
    "& th": {
      textAlign: "center"
    }
  }
});
function CalculationMonthlyCpList(props) {
  console.log(props);
  const classes = useStyles();

  return (
    <List
      {...props}
      actions={null}
      filters={<CalculationMonthlyCpFilter />}
      title="정산조회_CP별(월별)"
      empty={false}
      pagination={<Pagination rowsPerPageOptions={[10, 30, 50, 100]} />}
    >
      <Datagrid rowClick="edit" size="small" className={classes.root}>
        <TextField source="GCD_IDX" label="No" textAlign="center" />
        <TextField source="GCD_BUSINESS_TYPE" label="구분" textAlign="center" />
        <TextField source="GCD_OWNER_NAME" label="CP명" textAlign="left" />
        <TextField source="GCD_OLD_GROUP" label="CP코드" textAlign="center" />
        <TextField source="GRD_TOTAL_AMOUNT" label="총매출" textAlign="center" />
        <TextField source="GRD_NET_AMOUNT" label="순매출" textAlign="center" />
        <TextField source="GCD_AMOUNT" label="총정산액" textAlign="center" />
        <TextField source="MANAGE_ID_SUM" label="작품수" textAlign="center" />
      </Datagrid>
    </List>
  );
}

export default CalculationMonthlyCpList;
