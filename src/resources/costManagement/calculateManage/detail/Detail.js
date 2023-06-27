import ClearIcon from "@mui/icons-material/Clear";
import { Grid, IconButton, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {
  getCalculateManageGeneralDetail,
  postCalculateManageGeneralCreate,
  putCalculateManageGeneralModify
} from "axios/costManagement/calculateManageGeneral/calculateManageGeneral";
import { FormInputText } from "component/FormComponents/FormInputText";
import SingleWorkPopup from "component/popup/SinglePopup/SingleWorkPopup";
import { useEffect, useState } from "react";
import { Title } from "react-admin";
import { useFieldArray, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import SearchCodeGroupCP from "resources/infoManage/cp/Modal/SearchCodeGroupCP";
import SearchCodeTotalCP from "resources/infoManage/cp/Modal/SearchCodeTotalCP";
import { isEmpty3 } from "utils/commonUtils";
import TypeA from "./TypeA";
import TypeB from "./TypeB";
import TypeC from "./TypeC";
import TypeDE from "./TypeDE";
import TypeF from "./TypeF";

function CalculateManageDetail(props) {
  const history = useHistory();
  const [isCodePopup, setIsCodePopup] = useState(false);
  const [popupList, setPopupList] = useState([]);
  const [isCodeWorkPopup, setIsCodeWorkPopup] = useState(false);
  const [WorkpopupList, setWorkPopupList] = useState([]);
  const [beforeData, setBeforeData] = useState({});
  const createMutate = useMutation(postCalculateManageGeneralCreate);
  const modifyMutate = useMutation(putCalculateManageGeneralModify);

  const param = props.match.params.id;
  const mode = param !== "create";
  const { reset, control, getValues, watch, setValue, handleSubmit } = useForm({
    defaultValues: {
      info: {},
      list: [
        // {
        //   GC_NAME: "",
        //   GC_OLD: "",
        //   GC_SETTLEMENT_TYPE: "",
        //   SAVE_TYPE: "I",
        //   BASE_AMOUNT: ""
        // }
      ]
    }
  });
  const watchFieldArray = watch("list");
  const { fields, remove, replace } = useFieldArray({
    control,
    name: "list"
  });
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index]
    };
  });

  const { refetch } = useQuery(["getCalculateManageGeneralDetail"], () => getCalculateManageGeneralDetail({ param }), {
    enabled: false,
    onSuccess(data) {
      const { data: resultData } = data;
      const test = JSON.parse(JSON.stringify(resultData));
      // const test = Object.assign({}, resultData);
      setBeforeData(test);
      reset(resultData);
      setPopupList(resultData.list);
    }
  });

  const onSubmit = handleSubmit((formData) => {
    const createValue = {
      GC_MANAGE_ID: formData.info.GC_MANAGE_ID,
      CP_LIST: formData.list.map((item) => {
        const check = beforeData?.list?.map((item) => item.GC_OLD).includes(item.GC_OLD);
        return {
          ...item,
          SAVE_TYPE: check ? "U" : "I"
        };
      }),
      beforeData: beforeData,
      info: {
        GC_MANAGE_ID: formData.info.GC_MANAGE_ID,
        GCM_SERIES_NAME: formData.info.GCM_SERIES_NAME
      }
    };

    mode
      ? modifyMutate.mutate(
          { ...createValue },
          {
            onSuccess: (data) => {
              alert(data?.data);
              history.push("/calculateManageGenerals");
            },
            onError: (error) => {
              alert(error);
            }
          }
        )
      : createMutate.mutate(
          { ...createValue },
          {
            onSuccess: (data) => {
              alert(data?.data);
              history.push("/calculateManageGenerals");
            },
            onError: (error) => {
              alert(error);
            }
          }
        );
  });

  const popupBtn = () => {
    setIsCodeWorkPopup(true);
  };

  useEffect(() => {
    mode && refetch();
  }, [refetch, mode]);

  useEffect(() => {
    console.log("popupList : ", popupList);
    const mapingList = popupList.map((item) => {
      return {
        ...item,
        GC_SETTLEMENT_TYPE: "A-type",
        GC_OLD: item.CODE ? item.CODE : item.GC_OLD,
        GC_NAME: item.NAME ? item.NAME : item.GC_NAME
      };
    });
    popupList.length && replace(mapingList);
  }, [popupList, replace]);

  useEffect(() => {
    if (!isEmpty3(WorkpopupList)) {
      setValue("info.GC_MANAGE_ID", WorkpopupList.CODE);
      setValue("info.GCM_SERIES_NAME", WorkpopupList.NAME);
    }
  }, [WorkpopupList, setValue]);

  // useEffect(() => {
  //   // console.log("controlledFields : ", controlledFields);
  // }, [controlledFields]);

  return (
    <>
      <Title title="정산관리종합 > 상세" />
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
            정산 대상
          </Typography>
          <Grid container item spacing={2} p={2}>
            <Grid item xs>
              <FormInputText name="info.GC_MANAGE_ID" control={control} label="코드정보" search popupBtn={popupBtn} />
            </Grid>
            <Grid item xs>
              <FormInputText name="info.GCM_SERIES_NAME" control={control} label="내용" disabled />
            </Grid>

            {/* <Grid item xs>
              <FormInputDropdown name="gcStatus" control={control} label="계약상태" options={GC_STATUS_TYPE} />
            </Grid> */}

            <Grid item xs>
              <Button variant="contained" onClick={() => setIsCodePopup(true)}>
                CP 추가
              </Button>
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom m={2}>
            기타정보
          </Typography>
          {controlledFields?.map((item, index) => {
            if (item.GC_SETTLEMENT_TYPE === "A-type" || item.GC_SETTLEMENT_TYPE === null) {
              return (
                <>
                  {/* <Typography variant="h6" gutterBottom m={2}>
                      기본정보 / A형
                    </Typography> */}
                  <TypeA setValue={setValue} control={control} index={index} key={item.id} />
                  <Grid container item spacing={2} p={2}>
                    <Grid item xs>
                      <IconButton
                        aria-label="close"
                        onClick={() => {
                          popupList.splice(index, 1);
                          remove(index);
                        }}
                      >
                        <ClearIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </>
              );
            }
            if (item.GC_SETTLEMENT_TYPE === "B-type") {
              return (
                <>
                  <TypeA setValue={setValue} control={control} index={index} key={item.id} />
                  <TypeB control={control} index={index} />
                  <Grid container item spacing={2} p={2}>
                    <Grid item xs>
                      <IconButton
                        aria-label="close"
                        onClick={() => {
                          popupList.splice(index, 1);
                          remove(index);
                        }}
                      >
                        <ClearIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </>
              );
            }
            if (item.GC_SETTLEMENT_TYPE === "C-type") {
              return (
                <>
                  <TypeA setValue={setValue} control={control} index={index} key={item.id} />
                  <TypeC control={control} index={index} setValue={setValue} />
                  <Grid container item spacing={2} p={2}>
                    <Grid item xs>
                      <IconButton
                        aria-label="close"
                        onClick={() => {
                          popupList.splice(index, 1);
                          remove(index);
                        }}
                      >
                        <ClearIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </>
              );
            }
            if (item.GC_SETTLEMENT_TYPE === "D-type" || item.GC_SETTLEMENT_TYPE === "E-type") {
              return (
                <>
                  <TypeA setValue={setValue} control={control} index={index} key={item.id} />
                  <TypeDE control={control} index={index} />
                  <Grid container item spacing={2} p={2}>
                    <Grid item xs>
                      <IconButton
                        aria-label="close"
                        onClick={() => {
                          popupList.splice(index, 1);
                          remove(index);
                        }}
                      >
                        <ClearIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </>
              );
            }
            if (item.GC_SETTLEMENT_TYPE === "F-type") {
              return (
                <>
                  <TypeA setValue={setValue} control={control} index={index} key={item.id} />
                  <TypeF control={control} index={index} />
                  <Grid container item spacing={2} p={2}>
                    <Grid item xs>
                      <IconButton
                        aria-label="close"
                        onClick={() => {
                          popupList.splice(index, 1);
                          remove(index);
                        }}
                      >
                        <ClearIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </>
              );
            }
          })}

          <Grid container direction="row" justifyContent="end" alignItems="end" p={2}>
            <Grid item>
              <Button
                variant="contained"
                onClick={() => {
                  history.goBack();
                }}
              >
                취소
              </Button>
              <Button variant="contained" sx={{ ml: 2 }} onClick={onSubmit}>
                {mode ? "수정" : "등록"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <SearchCodeTotalCP
        isCodePopup={isCodePopup}
        setIsCodePopup={setIsCodePopup}
        setPopupList={setPopupList}
        popupList={popupList}
      />
      <SingleWorkPopup
        isPopupWork={isCodeWorkPopup}
        setIsPopupWork={setIsCodeWorkPopup}
        setSelectWork={setWorkPopupList}
      />
    </>
  );
}

export default CalculateManageDetail;
