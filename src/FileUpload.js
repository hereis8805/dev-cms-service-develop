import { useCallback, useState } from "react";
import { useNotify } from "react-admin";
import { Box, Button } from "@material-ui/core";

import useToggle from "hooks/useToggle";

import FileUploader from "component/FileUploader";
import Loader from "component/Loader";

import s3Upload from "./utils/s3Upload";

const BUCKET_NAME = "myattatchbuket";
const BUCKET_FOLDER_NAME = "Calc-Data";

const FileUpload = ({ date, files, onSetFiles, onComplete, onSetUploadedData, onRemoveFile, bucket, folder }) => {
  const notify = useNotify();
  const [isLoading, onToggleLoading] = useToggle(false);
  const [file, setFile] = useState(null);

  // 파일 삭제
  function handleDeleteFile() {
    setFile(null);
  }

  // 파일을 업로드 한다
  async function handleSubmit(e) {
    e.preventDefault();

    if (!date) {
      notify("정산월을 선택해주세요", { type: "warning" });

      return;
    }

    if (!files || files.length <= 0) {
      notify("통합 정산 파일을 업로드해주세요", { type: "warning" });

      return;
    }

    onToggleLoading();

    const file = files[0];
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
      onComplete();
    } catch (err) {
      notify("통합 정산 파일 업로드에 실패하였습니다", { type: "error" });
    } finally {
      onToggleLoading();
    }
  }

  return (
    <>
      {isLoading && <Loader />}
      <div>
        <FileUploader multiple={false} files={files} onDrop={onSetFiles} onDeleteFile={handleDeleteFile} />
        <Box ml="auto">
          <Button variant="contained" color="primary" onClick={handleSubmit} disabled={isLoading}>
            파일 업로드
          </Button>
        </Box>
      </div>
    </>
  );
};

export default FileUpload;
