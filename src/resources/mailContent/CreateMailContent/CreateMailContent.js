import React, { useCallback, useEffect, useState } from "react";
import { Create, SimpleForm, useNotify, useRedirect, useMutation } from "react-admin";
import { useQuery } from "react-query";
import { makeStyles } from "@material-ui/core/styles";

import { Grid } from "@mui/material";

import { getMails } from "api/mails";

import { isDev } from "utils/commonUtils";

import DatePickerInput from "component/DatePickerInput";
import Loader from "component/Loader";
import CpTypeCodeInput from "./CpTypeCodeInput";
import DefaultValueInput from "./DefaultValueInput";

const IS_DEV = isDev();
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

function getMailTitleBasedOnEnv(title, type) {
  return IS_DEV ? `[테스트-${type}] ${title}` : title;
}

function CreateMailContent(props) {
  const notify = useNotify();
  const redirect = useRedirect();
  const [mutate] = useMutation();
  const {
    data: getMailsData,
    isLoading: isGetMailsLoading,
    refetch: handleGetMails
  } = useQuery("", getMails, {
    enabled: false
  });
  const style = useStyles();
  const [defaultMailContent, setDefaultMailContent] = useState("");
  const [defaultMailTitle, setDefaultMailTitle] = useState("");
  const [cpTypeCode, setCpTypeCode] = useState("");
  const onSetCpTypeCode = useCallback((nextcpTypeCode) => {
    setCpTypeCode(nextcpTypeCode);
  }, []);

  const handleSubmit = useCallback(
    async (values) => {
      try {
        const response = await mutate(
          {
            type: "create",
            resource: "mailContent",
            payload: {
              data: {
                ...values,
                mail_title: getMailTitleBasedOnEnv(values.mail_title, values.cp_type_code === "C" ? "사업자" : "개인")
              }
            }
          },
          { returnPromise: true }
        );

        redirect("edit", props.basePath, response.data.id, response.data);
      } catch (error) {
        notify("오류가 발생하여 등록에 실패하였습니다", { type: "error" });
      }
    },
    [mutate, redirect, notify, props.basePath]
  );

  useEffect(() => {
    handleGetMails();
  }, [handleGetMails]);

  useEffect(() => {
    if (!cpTypeCode) return;
    if (!getMailsData) return;

    const findIndex = getMailsData.data.findIndex((item) => cpTypeCode === item.cp_type_code);

    if (findIndex < 0) {
      setDefaultMailContent(getMailsData.data[0].mail_body);
      setDefaultMailTitle(getMailsData.data[0].mail_title);

      return;
    }

    setDefaultMailContent(getMailsData.data[findIndex].mail_body);
    setDefaultMailTitle(getMailsData.data[findIndex].mail_title);
  }, [getMailsData, cpTypeCode]);

  return (
    <>
      {isGetMailsLoading && <Loader />}
      <Create {...props} title="정산메일 콘텐츠 등록">
        <SimpleForm save={handleSubmit} validate={checkValidation}>
          <Grid container spacing={1}>
            <Grid item>
              <DatePickerInput
                name="month_calculate"
                label="정산월"
                views={["year", "month"]}
                openTo="month"
                format="yyyy-MM"
                variant="dialog"
              />
            </Grid>
            <Grid item>
              <CpTypeCodeInput
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
                onSetCpTypeCode={onSetCpTypeCode}
              />
            </Grid>
          </Grid>
          <DefaultValueInput
            fullWidth
            name="mail_title"
            label="메일 제목"
            variant="outlined"
            size="small"
            margin="dense"
            defaultValue={defaultMailTitle}
          />
          <DefaultValueInput
            fullWidth
            multiline
            name="mail_body"
            label="메일 본문"
            variant="outlined"
            size="small"
            margin="dense"
            minRows={3}
            defaultValue={defaultMailContent}
          />
        </SimpleForm>
      </Create>
    </>
  );
}

export default CreateMailContent;
