import { IconButton } from "@material-ui/core";
import { RestaurantRounded } from "@mui/icons-material";
import ClearIcon from "@mui/icons-material/Clear";
import { Grid, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {
  deleteGcmManageId,
  getSingleWorks,
  patchRevenueUpdateMonth,
  postCreateGcmManageId,
  postSingleWorks,
  putSingleWorks
} from "axios/information/work";
import { FormInputDropdown } from "component/FormComponents/FormInputDropdown";
import { FormInputText } from "component/FormComponents/FormInputText";
import { useEffect, useState } from "react";
import { Title } from "react-admin";
import { useFieldArray, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import MonthlySelect from "resources/infoManage/cp/Modal/MonthlySelect";
import SearchCodeCP from "resources/infoManage/cp/Modal/SearchCodeCP";
import { CURRENCIES, GC_STATUS_TYPE } from "resources/infoManage/enum/constant";
import { getToday } from "utils/date";

function Single(props) {
  const history = useHistory();
  const param = history.location.pathname.split("/").slice(-1)[0];
  const mode = param !== "create";
  const [isPopup, setIsPopup] = useState(false);
  const [date, setDate] = useState(getToday("yyyy-MM"));
  const [popupList, setPopupList] = useState([]);
  const [originList, setOriginList] = useState([]);
  const [isCodePopup, setIsCodePopup] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [origCpInfo, setOrigCpInfo] = useState([]);
  const [delCpInfo, setDelCpInfo] = useState([]);
  const { reset, handleSubmit, control, setValue, watch } = useForm({
    defaultValues: {
      gcmTypeCode: "",
      gcStatus: "",
      cpInfo: [
        {
          GC_IDX: 4082,
          GC_NAME: "",
          GC_OLD: ""
        }
      ]
    }
  });
  const { fields, append, prepend, remove, swap, move, insert, replace } = useFieldArray({
    control,
    name: "cpInfo"
  });
  const createDetailMutate = useMutation(postSingleWorks);
  const modifyDetailMutate = useMutation(putSingleWorks);
  const gcmTypeCode = watch("gcmTypeCode");
  // const gcmTypeCode = watch("gcmTypeCode");
  const UpdateMonthMutate = useMutation(patchRevenueUpdateMonth);

  const isEmpty3 = (val) => {
    if (
      val === "null" ||
      val === "NULL" ||
      val === "Null" ||
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

  const { refetch: createRefetch } = useQuery(
    ["postCreateGcmManageId"],
    () => postCreateGcmManageId({ param: gcmTypeCode }),
    {
      enabled: false,
      onSuccess({ data }) {
        if (data.error) {
          alert(data.error);
          setValue("gcmManageId", "");
        } else {
          setNewCode(data.GCM_MANAGE_ID);
          setValue("gcmManageId", data.GCM_MANAGE_ID);
        }

        // reset({
        //   gcmManageId: data.data.GCM_MANAGE_ID
        // });
      }
    }
  );
  const { refetch: deleteRefetch } = useQuery(["deleteGcmManageId"], () => deleteGcmManageId({ param: newCode }), {
    enabled: false,
    onSuccess(data) {
      createRefetch();
    }
  });

  const { refetch } = useQuery(["getSingleWorks"], () => getSingleWorks({ param }), {
    enabled: false,
    onSuccess(data) {
      setOrigCpInfo(data.data.cpInfo);
      setPopupList(data.data.cpInfo);

      const beforeData = data.data;
      beforeData.cpIdxs = beforeData.cpInfo.map((item) => item.GC_IDX).join();
      beforeData.gcOlds = beforeData.cpInfo.map((item) => item.GC_OLD).join();
      setOriginList(beforeData);
      reset(data.data);
    }
  });

  const onHandleSubmit = handleSubmit((formData) => {
    let mapingList = popupList.map((item) => {
      return {
        GC_IDX: Number(item.GC_IDX),
        GC_NAME: item.GC_NAME,
        GC_OLD: item.GC_OLD
      };
    });

    // 선택된 CP값이 없고 삭제버튼만 누를경우 시작
    let filterMapingList = [];
    let filterMapingList2 = [];
    if (isEmpty3(mapingList) && origCpInfo.length != delCpInfo.length) {
      for (let i = 0; i < origCpInfo.length; i++) {
        if (delCpInfo.length > 0) {
          for (let j = 0; j < delCpInfo.length; j++) {
            if (origCpInfo[i].GC_IDX != delCpInfo[j].GC_IDX) {
              filterMapingList = [...filterMapingList, origCpInfo[i]];
            }
          }
        } else {
          filterMapingList = origCpInfo;
        }
      }
      filterMapingList2 = filterMapingList.filter((e, i) => {
        return filterMapingList.indexOf(e) === i;
      });
      // console.log(filterMapingList2);
    }
    // 선택된 CP값이 없고 삭제버튼만 누를경우 끝
    const cpIdxs = formData.cpInfo.map((item) => item.GC_IDX).join();
    const gcOlds = formData.cpInfo.map((item) => item.GC_OLD).join();
    UpdateMonthMutate.mutate(
      {
        date,
        cpInfo: isEmpty3(mapingList) ? filterMapingList2 : mapingList,
        gcmManageId: watch("gcmManageId"),
        gcmIdx: param
      },
      {
        onSuccess: (data) => {
          const params = {
            ...formData,
            cpIdxs,
            gcOlds,
            cpInfo: isEmpty3(mapingList) ? filterMapingList2 : mapingList
          };
          console.log("params : ", params);
          console.log("originList : ", originList);

          mode
            ? modifyDetailMutate.mutate(
                { ...params, beforeData: originList },
                {
                  onSuccess: (data) => {
                    alert(data?.data);
                    setIsPopup(false);
                    history.push("/infoManageWork");
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
                    history.push("/infoManageWork");
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

  useEffect(() => {
    mode ? refetch() : createRefetch();
  }, []);

  useEffect(() => {
    const mapingList = popupList.map((item) => {
      return {
        GC_IDX: Number(item.GC_IDX),
        GC_NAME: item.GC_NAME,
        GC_OLD: item.GC_OLD
      };
    });
    popupList.length && replace(mapingList);
    // setValue("cpInfo.[0]", mapingList[0]);
  }, [popupList, replace]);

  useEffect(() => {
    if (gcmTypeCode !== "" && gcmTypeCode !== originList.gcmTypeCode) {
      newCode === "" ? createRefetch() : deleteRefetch();
    }
  }, [gcmTypeCode, originList]);

  return (
    <>
      <Title title="작품관리 > 단일" />
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
            작품정보
          </Typography>
          <Grid container item spacing={2} p={2}>
            <Grid item xs>
              <FormInputDropdown name="gcmTypeCode" control={control} label="작품유형" options={CURRENCIES} required />
            </Grid>
            <Grid item xs>
              <FormInputText name="gcmManageId" control={control} label="작품코드" disabled required />
            </Grid>
            <Grid item xs>
              <FormInputText name="gcmSeriesName" control={control} label="작품명" required />
            </Grid>
            <Grid item xs />
          </Grid>
          <Typography variant="h6" gutterBottom m={2}>
            CP정보
          </Typography>
          {fields.map((field, index) => (
            <>
              <Grid container item spacing={2} p={2} key={field.id}>
                <Grid item xs>
                  <FormInputText
                    name={`cpInfo.${index}.GC_OLD`}
                    control={control}
                    label="CP상세코드"
                    disabled
                    // required
                  />
                </Grid>
                <Grid item xs>
                  <FormInputText
                    name={`cpInfo.${index}.GC_NAME`}
                    control={control}
                    label="CP명"
                    disabled
                    // required
                  />
                </Grid>
                <Grid item xs>
                  <IconButton
                    aria-label="close"
                    onClick={(e) => {
                      setDelCpInfo((delCpInfo) => [...delCpInfo, field]);
                      popupList.splice(index, 1);
                      remove(index);
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                </Grid>
                {index === 0 ? (
                  <Grid item xs>
                    <Button variant="contained" onClick={() => setIsCodePopup(true)}>
                      CP추가
                    </Button>
                  </Grid>
                ) : (
                  <Grid item xs />
                )}
              </Grid>
            </>
          ))}
          {fields.length === 0 && (
            <Grid container item spacing={2} p={2}>
              <Grid item xs>
                <Button variant="contained" onClick={() => setIsCodePopup(true)}>
                  CP추가
                </Button>
              </Grid>
            </Grid>
          )}
          <Typography variant="h6" gutterBottom m={2}>
            기타정보
          </Typography>
          <Grid container spacing={2} p={2}>
            <Grid item xs>
              <FormInputText name="gcmProductKr" control={control} label="작품명1" />
            </Grid>
            <Grid item xs>
              <FormInputText name="gcmProductGlobal" control={control} label="작품명2" />
            </Grid>
            <Grid item xs>
              <FormInputText name="gcmAuthor" control={control} label="저자명1" />
            </Grid>
            <Grid item xs></Grid>
          </Grid>
          <Grid container spacing={2} p={2}>
            <Grid item xs>
              <FormInputText name="gcmPublisher" control={control} label="플랫폼 제공자" />
            </Grid>
            <Grid item xs>
              <FormInputText name="gcmSearch" control={control} label="CP명" />
            </Grid>
            <Grid item xs>
              <FormInputText name="gcmDepartment" control={control} label="담당부서" />
            </Grid>
            <Grid item xs>
              <FormInputText name="gcDocumentNo" control={control} label="계약서 번호" />
            </Grid>
            {/*<Grid item xs>
              <FormInputText
                name="contractInfo.gcIdx"
                control={control}
                label="계약서 번호"
                className="hidden"
                type="number"
                // search={true}
                // popupBtn={popupBtn}
              />
          </Grid>*/}
          </Grid>
          <Grid container spacing={2} p={2}>
            <Grid item xs={3}>
              <FormInputDropdown name="gcStatus" control={control} label="계약상태" options={GC_STATUS_TYPE} />
            </Grid>
            <Grid item xs={9}>
              <FormInputText name="gcmDescription" control={control} label="비고" />
            </Grid>
          </Grid>
          {/* <Typography variant="h6" gutterBottom m={2}>
            정보변경 히스토리
          </Typography> */}
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
        onHandleSubmit={onHandleSubmit}
        loading={createDetailMutate.isLoading || modifyDetailMutate.isLoading}
        date={date}
        setDate={setDate}
      />

      <SearchCodeCP
        isCodePopup={isCodePopup}
        setIsCodePopup={setIsCodePopup}
        setPopupList={setPopupList}
        popupList={popupList}
      />
      {/* <SearchCodeContract
        isCodePopup={isContractCodePopup}
        setIsCodePopup={setIsContractCodePopup}
        setPopupList={setPopupList}
      /> */}
    </>
  );
}
export default Single;
