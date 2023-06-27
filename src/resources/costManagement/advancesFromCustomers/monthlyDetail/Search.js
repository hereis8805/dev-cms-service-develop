import DatePicker from "component/DatePicker";
import { Box, Button, Grid } from "@mui/material";
import SelectSearchInputCustom from "component/filters/SelectSearchInputCustom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import KeyboardMonthPicker from "component/KeyboardMonthPicker";
import { FormInputDate } from "component/FormComponents/FormInputDate";
import { format, parse } from "date-fns";
import { nowDate } from "utils/commonUtils";
import moment from "moment";

const MG_PAYOUT_DETAILS_CONDITIONS = [
  { id: "1", name: "코드" },
  { id: "2", name: "저작권자" },
  { id: "3", name: "작품명" }
];

function Search(props) {
  const { setRequestParam, requestParam } = props;

  const { control, register, handleSubmit, watch } = useForm({
    defaultValues: {
      searchKeyword: requestParam?.advancesMonthly?.searchKeyword,
      searchType: requestParam?.advancesMonthly?.searchType,
      startDate: requestParam?.advancesMonthly?.startDate,
      endDate: requestParam?.advancesMonthly?.endDate
    }
  });

  const startDateWatch = watch("startDate");
  const endDateWatch = watch("endDate");

  function onSubmit(values) {
    if (typeof values.startDate === "string") {
      const startDateArr = values.startDate.split("-");
      values.startDate = startDateArr[0] + "-" + startDateArr[1];
    } else {
      values.startDate = format(values.startDate, "yyyy-MM");
    }

    if (typeof values.endDate === "string") {
      const endDateArr = values.endDate.split("-");
      values.endDate = endDateArr[0] + "-" + endDateArr[1];
    } else {
      values.endDate = format(values.endDate, "yyyy-MM");
    }

    // values.startDate = values.startDate ? format(values.startDate, "yyyy-MM") : format(new Date(), "yyyy-MM");
    // values.endDate = values.endDate ? format(values.endDate, "yyyy-MM") : format(new Date(), "yyyy-MM");

    setRequestParam({ ...requestParam, advancesMonthly: values });
  }

  useEffect(() => {
    setRequestParam({
      ...requestParam,
      advancesMonthly: {
        ...requestParam?.advancesMonthly,
        startDate: moment(startDateWatch).format("YYYY-MM"),
        endDate: moment(endDateWatch).format("YYYY-MM")
      }
    });
    // console.log("startDateWatch : ", requestParam);
    // console.log("endDateWatch : ", endDateWatch);
  }, [startDateWatch, endDateWatch]);

  return (
    <div>
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
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* <Box
              sx={{
                backgroundColor: "#FFFFFF",
                boxShadow:
                  "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%);",
                mb: 2,
                p: 2,
                borderSpacing: 3
              }}
            > */}
            <Box sx={{ mb: 3 }}>
              <Grid container direction="row" justifyContent="center" alignItems="center">
                <KeyboardMonthPicker
                  views={["year", "month"]}
                  openTo="month"
                  format="yyyy-MM"
                  name={"startDate"}
                  control={control}
                  onChange={(e) => {
                    control.setValue("startDate", e);
                    setRequestParam({
                      ...requestParam,
                      advancesMonthly: {
                        ...requestParam?.advancesMonthly,
                        startDate: e
                      }
                    });
                  }}
                  margin="no"
                  MuiInput-underline
                />
                -
                <KeyboardMonthPicker
                  views={["year", "month"]}
                  openTo="month"
                  format="yyyy-MM"
                  name={"endDate"}
                  // label={"종료일정"}
                  // minDate={formDate}
                  // value={toDate}
                  control={control}
                  // onChange={(e) => setToDate(e)}
                  margin="no"
                  MuiInput-underline
                />
              </Grid>
            </Box>
            <Box sx={{ display: "flex" }}>
              <SelectSearchInputCustom
                selects={MG_PAYOUT_DETAILS_CONDITIONS}
                onBlur={onSubmit}
                register={register}
                control={control}
              />
              <Button type="submit" variant="contained" color="primary">
                검색
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </div>
  );
}

export default Search;
