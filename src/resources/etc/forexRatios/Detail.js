import { Grid, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { putForexRatios, getForexRatiosDetail } from "axios/etc/forexRatios";
import { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import { useHistory } from "react-router-dom";
import moment from "moment";

function ForexRatiosDetail(props) {
  const [nowDate, setNowDate] = useState(new Date());
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
    handleGetForexRatiosDetail(props.match.params.id);
    dateChk();
  }, []);

  const handlePutForexRatios = async (gerActual, param) => {
    await putForexRatios(gerActual, param);
  };

  const handleGetForexRatiosDetail = async (gerActual) => {
    await getForexRatiosDetail(gerActual)
      .then((res) => {
        const year = res.data.GER_ACTUAL.substr(0, 4);
        const month = res.data.GER_ACTUAL.substr(4);
        setGerActualYearMonth(year + "-" + month);
        setCnhGerPercentage(res.data.CNH);
        setEurGerPercentage(res.data.EUR);
        setJpyGerPercentage(res.data.JPY);
        setThbGerPercentage(res.data.THB);
        setUsdGerPercentage(res.data.USD);
      })
      .catch((e) => {
        throw e;
      });
  };

  const dateChk = () => {
    const chkNowDateYearMonth = moment(new Date()).format("YYYYMM");
    const chkGerActualYearMonth = moment(new Date(gerActualYearMonth + "-" + "01")).format("YYYYMM");
    if (chkNowDateYearMonth <= chkGerActualYearMonth) {
      return true;
    }
    return false;
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
                InputProps={{
                  readOnly: true
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
                label="USD"
                value={usdGerPercentage}
                onChange={(e) => {
                  setUsdGerPercentage(e.target.value);
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
                label="EUR"
                value={eurGerPercentage}
                onChange={(e) => {
                  setEurGerPercentage(e.target.value);
                }}
              />
            </Grid>
          </Grid>

          <Grid container item spacing={2} p={2}>
            <Grid item xs>
              {dateChk() === true && (
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
                    handlePutForexRatios(gerActualYear + gerActualMonth, paramDataList);
                    alert("수정완료");
                    history.push(`/forexRatios`);
                  }}
                >
                  수정
                </Button>
              )}
              &nbsp;&nbsp;
              <Button
                variant="contained"
                color="primary"
                onClick={(e) => {
                  history.push(`/forexRatios`);
                }}
              >
                취소
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}

export default ForexRatiosDetail;
