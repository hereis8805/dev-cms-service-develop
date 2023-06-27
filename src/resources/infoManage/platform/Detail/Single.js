import { Grid, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useHistory } from "react-router-dom";
// import DatePicker from "component/CustomDatePicker";
import {
  deleteGcmManageId,
  getSinglePlatforms,
  postCreateGpOldDetail,
  postCreateGpOldPlatform,
  postSinglePlatforms,
  putSinglePlatforms
} from "axios/information/platform";
import ClearIcon from "@mui/icons-material/Clear";
import { FormInputText } from "component/FormComponents/FormInputText";
import { Title } from "react-admin";
import { useFieldArray, useForm } from "react-hook-form";
import MonthlySelect from "resources/infoManage/cp/Modal/MonthlySelect";
import SearchCodePlatform from "resources/infoManage/cp/Modal/SearchCodePlatform";
import { getToday } from "utils/date";
import { patchRevenueUpdateMonth } from "axios/information/platform";
import { FormInputDropdown } from "component/FormComponents/FormInputDropdown";
import {
  PLATFORM_CALCULATE_TYPE,
  PLATFORM_CONFIRM_YN,
  PLATFORM_SERVICE_AREA
} from "resources/infoManage/enum/constant";
import { IconButton } from "@material-ui/core";

function Single(props) {
  const history = useHistory();
  const param = history.location.pathname.split("/").slice(-1)[0];
  const mode = param !== "create";
  const [isPopup, setIsPopup] = useState(false);
  // const [saveCheck, setSaveCheck] = useState(false);
  // const [codeDetailAdd, setCodeDetailAdd] = useState(false);
  const [originList, setOriginList] = useState([]);
  const [date, setDate] = useState(getToday("yyyy-MM"));
  const {
    handleSubmit,
    reset,
    watch,
    getValues,
    setValue,
    control,
    formState: { errors }
  } = useForm({
    defaultValues: {
      GP_PLATFORM_TYPE: "",
      GP_AREA: "",
      GP_REALTIME: "",
      GP_REALTIME_CMS: "",
      GP_DOWNLOAD: "",
      GP_OLD_DETAIL_LIST: [
        // {
        //   GP_OLD_DETAIL: "",
        //   GP_REAL_NAME: "",
        //   GP_AGENCY_NAME: "",
        //   GP_PLATFORM_TYPE: "",
        //   GP_SERVICE_NAME: "",
        //   GP_AREA: "",
        //   GP_LANGUAGE: "",
        //   GP_SERVICE_ETC: "",
        //   GP_FEE_TYPE: "",
        //   GP_APP_FEE: "",
        //   GP_ALLIANCE_FEE: "",
        //   GP_TOTAL_FEE: "",
        //   GP_DETAIL: "",
        //   GP_SALES_NAME: "",
        //   GP_PRE_CODE: "",
        //   GP_BUSINESS_NAME: "",
        //   GP_ISSUE_TYPE: "",
        //   GP_SALES_MONTH_TYPE: "",
        //   GP_SETTLEMENT_DATE: "",
        //   GP_SETTLEMENT_TYPE: "",
        //   GP_REALTIME: "",
        //   GP_REALTIME_CMS: "",
        //   GP_DOWNLOAD: "",
        //   GP_DESCRIPTION: ""
        // }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "GP_OLD_DETAIL_LIST"
  });

  const GP_OLD_DETAIL_LIST = watch("GP_OLD_DETAIL_LIST");

  const createCodeMutate = useMutation(postCreateGpOldPlatform);
  // const deleteCodeMutate = useMutation(deleteGcmManageId);
  const createCodeDetailMutate = useMutation(postCreateGpOldDetail);
  const createDetailMutate = useMutation(postSinglePlatforms);
  const modifyDetailMutate = useMutation(putSinglePlatforms);
  const UpdateMonthMutate = useMutation(patchRevenueUpdateMonth);

  const { refetch } = useQuery(["getSinglePlatforms"], () => getSinglePlatforms({ param }), {
    enabled: false,
    onSuccess(data) {
      const { data: resultData } = data;
      setOriginList(data.data);
      const resetData = resultData?.gpOldDetailList;

      reset({ ...resultData, GP_OLD_DETAIL_LIST: resetData });
    }
  });

  const handleCreateGcOld = () => {
    createCodeMutate.mutate(
      {},
      {
        onSuccess: ({ data }) => {
          reset(data);
          onHandleDetail();
        }
      }
    );
  };

  const onHandleDetail = () => {
    createCodeDetailMutate.mutate(getValues("GP_OLD_PLATFORM"), {
      onSuccess: ({ data }) => {
        append({
          GP_OLD_DETAIL:
            !GP_OLD_DETAIL_LIST || GP_OLD_DETAIL_LIST?.length === 0
              ? data.GP_OLD_DETAIL
              : GP_OLD_DETAIL_LIST?.map((item) => item.GP_OLD_DETAIL)
                  .slice(-1)[0]
                  .split("_")[0] +
                "_" +
                String(
                  parseInt(
                    GP_OLD_DETAIL_LIST?.map((item) => item.GP_OLD_DETAIL)
                      .slice(-1)[0]
                      .split("_")[1]
                  ) + 1
                ).padStart(3, "0"),
          GP_REAL_NAME: "",
          GP_AGENCY_NAME: "",
          GP_PLATFORM_TYPE: "",
          GP_SERVICE_NAME: "",
          GP_AREA: "",
          GP_LANGUAGE: "",
          GP_SERVICE_ETC: "",
          GP_FEE_TYPE: "",
          GP_APP_FEE: "",
          GP_ALLIANCE_FEE: "",
          GP_TOTAL_FEE: "",
          GP_DETAIL: "",
          GP_SALES_NAME: "",
          GP_PRE_CODE: "",
          GP_BUSINESS_NAME: "",
          GP_ISSUE_TYPE: "",
          GP_SALES_MONTH_TYPE: "",
          GP_SETTLEMENT_DATE: "",
          GP_SETTLEMENT_TYPE: "",
          GP_REALTIME: "",
          GP_REALTIME_CMS: "",
          GP_DOWNLOAD: "",
          GP_DESCRIPTION: ""
        });
      }
    });
  };

  const onHandleSubmit = handleSubmit((formData) => {
    const params = {
      // GP_OLD_PLATFORM: formData.GP_OLD_PLATFORM,
      GP_NAME: formData.GP_NAME,
      // GP_OLD_DETAIL_LIST: [
      ...formData,
      GP_IDX: param
      // ]
    };
    UpdateMonthMutate.mutate(
      { date, GP_OLD_PLATFORM: formData.GP_OLD_PLATFORM, GP_OLD_DETAIL_LIST, mode },
      {
        onSuccess: (data) => {
          mode
            ? modifyDetailMutate.mutate(
                { ...params, beforeData: originList },
                {
                  onSuccess: (data) => {
                    alert(data?.data);
                    setIsPopup(false);
                    history.push("/infoManagePlatform");
                  },
                  onError: (error) => {
                    alert(error);
                  }
                }
              )
            : createDetailMutate.mutate(
                { ...params },
                {
                  onSuccess: (data) => {
                    alert(data?.data);
                    setIsPopup(false);
                    history.push("/infoManagePlatform");
                    // setSaveCheck(true);
                  },
                  onError: (error) => {
                    alert(error);
                  }
                }
              );
        },
        onError: (error) => {
          alert(error);
        }
      }
    );
  });

  const onHandleDelete = () => {
    if (window.confirm("정말 취소하시겠습니까?")) {
      history.goBack();
    }
  };

  useEffect(() => {
    mode ? refetch() : handleCreateGcOld();

    // return () => {
    //   !mode && !saveCheck && deleteCodeMutate.mutate(getValues("GP_OLD_PLATFORM"));
    // };
  }, [mode]);

  return (
    <>
      <Title title="플랫폼관리 > 단일" />
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
            플랫폼 정보
          </Typography>
          <Grid container item spacing={2} p={2}>
            <Grid item xs>
              <FormInputText name="GP_OLD_PLATFORM" control={control} label="플랫폼코드" disabled required />
            </Grid>
            <Grid item xs>
              <FormInputText name="GP_NAME" control={control} label="플랫폼명" required />
            </Grid>
            <Grid item xs>
              <Button variant="contained" onClick={onHandleDetail}>
                플랫폼2코드 추가
              </Button>
            </Grid>
          </Grid>
          {fields.map((field, index) => (
            <>
              <Grid container item spacing={2} p={2} key={field.id}>
                <Grid item xs>
                  <FormInputText
                    name={`GP_OLD_DETAIL_LIST.${index}.GP_OLD_DETAIL`}
                    control={control}
                    label="플랫폼2코드"
                    disabled
                    required
                  />
                </Grid>
                <Grid item xs>
                  <FormInputText
                    name={`GP_OLD_DETAIL_LIST.${index}.GP_REAL_NAME`}
                    control={control}
                    label="실서비스 플랫폼"
                  />
                </Grid>
                <Grid item xs>
                  <FormInputText
                    name={`GP_OLD_DETAIL_LIST.${index}.GP_AGENCY_NAME`}
                    control={control}
                    label="대형구분 플랫폼"
                  />
                </Grid>
                <Grid item xs>
                  <FormInputDropdown
                    name={`GP_OLD_DETAIL_LIST.${index}.GP_PLATFORM_TYPE`}
                    control={control}
                    label="플랫폼 정산구분"
                    options={PLATFORM_CALCULATE_TYPE}
                    required
                  />
                </Grid>
              </Grid>

              <Grid container item spacing={2} p={2}>
                <Grid item xs>
                  <FormInputText
                    name={`GP_OLD_DETAIL_LIST.${index}.GP_SERVICE_NAME`}
                    control={control}
                    label="서비스명"
                  />
                </Grid>
                <Grid item xs>
                  <FormInputDropdown
                    name={`GP_OLD_DETAIL_LIST.${index}.GP_AREA`}
                    control={control}
                    label="서비스 지역"
                    options={PLATFORM_SERVICE_AREA}
                    required
                  />
                </Grid>
                <Grid item xs>
                  <FormInputText
                    name={`GP_OLD_DETAIL_LIST.${index}.GP_LANGUAGE`}
                    control={control}
                    label="서비스 언어"
                  />
                </Grid>
                <Grid item xs>
                  <FormInputText name={`GP_OLD_DETAIL_LIST.${index}.GP_SERVICE_ETC`} control={control} label="기타" />
                </Grid>
              </Grid>
              <Grid container item spacing={2} p={2}>
                <Grid item xs>
                  <FormInputText
                    name={`GP_OLD_DETAIL_LIST.${index}.GP_FEE_TYPE`}
                    control={control}
                    label="수수료 구분"
                    required
                  />
                </Grid>
                <Grid item xs>
                  <FormInputText
                    name={`GP_OLD_DETAIL_LIST.${index}.GP_APP_FEE`}
                    control={control}
                    label="앱마켓 수수료"
                    required
                  />
                </Grid>
                <Grid item xs>
                  <FormInputText
                    name={`GP_OLD_DETAIL_LIST.${index}.GP_ALLIANCE_FEE`}
                    control={control}
                    label="제휴사 수수료율"
                    required
                  />
                </Grid>
                <Grid item xs>
                  <FormInputText
                    name={`GP_OLD_DETAIL_LIST.${index}.GP_TOTAL_FEE`}
                    control={control}
                    label="합계 수수료율"
                    required
                  />
                </Grid>
              </Grid>
              <Grid container item spacing={2} p={2}>
                <Grid item xs>
                  <FormInputText
                    name={`GP_OLD_DETAIL_LIST.${index}.GP_DETAIL`}
                    control={control}
                    label="서비스상세"
                    required
                  />
                </Grid>
                <Grid item xs>
                  <FormInputText
                    name={`GP_OLD_DETAIL_LIST.${index}.GP_SALES_NAME`}
                    control={control}
                    label="매출구분용 사업자"
                  />
                </Grid>
                <Grid item xs>
                  <FormInputText
                    name={`GP_OLD_DETAIL_LIST.${index}.GP_PRE_CODE`}
                    control={control}
                    label="거래처코드"
                    required
                  />
                </Grid>
              </Grid>
              <Grid container item spacing={2} p={2}>
                <Grid item xs>
                  <FormInputText
                    name={`GP_OLD_DETAIL_LIST.${index}.GP_BUSINESS_NAME`}
                    control={control}
                    label="사업자명"
                  />
                </Grid>
                <Grid item xs>
                  <FormInputText
                    name={`GP_OLD_DETAIL_LIST.${index}.GP_ISSUE_TYPE`}
                    control={control}
                    label="증빙발행"
                  />
                </Grid>
                <Grid item xs>
                  <FormInputText
                    name={`GP_OLD_DETAIL_LIST.${index}.GP_SALES_MONTH_TYPE`}
                    control={control}
                    label="매출집계월 기준(판매월 M)"
                  />
                </Grid>
                <Grid item xs>
                  <FormInputText
                    name={`GP_OLD_DETAIL_LIST.${index}.GP_SETTLEMENT_DATE`}
                    control={control}
                    label="정산보고서 수령일"
                  />
                </Grid>
              </Grid>
              <Grid container item spacing={2} p={2}>
                <Grid item xs>
                  <FormInputText
                    name={`GP_OLD_DETAIL_LIST.${index}.GP_SETTLEMENT_TYPE`}
                    control={control}
                    label="정산보고서 수령형태"
                  />
                </Grid>
                <Grid item xs>
                  <FormInputDropdown
                    name={`GP_OLD_DETAIL_LIST.${index}.GP_REALTIME`}
                    control={control}
                    label="실시간 매출 상세데이터 확인가능 여부"
                    options={PLATFORM_CONFIRM_YN}
                  />
                </Grid>
                <Grid item xs>
                  <FormInputDropdown
                    name={`GP_OLD_DETAIL_LIST.${index}.GP_REALTIME_CMS`}
                    control={control}
                    label="CMS 실시간 정산액 확인가능 여부"
                    options={PLATFORM_CONFIRM_YN}
                  />
                </Grid>
                <Grid item xs>
                  <FormInputDropdown
                    name={`GP_OLD_DETAIL_LIST.${index}.GP_DOWNLOAD`}
                    control={control}
                    label="데이터 다운로드 가능여부"
                    options={PLATFORM_CONFIRM_YN}
                  />
                </Grid>
              </Grid>
              <Grid container item spacing={2} p={2}>
                <Grid item xs={10}>
                  <FormInputText name={`GP_OLD_DETAIL_LIST.${index}.GP_DESCRIPTION`} control={control} label="비고" />
                </Grid>
                {index > 0 && (
                  <Grid item xs>
                    <IconButton
                      aria-label="close"
                      onClick={() => {
                        remove(index);
                      }}
                    >
                      <ClearIcon />
                    </IconButton>
                  </Grid>
                )}
              </Grid>
            </>
          ))}
          <Grid container direction="row" justifyContent="end" alignItems="end" p={2}>
            <Grid item>
              <Button variant="contained" onClick={onHandleDelete}>
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
        onHandleSubmit={onHandleSubmit}
        loading={createDetailMutate.isLoading || modifyDetailMutate.isLoading}
        date={date}
        setDate={setDate}
      />
    </>
  );
}
export default Single;
