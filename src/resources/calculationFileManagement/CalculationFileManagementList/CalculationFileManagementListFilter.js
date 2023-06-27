import React from "react";
import { useHistory, useLocation, Link } from "react-router-dom";
import { useNotify } from "react-admin";
import { Button, Box, Grid, FormControl, Input, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { Field, Form } from "react-final-form";
import AWS from "aws-sdk";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { stringify } from "query-string";

import DatePicker from "component/DatePicker";

import {
  useCalculationFileManagementDispatch,
  useCalculationFileManagementState
} from "./CalculationFileManagementContext";

const BUCKET_NAME = "myattatchbuket";

function CalculationFileManagementListFilter() {
  const notify = useNotify();
  const dispatch = useCalculationFileManagementDispatch();
  const { filterValues } = useCalculationFileManagementState();

  // 파일 전체 다운로드
  async function allDownloadFiles() {
    const { monthCalculate, cpType } = filterValues;
    const s3 = new AWS.S3();
    const albumPhotosKey = encodeURIComponent(`${monthCalculate}-${cpType}`) + "/";
    const zip = new JSZip();

    try {
      const list = await s3
        .listObjectsV2({
          Bucket: BUCKET_NAME,
          Delimiter: "",
          Prefix: albumPhotosKey
        })
        .promise();

      if (list?.Contents?.length <= 0) {
        notify("다운로드할 파일이 존재하지 않습니다", { type: "error" });

        return;
      }

      const getFiles = list.Contents.map(async (content) => {
        try {
          const result = await s3
            .getObject({
              Bucket: BUCKET_NAME,
              Key: content.Key
            })
            .promise();

          return {
            success: true,
            key: content.Key,
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

          notify("파일 다운로드 성공");
        })
        .catch(() => {
          notify("파일 다운로드 실패", { type: "error" });
        });
    } catch (err) {
      notify("파일 다운로드 실패", { type: "error" });
    }
  }

  // 검색
  async function handleSetFilterValues(values) {
    dispatch({
      type: "SET_FILTER_VALUES",
      filterValues: {
        ...values
      }
    });
  }

  return (
    <Box sx={{ width: "100%", pt: 1 }}>
      <Box sx={{ textAlign: "right", mb: 1 }}>
        <Button
          component={Link}
          to="/calucationDataManagement/create"
          sx={{
            minWidth: 0
          }}
        >
          정산서 업로드
        </Button>
        <Button type="button" onClick={allDownloadFiles}>
          전체 다운로드
        </Button>
      </Box>
      <Box
        sx={{
          width: "100%",
          backgroundColor: "#FFFFFF",
          boxShadow:
            "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%);",
          mb: 2,
          p: 2
        }}
      >
        <Typography variant="subtitle1" component="h1" sx={{ mb: 2 }}>
          정산서 파일 관리
        </Typography>
        <Form initialValues={{ ...filterValues }} onSubmit={handleSetFilterValues}>
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item>
                  <FormControl variant="standard" sx={{ minWidth: 120, mr: 2 }}>
                    <Field name="monthCalculate">
                      {({ input: { value, onChange } }) => (
                        <DatePicker
                          label="정산월"
                          views={["year", "month"]}
                          openTo="month"
                          format="yyyy-MM"
                          value={value}
                          onChange={onChange}
                          margin="no"
                        />
                      )}
                    </Field>
                  </FormControl>
                  <FormControl variant="standard" sx={{ minWidth: 120, mr: 2 }}>
                    <InputLabel size="small">CP 타입</InputLabel>
                    <Field name="cpType">
                      {({ input: { value, onChange } }) => (
                        <Select label="CP 타입" size="small" value={value} onChange={onChange}>
                          <MenuItem value="PER">개인</MenuItem>
                          <MenuItem value="COM">사업자</MenuItem>
                        </Select>
                      )}
                    </Field>
                  </FormControl>
                  <FormControl variant="standard">
                    <InputLabel size="small">파일명</InputLabel>
                    <Field name="fileName">
                      {({ input: { value, onChange } }) => (
                        <Input type="text" size="small" value={value} onChange={onChange} />
                      )}
                    </Field>
                  </FormControl>
                </Grid>
                <Grid item>
                  <Button type="submit" variant="contained" color="primary">
                    검색
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}
        </Form>
      </Box>
    </Box>
  );
}

export default CalculationFileManagementListFilter;
