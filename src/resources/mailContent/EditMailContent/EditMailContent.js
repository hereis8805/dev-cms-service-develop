import React from "react";
import { Edit, SelectInput, SimpleForm, TextInput } from "react-admin";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@mui/material";

import DatePickerInput from "component/DatePickerInput";
import EditMailContentToolbar from "./EditMailContentToolbar";

const useStyles = makeStyles({
  select: {
    marginTop: 3
  }
});

function checkValidation(values) {
  const errors = {};

  if (!values.month_calculate) {
    errors.month_calculate = "정산월을 선택해주세요";
  }

  if (!values.cp_type_code) {
    errors.cp_type_code = "CP 타입을 선택해주세요";
  }

  if (!values.mail_body) {
    errors.mail_body = "메일 본문을 입력해주세요";
  }

  if (!values.mail_title) {
    errors.mail_title = "메일 제목을 입력해주세요 ";
  }

  return errors;
}

function EditMailContent(props) {
  const style = useStyles();

  return (
    <>
      <Edit {...props} title="정산메일 콘텐츠 수정">
        <SimpleForm validate={checkValidation} toolbar={<EditMailContentToolbar />}>
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
                disabled
                margin="none"
                className={style.select}
                variant="standard"
                size="small"
                label="CP 타입"
                source="cp_type_code"
                choices={[
                  { name: "사업자", id: "C" },
                  { name: "개인", id: "P" }
                ]}
              />
            </Grid>
          </Grid>
          <TextInput fullWidth source="mail_title" label="메일 제목" variant="outlined" size="small" margin="none" />
          <TextInput
            fullWidth
            multiline
            source="mail_body"
            label="메일 본문"
            variant="outlined"
            size="small"
            margin="none"
            minRows={3}
          />
        </SimpleForm>
      </Edit>
    </>
  );
}

export default EditMailContent;
