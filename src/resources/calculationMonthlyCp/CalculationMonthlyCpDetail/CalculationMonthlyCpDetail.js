import React, { useEffect, useRef, useState } from "react";
import {
  TextInput,
  useGetList,
  useList,
  List,
  ListContextProvider,
  Datagrid,
  TextField,
  useGetMainList,
  Show,
  useListContext,
  SimpleList,
  DateField,
  FunctionField,
  useRefresh
} from "react-admin";
import { makeStyles } from "@material-ui/core/styles";
import { Form } from "react-final-form";
import { useHistory } from "react-router-dom";

import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { getToday } from "utils/date";
import DatePicker from "component/DatePicker";
import { Box, Button } from "@mui/material";
import { format } from "date-fns";

const useStyles = makeStyles({
  root: {
    width: "100%",
    "& th": {
      textAlign: "center"
    }
  }
});

function CalculationMonthlyCpDetail(props) {
  const {
    record: { settlementInfo }
  } = props;

  return settlementInfo ? (
    <>
      <CalculationMonthlyCpDetailConent {...props} />
    </>
  ) : (
    <></>
  );
}

function CalculationMonthlyCpDetailConent(props) {
  const {
    record: { settlementInfo, settlementList }
  } = props;

  const onRefresh = useRefresh();
  const history = useHistory();

  const [date, setDate] = useState(getToday("yyyy-MM"));
  // const { filterValues, setFilters, data: contextData } = useListContext();

  // const [listContext, setListContext] = useState(settlementInfo);
  const [formDate, setFormDate] = useState(getToday("yyyy-MM"));
  const [toDate, setToDate] = useState(getToday("yyyy-MM"));

  function makeUrl(param) {
    let result = "";
    Object.keys(param).forEach(function (key, index) {
      result = (index === 0 ? "?" : "&") + key + "=" + param[key];
    });

    return result;
  }

  function onSubmit(values) {
    console.log("values : ", makeUrl(values));

    history.push(makeUrl(values)); // 마운트 될 때 /helloWorld에 해당하는 페이지로 이동
    console.log("filterValues : ", zlistContext?.filterValues);
    zlistContext.setFilters(values);
    onRefresh();
    // const filters = {
    //   ...values
    // };

    // if (Object.entries(filterValues).toString() === Object.entries(filters).toString()) {
    // onRefresh();

    //   return;
    // }

    // setFilters(values);
  }

  // useEffect(() => {
  //   console.log("filterValues : ", filterValues);
  // }, [filterValues]);

  const data = [settlementInfo];
  const ids = [settlementInfo?.id];
  const settlementListdata = [settlementList];
  const settlementListids = [settlementList?.id];
  const listContext = useList({ data, ids, basePath: "/resource", resource: "resource" });
  const zlistContext = useList({ settlementListdata, settlementListids, basePath: "/resource", resource: "resource" });
  // const { data: contextData } = useListContext();
  const dateRef = useRef();
  console.log("contextData : ", listContext);
  // const classes = useStyles();
  // const showButton = (
  //   <ShowInDialogButton fullWidth maxWidth="md">
  //     <CustomerLayout />
  //   </ShowInDialogButton>
  // );
  return (
    <>
      {formDate}
      <ListContextProvider
        value={listContext}
        filterDefaultValues={{
          selectDate: format(new Date(), "yyyy-MM")
        }}
        filters={{}}
      >
        <Datagrid>
          <TextField source="GCD_BUSINESS_TYPE" label="구분" textAlign="center" />
          <TextField source="GCD_OWNER_NAME" label="작품명" textAlign="left" />
          <TextField source="GCD_OLD" label="CP코드" textAlign="center" />
          <TextField source="GRD_TOTAL_AMOUNT" label="총매출" textAlign="center" />
          <TextField source="GRD_NET_AMOUNT" label="순매출" textAlign="center" />
          <TextField source="GCD_AMOUNT" label="정산금" textAlign="center" />
          <FunctionField
            label="재정산금"
            render={(record) => (
              <Button variant="contained" color="primary">
                추가
              </Button>
            )}
          />
          ;
        </Datagrid>
      </ListContextProvider>

      <br />

      <Form
        initialValues={{
          ...zlistContext.filterValues
        }}
        onSubmit={onSubmit}
      >
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                backgroundColor: "#FFFFFF",
                boxShadow:
                  "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%);",
                mb: 2,
                p: 2,
                borderSpacing: 3
              }}
            >
              <DatePicker
                views={["year", "month"]}
                openTo="month"
                format="yyyy-MM"
                value={formDate}
                maxDate={toDate}
                onChange={(e) => {
                  setFormDate(e);
                  onSubmit({ selectDate: e });
                }}
                margin="no"
                MuiInput-underline
              />
              -
              <DatePicker
                views={["year", "month"]}
                openTo="month"
                format="yyyy-MM"
                minDate={formDate}
                value={toDate}
                onChange={(e) => setToDate(e)}
                margin="no"
                MuiInput-underline
              />
            </Box>
          </form>
        )}
      </Form>

      <ListContextProvider value={zlistContext}>
        <Datagrid>
          <TextField source="GCD_BUSINESS_TYPE" label="No" textAlign="center" />
          <TextField source="GCD_BUSINESS_TYPE" label="정산월" textAlign="center" />
          <TextField source="GCD_OWNER_NAME" label="작품명" textAlign="left" />
          <TextField source="GCD_OLD" label="작품코드" textAlign="center" />
          <TextField source="GRD_TOTAL_AMOUNT" label="선급금코드" textAlign="center" />
          <TextField source="GRD_NET_AMOUNT" label="정산타입" textAlign="center" />
          <TextField source="GCD_AMOUNT" label="정산기준" textAlign="center" />
          <TextField source="GCD_AMOUNT" label="정산금" textAlign="center" />
        </Datagrid>
      </ListContextProvider>

      {/* <ListContextProvider value={listContext}>
        <Datagrid>
        <TextField source="GCD_BUSINESS_TYPE" label="구분" textAlign="center" />
          <TextField source="GCD_OWNER_NAME" label="작품명" textAlign="left" />
          <TextField source="GCD_OLD" label="CP코드" textAlign="center" />
          <TextField source="GRD_TOTAL_AMOUNT" label="총매출" textAlign="center" />
          <TextField source="GRD_NET_AMOUNT" label="순매출" textAlign="center" />
          <TextField source="GCD_AMOUNT" label="정산금" textAlign="center" />
        </Datagrid>
      </ListContextProvider> */}

      {/* <Show {...props}> */}
      {/* <ListContextProvider value={listContext}>
        <Datagrid>
          <TextField source="GCD_AMOUNT" label="구분" textAlign="center" />
          <TextField source="GCD_BUSINESS_TYPE" label="작품명" textAlign="left" />
          <TextField source="GCD_OLD" label="작품코드" textAlign="center" />
          <TextField source="GCD_OLD_GROUP" label="총매출" textAlign="center" />
          <TextField source="NET_AMOUNT_SUM" label="순매출" textAlign="center" />
          <TextField source="AMOUNT_SUM" label="정산액" textAlign="center" />
        </Datagrid>
      </ListContextProvider> */}
      {/* </Show> */}
      {/* <TextInput source="MANAGE_ID_SUM" multiline margin="none" size="small" variant="outlined" label="작품수" /> */}
    </>
  );
}

export default CalculationMonthlyCpDetail;
