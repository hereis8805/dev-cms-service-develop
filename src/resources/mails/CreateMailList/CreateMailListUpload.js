import React, { useCallback, useState } from "react";
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

import useToggle from "hooks/useToggle";

import s3Upload from "utils/s3Upload";

import DatePicker from "component/DatePicker";
import FileUploader from "component/FileUploader";
import Loader from "component/Loader";

import { useCreateMailListDispatch, useCreateMailListState } from "./CreateMailListContext";
const color = grey[900];

const BUCKET_NAME = "myattatchbuket";

function CreateMailListUpload() {
  const dispatch = useCreateMailListDispatch();
  const { upload: state } = useCreateMailListState();
  const [isLoading, onToggleLoading] = useToggle(false);
  const [isShowingSnackbar, onToggleSnackbar] = useToggle(false);
  const [snackbarState, setSnackbarState] = useState({
    type: "",
    message: ""
  });
  const onDrop = useCallback(
    (files) => {
      dispatch({
        type: "SET_UPLOAD",
        upload: {
          ...state,
          files
        }
      });
    },
    [dispatch, state]
  );

  function handleDeleteFiles(nextFiles) {
    dispatch({
      type: "SET_UPLOAD",
      upload: {
        ...state,
        files: nextFiles
      }
    });
  }

  // 정산월을 변경한다
  function handleChangeDate(date) {
    dispatch({
      type: "SET_UPLOAD",
      upload: {
        ...state,
        date
      }
    });
  }

  // cpType을 변경한다
  function handleChangeCpType(e) {
    dispatch({
      type: "SET_UPLOAD",
      upload: {
        ...state,
        cpType: e.target.value
      }
    });
  }

  // 파일을 업로드 한다
  async function handleSubmit(e) {
    e.preventDefault();

    const { cpType, date, files } = state;

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

    if (files?.length <= 0) {
      setSnackbarState({
        type: "error",
        message: "정산 첨부 파일을 업로드해주세요"
      });
      onToggleSnackbar();

      return;
    }

    onToggleLoading();

    const bucket = `${BUCKET_NAME}/${date}-${cpType}`;
    const uploadedFiles = files.map(async (file) => {
      try {
        const result = await s3Upload({
          file,
          bucket,
          key: file.name
        });

        return result;
      } catch (err) {
        return err;
      }
    });

    const responses = await Promise.all(uploadedFiles);

    dispatch({
      type: "SET_UPLOAD",
      upload: {
        ...state,
        files: [],
        uploadedFiles: responses.filter((item) => !item.success)
      }
    });
    setSnackbarState({
      type: "success",
      message: "파일 업로드 완료"
    });
    onToggleSnackbar();
    onToggleLoading();
  }

  return (
    <>
      {isLoading && <Loader />}
      <Box sx={{ borderBottom: `1px solid ${color}` }}>
        <Typography variant="h6" component="h2" sx={{ mb: 1 }}>
          정산 파일 업로드
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
                  <MenuItem value="PER">개인</MenuItem>
                  <MenuItem value="COM">사업자</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ mt: 3 }}>
          <FileUploader multiple files={state.files} onDrop={onDrop} onDeleteFile={handleDeleteFiles} />
        </Box>
        {state.uploadedFiles.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <InputLabel shrink variant="standard">
              업로드 실패
            </InputLabel>
            <List dense>
              {state.uploadedFiles.map((uploadedFile) => (
                <ListItem key={uploadedFile.file}>
                  <ListItemText primary={uploadedFile.file} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Button type="submit" variant="contained">
            파일 업로드
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

export default CreateMailListUpload;
