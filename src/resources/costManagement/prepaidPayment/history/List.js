import * as React from "react";
import { Box, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { getPrepaidPaymentHistory, updateFirstPayoutInput } from "axios/costManagement/prepaidPayment/prepaidHistory";
import { format } from "date-fns";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import Info from "./Info";
import DetailList from "./DetailList";
import TotalDetailList from "./TotalDetailList";
import FirstPayoutInputPopup from "./FirstPayoutInputPopup";

import { parse } from "query-string";

function PrepaidPaymentMonthlyDetailtList(props) {
  const [infoData, setInfoData] = useState({});
  const [listData, setListData] = useState([]);
  const [gpPrepaidSeq, setGpPrepaidSeq] = useState("");
  const [selectDate, setSelectDate] = React.useState(format(new Date(), "yyyy"));
  const [selectDateValue, setSelectValueDate] = React.useState(dayjs(format(new Date(), "yyyy")));
  // const [selectDate, setSelectDate] = useState("");
  // const [selectDateValue, setSelectValueDate] = useState("");

  const isEmpty3 = (val) => {
    if (
      val === 0 ||
      val === "" ||
      val === null ||
      val === undefined ||
      (val !== null && typeof val === "object" && !Object.keys(val).length)
    ) {
      return true;
    } else {
      return false;
    }
  };

  const getApiResultData = async (param) => {
    const prepaidPayment = await getPrepaidPaymentHistory({
      GP_PREPAID_SEQ: param.GP_PREPAID_SEQ,
      selectYear: param.selectYear
    });
    setGpPrepaidSeq(prepaidPayment.data.info.GP_PREPAID_SEQ);
    setInfoData(prepaidPayment.data.info);
    setListData(prepaidPayment.data.list);
  };

  useEffect(() => {
    const querys = parse(props.location.search);
    if (!isEmpty3(querys.selectDate)) {
      setSelectValueDate(querys.selectDate);
    }

    getApiResultData({
      // GP_PREPAID_SEQ: 'PP00524',
      GP_PREPAID_SEQ: props.match.params.id,
      selectYear: !isEmpty3(querys.selectDate) ? querys.selectDate : selectDate
    });
  }, []);

  return (
    <>
      <Box sx={{ width: "100%", pt: 1 }}>
        <Box
          sx={{
            backgroundColor: "#FFFFFF",
            boxShadow:
              "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%);",
            mb: 2,
            p: 2
          }}
        >
          <Box sx={{ display: "flex" }}>
            선급금 내역 - {gpPrepaidSeq} &nbsp;&nbsp;&nbsp;&nbsp;
            <FirstPayoutInputPopup infoData={infoData} updateFirstPayoutInput={updateFirstPayoutInput} />
          </Box>
        </Box>
      </Box>
      <Box sx={{ width: "100%", pt: 1 }}>
        <Box
          sx={{
            backgroundColor: "#FFFFFF",
            boxShadow:
              "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%);",
            mb: 2,
            p: 2
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Grid container direction="row" justifyContent="center" alignItems="center">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  views={["year"]}
                  label="Year only"
                  value={selectDateValue}
                  onChange={(newValue) => {
                    setSelectDate(newValue.$y);
                    setSelectValueDate(newValue);
                    getApiResultData({
                      GP_PREPAID_SEQ: gpPrepaidSeq,
                      selectYear: newValue.$y
                    });
                  }}
                  renderInput={(params) => <TextField {...params} helperText={null} />}
                />
              </LocalizationProvider>
            </Grid>
          </Box>
          <Info infoData={infoData} gpPrepaidSeq={gpPrepaidSeq} selectDate={selectDate} />
        </Box>
      </Box>
      <DetailList listData={listData} gpPrepaidSeq={gpPrepaidSeq} selectDate={selectDate} />
      <br />
      <TotalDetailList listData={listData} />
    </>
  );
}

export default PrepaidPaymentMonthlyDetailtList;
