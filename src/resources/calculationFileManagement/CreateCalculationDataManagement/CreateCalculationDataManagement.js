import React, { useCallback, useState } from "react";
import { useNotify } from "react-admin";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Typography
} from "@mui/material";
import { grey } from "@mui/material/colors";

import useToggle from "hooks/useToggle";

import { getToday } from "utils/date";
import s3Upload from "utils/s3Upload";

import DatePicker from "component/DatePicker";
import FileUploader from "component/FileUploader";
import Loader from "component/Loader";

const color = grey[900];
const BUCKET_NAME = "myattatchbuket";

function CreateCalculationDataManagement() {
  const notify = useNotify();
  const [isLoading, onToggleLoading] = useToggle(false);
  const [cpType, setCpType] = useState("COM");
  const [date, setDate] = useState(getToday("yyyy-MM"));
  const [files, setFiles] = useState([]);
  const [uploadFailFiles, setUploadFailFiles] = useState([]);
  const handleDrop = useCallback((nextFiles) => {
    setFiles(nextFiles);
  }, []);

  // 파일 삭제
  function handleDeleteFiles(nextFiles) {
    setFiles(nextFiles);
  }

  // 정산월 변경
  function handleChangeDate(date) {
    console.log(date);
    setDate(date);
  }

  // cpType 변경
  function handleChangeCpType(e) {
    setCpType(e.target.value);
  }

  // 파일을 업로드 한다
  async function handleSubmit(e) {
    e.preventDefault();

    if (!date) {
      notify("정산월을 입력해주세요", { type: "error" });

      return;
    }

    if (!cpType) {
      notify("CP 타입을 선택해주세요", { type: "error" });

      return;
    }

    if (files?.length <= 0) {
      notify("정산서 파일을 업로드해주세요", { type: "error" });

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

    setUploadFailFiles(responses.filter((item) => !item.success));

    notify("파일 업로드 완료", { type: "success" });

    onToggleLoading();
  }

  return (
    <>
      {isLoading && <Loader />}
      <Box>
        <Paper
          sx={{
            width: "100%",
            height: "100%",
            flexShrink: 0,
            p: 3
          }}
        >
          <Box sx={{ borderBottom: `1px solid ${color}` }}>
            <Typography variant="h6" component="h2" sx={{ mb: 1 }}>
              정산서 파일 업로드
            </Typography>
          </Box>
          <form onSubmit={handleSubmit}>
            <Box sx={{ mt: 3, flexGrow: 1 }}>
              <Grid container spacing={1}>
                <Grid item>
                  <DatePicker
                    label="정산월"
                    views={["year", "month"]}
                    openTo="month"
                    format="yyyy-MM"
                    value={date}
                    onChange={handleChangeDate}
                    margin="no"
                  />
                </Grid>
                <Grid item sx={{ display: "flex", alignItems: "flex-end" }}>
                  <FormControl variant="standard" sx={{ minWidth: 120 }}>
                    <InputLabel size="small">CP 타입</InputLabel>
                    <Select label="CP 타입" size="small" value={cpType} onChange={handleChangeCpType}>
                      <MenuItem value="PER">개인</MenuItem>
                      <MenuItem value="COM">사업자</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ mt: 3 }}>
              <FileUploader multiple files={files} onDrop={handleDrop} onDeleteFile={handleDeleteFiles} />
            </Box>
            {uploadFailFiles.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <InputLabel shrink variant="standard">
                  업로드 실패
                </InputLabel>
                <List dense>
                  {uploadFailFiles.map((uploadedFile) => (
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
        </Paper>
      </Box>
    </>
  );
}

export default CreateCalculationDataManagement;
