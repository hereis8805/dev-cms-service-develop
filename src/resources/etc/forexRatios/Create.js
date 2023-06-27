import { Grid, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { postForexRatios } from "axios/etc/forexRatios";
import { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import { useHistory } from "react-router-dom";

function ForexRatiosListCreate(props) {
  const [gerActualYearMonth, setGerActualYearMonth] = useState("");
  const [cnhGerPercentage, setCnhGerPercentage] = useState("");
  const [eurGerPercentage, setEurGerPercentage] = useState("");
  const [jpyGerPercentage, setJpyGerPercentage] = useState("");
  const [thbGerPercentage, setThbGerPercentage] = useState("");
  const [usdGerPercentage, setUsdGerPercentage] = useState("");
  const history = useHistory();

  const isEmpty3 = (val) => {
    if (
      val === "null" ||
      val === "NULL" ||
      val === "Null" ||
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

  useEffect(() => {
    setGerActualYearMonth(props.match.params.id);
  }, []);

  const handlePostForexRatios = async (param) => {
    await postForexRatios(param);
  };

  return (
    <>
      <Box
        component="form"
        sx={{
          height: "auto",
          width: "100%",
          backgroundColor: "#FFFFFF"
        }}
        noValidate
        autoComplete="off"
      >
        <Box>
          <Typography variant="h6" gutterBottom m={2}>
            외환 비율 정보
          </Typography>
          <Grid container item spacing={2} p={2}>
            <Grid item xs>
              <TextField
                id="outlined-helperText"
                label="매출반영월"
                value={gerActualYearMonth}
                onChange={(e) => {
                  setGerActualYearMonth(e.target.value);
                }}
              />
            </Grid>
          </Grid>
          <Grid container item spacing={2} p={2}>
            <Grid item xs>
              <TextField
                id="outlined-helperText"
                label="CNH"
                value={cnhGerPercentage}
                onChange={(e) => {
                  setCnhGerPercentage(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs>
              <TextField
                id="outlined-helperText"
                label="EUR"
                value={eurGerPercentage}
                onChange={(e) => {
                  setEurGerPercentage(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs>
              <TextField
                id="outlined-helperText"
                label="JPY"
                value={jpyGerPercentage}
                onChange={(e) => {
                  setJpyGerPercentage(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs>
              <TextField
                id="outlined-helperText"
                label="THB"
                value={thbGerPercentage}
                onChange={(e) => {
                  setThbGerPercentage(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs>
              <TextField
                id="outlined-helperText"
                label="USD"
                value={usdGerPercentage}
                onChange={(e) => {
                  setUsdGerPercentage(e.target.value);
                }}
              />
            </Grid>
          </Grid>

          <Grid container item spacing={2} p={2}>
            <Grid item xs>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  if (gerActualYearMonth.indexOf("-") == -1) {
                    alert("매출반영월값을 Ex) 2023-01 과 같은 형태로 입력해주세요.");
                    return;
                  }

                  let paramDataList = new Array();
                  const gerActualYearMonthArr = gerActualYearMonth.split("-");
                  const gerActualYear = gerActualYearMonthArr[0];
                  const gerActualMonth = gerActualYearMonthArr[1];

                  // CNH
                  if (!isEmpty3(cnhGerPercentage)) {
                    const paramDataObj = {
                      GER_ACTUAL_YEAR: gerActualYear,
                      GER_ACTUAL_MONTH: gerActualMonth,
                      GER_EXCHANGE_CODE: "1 CNH",
                      GER_PERCENTAGE: cnhGerPercentage
                    };
                    paramDataList.push(paramDataObj);
                  }

                  // EUR
                  if (!isEmpty3(eurGerPercentage)) {
                    const paramDataObj = {
                      GER_ACTUAL_YEAR: gerActualYear,
                      GER_ACTUAL_MONTH: gerActualMonth,
                      GER_EXCHANGE_CODE: "1 EUR",
                      GER_PERCENTAGE: eurGerPercentage
                    };
                    paramDataList.push(paramDataObj);
                  }

                  // JPY
                  if (!isEmpty3(jpyGerPercentage)) {
                    const paramDataObj = {
                      GER_ACTUAL_YEAR: gerActualYear,
                      GER_ACTUAL_MONTH: gerActualMonth,
                      GER_EXCHANGE_CODE: "1 JPY",
                      GER_PERCENTAGE: jpyGerPercentage
                    };
                    paramDataList.push(paramDataObj);
                  }

                  // THB
                  if (!isEmpty3(thbGerPercentage)) {
                    const paramDataObj = {
                      GER_ACTUAL_YEAR: gerActualYear,
                      GER_ACTUAL_MONTH: gerActualMonth,
                      GER_EXCHANGE_CODE: "1 THB",
                      GER_PERCENTAGE: thbGerPercentage
                    };
                    paramDataList.push(paramDataObj);
                  }

                  // USD
                  if (!isEmpty3(usdGerPercentage)) {
                    const paramDataObj = {
                      GER_ACTUAL_YEAR: gerActualYear,
                      GER_ACTUAL_MONTH: gerActualMonth,
                      GER_EXCHANGE_CODE: "1 USD",
                      GER_PERCENTAGE: usdGerPercentage
                    };
                    paramDataList.push(paramDataObj);
                  }

                  handlePostForexRatios(paramDataList);
                  alert("등록완료");
                  history.push(`/forexRatios`);
                }}
              >
                등록
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}

export default ForexRatiosListCreate;
