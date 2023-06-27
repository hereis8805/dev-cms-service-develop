import React, { useMemo } from "react";
import { useDropzone } from "react-dropzone";
import InputLabel from "@mui/material/InputLabel";

function Dropzone({
  accept,
  description = "파일을 여기에 드래그하거나, 클릭 후 파일을 선택해주세요",
  label = "파일 업로드",
  maxFile,
  multiple = true,
  onDrop
}) {
  const options = useMemo(() => {
    const nextOptions = {
      accept,
      maxFile
    };

    Object.entries(nextOptions).forEach(([key, value]) => {
      if (!value) delete nextOptions[key];
    });

    return nextOptions;
  }, [accept, maxFile]);
  const { getRootProps, getInputProps } = useDropzone({
    ...options,
    multiple,
    onDrop
  });

  return (
    <div className="upload-container">
      <InputLabel shrink variant="standard">
        {label}
      </InputLabel>
      <div {...getRootProps({ className: "drop-zone" })}>
        <input {...getInputProps()} />
        <p>{description}</p>
      </div>
    </div>
  );
}

export default React.memo(Dropzone);
