import React, { useCallback, useMemo, useState } from "react";
import { useMutation } from "react-query";

import {
  Alert,
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Snackbar,
  Typography
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { read, utils } from "xlsx";

import { createMailValidation } from "api/mails";

import useToggle from "hooks/useToggle";

import DatePicker from "component/DatePicker";
import Loader from "component/Loader";

import { useCreateMailListDispatch, useCreateMailListState } from "./CreateMailListContext";

const color = grey[900];

function CreateMailListValidation() {
  const { isLoading, mutateAsync } = useMutation(createMailValidation);
  const dispatch = useCreateMailListDispatch();
  const { validation: state } = useCreateMailListState();
  const [isShowingSnackbar, onToggleSnackbar] = useToggle(false);
  const [snackbarState, setSnackbarState] = useState({
    type: "",
    message: ""
  });

  // 정산월을 변경한다
  function handleChangeDate(date) {
    dispatch({
      type: "SET_VALIDATION",
      validation: {
        ...state,
        date
      }
    });
  }

  // cpType을 변경한다
  function handleChangeCpType(e) {
    dispatch({
      type: "SET_VALIDATION",
      validation: {
        ...state,
        cpType: e.target.value
      }
    });
  }

  // 메일리스트를 등록한다
  async function handleSubmit(e) {
    e.preventDefault();

    const { cpType, date } = state;

    if (!date) {
      setSnackbarState({
        type: "error",
        message: "정산월을 입력해주세요"
      });
      onToggleSnackbar();

      return;
    }

    if (!cpType) {
      setSnackbarState({
        type: "error",
        message: "CP 타입을 선택해주세요"
      });
      onToggleSnackbar();

      return;
    }

    try {
      await mutateAsync({
        calcMonth: date,
        cpType: cpType
      });

      setSnackbarState({
        type: "success",
        message: "데이터 검증 성공"
      });
      onToggleSnackbar();
    } catch (err) {
      setSnackbarState({
        type: "error",
        message: "데이터 검증 실패\n관리자에게 문의하세요."
      });
      onToggleSnackbar();
    }
  }

  return (
    <>
      {isLoading && <Loader />}
      <Box sx={{ borderBottom: `1px solid ${color}` }}>
        <Typography variant="h6" component="h2" sx={{ mb: 1 }}>
          정산 메일 리스트 검증
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        {" "}
        <Box sx={{ mt: 3, flexGrow: 1 }}>
          <Grid container spacing={1}>
            <Grid item>
              <DatePicker label="정산월" value={state.date} onChange={handleChangeDate} />
            </Grid>
            <Grid item sx={{ display: "flex", alignItems: "flex-end" }}>
              <FormControl variant="standard" sx={{ minWidth: 120 }}>
                <InputLabel size="small">CP 타입</InputLabel>
                <Select label="CP 타입" size="small" value={state.cpType} onChange={handleChangeCpType}>
                  <MenuItem value="P">개인</MenuItem>
                  <MenuItem value="C">사업자</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ mt: 3, textAlign: "center" }}>
          <p>Validation 작업이란? - 등록한 정산 메일 리스트의 첨부 파일이 서버상에 존재하는지 체크하는 과정입니다.</p>
          <p>Validation 작업은 다소 시간이 소요됩니다.</p>
          <Button type="submit" variant="contained">
            <span>
              Validation
              <br />
              정산 데이터 & 파일
            </span>
          </Button>
        </Box>
      </form>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={isShowingSnackbar}
        autoHideDuration={3000}
        onClose={onToggleSnackbar}
      >
        <Alert onClose={onToggleSnackbar} severity={snackbarState.type} sx={{ width: "100%" }} variant="filled">
          {snackbarState.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default CreateMailListValidation;
