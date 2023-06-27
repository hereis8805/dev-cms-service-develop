import React from "react";
import { Datagrid, List, TextField } from "react-admin";
import { makeStyles } from "@material-ui/core/styles";

import CalculationDataListFilter from "./CalculationDataListFilter";

const useStyles = makeStyles({
  root: {
    width: "100%",
    "& th": {
      textAlign: "center"
    }
  }
});

function CalculationDataList(props) {
  const classes = useStyles();

  return (
    <List {...props} actions={null} filters={<CalculationDataListFilter />} title="정산 파일 관리">
      <Datagrid rowClick="edit" size="small" className={classes.root}>
        <TextField source="month_calculate" label="파일명" textAlign="center" />
        <TextField source="month_calculate" label="사이즈" textAlign="center" />
        <TextField source="date_create" label="생성일자" textAlign="center" />
      </Datagrid>
    </List>
  );
}

export default CalculationDataList;
