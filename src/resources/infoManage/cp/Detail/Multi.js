import { Grid, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { deleteGcgOldGroup, getGroupCps, postCreateGcgOldGroup, postGroupCps, putGroupCps } from "axios/information/cp";
import { rowsPerPageOptions } from "common/enum/grid";
import DataGridCusutom from "component/DataGridCusutom";
import { FormInputText } from "component/FormComponents/FormInputText";
import { useEffect, useState } from "react";
import { Title } from "react-admin";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { isEmpty3 } from "utils/commonUtils";
import { getToday } from "utils/date";
import MonthlySelect from "../Modal/MonthlySelect";
import SearchCodeGroupCP from "../Modal/SearchCodeGroupCP";
import { patchGroupRevenueUpdateMonth } from "axios/information/cp";

function Multi(props) {
  const history = useHistory();
  const param = history.location.pathname.split("/").slice(-1)[0];
  const mode = param !== "create";
  const [isPopup, setIsPopup] = useState(false);
  const [isCodePopup, setIsCodePopup] = useState(false);
  const [popupList, setPopupList] = useState([]);
  const [originList, setOriginList] = useState([]);
  const [selectList, setSelectList] = useState([]);
  const [date, setDate] = useState(getToday("yyyy-MM"));
  const createMutate = useMutation(postGroupCps);
  const modifyMutate = useMutation(putGroupCps);
  const UpdateMonthMutate = useMutation(patchGroupRevenueUpdateMonth);

  const { handleSubmit, reset, control, getValues, errors } = useForm();

  const { refetch: createRefetch } = useQuery(["postCreateGcgOldGroup"], () => postCreateGcgOldGroup(), {
    enabled: false,
    onSuccess(data) {
      reset({
        "info.GCG_OLD_GROUP": data.data.GCG_OLD_GROUP
      });
    }
  });

  const { isLoading, refetch } = useQuery(["getGroupCps"], () => getGroupCps({ param }), {
    enabled: false,
    onSuccess(data) {
      const { data: resultData } = data;
      reset(resultData);

      const resultList = resultData.cpList
        .filter((item) => item.GCD_IDX)
        .map((item, index) => {
          return {
            id: index + 1,
            GCD_IDX: item.GCD_IDX,
            IDX: item.GC_IDX,
            NAME: item.GCD_OWNER_NAME,
            CODE: item.GC_OLD
          };
        });
      setOriginList(resultList);
      setPopupList(resultList);
    }
  });

  const columns = [
    { field: "IDX", headerName: "IDX", hide: true },
    { field: "GCD_IDX", headerName: "GCD_IDX", hide: true },
    { field: "id", headerName: "No", flex: 0.3 },
    { field: "NAME", headerName: "CP명", flex: 1 },
    { field: "CODE", headerName: "CP상세코드", flex: 1 }
  ];

  const onHandleSubmit = handleSubmit((formData) => {
    // console.log("formData : ", formData);
    // if (popupList.length === 0) {
    //   return alert("CP 추가해주세요");
    // }
    const item = JSON.parse(localStorage.getItem("userInfo"));
    const originIdx = originList?.map((item) => item.IDX).join();
    const data = popupList?.map((item) => item.IDX).join();
    const result = data
      ?.split(",")
      .filter((item) => {
        return !originIdx?.split(",").includes(item.toString());
      })
      .join();
    const params = {
      ...formData.info,
      GC_IDXS: data,
      REG_USER_ID: item.user.id,
      ADD_IDEX: result,
      DEL_CP_IDXS: ""
    };

    UpdateMonthMutate.mutate(
      { date, mode, gcgOldGroup: formData.info.GCG_OLD_GROUP },
      {
        onSuccess: (data) => {
          console.log("params : ", params);
          mode
            ? modifyMutate.mutate(
                { ...params, param },
                {
                  onSuccess: (data) => {
                    alert(data?.data);
                    setIsPopup(false);
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
                    history.push("/infoManageCp");
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

  useEffect(() => {
    console.log("errors : ", errors);
  }, [errors]);

  const onHandleListDelete = handleSubmit((formData) => {
    if (selectList.length === 0) {
      return alert("데이터를 선택해주새요.");
    }
    if (window.confirm("정말 삭제하시겠습니까")) {
      const params = {
        GCG_DESCRIPTION: formData.info.GCG_DESCRIPTION,
        GCG_NAME: formData.info.GCG_NAME,
        GCG_OLD_GROUP: formData.info.GCG_OLD_GROUP,
        DEL_CP_IDXS: popupList
          .filter((item) => selectList.includes(item.id))
          .map((item) => item.IDX)
          .join()
      };
      modifyMutate.mutate(
        { ...params, param },
        {
          onSuccess: (data) => {
            alert(data?.data);
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
  });

  const onHandleDelete = handleSubmit((formData) => {
    if (window.confirm("정말 취소하시겠습니까?")) {
      history.goBack();
    }
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

  useEffect(() => {
    mode ? refetch() : createRefetch();
  }, [mode]);

  // useEffect(() => {
  //   return () => {
  //     !mode && !saveCheck && deleteCodeMutate.mutate(getValues("info.GCG_OLD_GROUP"));
  //   };
  // }, [mode, saveCheck]);

  // useEffect(() => {
  //   console.log("popupList : ", popupList);
  // }, [popupList]);

  return (
    <>
      <Title title="CP관리 > 그룹" />
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
              <FormInputText name="info.GCG_OLD_GROUP" control={control} label="CP 그룹 코드" disabled required />
            </Grid>
            <Grid item xs>
              <FormInputText name="info.GCG_NAME" control={control} label="그룹명" required />
            </Grid>
            <Grid item xs>
              <Button variant="contained" onClick={() => setIsCodePopup(true)}>
                CP추가
              </Button>
            </Grid>
          </Grid>
          <Grid container item spacing={2} p={2}>
            <Grid item xs>
              <FormInputText name="info.GCG_DESCRIPTION" control={control} label="비고" />
            </Grid>
          </Grid>
          <Typography variant="h6" gutterBottom m={2}>
            CP 정보
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
      <SearchCodeGroupCP
        isCodePopup={isCodePopup}
        setIsCodePopup={setIsCodePopup}
        setPopupList={setPopupList}
        popupList={popupList}
      />
    </>
  );
}
export default Multi;
