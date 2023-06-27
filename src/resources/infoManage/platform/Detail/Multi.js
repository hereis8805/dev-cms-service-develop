import { Grid, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { pageSizeDefalut, rowsPerPageOptions } from "common/enum/grid";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
// import DatePicker from "component/CustomDatePicker";
import {
  deleteGpgOldPlatform,
  getGroupPlatforms,
  postCreateGpgOldPlatform,
  postGroupPlatforms,
  putGroupPlatforms
} from "axios/information/platform";
import DataGridCusutom from "component/DataGridCusutom";
import { FormInputDropdown } from "component/FormComponents/FormInputDropdown";
import { FormInputText } from "component/FormComponents/FormInputText";
import { Title } from "react-admin";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import MonthlySelect from "resources/infoManage/cp/Modal/MonthlySelect";
import SearchCodePlatform from "resources/infoManage/cp/Modal/SearchCodePlatform";
import { PLATFORM_TYPE } from "resources/infoManage/enum/constant";
import { getToday } from "utils/date";
import { isEmpty3 } from "utils/commonUtils";
import { patchGroupRevenueUpdateMonth } from "axios/information/platform";

const columns = [
  { field: "IDX", headerName: "IDX", hide: true },
  { field: "id", headerName: "No", flex: 0.3 },
  { field: "CODE", headerName: "플랫폼코드", flex: 1 },
  { field: "NAME", headerName: "플랫폼명", flex: 1 }
];

function Multi(props) {
  const history = useHistory();
  const param = history.location.pathname.split("/").slice(-1)[0];
  const mode = param !== "create";
  const [isPopup, setIsPopup] = useState(false);
  const [isCodePopup, setIsCodePopup] = useState(false);
  const [originList, setOriginList] = useState([]);
  const [selectList, setSelectList] = useState([]);
  const [date, setDate] = useState(getToday("yyyy-MM"));
  const [pageSize, setPageSize] = useState(pageSizeDefalut);
  const [popupList, setPopupList] = useState([]);
  const { handleSubmit, reset, getValues, control } = useForm({
    defaultValues: {
      groupPlatformInfo: {
        GPG_TYPE: ""
      },
      GCD_BUSINESS_TYPE: "",
      GC_CP_TYPE: "",
      GCD_OLD: ""
    }
  });
  const createMutate = useMutation(postGroupPlatforms);
  const modifyMutate = useMutation(putGroupPlatforms);
  const createCodeMutate = useMutation(postCreateGpgOldPlatform);
  // const deleteCodeMutate = useMutation(deleteGpgOldPlatform);
  const UpdateMonthMutate = useMutation(patchGroupRevenueUpdateMonth);

  const { isLoading, refetch } = useQuery(["getGroupPlatforms"], () => getGroupPlatforms({ param }), {
    enabled: false,
    onSuccess(data) {
      const { data: resultData } = data;
      reset(resultData);
      const resultList = resultData.platformList.map((item, index) => {
        return {
          id: index + 1,
          IDX: item.GPG_IDX,
          NAME: item.GP_NAME,
          CODE: item.GPG_OLD_DETAIL
        };
      });
      setOriginList(resultList);
      // setPopupList(resultList);
      setPopupList(resultList.filter((item) => !isEmpty3(item.CODE)));
    }
  });

  const onHandleSubmit = handleSubmit((formData) => {
    // console.log("formData : ", formData);
    // if (popupList.length === 0) {
    //   return alert("플랫폼 추가해주세요");
    // }

    console.log("=======================================11111");

    const originIdx = originList?.map((item) => item.CODE).join();
    const data = popupList?.map((item) => item.CODE).join();
    // console.log("tt : ", originList, popupList);
    const result = data
      ?.split(",")
      .filter((item) => {
        return !originIdx?.split(",").includes(item.toString());
      })
      .join();
    const params = {
      ...formData.groupPlatformInfo,
      GPG_OLD_DETAILS: data,
      ADD_IDEX: result,
      DEL_GPG_IDXS: ""
    };

    console.log("=======================================");
    UpdateMonthMutate.mutate(
      { date, mode, gcgOldGroup: formData.groupPlatformInfo.GPG_OLD_PLATFORM },
      {
        onSuccess: (data) => {
          mode
            ? modifyMutate.mutate(
                { ...params, param },
                {
                  onSuccess: (data) => {
                    alert(data?.data);
                    setIsPopup(false);
                    history.push("/infoManagePlatform");
                  },
                  onError: (error) => {
                    const { message } = error;
                    alert(message);
                  }
                }
              )
            : createMutate.mutate(
                { ...params },
                {
                  onSuccess: (data) => {
                    alert(data?.data);
                    setIsPopup(false);
                    history.push("/infoManagePlatform");
                  },
                  onError: (error) => {
                    const { message } = error;
                    alert(message);
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

  const onHandleListDeleteNew = () => {
    if (window.confirm("정말 삭제하시겠습니까")) {
      setPopupList(
        popupList
          .filter((item) => {
            return !selectList.includes(item.id);
          })
          .map((item, index) => {
            return { ...item, id: index + 1 };
          })
      );
      setSelectList([]);
    }
  };

  const handleCreateGcOld = () => {
    createCodeMutate.mutate(
      {},
      {
        onSuccess: ({ data }) => {
          reset({
            "groupPlatformInfo.GPG_OLD_PLATFORM": data.GPG_OLD_PLATFORM
          });
        }
      }
    );
  };

  const onHandleDelete = () => {
    if (window.confirm("정말 취소하시겠습니까?")) {
      // !mode && deleteCodeMutate.mutate(getValues("groupPlatformInfo.GPG_OLD_PLATFORM"));
      history.goBack();
    }
  };

  const onHandleListDelete = handleSubmit((formData) => {
    if (selectList.length === 0) {
      return alert("데이터를 선택해주새요.");
    }
    // console.log("selectList : ", popupListselectList);
    if (window.confirm("정말 삭제하시겠습니까")) {
      const params = {
        GPG_NAME: formData.groupPlatformInfo?.GPG_NAME,
        GPG_TYPE: formData.groupPlatformInfo?.GPG_TYPE,
        GPG_DESCRIPTION: formData.groupPlatformInfo?.GPG_DESCRIPTION,
        GPG_OLD_PLATFORM: formData.groupPlatformInfo?.GPG_OLD_PLATFORM,
        GPG_STLMN_RATE: formData.groupPlatformInfo?.GPG_STLMN_RATE,
        DEL_GPG_IDXS: popupList
          .filter((item) => selectList.includes(item.id))
          .map((item) => item.IDX)
          .join()
      };
      modifyMutate.mutate(
        { ...params, param },
        {
          onSuccess: (data) => {
            alert("삭제완료");
            setPopupList(
              popupList
                .filter((item) => {
                  return !selectList.includes(item.id);
                })
                .map((item, index) => {
                  return { ...item, id: index + 1 };
                })
            );
            setSelectList([]);
            history.push("/infoManagePlatform");
          },
          onError: (error) => {
            const { message } = error;
            alert(message);
          }
        }
      );
    }
  });

  useEffect(() => {
    mode ? refetch() : handleCreateGcOld();
    // return () => {
    //   !mode && !saveCheck && deleteCodeMutate.mutate(getValues("groupPlatformInfo.GPG_OLD_PLATFORM"));
    // };
  }, [mode]);

  return (
    <>
      <Title title="플랫폼관리 > 그룹" />
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
            그룹 코드 정보
          </Typography>
          <Grid container item spacing={2} p={2}>
            <Grid item xs>
              <FormInputText
                name="groupPlatformInfo.GPG_OLD_PLATFORM"
                control={control}
                label="플랫폼 그룹 코드"
                disabled
                required
              />
            </Grid>
            <Grid item xs>
              <FormInputText name="groupPlatformInfo.GPG_NAME" control={control} label="그룹명(내용)" required />
            </Grid>
            <Grid item xs>
              <Button variant="contained" onClick={() => setIsCodePopup(true)}>
                플랫폼 추가
              </Button>
            </Grid>
          </Grid>
          <Grid container item spacing={2} p={2}>
            <Grid item xs>
              <FormInputDropdown
                name="groupPlatformInfo.GPG_TYPE"
                control={control}
                label="구분"
                options={PLATFORM_TYPE}
                required
              />
              {/* <FormInputText name="groupPlatformInfo.GPG_TYPE" control={control} label="구분" /> */}
            </Grid>
            <Grid item xs>
              <FormInputText name="groupPlatformInfo.GPG_STLMN_RATE" control={control} label="정산율" />
            </Grid>
            <Grid item xs>
              <FormInputText name="groupPlatformInfo.GPG_DESCRIPTION" control={control} label="비고" />
            </Grid>
          </Grid>
          <Typography variant="h6" gutterBottom m={2}>
            플랫폼 정보
          </Typography>
          {popupList.length > 0 && (
            <Box>
              <Grid container direction="row" justifyContent="end" alignItems="end" p={2}>
                <Grid item>
                  <Button
                    variant="contained"
                    onClick={
                      originList.filter((item) => !isEmpty3(item.CODE)).length
                        ? onHandleListDelete
                        : onHandleListDeleteNew
                    }
                  >
                    삭제
                  </Button>
                </Grid>
              </Grid>
              <DataGridCusutom
                rows={popupList}
                loading={isLoading}
                onrow
                rowsPerPageOptions={rowsPerPageOptions}
                pageSize={pageSize}
                onPageSizeChange={(newPage) => setPageSize(newPage)}
                pagination
                onSelectionModelChange={(newSelectionModel) => {
                  setSelectList(newSelectionModel);
                }}
                selectionModel={selectList}
                checkboxSelection
                keepNonExistentRowsSelected
                columns={columns}
              />
            </Box>
          )}

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
        loading={createMutate.isLoading || modifyMutate.isLoading}
        date={date}
        setDate={setDate}
      />
      <SearchCodePlatform
        isCodePopup={isCodePopup}
        setIsCodePopup={setIsCodePopup}
        setPopupList={setPopupList}
        popupList={popupList}
      />
    </>
  );
}
export default Multi;
