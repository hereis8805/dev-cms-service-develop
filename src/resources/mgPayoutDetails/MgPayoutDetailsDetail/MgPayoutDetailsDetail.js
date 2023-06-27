import React, { useCallback } from "react";
import { TextInput } from "react-admin";
import { Grid } from "@mui/material";

import { formatNumber } from "utils/string";

import DatePickerInput from "component/DatePickerInput";

function MgPayoutDetailsDetail(props) {
  // 금액을 입력할 때 금액에 콤마를 입력해준다
  const handleFormatNumber = useCallback((value) => {
    if (!value) return "";

    if (typeof value === "number") {
      return formatNumber(value);
    }

    return formatNumber(value.replace(/[^0-9]/g, ""));
  }, []);

  return (
    <>
      <DatePickerInput
        name="month_sales"
        label="정산월"
        views={["year", "month"]}
        openTo="month"
        format="yyyy-MM"
        variant="dialog"
      />
      <Grid container spacing={1} sx={{ mt: 2 }}>
        <Grid item xs={6}>
          <TextInput fullWidth margin="none" source="cp_code" size="small" variant="outlined" label="저작권자 코드" />
        </Grid>
        <Grid item xs={6}>
          <TextInput fullWidth margin="none" source="cp_name" size="small" variant="outlined" label="저작권자" />
        </Grid>
      </Grid>
      <TextInput
        fullWidth
        margin="none"
        source="amount"
        size="small"
        variant="outlined"
        label="금액"
        format={handleFormatNumber}
      />
      <TextInput
        fullWidth
        multiline
        margin="none"
        source="content_title"
        size="small"
        variant="outlined"
        label="내용"
      />
    </>
  );
}

export default MgPayoutDetailsDetail;
