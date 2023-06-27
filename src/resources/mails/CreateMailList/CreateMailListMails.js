import React, { useCallback, useMemo, useState } from "react";
import { useMutation } from "react-query";
import { read, utils } from "xlsx";
import {
  Alert,
  Box,
  Button,
  FormControl,
  Grid,
  MenuItem,
  InputLabel,
  Select,
  Snackbar,
  Typography
} from "@mui/material";
import { grey } from "@mui/material/colors";

import { createMailList } from "api/mails";

import useToggle from "hooks/useToggle";

import DatePicker from "component/DatePicker";
import FileUploader from "component/FileUploader";
import Loader from "component/Loader";

import { useCreateMailListDispatch, useCreateMailListState } from "./CreateMailListContext";

const color = grey[900];
const BUCKET_NAME = "myattatchbuket";
const EXCEL_TABS = {
  P: {
    listIndex: 4,
    folder: "PER",
    code: "P",
    name: "개인"
  },
  C: {
    listIndex: 3,
    folder: "COM",
    code: "C",
    name: "사업자"
  }
};

function CreateMailListMails() {
  const { isLoading, mutateAsync } = useMutation(createMailList);
  const dispatch = useCreateMailListDispatch();
  const { mails: state } = useCreateMailListState();
  const [isShowingSnackbar, onToggleSnackbar] = useToggle(false);
  const [snackbarState, setSnackbarState] = useState({
    type: "",
    message: ""
  });

  const currentFile = useMemo(() => {
    return state?.file ? [state.file] : [];
  }, [state?.file]);

  const handleDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles?.length <= 0) return;

      const file = acceptedFiles[0];
      const reader = new FileReader();
      const rABS = !!reader.readAsBinaryString;

      reader.onabort = () => {
        setSnackbarState({
          type: "error",
          message: "메일 리스트 업로드가 중단되었습니다"
        });
        onToggleSnackbar();
      };

      reader.onerror = () => {
        setSnackbarState({
          type: "error",
          message: "메일 리스트 업로드에 실패하였습니다"
        });
        onToggleSnackbar();
      };

      reader.onload = (e) => {
        const bstr = e.target.result;
        const wb = read(bstr, { type: rABS ? "binary" : "array" });

        dispatch({
          type: "SET_MAILS",
          mails: {
            ...state,
            file,
            convertFile: wb
          }
        });
      };

      if (rABS) reader.readAsBinaryString(file);
      else reader.readAsArrayBuffer(file);
    },
    [dispatch, state, onToggleSnackbar]
  );

  // 정산월을 변경한다
  function handleChangeDate(date) {
    dispatch({
      type: "SET_MAILS",
      mails: {
        ...state,
        date
      }
    });
  }

  // cpType을 변경한다
  function handleChangeCpType(e) {
    dispatch({
      type: "SET_MAILS",
      mails: {
        ...state,
        cpType: e.target.value
      }
    });
  }

  // 메일 리스트를 삭제한다
  function handleDeleteMailList() {
    dispatch({
      type: "SET_MAILS",
      mails: {
        ...state,
        file: null,
        convertFile: null
      }
    });
  }

  // 메일리스트를 등록한다
  async function handleSubmit(e) {
    e.preventDefault();

    if (!state.convertFile) {
      setSnackbarState({
        type: "error",
        message: "메일 리스트를 등록해주세요"
      });
      onToggleSnackbar();

      return;
    }

    if (!state.cpType) {
      setSnackbarState({
        type: "error",
        message: "CP 타입을 선택해주세요"
      });
      onToggleSnackbar();

      return;
    }

    try {
      const { convertFile, cpType, date } = state;
      const tabIndex = EXCEL_TABS[cpType].listIndex;
      const wsname = convertFile.SheetNames[tabIndex];

      // 데이터를 컨버팅 한다
      const jsonFromExcel = utils.sheet_to_json(convertFile.Sheets[wsname]);
      const nextMails = [];

      jsonFromExcel.forEach((item) => {
        const files = item.attach_files?.split(";") || [];
        const isMultipleFiles = files.length > 1;

        // 데이터에 이상한 값이 들어가 있을 수도 있으므로 항목들을 다 직접 입력해준다
        nextMails.push({
          attach_bucket_path: BUCKET_NAME,
          cp_type: EXCEL_TABS[cpType].name,
          cp_type_code: EXCEL_TABS[cpType].code,
          month_calculate: date,
          recv_name: item.recv_name,
          recv_email: item.recv_email,
          attach_files: isMultipleFiles
            ? files.map((file) => `${date}-${EXCEL_TABS[cpType].folder}/${file}`).join(";")
            : `${date}-${EXCEL_TABS[cpType].folder}/${item.attach_files}`
        });
      });

      await mutateAsync({
        data: nextMails
      });

      setSnackbarState({
        type: "success",
        message: "정산 메일 리스트 등록 완료"
      });
      onToggleSnackbar();
    } catch (err) {
      setSnackbarState({
        type: "error",
        message: "정산 메일 리스트 실패"
      });
      onToggleSnackbar();
    }
  }

  return (
    <>
      {isLoading && <Loader />}
      <Box sx={{ borderBottom: `1px solid ${color}` }}>
        <Typography variant="h6" component="h2" sx={{ mb: 1 }}>
          정산 메일 리스트 등록
        </Typography>
      </Box>
      <form onSubmit={handleSubmit}>
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
        <Box sx={{ mt: 3 }}>
          <FileUploader
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            files={currentFile}
            multiple={false}
            label="메일 리스트 업로드"
            onDeleteFile={handleDeleteMailList}
            onDrop={handleDrop}
          />
        </Box>
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Button type="submit" variant="contained">
            리스트 등록
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

export default CreateMailListMails;
