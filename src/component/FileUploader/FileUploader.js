import React, { useCallback, useMemo } from "react";
import Box from "@mui/material/Box";

import Dropzone from "../Dropzone";
import UploadedFiles from "../UploadedFiles";

function FileUploader({ accept, description, files, multiple, label, onDeleteFile, onDrop }) {
  const handleDrop = useCallback(
    (acceptedFiles) => {
      if (!multiple) {
        onDrop(acceptedFiles);

        return;
      }

      // 파일 중복 제거
      const nextFiles = [...files, ...acceptedFiles];
      const filteredNextFiles = nextFiles.filter(
        (file, index, self) => self.findIndex((f) => f.path === file.path) === index
      );

      onDrop(filteredNextFiles);
    },
    [files, multiple, onDrop]
  );
  const uploadedFile = useMemo(() => {
    if (!files) return [];

    return Array.isArray(files) ? files : [files];
  }, [files]);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 500
      }}
    >
      <Dropzone accept={accept} description={description} multiple={multiple} label={label} onDrop={handleDrop} />
      <UploadedFiles files={uploadedFile} onDeleteFile={onDeleteFile} />
    </Box>
  );
}

export default FileUploader;
