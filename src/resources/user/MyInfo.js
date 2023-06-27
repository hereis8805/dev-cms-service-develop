import { Grid, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { getAccountsDetail, getAccountsListGrade, putAccountsDetail } from "axios/user/user";
import PasswordModifyPopup from "./PasswordModifyPopup";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import CpPopup2 from "../../component/popup/CpPopup2";
import { Title } from "react-admin";
import { useRecoilState } from "recoil";
import { initSearchMont, searchMonthAtom } from "store/atom";

const columns = [
  { field: "id", headerName: "No.", width: 120 },
  { field: "GM_LEVEL", headerName: "Depth", width: 120 },
  { field: "GM_NAME", headerName: "메뉴명", width: 800 }
];

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

function Myinfo(props) {
  const [guIdx, setGuIdx] = useState(0);
  const [guGrade, setGuGrade] = useState("");
  const [guUserId, setGuUserId] = useState("");
  const [guName, setGuName] = useState("");
  const [guEmail, setGuEmail] = useState("");
  const [guDescription, setGuDescription] = useState("");
  const [popupPassword, setPopupPassword] = useState(false);
  const history = useHistory();
  const item = JSON.parse(localStorage.getItem("userInfo"));
  const [menuList, setMenuList] = useState([]);
  const [grade, setGrade] = useState("");
  const [requestParam, setRequestParam] = useRecoilState(searchMonthAtom);

  // CP 팝업
  const [gpCpId, setGpCpId] = useState("");
  const [gpCpGroupId, setGpCpGroupId] = useState("");
  const [gpCpName, setCpName] = useState("");
  const [popupCp, setPopupCp] = useState(false);
  const [selectCp, setSelectCp] = useState("");
  const [selectCpRowType, setSelectCpRowType] = useState("");

  const handleGetAccountsDetail = async (guIdx) => {
    await getAccountsDetail(guIdx)
      .then((res) => {
        setGuIdx(res.data.userInfo.GU_IDX);
        setGuGrade(res.data.userInfo.GU_GRADE);
        setGuUserId(res.data.userInfo.GU_USER_ID);
        setGuName(res.data.userInfo.GU_NAME);
        setGuEmail(res.data.userInfo.GU_EMAIL);
        setGuDescription(res.data.userInfo.GU_DESCRIPTION);
        setGpCpId(res.data.userInfo.GCD_OLD);
        setCpName(res.data.userInfo.GCD_COMPANY_NAME);
        setMenuList(res.data.menuList);
      })
      .catch((e) => {
        throw e;
      });
  };

  const handleSetGuGradeChange = (event) => {
    setGuGrade(event.target.value);
  };

  const handleGetAccountsListGrade = async () => {
    await getAccountsListGrade()
      .then((res) => {
        setGrade(res.data);
      })
      .catch((e) => {
        throw e;
      });
  };

  useEffect(() => {
    history.action === "PUSH" && setRequestParam(initSearchMont);
  }, [history, setRequestParam]);

  useEffect(() => {
    handleGetAccountsDetail(item?.user?.no);
    handleGetAccountsListGrade();
    // handleGetAccountsDetail(props.match.params.id);
  }, []);

  return (
    <>
      <Title title="내정보" />
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
            계정 정보
          </Typography>
          <Grid container item spacing={2} p={2}>
            <Grid item xs>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">회원구분</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={guGrade}
                  label="회원구분"
                  onChange={handleSetGuGradeChange}
                  disabled={grade === "C"}
                >
                  <MenuItem value={"S"}>슈퍼관리자</MenuItem>
                  <MenuItem value={"M"}>담당자</MenuItem>
                  <MenuItem value={"C"}>CP</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs>
              <TextField
                id="outlined-helperText"
                label="아이디"
                value={guUserId}
                InputProps={{
                  readOnly: true
                }}
                onChange={(e) => {
                  setGuUserId(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs justifyContent="center" alignItems="center">
              <Button
                variant="contained"
                onClick={(e) => {
                  setPopupPassword(true);
                }}
              >
                비밀번호 변경
              </Button>
            </Grid>
            <Grid item xs></Grid>
          </Grid>
          <Grid container item spacing={2} p={2}>
            <Grid item xs>
              <TextField
                id="outlined-helperText"
                label="이름"
                value={guName}
                onChange={(e) => {
                  setGuName(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs>
              <TextField
                id="outlined-helperText"
                label="이메일"
                value={guEmail}
                onChange={(e) => {
                  setGuEmail(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs>
              <TextField
                id="outlined-helperText"
                label="기타정보"
                value={guDescription}
                onChange={(e) => {
                  setGuDescription(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs />
          </Grid>
          {!(grade === "S" || grade === "M") && (
            <Grid container item spacing={2} p={2}>
              <Grid item xs>
                <TextField
                  id="outlined-helperText"
                  label="CP코드"
                  value={selectCpRowType === "단일" || !isEmpty3(gpCpId) ? gpCpId : gpCpGroupId}
                  InputProps={{
                    readOnly: true
                  }}
                  disabled={grade === "C"}
                />
              </Grid>
              <Grid item xs>
                <TextField
                  id="outlined-helperText"
                  label="CP명"
                  value={gpCpName}
                  InputProps={{
                    readOnly: true
                  }}
                  disabled={grade === "C"}
                />
              </Grid>
              <Grid item xs>
                {/* <IconButton
                  type="button"
                  sx={{ p: "10px" }}
                  aria-label="search"
                  onClick={(e) => {
                    setPopupCp(true);
                  }}
                >
                  <SearchIcon />
                </IconButton> */}
              </Grid>
              <Grid item xs></Grid>
            </Grid>
          )}
          <Grid container direction="row" justifyContent="end" alignItems="end" p={2}>
            <Grid item>
              <Button
                variant="contained"
                onClick={() => {
                  history.goBack();
                }}
              >
                취소
              </Button>
              <Button
                variant="contained"
                sx={{ ml: 2 }}
                onClick={() => {
                  if (window.confirm("정말 수정하시겠습니까?")) {
                    const param = {
                      GU_IDX: guIdx,
                      GU_GRADE: guGrade,
                      GU_NAME: guName,
                      GU_EMAIL: guEmail,
                      GU_DESCRIPTION: guDescription,
                      GU_CP_ID: gpCpId
                    };
                    putAccountsDetail(param);
                    alert("수정완료");
                  }
                }}
              >
                수정
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <PasswordModifyPopup
        popupPassword={popupPassword}
        setPopupPassword={setPopupPassword}
        guIdx={guIdx}
        guUserId={guUserId}
      />
      <div style={{ height: 500, width: "100%" }}>
        <DataGrid columns={columns} rows={menuList} hideFooterPagination={true} />
      </div>
      <CpPopup2
        popupCp={popupCp}
        setPopupCp={setPopupCp}
        selectCp={selectCp}
        setSelectCp={setSelectCp}
        setGpCpId={setGpCpId}
        setGpCpGroupId={setGpCpGroupId}
        setCpName={setCpName}
        selectCpRowType={selectCpRowType}
        setSelectCpRowType={setSelectCpRowType}
      />
    </>
  );
}
export default Myinfo;
