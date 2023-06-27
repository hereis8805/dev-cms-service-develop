import * as React from "react";
import { Box, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { getUnearnedRevenueHistory } from "axios/costManagement/unearnedRevenue/unearnedRevenueHistory";
import { format } from "date-fns";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import DetailList from "./DetailList";

import { parse } from "query-string";

function UnearnedRevenueHistoryList(props) {
  const [infoData, setInfoData] = useState({});
  const [listData, setListData] = useState([]);
  const [gpCurrency, setGpCurrency] = useState("");
  const [gpmPrepaidSeq, setGpmPrepaidSeq] = useState("");
  const [selectDate, setSelectDate] = React.useState(format(new Date(), "yyyy"));
  const [selectDateValue, setSelectValueDate] = React.useState(dayjs(format(new Date(), "yyyy")));

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
    const unearnedRevenue = await getUnearnedRevenueHistory({
      GPM_PREPAID_SEQ: param.GPM_PREPAID_SEQ,
      selectYear: param.selectYear
    });
    setGpmPrepaidSeq(unearnedRevenue.data.info.GPM_PREPAID_SEQ);
    setGpCurrency(unearnedRevenue.data.info.GP_CURRENCY);
    setInfoData(unearnedRevenue.data.info);
    setListData(unearnedRevenue.data.list);
  };

  useEffect(() => {
    const querys = parse(props.location.search);
    if (!isEmpty3(querys.selectDate)) {
      setSelectValueDate(querys.selectDate);
    }

    getApiResultData({
      // GPM_PREPAID_SEQ: 'AD00002',
      GPM_PREPAID_SEQ: props.match.params.id,
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
          <Box sx={{ display: "flex" }}>선수금 내역 - {gpmPrepaidSeq}</Box>
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
                      GPM_PREPAID_SEQ: gpmPrepaidSeq,
                      selectYear: newValue.$y
                    });
                  }}
                  renderInput={(params) => <TextField {...params} helperText={null} />}
                />
              </LocalizationProvider>
            </Grid>
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
          <Box sx={{ display: "flex" }}>기준외화: {gpCurrency}</Box>
          <DetailList listData={listData} gpmPrepaidSeq={gpmPrepaidSeq} selectDate={selectDate} />
        </Box>
      </Box>
    </>
  );
}

export default UnearnedRevenueHistoryList;
