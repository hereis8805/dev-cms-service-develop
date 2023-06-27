import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import {
  setUnearnedRevenue,
  createGpPrepaidSeq
} from "axios/costManagement/advancesFromCustomers/advancesFromCustomers";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Paper from "@mui/material/Paper";
import { Button, Grid } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import CreateIcon from "@mui/icons-material/Create";

import { useHistory } from "react-router-dom";

import PlatformPopup from "../../../../component/popup/PlatformPopup";
import CpPopup from "../../../../component/popup/CpPopup";
import WorkPopup from "../../../../component/popup/WorkPopup";
import { Title } from "react-admin";
import { isEmpty } from "utils/commonUtils";

const Div = styled("div")(({ theme }) => ({
  ...theme.typography.button,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1)
}));

function AdvanceDetailWriteForm(props) {
  const [gpIdx, setGpIdx] = useState(0);
  const [advanceDetailInfo, setAdvanceDetailInfo] = useState({});
  const [gpPrepaidSeq, setGpPrepaidSeq] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessCode, setBusinessCode] = useState("");
  const [gpCurrency, setGpCurrency] = useState("");
  const [gpName, setGpName] = useState("");
  const [gpPartnerAdvance, setGpPartnerAdvance] = useState("");
  const [gpPartnerName, setGpPartnerName] = useState("");
  const [gpPartnerCode, setGpPartnerCode] = useState("");

  // 플랫폼 팝업
  const [platformDetail, setPlatformDetail] = useState("");
  const [platformGroup, setPlatformGroup] = useState("");
  const [gpPlatformName, setGpPlatformName] = useState("");
  const [popupPlatform, setPopupPlatform] = useState(false);
  const [selectPlatform, setSelectPlatform] = useState("");
  const [selectPlatformRowType, setSelectPlatformRowType] = useState("");

  // CP 팝업
  const [gpCpId, setGpCpId] = useState("");
  const [gpCpGroupId, setGpCpGroupId] = useState("");
  const [popupCp, setPopupCp] = useState(false);
  const [selectCp, setSelectCp] = useState("");
  const [selectCpRowType, setSelectCpRowType] = useState("");

  // 작품
  const [gcmManageId, setGcmManageId] = useState("");
  const [gcmManageGroupId, setGcmManageGroupId] = useState("");
  const [gcmSeriesName, setGcmSeriesName] = useState("");
  const [gcmTypeCode, setGcmTypeCode] = useState("");
  const [popupWork, setPopupWork] = useState(false);
  const [selectWork, setSelectWork] = useState("");
  const [selectWorkRowType, setSelectWorkRowType] = useState("");

  const history = useHistory();

  const handleSetGpCurrencyChange = (event) => {
    setGpCurrency(event.target.value);
  };

  const getGcmTypeCodeVal = (code) => {
    let val = "";

    // (`N` : 소설, `C` : 만화, `E` : 이모티콘, `A` : 오디오북, `W` : 웹툰단행본 , `M` : 메타버스)
    if (code === "N") {
      val = "소설";
    } else if (code === "C") {
      val = "만화";
    } else if (code === "E") {
      val = "이모티콘";
    } else if (code === "A") {
      val = "오디오북";
    } else if (code === "W") {
      val = "웹툰단행본";
    } else if (code === "M") {
      val = "메타버스";
    }

    return val;
  };

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

  const handleSetUnearnedRevenue = async (param) => {
    return await setUnearnedRevenue(param);
  };

  const handleCreateGpPrepaidSeq = async () => {
    await createGpPrepaidSeq()
      .then((res) => {
        setGpPrepaidSeq(res.data);
      })
      .catch((e) => {
        throw e;
      });
  };

  useEffect(() => {
    handleCreateGpPrepaidSeq();
  }, []);

  return (
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": { m: 1, width: "25ch" }
      }}
      noValidate
      autoComplete="off"
    >
      <Title title="선수금 관리 > 등록" />
      <Grid container direction="row" justifyContent="end" alignItems="end">
        <Grid item>
          <Button
            variant="text"
            startIcon={<CancelIcon />}
            onClick={() => {
              if (window.confirm("정말 취소하시겠습니까?")) {
                history.push(`/advances`);
              }
            }}
          >
            {"취소"}
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="text"
            startIcon={<CreateIcon />}
            onClick={() => {
              if (window.confirm("정말 등록하시겠습니까?")) {
                let gpdPlatform = "";
                if (isEmpty3(advanceDetailInfo.PLATFORM_DETAIL)) {
                  if (isEmpty3(platformDetail)) {
                    gpdPlatform = advanceDetailInfo.PLATFORM_DETAIL;
                  } else {
                    gpdPlatform = platformDetail;
                  }
                } else {
                  if (selectPlatformRowType === "단일") {
                    gpdPlatform = platformDetail;
                  } else if (selectPlatformRowType === "그룹") {
                    gpdPlatform = "";
                  } else {
                    gpdPlatform = advanceDetailInfo.PLATFORM_DETAIL;
                  }
                }

                let gpdPlatformGroup = "";
                if (isEmpty3(advanceDetailInfo.PLATFORM_GROUP)) {
                  if (isEmpty3(platformGroup)) {
                    gpdPlatformGroup = advanceDetailInfo.PLATFORM_GROUP;
                  } else {
                    gpdPlatformGroup = platformGroup;
                  }
                } else {
                  if (selectPlatformRowType === "그룹") {
                    gpdPlatformGroup = platformGroup;
                  } else if (selectPlatformRowType === "단일") {
                    gpdPlatformGroup = "";
                  } else {
                    gpdPlatformGroup = advanceDetailInfo.PLATFORM_GROUP;
                  }
                }

                let gpCpId = "";
                if (isEmpty3(advanceDetailInfo.GP_CP_ID)) {
                  if (isEmpty3(gpCpId)) {
                    gpCpId = advanceDetailInfo.GP_CP_ID;
                  } else {
                    gpCpId = gpCpId;
                  }
                } else {
                  if (selectCpRowType === "단일") {
                    gpCpId = gpCpId;
                  } else if (selectCpRowType === "그룹") {
                    gpCpId = "";
                  } else {
                    gpCpId = advanceDetailInfo.GP_CP_ID;
                  }
                }

                let gpCpIdGroup = "";
                if (isEmpty3(advanceDetailInfo.GP_CP_GROUP)) {
                  if (isEmpty3(gpCpGroupId)) {
                    gpCpIdGroup = advanceDetailInfo.GP_CP_GROUP;
                  } else {
                    gpCpIdGroup = gpCpGroupId;
                  }
                } else {
                  if (selectCpRowType === "그룹") {
                    gpCpIdGroup = gpCpGroupId;
                  } else if (selectCpRowType === "단일") {
                    gpCpIdGroup = "";
                  } else {
                    gpCpIdGroup = advanceDetailInfo.GP_CP_GROUP;
                  }
                }

                let gpdManageId = "";
                if (isEmpty3(advanceDetailInfo.GCM_MANAGE_ID)) {
                  if (isEmpty3(gcmManageId)) {
                    gpdManageId = advanceDetailInfo.GCM_MANAGE_ID;
                  } else {
                    gpdManageId = gcmManageId;
                  }
                } else {
                  if (selectWorkRowType === "단일") {
                    gpdManageId = gcmManageId;
                  } else if (selectWorkRowType === "그룹") {
                    gpdManageId = "";
                  } else {
                    gpdManageId = advanceDetailInfo.GCM_MANAGE_ID;
                  }
                }

                let gpdManageGroup = "";
                if (isEmpty3(advanceDetailInfo.GCM_MANAGE_GROUP)) {
                  if (isEmpty3(gcmManageGroupId)) {
                    gpdManageGroup = advanceDetailInfo.GCM_MANAGE_GROUP;
                  } else {
                    gpdManageGroup = gcmManageGroupId;
                  }
                } else {
                  if (selectWorkRowType === "그룹") {
                    gpdManageGroup = gcmManageGroupId;
                  } else if (selectWorkRowType === "단일") {
                    gpdManageGroup = "";
                  } else {
                    gpdManageGroup = advanceDetailInfo.GCM_MANAGE_GROUP;
                  }
                }

                if (isEmpty3(gpPartnerCode)) {
                  alert("거래처를 입력하여 주시길 바랍니다.");
                  return;
                }

                if (isEmpty3(gpCurrency)) {
                  alert("통화를 선택하여 주시길 바랍니다.");
                  return;
                }

                const param = {
                  GP_PREPAID_SEQ: gpPrepaidSeq,
                  GP_PARTNER_CODE: gpPartnerCode,
                  GP_OLD_PREPAID: gpPrepaidSeq,
                  BUSINESS_NAME: businessName,
                  BUSINESS_CODE: businessCode,
                  GP_CURRENCY: gpCurrency,
                  GPD_PLATFORM: gpdPlatform,
                  GPD_PLATFORM_GROUP: gpdPlatformGroup,
                  GP_NAME: gpName,
                  GP_CP_ID: gpCpId,
                  GP_CP_GROUP: gpCpIdGroup,
                  GPD_MANAGE_ID: gpdManageId,
                  GPD_MANAGE_GROUP: gpdManageGroup,
                  GP_PARTNER_ADVANCE: gpPartnerAdvance
                };
                handleSetUnearnedRevenue(param)
                  .then((res) => {
                    alert("등록완료");
                    history.push(`/advancesDetail/${res.data}`);
                  })
                  .catch((e) => {
                    throw e;
                  });
              }
            }}
          >
            {"등록"}
          </Button>
        </Grid>
      </Grid>

      {/* <Div>
        <h3>{"선수금 관리 > 등록"}</h3>
      </Div> */}
      <div>
        <Paper component="form" sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: 1000 }}>
          <TextField
            id="outlined-helperText"
            label="선수금 코드"
            value={gpPrepaidSeq}
            InputProps={{
              readOnly: true
            }}
          />
          <TextField
            id="outlined-helperText"
            label="거래처 코드"
            value={gpPartnerCode}
            onChange={(e) => {
              setGpPartnerCode(e.target.value);
            }}
          />
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">통화</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={gpCurrency}
              label="통화"
              onChange={handleSetGpCurrencyChange}
            >
              <MenuItem value={"KRW"}>KRW</MenuItem>
              <MenuItem value={"JPY"}>JPY</MenuItem>
              <MenuItem value={"CNH"}>CNH</MenuItem>
              <MenuItem value={"CNY"}>CNY</MenuItem>
              <MenuItem value={"THB"}>THB</MenuItem>
              <MenuItem value={"USD"}>USD</MenuItem>
            </Select>
          </FormControl>
        </Paper>
        <Paper component="form" sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: 1000 }}>
          <TextField
            id="outlined-helperText"
            label="플랫폼 코드"
            value={selectPlatform === "단일" || !isEmpty3(platformDetail) ? platformDetail : platformGroup}
            InputProps={{
              readOnly: true
            }}
          />
          <TextField
            id="outlined-helperText"
            label="플랫폼명"
            value={gpPlatformName}
            InputProps={{
              readOnly: true
            }}
          />
          <IconButton
            type="button"
            sx={{ p: "10px" }}
            aria-label="search"
            onClick={(e) => {
              setPopupPlatform(true);
            }}
          >
            <SearchIcon />
          </IconButton>
        </Paper>
        <Paper component="form" sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: 1000 }}>
          <TextField
            id="outlined-helperText"
            label="내용"
            value={gpName}
            onChange={(e) => {
              setGpName(e.target.value);
            }}
          />
        </Paper>
        <Paper component="form" sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: 1000 }}>
          <TextField
            id="outlined-helperText"
            label="CP 상세코드"
            value={selectCpRowType === "단일" || !isEmpty3(gpCpId) ? gpCpId : gpCpGroupId}
            InputProps={{
              readOnly: true
            }}
          />
          <IconButton
            type="button"
            sx={{ p: "10px" }}
            aria-label="search"
            onClick={(e) => {
              setPopupCp(true);
            }}
          >
            <SearchIcon />
          </IconButton>
        </Paper>
        <Paper component="form" sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: 1000 }}>
          <TextField
            id="outlined-helperText"
            label="작품코드"
            value={selectWorkRowType === "단일" || !isEmpty3(gcmManageId) ? gcmManageId : gcmManageGroupId}
            InputProps={{
              readOnly: true
            }}
          />
          <TextField
            id="outlined-helperText"
            label="작품명"
            value={gcmSeriesName}
            InputProps={{
              readOnly: true
            }}
          />
          <TextField
            id="outlined-helperText"
            label="작품유형"
            value={getGcmTypeCodeVal(gcmTypeCode)}
            InputProps={{
              readOnly: true
            }}
          />
          <IconButton
            type="button"
            sx={{ p: "10px" }}
            aria-label="search"
            onClick={(e) => {
              setPopupWork(true);
            }}
          >
            <SearchIcon />
          </IconButton>
        </Paper>
        <Paper component="form" sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: 1000 }}>
          <TextField
            id="outlined-helperText"
            label="거래처측 관리코드"
            value={gpPartnerAdvance}
            onChange={(e) => {
              setGpPartnerAdvance(e.target.value);
            }}
          />
        </Paper>
      </div>
      <PlatformPopup
        popupPlatform={popupPlatform}
        setPopupPlatform={setPopupPlatform}
        selectPlatform={selectPlatform}
        setSelectPlatform={setSelectPlatform}
        setPlatformDetail={setPlatformDetail}
        setPlatformGroup={setPlatformGroup}
        setGpPlatformName={setGpPlatformName}
        selectPlatformRowType={selectPlatformRowType}
        setSelectPlatformRowType={setSelectPlatformRowType}
      />
      <CpPopup
        popupCp={popupCp}
        setPopupCp={setPopupCp}
        selectCp={selectCp}
        setSelectCp={setSelectCp}
        setGpCpId={setGpCpId}
        setGpCpGroupId={setGpCpGroupId}
        selectCpRowType={selectCpRowType}
        setSelectCpRowType={setSelectCpRowType}
      />
      <WorkPopup
        popupWork={popupWork}
        setPopupWork={setPopupWork}
        selectWork={selectWork}
        setSelectWork={setSelectWork}
        setGcmManageId={setGcmManageId}
        setGcmManageGroupId={setGcmManageGroupId}
        setGcmSeriesName={setGcmSeriesName}
        setGcmTypeCode={setGcmTypeCode}
        selectWorkRowType={selectWorkRowType}
        setSelectWorkRowType={setSelectWorkRowType}
      />
    </Box>
  );
}

export default AdvanceDetailWriteForm;
