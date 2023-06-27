import { Grid, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {
  deleteGcgOldGroup,
  getGroupWorks,
  postCreateGcgOldGroup,
  postGroupWorks,
  putGroupWorks
} from "axios/information/work";
import { rowsPerPageOptions } from "common/enum/grid";
import DataGridCusutom from "component/DataGridCusutom";
import { FormInputText } from "component/FormComponents/FormInputText";
import { useEffect, useState } from "react";
import { Title } from "react-admin";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import MonthlySelect from "resources/infoManage/cp/Modal/MonthlySelect";
import SearchCodeWork from "resources/infoManage/cp/Modal/SearchCodeWork";
import { isEmpty3 } from "utils/commonUtils";
import { getToday } from "utils/date";
import { patchGroupRevenueUpdateMonth } from "axios/information/work";
import Loader from "component/Loader";

function Multi(props) {
  const history = useHistory();
  const param = history.location.pathname.split("/").slice(-1)[0];
  const mode = param !== "create";
  const [isPopup, setIsPopup] = useState(false);
  const [isCodePopup, setIsCodePopup] = useState(false);
  const [originList, setOriginList] = useState([]);
  const [popupList, setPopupList] = useState([]);
  const [selectList, setSelectList] = useState([]);
  const [newCode, setNewCode] = useState("");
  // const [createBool, setCreateBool] = useState(false);
  const [date, setDate] = useState(getToday("yyyy-MM"));
  const createMutate = useMutation(postGroupWorks);
  const modifyMutate = useMutation(putGroupWorks);
  const UpdateMonthMutate = useMutation(patchGroupRevenueUpdateMonth);

  const { handleSubmit, reset, control } = useForm();

  const { refetch: createRefetch } = useQuery(["postCreateGcgOldGroup"], () => postCreateGcgOldGroup(), {
    enabled: false,
    onSuccess(data) {
      setNewCode(data.data.GCG_OLD_GROUP);
      reset({
        "groupWorkInfo.GCG_OLD_GROUP": data.data.GCG_OLD_GROUP
      });
    }
  });

  // const { refetch: deleteRefetch } = useQuery(["deleteGcgOldGroup"], () => deleteGcgOldGroup({ param: newCode }), {
  //   enabled: false,
  //   onSuccess(data) {
  //     console.log("data : ", data);
  //   }
  // });

  const { isLoading, refetch } = useQuery(["getGroupWorks"], () => getGroupWorks({ param }), {
    enabled: false,
    onSuccess(data) {
      const { data: resultData } = data;
      reset(resultData);
      const resultList = resultData.workList.map((item, index) => {
        return {
          id: index + 1,
          IDX: item.GCG_IDX,
          NAME: item.GCM_SERIES_NAME,
          CODE: item.GCG_OLD_MANAGE_ID
        };
      });
      setOriginList(resultList);
      setPopupList(resultList);
    }
  });

  const columns = [
    { field: "IDX", headerName: "IDX", hide: true },
    { field: "id", headerName: "No", flex: 0.3 },
    { field: "NAME", headerName: "작품명", flex: 1 },
    { field: "CODE", headerName: "작품코드", flex: 1 }
  ];

  const onHandleSubmit = handleSubmit((formData) => {
    // if (popupList.length === 0) {
    //   return alert("작품 추가해주세요");
    // }
    const data = popupList.map((item) => item.IDX).join();
    const originIdx = originList?.map((item) => item.GCG_IDX).join();
    const result = data
      ?.split(",")
      .filter((item) => {
        return !originIdx?.split(",").includes(item.toString());
      })
      .join();
    const params = {
      gcgOldGroup: formData.groupWorkInfo.GCG_OLD_GROUP,
      gcgName: formData.groupWorkInfo.GCG_NAME,
      // delGcmIdxs: popupList
      //   .filter((item) => selectList.includes(item.id))
      //   .map((item) => item.id)
      //   .join(),
      gcmIdxs: data,
      ADD_IDEX: result
      // TODO : date 매출반영월 처리
      // date
    };

    UpdateMonthMutate.mutate(
      { date, mode, gcgOldGroup: formData.groupWorkInfo.GCG_OLD_GROUP },
      {
        onSuccess: (data) => {
          console.log("params : ", params);
          mode
            ? modifyMutate.mutate(
                { ...params, param },
                {
                  onSuccess: (data) => {
                    alert(data?.data);
                    // refetch();
                    history.push("/infoManageWork");
                    // setPopupList(
                    //   popupList.filter((item) => {
                    //     return !selectList.includes(item.id);
                    //   })
                    // );
                    // setSelectList([]);
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
                    // setCreateBool(true);
                    alert(data?.data);
                    // setIsPopup(false);
                    history.push("/infoManageWork");
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

  const onHandleListDelete = handleSubmit((formData) => {
    if (selectList.length === 0) {
      return alert("데이터를 선택해주새요.");
    }
    if (window.confirm("정말 삭제하시겠습니까")) {
      if (mode) {
        const params = {
          gcgOldGroup: formData.groupWorkInfo.GCG_OLD_GROUP,
          gcgName: formData.groupWorkInfo.GCG_NAME,
          delGcmIdxs: popupList
            .filter((item) => selectList.includes(item.id))
            .map((item) => item.IDX)
            .join()
        };
        modifyMutate.mutate(
          { ...params, param },
          {
            onSuccess: (data) => {
              alert(data?.data);
              // history.push("/infoManageWork");
              // refetch();
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
            },
            onError: (error) => {
              const { message } = error;
              alert(message);
            }
          }
        );
      }
    }
  });

  const onHandleDelete = handleSubmit((formData) => {
    if (window.confirm("정말 취소하시겠습니까?")) {
      // !mode && deleteRefetch();
      history.push("/infoManageWork");
    }
  });

  useEffect(() => {
    mode ? refetch() : createRefetch();
  }, []);

  // useEffect(() => {
  //   console.log("createBool : ", createBool);
  //   return (value) => {
  //     console.log("createBool : ", createBool, value);
  //     // !mode && deleteRefetch();
  //   };
  // }, [createBool]);

  return (
    <>
      {/* {(createMutate.isLoading || modifyMutate.isLoading) && <Loader />} */}
      {/* {isPopup && <Loader />} */}
      <Title title="작품관리 > 그룹" />
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
                name="groupWorkInfo.GCG_OLD_GROUP"
                control={control}
                label="작품 그룹 코드"
                disabled={true}
                required
              />
            </Grid>
            <Grid item xs>
              <FormInputText name="groupWorkInfo.GCG_NAME" control={control} label="그룹명" required />
            </Grid>
            <Grid item xs>
              <Button variant="contained" onClick={() => setIsCodePopup(true)}>
                작품추가
              </Button>
            </Grid>
          </Grid>
          <Typography variant="h6" gutterBottom m={2}>
            작품정보
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
          {/* <Grid container spacing={2} p={2}>
            <Grid item xs>
              <FormInputText name="GCD_COMPANY_NAME" control={control} label="CP 그룹 코드" />
            </Grid>
            <Grid item xs>
              <FormInputText name="GCD_MANAGER01" control={control} label="그룹명" />
            </Grid>
            <Grid item xs>
              <Button variant="contained">CP추가</Button>
            </Grid>
          </Grid> */}

          <Grid container direction="row" justifyContent="end" alignItems="end" p={2}>
            <Grid item>
              <Button variant="contained" onClick={onHandleDelete}>
                취소
              </Button>
              <Button variant="contained" sx={{ ml: 2 }} onClick={() => setIsPopup(true)}>
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
      <SearchCodeWork
        isCodePopup={isCodePopup}
        setIsCodePopup={setIsCodePopup}
        setPopupList={setPopupList}
        popupList={popupList}
      />
    </>
  );
}
export default Multi;
