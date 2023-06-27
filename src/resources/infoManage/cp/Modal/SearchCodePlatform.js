import { Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { getCpPopupCps } from "axios/information/cp";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
// import DatePicker from "component/CustomDatePicker";
import { rowsPerPageOptions } from "common/enum/grid";
import DataGridCusutom from "component/DataGridCusutom";
import SelectSearchInputCustom from "component/filters/SelectSearchInputCustom";
import { useForm } from "react-hook-form";
import MuiModalCustom from "component/ModalCustom";
import { getPopupGpOldPlatforms } from "axios/information/platform";

const columns = [
  { field: "IDX", headerName: "IDX", hide: true },
  { field: "id", headerName: "No", flex: 0.3 },
  { field: "NAME", headerName: "플랫폼명", flex: 1 },
  { field: "CODE", headerName: "플랫폼코드", flex: 1 }
  // { field: "OLD_DETAIL", headerName: "플랫폼상세코드", flex: 1 }
];

const defaultPageSize = 5;

function SearchCodePlatform(props) {
  const { isCodePopup, setIsCodePopup, setPopupList, popupList } = props;
  const { register, handleSubmit, reset, watch, control } = useForm({
    defaultValues: {
      searchKeyword: ""
    }
  });
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [resultData, setresultData] = useState([]);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [selectionModel, setSelectionModel] = useState([]);
  const [requestParam, setRequestParam] = useState({ searchKeyword: "" });

  const queryOptions = useMemo(
    () => ({
      // page: page + 1,
      // limit: pageSize,
      ...requestParam
    }),
    [page, pageSize, requestParam]
  );

  const { isLoading, refetch } = useQuery(["getPopupGpOldPlatforms"], () => getPopupGpOldPlatforms(queryOptions), {
    enabled: false,
    onSuccess({ data }) {
      setresultData(
        data
          ?.map((item, index) => {
            return {
              ...item,
              id: index + 1,
              IDX: item.id,
              CODE: item.OLD_DETAIL
            };
          })
          .filter((item) => item.ROW_TYPE === "단일")
      );
    }
  });

  useEffect(() => {
    refetch();
  }, [queryOptions, refetch]);

  function onSubmit(values) {
    console.log(values);
    setRequestParam(values);
  }
  return (
    <MuiModalCustom
      isOpen={isCodePopup}
      onClose={() => {
        setIsCodePopup(false);
      }}
      title={"코드 검색"}
    >
      <Box sx={{ width: 500, pt: 1 }}>
        <Box
          sx={{
            backgroundColor: "#FFFFFF",
            boxShadow:
              "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%);",
            mb: 2,
            p: 2
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: "flex" }}>
              <SelectSearchInputCustom
                //   selects={MG_PAYOUT_DETAILS_CONDITIONS}
                onBlur={onSubmit}
                register={register}
                control={control}
              />
              <Button type="submit" variant="contained" color="primary">
                검색
              </Button>
            </Box>
          </form>
        </Box>
        <DataGridCusutom
          rows={resultData}
          // rowCount={count}
          loading={isLoading}
          onrow
          // page={page}
          pageSize={pageSize}
          rowsPerPageOptions={rowsPerPageOptions}
          pagination
          onPageSizeChange={(newPage) => setPageSize(newPage)}
          checkboxSelection
          onSelectionModelChange={(newSelectionModel) => {
            const selectedIDs = new Set(newSelectionModel);
            const selectedRows = resultData.filter((row) => selectedIDs.has(row.id));
            setSelectionModel(selectedRows);
          }}
          // selectionModel={selectionModel}
          // onPageChange={(newPage) => setPage(newPage)}
          keepNonExistentRowsSelected
          columns={columns}
        />
        <Grid container direction="row" justifyContent="end" alignItems="end" p={2}>
          <Grid item>
            <Button
              variant="contained"
              sx={{ mr: 2 }}
              onClick={() => {
                console.log("selectionModel : ", selectionModel);
                if (selectionModel.length === 0) {
                  return alert("데이터를 선택해주새요.");
                }

                const result = selectionModel.map((item) => {
                  return {
                    id: item.IDX,
                    IDX: item.IDX,
                    NAME: item.NAME,
                    CODE: item.CODE
                  };
                });
                const sumItem = [...popupList, ...result];
                const resultItem = sumItem.reduce(function (acc, current) {
                  if (acc.findIndex(({ CODE }) => CODE === current.CODE) === -1) {
                    acc.push(current);
                  }
                  return acc;
                }, []);
                setPopupList(
                  resultItem.map((item, index) => {
                    return { ...item, id: index + 1 };
                  })
                );
                setIsCodePopup(false);
                // setPopupList(selectionModel);
                // setIsCodePopup(false);
              }}
            >
              등록
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setIsCodePopup(false);
              }}
            >
              닫기
            </Button>
          </Grid>
        </Grid>
      </Box>
    </MuiModalCustom>
  );
}

export default SearchCodePlatform;
