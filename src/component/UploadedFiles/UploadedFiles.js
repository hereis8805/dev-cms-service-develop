import React, { useEffect, useState } from "react";

import { Box, Typography } from "@mui/material";
import List from "@mui/material/List";

import UploadedFile from "./UploadedFile";

function UploadedFiles({ files = [], onDeleteFile }) {
  const [nextFiles, setNextFiles] = useState([]);
  const [displayFiles, setDisplayFiles] = useState([]);

  function handleDeleteFile(index) {
    return function () {
      const deletedNextFiles = nextFiles.filter((_, fileIndex) => index !== fileIndex);

      setNextFiles(deletedNextFiles);
      onDeleteFile(deletedNextFiles);
    };
  }

  useEffect(() => {
    setNextFiles(files);
  }, [files]);

  useEffect(() => {
    const nextDisplayFiles = nextFiles.filter((_, fileIndex) => fileIndex < 10);

    setDisplayFiles(nextDisplayFiles);
  }, [nextFiles]);

  return (
    <Box sx={{ mt: 2 }}>
      {nextFiles.length > 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end"
          }}
        >
          <Typography variant="body1" component="span">
            <strong>선택된 파일</strong>
          </Typography>
          <Typography variant="body2" component="span">
            총 {nextFiles.length}개
          </Typography>
        </Box>
      )}

      <List dense>
        {displayFiles.map((file, index) => (
          <UploadedFile key={file.path} fileName={file.path} onDeleteFile={handleDeleteFile(index)} />
        ))}
      </List>
      {nextFiles.length > 10 && (
        <Typography component="p" sx={{ textAlign: "center" }}>
          ...
        </Typography>
      )}
    </Box>
  );
}

export default UploadedFiles;
