import React, { useCallback, useState } from "react";
import { useNotify } from "react-admin";
import { Box, Button, Paper, Typography } from "@mui/material";
import { format } from "date-fns";
import { grey } from "@mui/material/colors";

import useToggle from "hooks/useToggle";

import s3Upload from "utils/s3Upload";

import DatePicker from "component/DatePicker";
import FileUploader from "component/FileUploader";
import Loader from "component/Loader";

const color = grey[900];
const BUCKET_NAME = "myattatchbuket";
const BUCKET_FOLDER_NAME = "Calc-Data";

function CreateCalculationData() {
  const notify = useNotify();
  const [isLoading, onToggleLoading] = useToggle(false);
  const [date, setDate] = useState(format(new Date(), "yyyy-MM"));
  const [file, setFile] = useState(null);
  const handleDrop = useCallback((files) => {
    if (files.length > 0) setFile(files[0]);
  }, []);

  // 파일 삭제
  function handleDeleteFile() {
    setFile(null);
  }

  // 정산월을 변경한다
  function handleChangeDate(date) {
    setDate(date);
  }

  // 파일을 업로드 한다
  async function handleSubmit(e) {
    e.preventDefault();

    if (!date) {
      notify("정산월을 선택해주세요", { type: "warning" });

      return;
    }

    if (!file) {
      notify("통합 정산 파일을 업로드해주세요", { type: "warning" });

      return;
    }

    onToggleLoading();

    const bucket = `${BUCKET_NAME}/${date}-${BUCKET_FOLDER_NAME}`;
    const fileTexts = file.name.split(".");
    const fileTypeIndex = fileTexts.length - 1;

    if (fileTypeIndex <= 0) {
      notify("파일 형식을 확인할 수 없습니다", { type: "warning" });

      return;
    }

    try {
      const result = await s3Upload({
        file,
        bucket,
        key: `${date}-Calc-Raw.${fileTexts[fileTypeIndex]}`
      });

      if (!result.success) {
        throw new Error();
      }

      notify("파일 업로드 완료", { type: "success" });
    } catch (err) {
      notify("통합 정산 파일 업로드에 실패하였습니다", { type: "error" });
    } finally {
      onToggleLoading();
    }
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
              통합 정산 파일 업로드
            </Typography>
          </Box>
          <form onSubmit={handleSubmit}>
            <Box sx={{ mt: 3, flexGrow: 1 }}>
              <DatePicker label="정산월" value={date} onChange={handleChangeDate} />
            </Box>
            <Box sx={{ mt: 3 }}>
              <FileUploader multiple={false} files={file} onDrop={handleDrop} onDeleteFile={handleDeleteFile} />
            </Box>
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

export default CreateCalculationData;
