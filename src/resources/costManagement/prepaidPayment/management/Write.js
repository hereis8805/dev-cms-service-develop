import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import {
  setPrepaidPaymentDetail,
  setPrepaidPaymentCreateGpSeq
} from "axios/costManagement/prepaidPayment/prepaidPayment";

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
import CpPopup from "../../../../component/popup/CpPopup2";
import WorkPopup from "../../../../component/popup/WorkPopup";
import HistoryDetailList from "../../../../component/history/HistoryDetailList";
import { Title } from "react-admin";

const Div = styled("div")(({ theme }) => ({
  ...theme.typography.button,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1)
}));

function PrepaidPaymentManagementWrite(props) {
  const [gpIdx, setGpIdx] = useState(0);
  const [prepaidDetailInfo, setPrepaidDetailInfo] = useState({});
  const [gpPrepaidType, setGpPrepaidType] = useState("");
  const [gpPrepaidSeq, setGpPrepaidSeq] = useState("");
  const [gpName, setGpName] = useState("");
  const [gpPriority, setGpPriority] = useState("");
  const [gpSettlementType, setGpSettlementType] = useState("");
  const [gpStatus, setGpStatus] = useState("");
  const [gpdSaleType, setGpdSaleType] = useState("");
  const [gpdSettlementRate, setGpdSettlementRate] = useState("");
  const [gpdSettlementPriority, setGpdSettlementPriority] = useState("");

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
  const [gpCpName, setGpCpName] = useState("");
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

  const handleSetGpPrepaidTypeChange = (event) => {
    setGpPrepaidType(event.target.value);
  };

  const handleSetStatusChange = (event) => {
    setGpStatus(event.target.value);
  };

  const handleSetGpdSaleTypeChange = (event) => {
    setGpdSaleType(event.target.value);
  };

  const handleCreateGpPrepaidSeq = async () => {
    await setPrepaidPaymentCreateGpSeq()
      .then((res) => {
        setGpPrepaidSeq(res.data.GP_PREPAID_SEQ);
      })
      .catch((e) => {
        throw e;
      });
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
      <Title title="선급금 관리 > 상세" />
      <Grid container direction="row" justifyContent="end" alignItems="end">
        <Grid item>
          <Button
            variant="text"
            startIcon={<CancelIcon />}
            onClick={() => {
              if (window.confirm("정말 취소하시겠습니까?")) {
                history.push(`/prepaid`);
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
                if (isEmpty3(prepaidDetailInfo.PLATFORM_DETAIL)) {
                  if (isEmpty3(platformDetail)) {
                    gpdPlatform = prepaidDetailInfo.PLATFORM_DETAIL;
                  } else {
                    gpdPlatform = platformDetail;
                  }
                } else {
                  if (selectPlatformRowType === "단일") {
                    gpdPlatform = platformDetail;
                  } else if (selectPlatformRowType === "그룹") {
                    gpdPlatform = "";
                  } else {
                    gpdPlatform = prepaidDetailInfo.PLATFORM_DETAIL;
                  }
                }

                let gpdPlatformGroup = "";
                if (isEmpty3(prepaidDetailInfo.PLATFORM_GROUP)) {
                  if (isEmpty3(platformGroup)) {
                    gpdPlatformGroup = prepaidDetailInfo.PLATFORM_GROUP;
                  } else {
                    gpdPlatformGroup = platformGroup;
                  }
                } else {
                  if (selectPlatformRowType === "그룹") {
                    gpdPlatformGroup = platformGroup;
                  } else if (selectPlatformRowType === "단일") {
                    gpdPlatformGroup = "";
                  } else {
                    gpdPlatformGroup = prepaidDetailInfo.PLATFORM_GROUP;
                  }
                }

                let gpCpId = "";
                if (isEmpty3(prepaidDetailInfo.GP_CP_ID)) {
                  if (isEmpty3(gpCpId)) {
                    gpCpId = prepaidDetailInfo.GP_CP_ID;
                  } else {
                    gpCpId = gpCpId;
                  }
                } else {
                  if (selectCpRowType === "단일") {
                    gpCpId = gpCpId;
                  } else if (selectCpRowType === "그룹") {
                    gpCpId = "";
                  } else {
                    gpCpId = prepaidDetailInfo.GP_CP_ID;
                  }
                }

                let gpCpIdGroup = "";
                if (isEmpty3(prepaidDetailInfo.GP_CP_GROUP)) {
                  if (isEmpty3(gpCpGroupId)) {
                    gpCpIdGroup = prepaidDetailInfo.GP_CP_GROUP;
                  } else {
                    gpCpIdGroup = gpCpGroupId;
                  }
                } else {
                  if (selectCpRowType === "그룹") {
                    gpCpIdGroup = gpCpGroupId;
                  } else if (selectCpRowType === "단일") {
                    gpCpIdGroup = "";
                  } else {
                    gpCpIdGroup = prepaidDetailInfo.GP_CP_GROUP;
                  }
                }

                let gpdManageId = "";
                if (isEmpty3(prepaidDetailInfo.GCM_MANAGE_ID)) {
                  if (isEmpty3(gcmManageId)) {
                    gpdManageId = prepaidDetailInfo.GCM_MANAGE_ID;
                  } else {
                    gpdManageId = gcmManageId;
                  }
                } else {
                  if (selectWorkRowType === "단일") {
                    gpdManageId = gcmManageId;
                  } else if (selectWorkRowType === "그룹") {
                    gpdManageId = "";
                  } else {
                    gpdManageId = prepaidDetailInfo.GCM_MANAGE_ID;
                  }
                }

                let gpdManageGroup = "";
                if (isEmpty3(prepaidDetailInfo.GCM_MANAGE_GROUP)) {
                  if (isEmpty3(gcmManageGroupId)) {
                    gpdManageGroup = prepaidDetailInfo.GCM_MANAGE_GROUP;
                  } else {
                    gpdManageGroup = gcmManageGroupId;
                  }
                } else {
                  if (selectWorkRowType === "그룹") {
                    gpdManageGroup = gcmManageGroupId;
                  } else if (selectWorkRowType === "단일") {
                    gpdManageGroup = "";
                  } else {
                    gpdManageGroup = prepaidDetailInfo.GCM_MANAGE_GROUP;
                  }
                }

                if (isEmpty3(gpPrepaidType)) {
                  alert("유형을 선택하여 주시길 바랍니다.");
                  return;
                }

                if (isEmpty3(gpName)) {
                  alert("상세내용을 선택하여 주시길 바랍니다.");
                  return;
                }

                if (isEmpty3(gpCpId) && isEmpty3(gpCpIdGroup)) {
                  alert("CP상세코드를 선택하여 주시길 바랍니다.");
                  return;
                }

                if (isEmpty3(gpStatus)) {
                  alert("계약상태를 선택하여 주시길 바랍니다.");
                  return;
                }

                if (isEmpty3(gpdManageId) && isEmpty3(gpdManageGroup)) {
                  alert("작품코드를 선택하여 주시길 바랍니다.");
                  return;
                }

                if (isEmpty3(gpdPlatform) && isEmpty3(gpdPlatformGroup)) {
                  alert("플랫폼코드를 선택하여 주시길 바랍니다.");
                  return;
                }

                const param = {
                  GP_IDX: gpIdx,
                  GP_PREPAID_TYPE: gpPrepaidType,
                  GP_PREPAID_SEQ: gpPrepaidSeq,
                  GP_NAME: gpName,
                  GP_CP_ID: gpCpId,
                  GP_CP_GROUP: gpCpIdGroup,
                  GP_PRIORITY: gpPriority,
                  GP_SETTLEMENT_TYPE: gpSettlementType,
                  GP_STATUS: gpStatus,
                  GP_PREPAID_DETAIL: {
                    GP_PREPAID_SEQ: gpPrepaidSeq,
                    GPD_MANAGE_ID: gpdManageId,
                    GPD_MANAGE_GROUP: gpdManageGroup,
                    GPD_PLATFORM: gpdPlatform,
                    GPD_PLATFORM_GROUP: gpdPlatformGroup,
                    GPD_SALE_TYPE: gpdSaleType,
                    GPD_SETTLEMENT_RATE: gpdSettlementRate,
                    GPD_SETTLEMENT_PRIORITY: gpdSettlementPriority
                  },
                  beforeData: {
                    GP_IDX: prepaidDetailInfo.GP_IDX,
                    GP_PREPAID_TYPE: prepaidDetailInfo.GP_PREPAID_TYPE,
                    GP_PREPAID_SEQ: prepaidDetailInfo.GP_PREPAID_SEQ,
                    GP_NAME: prepaidDetailInfo.GP_NAME,
                    GP_CP_ID: prepaidDetailInfo.GP_CP_ID,
                    GP_CP_GROUP: prepaidDetailInfo.GP_CP_GROUP,
                    GP_PRIORITY: prepaidDetailInfo.GP_PRIORITY,
                    GP_SETTLEMENT_TYPE: prepaidDetailInfo.GP_SETTLEMENT_TYPE,
                    GP_STATUS: prepaidDetailInfo.GP_STATUS,
                    GP_PREPAID_DETAIL: {
                      GP_PREPAID_SEQ: prepaidDetailInfo.GP_PREPAID_SEQ,
                      GPD_MANAGE_ID: prepaidDetailInfo.GPD_MANAGE_ID,
                      GPD_MANAGE_GROUP: prepaidDetailInfo.GPD_MANAGE_GROUP,
                      GPD_PLATFORM: prepaidDetailInfo.GPD_PLATFORM,
                      GPD_PLATFORM_GROUP: prepaidDetailInfo.GPD_PLATFORM_GROUP,
                      GPD_SALE_TYPE: prepaidDetailInfo.GPD_SALE_TYPE,
                      GPD_SETTLEMENT_RATE: prepaidDetailInfo.GPD_SETTLEMENT_RATE,
                      GPD_SETTLEMENT_PRIORITY: prepaidDetailInfo.GPD_SETTLEMENT_PRIORITY
                    }
                  }
                };
                setPrepaidPaymentDetail(param);
                alert("등록완료");
                history.push(`/prepaid`);
              }
            }}
          >
            {"등록"}
          </Button>
        </Grid>
      </Grid>

      <div>
        <Paper component="form" sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: 1000 }}>
          <FormControl sx={{ width: 150 }}>
            <InputLabel id="demo-simple-select-label">유형</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={gpPrepaidType}
              label="유형"
              onChange={handleSetGpPrepaidTypeChange}
            >
              <MenuItem value={"선수수익"}>선수수익</MenuItem>
              <MenuItem value={"선급원가A"}>선급원가A</MenuItem>
              <MenuItem value={"선급원가B"}>선급원가B</MenuItem>
              <MenuItem value={"선급원가C"}>선급원가C</MenuItem>
            </Select>
          </FormControl>
          <TextField
            id="outlined-helperText"
            label="선급금 코드"
            value={gpPrepaidSeq}
            required
            InputProps={{
              readOnly: true
            }}
          />
          <TextField
            id="outlined-helperText"
            label="상세내용"
            value={gpName}
            required
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
          <TextField
            id="outlined-helperText"
            label="저작권자"
            value={gpCpName}
            InputProps={{
              readOnly: true
            }}
          />
          <TextField
            id="outlined-helperText"
            label="체크순위"
            value={gpPriority}
            onChange={(e) => {
              setGpPriority(e.target.value);
            }}
          />
          <TextField
            id="outlined-helperText"
            label="정산기준"
            value={gpSettlementType}
            onChange={(e) => {
              setGpSettlementType(e.target.value);
            }}
          />
        </Paper>
        <Paper component="form" sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: 1000 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">계약상태</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={gpStatus}
              label="계약상태"
              onChange={handleSetStatusChange}
            >
              <MenuItem value={"계약이관"}>계약이관</MenuItem>
              <MenuItem value={"계약중"}>계약중</MenuItem>
              <MenuItem value={"계약종료"}>계약종료</MenuItem>
              <MenuItem value={"계약해지"}>계약해지</MenuItem>
              <MenuItem value={"차감완료"}>차감완료</MenuItem>
              <MenuItem value={"확인필요"}>확인필요</MenuItem>
            </Select>
          </FormControl>
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
          <TextField
            id="outlined-helperText"
            label="플랫폼 코드"
            value={selectPlatform === "단일" || !isEmpty3(platformDetail) ? platformDetail : platformGroup}
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
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">정산대상매출</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={gpdSaleType}
              label="정산대상매출"
              onChange={handleSetGpdSaleTypeChange}
            >
              <MenuItem value={"순매출"}>순매출</MenuItem>
              <MenuItem value={"플랫폼 수령금액"}>플랫폼 수령금액</MenuItem>
              <MenuItem value={"플랫폼 매출액"}>플랫폼 매출액</MenuItem>
            </Select>
          </FormControl>
        </Paper>
        <Paper component="form" sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: 1000 }}>
          <TextField
            id="outlined-helperText"
            label="정산율"
            value={gpdSettlementRate}
            onChange={(e) => {
              setGpdSettlementRate(e.target.value);
            }}
          />
          <TextField
            id="outlined-helperText"
            label="정산순위"
            value={gpdSettlementPriority}
            onChange={(e) => {
              setGpdSettlementPriority(e.target.value);
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
        setCpName={setGpCpName}
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

export default PrepaidPaymentManagementWrite;
