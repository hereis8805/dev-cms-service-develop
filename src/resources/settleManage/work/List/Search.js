import { IconButton } from "@material-ui/core";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Box, Button, Grid } from "@mui/material";
import DatePicker from "component/CustomDatePicker";
import SelectSearchInputCustom from "component/filters/SelectSearchInputCustom";
import { add, format, parse } from "date-fns";
import { useForm } from "react-hook-form";

const MG_PAYOUT_DETAILS_CONDITIONS = [
  {
    id: 1,
    name: "작품명"
  },
  // {
  //   id: 2,
  //   name: "플랫폼명"
  // },
  {
    id: 2,
    name: "대표CP명"
  }
];

function Search(props) {
  const { setRequestParam, requestParam, onHandleDeadline, deadline, grade } = props;

  const { control, register, handleSubmit } = useForm({
    defaultValues: {
      ...requestParam?.settleManageWork
    }
  });

  function onSubmit(values) {
    setRequestParam({
      ...requestParam,
      settleManageWork: { ...values, selectDate: requestParam?.settleManageWork?.selectDate }
    });
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container direction="row" justifyContent="space-between" alignItems="baseline">
            <Grid item>
              <Box />
            </Grid>
            <Grid item>
              <IconButton
                aria-label="search"
                color="black"
                onClick={() => {
                  setRequestParam({
                    ...requestParam,
                    settleManageWork: {
                      ...requestParam?.settleManageWork,
                      selectDate: format(
                        add(parse(requestParam?.settleManageWork?.selectDate, "yyyy-MM", new Date()), { months: -1 }),
                        "yyyy-MM"
                      )
                    }
                  });
                }}
              >
                <ArrowBackIosIcon />
              </IconButton>
              <DatePicker
                views={["year", "month"]}
                openTo="month"
                format="yyyy-MM"
                value={requestParam?.settleManageWork?.selectDate}
                onChange={(nextDate) => {
                  setRequestParam({
                    ...requestParam,
                    settleManageWork: {
                      ...requestParam?.settleManageWork,
                      selectDate: nextDate
                    }
                  });
                }}
                margin="no"
                MuiInput-underline
              />
              <IconButton
                aria-label="search"
                color="black"
                onClick={() => {
                  setRequestParam({
                    ...requestParam,
                    settleManageWork: {
                      ...requestParam?.settleManageWork,
                      selectDate: format(
                        add(parse(requestParam?.settleManageWork?.selectDate, "yyyy-MM", new Date()), { months: 1 }),
                        "yyyy-MM"
                      )
                    }
                  });
                }}
              >
                <ArrowForwardIosIcon />
              </IconButton>
            </Grid>
            <Grid item>
              {grade === "S" && (
                <Button
                  variant="contained"
                  // disabled={!deadline}
                  onClick={onHandleDeadline}
                >
                  {deadline ? "마감처리" : "마감"}
                </Button>
              )}
            </Grid>
          </Grid>
          <br />
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
  );
}

export default Search;
