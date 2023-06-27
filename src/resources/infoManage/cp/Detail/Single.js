import { Grid, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {
  getCpSingleDetail,
  postCpkSingleDetail,
  postCreateGcOld,
  postCreateGcOldDetail,
  putCpkSingleDetail
} from "axios/information/cp";
import { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { patchRevenueUpdateMonth } from "axios/information/cp";
import { FormInputDropdown } from "component/FormComponents/FormInputDropdown";
import { FormInputText } from "component/FormComponents/FormInputText";
import { Title } from "react-admin";
import ClearIcon from "@mui/icons-material/Clear";
import { useFieldArray, useForm } from "react-hook-form";
import { BUSINESS_TYPE, BUSINESS_TYPE1, BUSINESS_TYPE2 } from "resources/infoManage/enum/constant";
import { getToday } from "utils/date";
import MonthlySelect from "../Modal/MonthlySelect";
import { IconButton } from "@material-ui/core";

function Single(props) {
  const history = useHistory();
  const param = history.location.pathname.split("/").slice(-1)[0];
  const mode = param !== "create";
  const [isPopup, setIsPopup] = useState(false);
  const [businessType, setBusinessType] = useState(false);
  const [date, setDate] = useState(getToday("yyyy-MM"));
  // const [codeCreate, setCodeCreate] = useState("");
  // const [chipData, setChipData] = useState([]); // # TODO
  const [originList, setOriginList] = useState([]);
  const { handleSubmit, reset, control, watch, setValue, getValues } = useForm({
    defaultValues: {
      GC_OLD: "",
      GCD_BUSINESS_TYPE: "",
      GC_CP_TYPE: "",
      GCD_OLD: "",
      cpDetail: []
    }
  });
  const { fields, append, prepend, remove, swap, move, insert, replace } = useFieldArray({
    control,
    name: "cpDetail"
  });
  // const data = getValues();
  const typeCheck = watch("GCD_BUSINESS_TYPE");
  const cpDetail = watch("cpDetail");

  const createCodeMutate = useMutation(postCreateGcOld);
  // const deleteCodeMutate = useMutation(deleteGcOld);
  const createCodeDetailMutate = useMutation(postCreateGcOldDetail);
  const createDetailMutate = useMutation(postCpkSingleDetail);
  const modifyDetailMutate = useMutation(putCpkSingleDetail);
  const UpdateMonthMutate = useMutation(patchRevenueUpdateMonth);

  const { refetch } = useQuery(["getCpSingleDetail"], () => getCpSingleDetail({ param }), {
    enabled: false,
    onSuccess(data) {
      const { data: resultData } = data;
      setOriginList(data.data);

      reset({
        ...resultData,
        ...resultData.gcCpDetailList[0],
        GCD_SEND_EMAIL: resultData?.gcCpDetailList[0]?.GCD_SEND_EMAIL
          ? resultData?.gcCpDetailList[0]?.GCD_SEND_EMAIL.split(";")[0]
          : resultData?.gcCpDetailList[0]?.GCD_SEND_EMAIL,
        GCD_SEND_EMAILS: resultData?.gcCpDetailList[0]?.GCD_SEND_EMAIL,
        GC_OLD: resultData.GCD_OLD_GROUP,
        cpDetail: resultData.gcCpDetailList
      });
    }
  });

  const handleCreateGcOld = () => {
    createCodeMutate.mutate(
      {},
      {
        onSuccess: ({ data }) => {
          reset(data);
          onHandleDetail();
          console.log("originList : ", originList);
          // append({ GCD_OLD: originList[0]?.GCD_OLD });
        }
      }
    );
  };

  const onHandleDetail = useCallback(() => {
    createCodeDetailMutate.mutate(getValues("GC_OLD"), {
      onSuccess: ({ data }) => {
        if (!cpDetail || cpDetail?.length === 0) {
          append({ GCD_OLD: data.GCD_OLD, GCD_OWNER_NAME: "" });
        } else {
          const tt = cpDetail?.map((item) => item.GCD_OLD).slice(-1)[0];
          const code = tt.split("_")[0] + "_" + String(parseInt(tt.split("_")[1]) + 1).padStart(2, "0");
          // console.log("code : ", code);
          append({ GCD_OLD: code, GCD_OWNER_NAME: "" });
        }
      }
    });
  }, [cpDetail]);

  const onHandleSubmit = handleSubmit((formData) => {
    const item = JSON.parse(localStorage.getItem("userInfo"));
    const emailArr = formData.GCD_SEND_EMAILS?.split(";");
    emailArr?.unshift(formData.GCD_SEND_EMAIL);
    const duplicateArr = emailArr?.filter((v, i) => emailArr.indexOf(v) === i);

    const params = {
      gcCpType: formData.GC_CP_TYPE,
      gcOld: formData.GC_OLD,
      gcName: formData.GC_NAME,
      regUserId: item.user.id,
      gcCpDetailList: formData?.cpDetail?.map((item) => {
        return {
          gcOldDetail: item.GCD_OLD,
          gcdOwnerName: item.GCD_OWNER_NAME,
          gcdAccountCode: formData.GCD_KCLEP_CODE,
          gcdBusinessType: formData.GCD_BUSINESS_TYPE,
          gcdBusinessNo: formData.GCD_BUSINESS_NO,
          // gcdSendMail: formData.GCD_SEND_EMAIL,
          gcdSendMail: duplicateArr?.join(";"),
          gcdCompanyName: formData.GCD_COMPANY_NAME,
          gcdWriterName: formData.GCD_WRITER_NAME,
          gcdManager01: formData.GCD_MANAGER01,
          gcdContactTel: formData.GCD_CONTACT_TEL,
          gcdAddress: formData.GCD_ADDRESS,
          gcdBank: formData.GCD_BANK,
          gcdBankCode: formData.GCD_BANK_CODE,
          gcdAccountNo: formData.GCD_ACCOUNT_NO,
          gcdAccountOwner: formData.GCD_ACCOUNT_OWNER,
          gcdKclepCode: formData.GCD_KCLEP_CODE,
          gcdDescription: formData.GCD_DESCRIPTION
        };
      })
    };

    UpdateMonthMutate.mutate(
      { date, gcOld: formData.GC_OLD, cpDetail },
      {
        onSuccess: (data) => {
          mode
            ? modifyDetailMutate.mutate(
                { ...params, beforeData: originList },
                {
                  onSuccess: (data) => {
                    alert(data?.data);
                    setIsPopup(false);
                    history.push("/infoManageCp");
                  },
                  onError: (error) => {
                    alert(error);
                  }
                }
              )
            : createDetailMutate.mutate(params, {
                onSuccess: (data) => {
                  alert(data?.data);
                  setIsPopup(false);
                  history.push("/infoManageCp");
                },
                onError: (error) => {
                  alert(error);
                }
              });
        },
        onError: (error) => {
          alert(error);
        }
      }
    );
  });

  useEffect(() => {
    mode ? refetch() : handleCreateGcOld();

    // return () => {
    //   !mode && !saveCheck && deleteCodeMutate.mutate(getValues("GC_OLD"));
    // };
  }, [mode]);

  useEffect(() => {
    setBusinessType(typeCheck === BUSINESS_TYPE.PERSONAL);
  }, [typeCheck]);

  return (
    <>
      <Title title="CP관리 > 단일" />
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
        <Box>
          <Typography variant="h6" gutterBottom m={2}>
            CP정보
          </Typography>
          <Grid container item spacing={2} p={2}>
            <Grid item xs>
              <FormInputDropdown
                name="GCD_BUSINESS_TYPE"
                control={control}
                label="유형1"
                options={BUSINESS_TYPE1}
                required
              />
            </Grid>
            <Grid item xs>
              <FormInputDropdown name="GC_CP_TYPE" control={control} label="유형2" options={BUSINESS_TYPE2} />
            </Grid>
            <Grid item xs>
              <FormInputText name="GC_OLD" control={control} label="CP코드" disabled required />
            </Grid>
            <Grid item xs>
              <FormInputText name="GC_NAME" control={control} label="CP명" required />
            </Grid>
            <Grid item xs>
              <Button variant="contained" onClick={onHandleDetail}>
                상세코드 추가
              </Button>
            </Grid>
          </Grid>
          {/* {codeDetailAdd && (
            <Grid container item spacing={2} p={2}>
              <Grid item xs>
                <FormInputText name="GCD_OLD" control={control} label="CP상세코드" />
              </Grid>
              <Grid item xs>
                <FormInputText name="GCD_OWNER_NAME" control={control} label="CP상세코드명" />
              </Grid>
              <Grid item xs />
              <Grid item xs />
            </Grid>
          )} */}
          {fields.map((field, index) => (
            <Grid container item spacing={2} p={2} key={field.id}>
              <Grid item xs>
                <FormInputText
                  name={`cpDetail.${index}.GCD_OLD`}
                  control={control}
                  label="CP상세코드"
                  disabled
                  required
                />
              </Grid>
              <Grid item xs>
                <FormInputText
                  name={`cpDetail.${index}.GCD_OWNER_NAME`}
                  control={control}
                  label="상세코드명"
                  required
                />
              </Grid>
              <Grid item xs>
                {index > 0 && (
                  <IconButton
                    aria-label="close"
                    onClick={() => {
                      remove(index);
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                )}
              </Grid>
            </Grid>
          ))}
          <Grid container item spacing={2} p={2}>
            <Grid item xs>
              <FormInputText name="GCD_KCLEP_CODE" control={control} label="거래처코드" required />
            </Grid>
            <Grid item xs>
              <FormInputText
                name="GCD_BUSINESS_NO"
                control={control}
                label={businessType ? "주민번호" : "사업자번호"}
              />
            </Grid>
          </Grid>

          <Grid container item spacing={2} p={2}>
            <Grid item xs>
              <FormInputText name="GCD_SEND_EMAIL" control={control} label="이메일" />
            </Grid>
            {/* <Grid item justifyContent="center" alignItems="center">
              <Button variant="contained" onClick={() => setEmailBtn(true)}>
                참조이메일추가
              </Button>
            </Grid> */}
          </Grid>
          {/* {emailBtn && ( */}
          <Grid container item spacing={2} p={2}>
            <Grid item xs>
              <FormInputText name="GCD_SEND_EMAILS" control={control} label="참조이메일" />
            </Grid>
          </Grid>
          {/* )} */}
          <Typography variant="h6" gutterBottom m={2}>
            기타정보
          </Typography>
          <Grid container spacing={2} p={2}>
            <Grid item xs>
              <FormInputText name="GCD_COMPANY_NAME" control={control} label="업체명" />
            </Grid>
            <Grid item xs>
              <FormInputText name="GCD_WRITER_NAME" control={control} label="담당자명" />
            </Grid>
            <Grid item xs>
              <FormInputText name="GCD_CONTACT_TEL" control={control} label="연락처" />
            </Grid>
            <Grid item xs>
              <FormInputText name="GCD_ADDRESS" control={control} label="주소" />
            </Grid>
          </Grid>
          <Grid container spacing={2} p={2}>
            <Grid item xs>
              <FormInputText name="GCD_BANK" control={control} label="은행" />
            </Grid>
            <Grid item xs>
              <FormInputText name="GCD_BANK_CODE" control={control} label="은행코드" />
            </Grid>
            <Grid item xs>
              <FormInputText name="GCD_ACCOUNT_NO" control={control} label="계좌번호" />
            </Grid>
            <Grid item xs>
              <FormInputText name="GCD_ACCOUNT_OWNER" control={control} label="계좌주" />
            </Grid>
          </Grid>
          <Grid container spacing={2} p={2}>
            <Grid item xs={9}>
              <FormInputText name="GCD_DESCRIPTION" control={control} label="비고" />
            </Grid>
          </Grid>
          <Grid container direction="row" justifyContent="end" alignItems="end" p={2}>
            <Grid item>
              <Button
                variant="contained"
                onClick={() => {
                  if (window.confirm("정말 취소하시겠습니까?")) {
                    history.goBack();
                  }
                }}
              >
                취소
              </Button>
              <Button
                variant="contained"
                sx={{ ml: 2 }}
                onClick={() => {
                  setIsPopup(true);
                }}
              >
                {mode ? "수정" : "등록"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <MonthlySelect
        setIsPopup={setIsPopup}
        isPopup={isPopup}
        loading={createDetailMutate.isLoading || modifyDetailMutate.isLoading}
        onHandleSubmit={onHandleSubmit}
        date={date}
        setDate={setDate}
      />
    </>
  );
}
export default Single;
