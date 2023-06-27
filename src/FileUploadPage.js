import { useEffect, useState } from "react";
import { useNotify } from "react-admin";
import { useDropzone } from "react-dropzone";
import { Box, Button, CircularProgress } from "@material-ui/core";
import s3Upload from "./utils/s3Upload";

const FileUploadPage = () => {
  const [loading, setLoading] = useState(false);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
  const notify = useNotify();
  const isFileLimit = acceptedFiles.length > 0;

  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  const handleClick = async () => {
    setLoading(true);
    const uploadFile = acceptedFiles[0];
    const result = await s3Upload(uploadFile);
    console.log("result", result);

    if (!result.success) {
      setLoading(false);
      notify("실패", { type: "error" });
      return;
    }

    setLoading(false);
    notify("성공", { type: "success" });
  };

  return (
    <section className="upload-container">
      <div {...getRootProps({ className: "drop-zone" })}>
        <input {...getInputProps()} />
        <p>파일을 여기에 드래그하거나, 클릭 후 파일을 선택해주세요</p>
      </div>
      <aside>
        <h4>Files</h4>
        <ul>{files}</ul>
      </aside>
      <Box ml="auto">
        <Button variant="contained" color="primary" onClick={handleClick} disabled={!isFileLimit || loading}>
          {loading ? <CircularProgress size={24} /> : "파일 업로드"}
        </Button>
      </Box>
    </section>
  );
};

export default FileUploadPage;
