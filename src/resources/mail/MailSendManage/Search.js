import { IconButton } from "@material-ui/core";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Box, Button, Grid } from "@mui/material";
import DatePicker from "component/CustomDatePicker";
import SelectSearchInputCustom from "component/filters/SelectSearchInputCustom";
import { add, format, parse } from "date-fns";
import { useForm } from "react-hook-form";

import { postMailManageMailSend } from "axios/mail/mail";

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

const MG_PAYOUT_DETAILS_CONDITIONS = [
  { id: "1", name: "템플릿 번호" },
  { id: "2", name: "CP명" },
  { id: "3", name: "CP코드" },
  { id: "4", name: "이메일" }
];
function Search(props) {
  const { setRequestParam, date, setDate, gmhIdxs, gmhAllIdxs } = props;

  const { control, register, handleSubmit } = useForm({
    defaultValues: {
      searchKeyword: "",
      searchType: 1
    }
  });

  function onSubmit(values) {
    setRequestParam(values);
  }

  const handleSelectMailManageMailSend = async (gmhIdxs) => {
    await postMailManageMailSend({ gmhIdxs })
      .then((res) => {
        alert("전송완료");
        window.location.href = "/mailSend";
      })
      .catch(() => {
        throw new Error("Network error");
      });
  };

  const handleSelectMailManageMailSendAll = async (gmhAllIdxs) => {
    await postMailManageMailSend({ gmhIdxs: gmhAllIdxs })
      .then((res) => {
        alert("전송완료");
        window.location.href = "/mailSend";
      })
      .catch(() => {
        throw new Error("Network error");
      });
  };

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
                  setDate(format(add(parse(date, "yyyy-MM", new Date()), { months: -1 }), "yyyy-MM"));
                }}
              >
                <ArrowBackIosIcon />
              </IconButton>
              <DatePicker
                views={["year", "month"]}
                openTo="month"
                format="yyyy-MM"
                value={date}
                onChange={(nextDate) => {
                  setDate(nextDate);
                }}
                margin="no"
                MuiInput-underline
              />
              <IconButton
                aria-label="search"
                color="black"
                onClick={() => {
                  setDate(format(add(parse(date, "yyyy-MM", new Date()), { months: 1 }), "yyyy-MM"));
                }}
              >
                <ArrowForwardIosIcon />
              </IconButton>
            </Grid>
            <Grid item></Grid>
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
        <Grid container direction="row" justifyContent="end" alignItems="end" p={2}>
          <Grid item>
            <Button
              variant="contained"
              onClick={(e) => {
                if (window.confirm("전체전송 하시겠습니까?")) {
                  handleSelectMailManageMailSendAll(gmhAllIdxs);
                }
              }}
            >
              전체전송
            </Button>
            <Button
              variant="contained"
              sx={{ ml: 2 }}
              onClick={(e) => {
                if (window.confirm("선택전송 하시겠습니까?")) {
                  if (isEmpty3(gmhIdxs)) {
                    alert("선택한 템플릿이 없습니다.");
                  } else {
                    handleSelectMailManageMailSend(gmhIdxs);
                  }
                }
              }}
            >
              선택전송
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Search;
