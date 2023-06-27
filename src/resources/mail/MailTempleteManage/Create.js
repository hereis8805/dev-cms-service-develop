import { Alert, Grid, Snackbar, TextField, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {
  getMailManageTemplatesDetail,
  postMailManageTemplatesCreate,
  putMailManageTemplatesModify
} from "axios/mail/mail";
import { FormInput } from "component/FormComponents/FormInput";
import { FormInputText } from "component/FormComponents/FormInputText";
import useToggle from "hooks/useToggle";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { useHistory } from "react-router-dom";

const isEmpty3 = (val) => {
  if (
    val === 0 ||
    val === "" ||
    val === null ||
    val === undefined ||
    (val !== null && typeof val === "object" && !Object.keys(val).length)
  ) {
    return true;
  } else {
    return false;
  }
};

function MailTempleteManageCreate(props) {
  const { reset, control, handleSubmit } = useForm();
  const history = useHistory();
  const param = history.location.pathname.split("/")[2];
  const [isShowingSnackbar, onToggleSnackbar] = useToggle(false);
  const [content, setContent] = useState("");
  const [snackbarState, setSnackbarState] = useState({
    type: "",
    message: ""
  });
  const paymentMutate = useMutation(postMailManageTemplatesCreate);
  const templateModify = useMutation(putMailManageTemplatesModify);

  const handlePutMailManageTemplatesModify = async (formData) => {
    const params = {
      gmtName: formData.GMT_NAME,
      gmtTitle: formData.GMT_TITLE,
      gmtBody: formData.GMT_BODY
    };
    await putMailManageTemplatesModify(param, params);
    alert("수정되었습니다.");
    history.push("/mailTemplete");
  };

  const { refetch } = useQuery(
    ["getMailManageTemplatesDetail"],
    () =>
      getMailManageTemplatesDetail({
        param
      }),
    {
      enabled: false,
      retry: false,
      onSuccess: (data) => {
        reset(data.data);
        setContent(data.data.GMT_BODY);
      }
    }
  );

  const onHandleSubmit = handleSubmit((formData) => {
    if (isEmpty3(formData.GMT_NAME)) {
      alert("템플릿명 입력해주세요.");
    }

    if (isEmpty3(formData.GMT_TITLE)) {
      alert("메일제목 입력해주세요.");
    }

    if (isEmpty3(formData.GMT_BODY)) {
      alert("메일본문 입력해주세요.");
    }

    const params = {
      gmtName: formData.GMT_NAME,
      gmtTitle: formData.GMT_TITLE,
      gmtBody: formData.GMT_BODY
    };

    if (isEmpty3(param)) {
      // 등록
      paymentMutate.mutate(
        { ...params },
        {
          onSuccess: (data) => {
            alert(`${param ? "수정" : "등록"}되었습니다.`);
            history.push("/mailTemplete");
            // console.log("data : ", data);
            // setSnackbarState({
            //   type: "success",
            //   message: "템플릿 생성"
            // });
            // onToggleSnackbar();
          },
          onError: (error) => {
            const { message } = error;
            console.log(message);
          }
        }
      );
    } else {
      // 수정
      handlePutMailManageTemplatesModify(formData);
    }
  });

  useEffect(() => {
    param && refetch();
  }, [param, refetch]);

  return (
    <>
      <Box
        component="form"
        sx={{
          height: "auto",
          width: "100%",
          backgroundColor: "#FFFFFF"
        }}
        noValidate
        autoComplete="off"
      >
        {/* <form onSubmit={handleSubmit(onSubmit)}> */}
        <Box>
          <Typography variant="h6" gutterBottom m={2}>
            템플릿 생성
          </Typography>
          <Grid container item spacing={2} p={2}>
            {/*<Grid item xs>
              <FormInputText name="GMT_IDX" control={control} label="템플릿 번호" disabled={true} />
      </Grid>*/}
            <Grid item xs>
              <FormInputText name="GMT_NAME" control={control} label="템플릿명" />
            </Grid>
            <Grid item xs>
              <FormInputText name="GMT_SENDER" control={control} label="송신 이메일" disabled={true} />
            </Grid>
            <Grid item xs />
          </Grid>

          <Grid container item spacing={2} p={2}>
            <Grid item xs>
              <FormInputText name="GMT_TITLE" control={control} label="메일제목" />
            </Grid>
          </Grid>
          <Grid container spacing={2} p={2}>
            <Grid item xs>
              <FormInputText name="GMT_BODY" multiline control={control} label="메일본문" rows={12} />
            </Grid>
          </Grid>

          <Grid container direction="row" justifyContent="end" alignItems="end" p={2}>
            <Grid item>
              <Button
                variant="contained"
                onClick={() => {
                  if (window.confirm("정말 취소하시겠습니까?")) {
                    history.push(`/mailTemplete`);
                  }
                }}
              >
                취소
              </Button>
              <Button
                variant="contained"
                sx={{ ml: 2 }}
                //   type="submit"
                onClick={onHandleSubmit}
              >
                {param ? "수정" : "등록"}
              </Button>
            </Grid>
          </Grid>
        </Box>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={isShowingSnackbar}
          autoHideDuration={3000}
          onClose={onToggleSnackbar}
        >
          <Alert onClose={onToggleSnackbar} severity={snackbarState.type} sx={{ width: "100%" }} variant="filled">
            {snackbarState.message}
          </Alert>
        </Snackbar>
        {/* </form> */}
      </Box>
    </>
  );
}

export default MailTempleteManageCreate;
