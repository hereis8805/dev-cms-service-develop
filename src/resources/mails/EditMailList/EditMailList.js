import React, { useCallback } from "react";
import { useNotify, useMutation, useRedirect, Edit, SimpleForm, TextInput, SelectInput } from "react-admin";
import { Grid } from "@mui/material";

import DatePickerInput from "component/DatePickerInput";
import EditMailListToolbar from "./EditMailListToolbar";

function EditMailList(props) {
  const notify = useNotify();
  const redirect = useRedirect();
  const [mutate] = useMutation();

  const handleSubmit = useCallback(
    async (values) => {
      try {
        const response = await mutate(
          {
            type: "update",
            resource: "mail",
            payload: {
              id: values.id,
              data: {
                ...values,
                cp_type: values.cp_type_code === "C" ? "사업자" : "개인"
              }
            }
          },
          { returnPromise: true }
        );

        redirect("list", props.basePath, response.data.id, response.data);
      } catch (error) {
        notify("오류가 발생하여 등록에 실패하였습니다", { type: "error" });
      }
    },
    [mutate, redirect, notify, props.basePath]
  );

  return (
    <Edit {...props}>
      <SimpleForm save={handleSubmit} toolbar={<EditMailListToolbar />}>
        <Grid container spacing={1}>
          <Grid item>
            <DatePickerInput
              disabled
              name="month_calculate"
              label="정산월"
              views={["year", "month"]}
              openTo="month"
              format="yyyy-MM"
            />
          </Grid>
          <Grid item>
            <SelectInput
              margin="none"
              size="small"
              source="status_sending"
              variant="standard"
              label="전송상태"
              choices={[
                { id: 0, name: "대기" },
                { id: 2, name: "완료" },
                { id: 9, name: "실패" }
              ]}
            />
          </Grid>
          <Grid item>
            <SelectInput
              margin="none"
              source="cp_type_code"
              variant="standard"
              label="CP 타입"
              choices={[
                { id: "P", name: "개인" },
                { id: "C", name: "사업자" }
              ]}
            />
          </Grid>
        </Grid>
        <TextInput source="recv_name" label="수신자" fullWidth size="small" variant="outlined" />
        <TextInput source="recv_email" label="수신 이메일" fullWidth size="small" variant="outlined" />
        {/* <TextInput source="attach_bucket_path" fullWidth size="small" variant="outlined" /> */}
        <TextInput
          source="attach_files"
          helperText="2개 이상인 경우 ;로 구분"
          label="첨부 파일"
          fullWidth
          multiline
          size="small"
          variant="outlined"
        />
      </SimpleForm>
    </Edit>
  );
}

export default EditMailList;
