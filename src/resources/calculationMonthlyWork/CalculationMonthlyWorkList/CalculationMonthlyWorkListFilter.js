import { IconButton } from "@material-ui/core";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Box, Button, Grid } from "@mui/material";
import DatePicker from "component/DatePicker";
import SelectSearchInput from "component/filters/SelectSearchInput";
import { add, format, parse } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { useListContext, useRefresh } from "react-admin";
import { Form } from "react-final-form";
import { getToday } from "utils/date";

const MG_PAYOUT_DETAILS_CONDITIONS = [
  {
    id: "GCM_SERIES_NAME",
    name: "작품명"
  },
  {
    id: "GCM_MANAGE_ID",
    name: "플랫폼명"
  },
  {
    id: "CP1",
    name: "대표CP명"
  }
];

function CalculationMonthlyWorkListFilter() {
  const onRefresh = useRefresh();
  const [date, setDate] = useState(getToday("yyyy-MM"));
  const { filterValues, setFilters } = useListContext();

  // 검색
  function onSubmit(values) {
    const filters = {
      ...values
    };

    if (Object.entries(filterValues).toString() === Object.entries(filters).toString()) {
      onRefresh();

      return;
    }

    setFilters(filters);
  }

  // 정산월 변경
  function handleChangeDate(nextDate) {
    setDate(nextDate);
    onSubmit({
      ...filterValues,
      selectDate: nextDate
    });
  }

  function handleBlurMgPayoutDetailsConditioins(nextFiters) {
    onSubmit(nextFiters);
  }

  return (
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
        <Grid container direction="row" justifyContent="space-between" alignItems="baseline">
          <Grid item />

          <Grid item>
            <IconButton
              aria-label="search"
              color="primary"
              onClick={() => {
                handleChangeDate(format(add(parse(date, "yyyy-MM", new Date()), { months: -1 }), "yyyy-MM"));
              }}
            >
              <ArrowBackIosIcon />
            </IconButton>
            <DatePicker
              views={["year", "month"]}
              openTo="month"
              format="yyyy-MM"
              value={date}
              onChange={handleChangeDate}
              // margin="no"
              // MuiInput-underline
            />
            <IconButton
              aria-label="search"
              color="primary"
              onClick={() => {
                handleChangeDate(format(add(parse(date, "yyyy-MM", new Date()), { months: 1 }), "yyyy-MM"));
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </Grid>
          <Grid item />
        </Grid>
        <Form
          initialValues={{
            ...filterValues
            // cp_type_code: !filterValues.cp_type_code ? "ALL" : filterValues.cp_type_code
          }}
          onSubmit={onSubmit}
        >
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: "flex" }}>
                <SelectSearchInput
                  selects={MG_PAYOUT_DETAILS_CONDITIONS}
                  onBlur={handleBlurMgPayoutDetailsConditioins}
                />
                <Button type="submit" variant="contained" color="primary">
                  검색
                </Button>
              </Box>
            </form>
          )}
        </Form>
      </Box>
    </Box>
  );
}

export default CalculationMonthlyWorkListFilter;
