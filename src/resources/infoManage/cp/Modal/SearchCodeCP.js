import { Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { getCpPopupCps } from "axios/information/cp";
import { rowsPerPageOptions } from "common/enum/grid";
import DataGridCusutom from "component/DataGridCusutom";
import SelectSearchInputCustom from "component/filters/SelectSearchInputCustom";
import MuiModalCustom from "component/ModalCustom";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";

const columns = [
  { field: "IDX", headerName: "IDX", hide: true },
  { field: "id", headerName: "No", flex: 0.3 },
  { field: "NAME", headerName: "CP명", flex: 1 },
  { field: "CODE", headerName: "CP코드", flex: 1 },
  { field: "OLD", headerName: "CP상세코드", flex: 1 }
];

const defaultPageSize = 5;

function SearchCodeCP(props) {
  const { isCodePopup, setIsCodePopup, setPopupList, popupList } = props;
  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      searchKeyword: ""
    }
  });
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

  const { isLoading, refetch } = useQuery(["getCpPopupCps"], () => getCpPopupCps(queryOptions), {
    enabled: false,
    onSuccess(data) {
      setresultData(
        data?.data
          ?.map((item, index) => {
            // console.log("item : ", item);
            return {
              ...item,
              id: index + 1,
              IDX: item.IDX,
              NAME: item.NAME,
              CODE: item.GROUP
            };
          })
          .filter((item) => item.ROW_TYPE === "단일")
      );
    }
  });

  useEffect(() => {
    refetch();
  }, [queryOptions, refetch]);

  useEffect(() => {
    setSelectionModel([]);
  }, [isCodePopup]);

  function onSubmit(values) {
    setRequestParam(values);
  }
  return (
    isCodePopup && (
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
                <SelectSearchInputCustom onBlur={onSubmit} register={register} control={control} />
                <Button type="submit" variant="contained" color="primary">
                  검색
                </Button>
              </Box>
            </form>
          </Box>
          <DataGridCusutom
            rows={resultData}
            loading={isLoading}
            onrow
            // page={page}
            pageSize={pageSize}
            rowsPerPageOptions={rowsPerPageOptions}
            pagination
            onPageSizeChange={(newPage) => setPageSize(newPage)}
            checkboxSelection
            onSelectionModelChange={(newSelectionModel) => {
              // console.log("newSelectionModel : ", newSelectionModel);
              const selectedIDs = new Set(newSelectionModel);
              const selectedRows = resultData.filter((row) => selectedIDs.has(row.id));
              setSelectionModel(selectedRows);
            }}
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
                  if (selectionModel.length === 0) {
                    return alert("데이터를 선택해주새요.");
                  }
                  // console.log("selectionModel : ", selectionModel, popupList);
                  const result = selectionModel.map((item, index) => {
                    return {
                      id: index + 1,
                      GC_IDX: item.IDX,
                      GC_NAME: item.NAME,
                      GC_OLD: item.OLD
                    };
                  });
                  const sumItem = [...popupList, ...result];
                  const resultItem = sumItem.reduce(function (acc, current) {
                    if (acc.findIndex(({ GC_OLD }) => GC_OLD === current.GC_OLD) === -1) {
                      acc.push(current);
                    }
                    return acc;
                  }, []);
                  console.log("resultItem : ", resultItem);
                  setPopupList(resultItem);
                  setIsCodePopup(false);
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
    )
  );
}

export default SearchCodeCP;
