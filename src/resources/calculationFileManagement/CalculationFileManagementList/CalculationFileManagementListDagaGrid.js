import React, { useCallback, useEffect, useState, useRef } from "react";
import { Transition } from "react-transition-group";
import { useNotify } from "react-admin";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Toolbar } from "@mui/material";
import AWS from "aws-sdk";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { format } from "date-fns";

import { formatNumber } from "utils/string";

import {
  useCalculationFileManagementDispatch,
  useCalculationFileManagementState
} from "./CalculationFileManagementContext";

const BUCKET_NAME = "myattatchbuket";

const columns = [
  { field: "Key", headerName: "파일명", flex: 1 },
  { field: "Size", headerName: "사이즈", width: 150 },
  { field: "LastModified", headerName: "생성일자", width: 200 }
];

const transitionStyle = {
  entering: { height: 0, minHeight: 0 },
  entered: { height: "64px", minHeight: "64px" },
  exiting: { height: "0px", minHeight: "0px" },
  exited: { height: "0px", minHeight: "0px" }
};

function CalculationFileManagementListDagaGrid() {
  const notify = useNotify();
  const dispatch = useCalculationFileManagementDispatch();
  const { calculationFiles, filterValues, selectedCalculationFiles } = useCalculationFileManagementState();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const s3 = useRef(null);
  const nextContinuationToken = useRef(null);

  // s3에서 파일 리스트를 불러 온다.
  const getFiles = useCallback(async () => {
    if (!s3.current) return;

    const { cpType, monthCalculate } = filterValues;
    const key = encodeURIComponent(`${monthCalculate}-${cpType}`) + "/";
    const list = await s3.current
      .listObjectsV2({
        Bucket: BUCKET_NAME,
        Delimiter: "",
        Prefix: key,
        MaxKeys: 50,
        ContinuationToken: nextContinuationToken.current
      })
      .promise();

    if (list?.Contents?.length <= 0) {
      return;
    }

    nextContinuationToken.current = list.IsTruncated ? list.NextContinuationToken : null;

    console.log(list.Contents);

    const nextFiles = list.Contents.map((content) => ({
      ...content,
      LastModified: format(content.LastModified, "yyyy-MM-dd hh:mm:s"),
      Size: formatNumber(content.Size),
      id: content.Key
    }));

    dispatch({
      type: "SET_FILES",
      calculationFiles: nextFiles
    });

    if (list.IsTruncated) {
      getFiles();
    }
  }, [dispatch, filterValues]);

  // 파일 이름 필터링
  const setFilteredFilesOfFileName = useCallback(() => {
    const { fileName } = filterValues;

    if (!fileName) {
      setFilteredFiles(calculationFiles);
      setCurrentPageIndex(0);

      return;
    }

    const nextFiles = calculationFiles.filter((file) => file.Key.includes(fileName));

    setFilteredFiles(nextFiles);
    setCurrentPageIndex(0);
  }, [calculationFiles, filterValues]);

  // 리스트 페이지 이동
  function handleChangePage(index) {
    setCurrentPageIndex(index);
  }

  // 파일 선택
  function handleSelectFiles(nextSelectedCalculationFiles) {
    dispatch({
      type: "SELECT_FILES",
      selectedCalculationFiles: nextSelectedCalculationFiles
    });
  }

  // 선택한 파일 다운로드
  async function handleDownloadFiles() {
    const { monthCalculate, cpType } = filterValues;
    const s3 = new AWS.S3();
    const zip = new JSZip();

    try {
      const getFiles = selectedCalculationFiles.map(async (content) => {
        try {
          const result = await s3
            .getObject({
              Bucket: BUCKET_NAME,
              Key: content
            })
            .promise();

          return {
            success: true,
            key: content,
            result
          };
        } catch (err) {
          return {
            success: false,
            result: err
          };
        }
      });

      const responses = await Promise.all(getFiles);
      const files = responses.filter((response) => response.success);

      files.forEach((file) => {
        zip.file(file.key, file.result.Body);
      });

      zip
        .generateAsync({ type: "blob" })
        .then((content) => {
          saveAs(content, `${monthCalculate}-${cpType}.zip`);

          notify("파일 다운로드 성공", { type: "success" });

          dispatch({
            type: "SELECT_FILES",
            selectedCalculationFiles: []
          });
        })
        .catch((err) => {
          notify("파일 다운로드 실패", { type: "error" });
        });
    } catch (err) {
      notify("파일 다운로드 실패", { type: "error" });
    }
  }

  useEffect(() => {
    s3.current = new AWS.S3();
  }, []);

  useEffect(() => {
    getFiles();
  }, [dispatch, getFiles]);

  useEffect(() => {
    setFilteredFiles(calculationFiles);
  }, [calculationFiles]);

  useEffect(() => {
    setFilteredFilesOfFileName();
  }, [setFilteredFilesOfFileName]);

  return (
    <>
      <Transition timeout={300} in={selectedCalculationFiles.length > 0} mountOnEnter unmountOnExit>
        {(state) => (
          <Toolbar
            style={{
              color: "#31a6ff",
              zIndex: 3,
              transition:
                "height 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, min-height 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
              justifyContent: "space-between",
              backgroundColor: "rgb(234, 249, 255)",
              ...transitionStyle[state]
            }}
          >
            <Button type="button" onClick={handleDownloadFiles}>
              선택한 파일 다운로드{" "}
            </Button>
          </Toolbar>
        )}
      </Transition>
      <div style={{ width: "100%" }}>
        <DataGrid
          autoHeight
          checkboxSelection
          pagination
          columns={columns}
          rows={filteredFiles}
          page={currentPageIndex}
          rowCount={filteredFiles.length}
          pageSize={50}
          rowsPerPageOptions={[50]}
          selectionModel={selectedCalculationFiles}
          onPageChange={handleChangePage}
          onSelectionModelChange={handleSelectFiles}
        />
      </div>
    </>
  );
}

export default CalculationFileManagementListDagaGrid;
