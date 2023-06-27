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

const MG_PAYOUT_DETAILS_CONDITIONS = [
  { id: "1", name: "CP코드" },
  { id: "2", name: "CP명" }
];

const columns = [
  { field: "IDX", headerName: "No", flex: 0.3 },
  { field: "NAME", headerName: "CP명", flex: 1 },
  { field: "GROUP", headerName: "CP코드", flex: 1 },
  { field: "OLD", headerName: "CP상세코드", flex: 1 }
];

const defaultPageSize = 5;

function SearchCode(props) {
  const { isCodePopup, setIsCodePopup, setPopupList } = props;
  const { register, handleSubmit, reset, watch, control } = useForm();
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

  const { isLoading, refetch } = useQuery(["getCpPopupCps"], () => getCpPopupCps(queryOptions), {
    enabled: false,
    onSuccess(data) {
      setresultData(
        data?.data?.map((item) => {
          return {
            ...item,
            id: item.IDX
          };
        })
      );
    }
  });

  useEffect(() => {
    refetch();
  }, []);

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
                검색1
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
            console.log("newSelectionModel) : ", newSelectionModel);
            setSelectionModel(newSelectionModel);
          }}
          selectionModel={selectionModel}
          // onPageChange={(newPage) => setPage(newPage)}
          keepNonExistentRowsSelected
          columns={columns}
        />
        <Grid container direction="row" justifyContent="end" alignItems="end" p={2}>
          <Grid item>
            <Button
              variant="contained"
              onClick={() => {
                setPopupList && setPopupList(selectionModel);
                setIsCodePopup(false);
              }}
            >
              등록
            </Button>
          </Grid>
        </Grid>
      </Box>
    </MuiModalCustom>
  );
}

export default SearchCode;
