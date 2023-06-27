import AddIcon from "@mui/icons-material/Add";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Button, Grid } from "@mui/material";
import { getCpkList, getCpkListCsvExport } from "axios/information/cp";
import { pageSizeDefalut, rowsPerPageOptions } from "common/enum/grid";
import DataGridCusutom from "component/DataGridCusutom";
import MuiModalCustom from "component/ModalCustom";
import { useEffect, useMemo, useRef, useState } from "react";
import { Title } from "react-admin";
import { CSVLink } from "react-csv";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { getTimestamp } from "utils/commonUtils";
import CreateTypeSelect from "../Modal/CreateTypeSelect";
import Search from "./Search";

const columns = [
  { field: "id", headerName: "No", flex: 0.5 },
  { field: "IDX", headerName: "IDX", hide: true },
  { field: "ROW_TYPE", headerName: "구분", flex: 0.5 },
  { field: "GCD_BUSINESS_TYPE", headerName: "유형1", flex: 0.5 },
  { field: "CP_TYPE", headerName: "유형2", flex: 0.5 },
  { field: "GCD_OWNER_NAME", headerName: "CP명" },
  { field: "GC_OLD_GROUP", headerName: "CP코드/CP그룹코드" },
  { field: "GCD_OLDS", headerName: "CP상세코드" },
  { field: "GCD_WRITER_NAME", headerName: "필명/그룹명" },
  { field: "GCD_KCLEP_CODE", headerName: "거래처코드" },
  { field: "GCD_EMAIL", headerName: "이메일" }
];

function InfoManageCpList(props) {
  const [resultData, setresultData] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [requestParam, setRequestParam] = useState({ searchKeyword: "", searchType: "" });
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [isPopup, setIsPopup] = useState(false);
  const [age, setAge] = useState("");
  const [pageSize, setPageSize] = useState(pageSizeDefalut);
  const file = useRef(null);
  const history = useHistory();

  const queryOptions = useMemo(
    () => ({
      // page: page + 1,
      // limit: pageSize,
      ...requestParam
    }),
    [page, pageSize, requestParam]
  );

  const { isFetching, refetch } = useQuery(["getCpkList"], () => getCpkList(queryOptions), {
    enabled: false,
    onSuccess: (data) => {
      setCount(data?.headers["x-total-count"]);
      setresultData(
        data?.data?.map((item, index) => {
          return {
            ...item,
            id: page * pageSize + index + 1
          };
        })
      );
      handleExcelDown(queryOptions);
    }
  });

  const handleExcelDown = async (queryOptions) => {
    await getCpkListCsvExport(queryOptions)
      .then((res) => {
        setExcelData(
          res.data?.map((item, index) => {
            return {
              ...item,
              id: page * pageSize + index + 1
            };
          })
        );
      })
      .catch(() => {
        throw new Error("Network error");
      });
  };

  const headers = columns.map((item) => {
    return { label: item.headerName, key: item.field };
  });

  useEffect(() => {
    handleExcelDown(queryOptions);
    refetch();
  }, [page, pageSize, requestParam, refetch]);

  return (
    <>
      <Title title="CP관리" />
      <Grid container direction="row" justifyContent="end" alignItems="end">
        <Grid item>
          <Button
            variant="text"
            startIcon={<AddIcon />}
            // disabled={!deadline}
            onClick={() => {
              setIsPopup(true);
            }}
          >
            {"등록"}
          </Button>
          <Button variant="text" startIcon={<FileDownloadIcon />} onClick={() => file.current.link.click()}>
            내보내기
          </Button>
          <div style={{ display: "none" }}>
            <CSVLink
              ref={file}
              data={excelData}
              headers={headers}
              filename={`work-${getTimestamp()}.csv`}
              className="hidden"
            />
          </div>
        </Grid>
      </Grid>
      <Search setRequestParam={setRequestParam} />
      <DataGridCusutom
        rows={resultData}
        rowCount={count}
        loading={isFetching}
        onrow
        // page={page}
        pageSize={pageSize}
        rowsPerPageOptions={rowsPerPageOptions}
        pagination
        onPageSizeChange={(newPage) => setPageSize(newPage)}
        // paginationMode="server"
        // onPageChange={(newPage) => setPage(newPage)}
        onRowClick={(e) =>
          history.push(`/infoManageCpDetail/${e.row.IDX}?createType=${e.row?.ROW_TYPE === "단일" ? "single" : "multi"}`)
        }
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
        columns={columns}
      />
      <MuiModalCustom
        isOpen={isPopup}
        onClose={() => {
          setIsPopup(false);
        }}
        title={"단일/그룹 코드 선택"}
      >
        <CreateTypeSelect url={"infoManageCpDetail"} />
      </MuiModalCustom>
    </>
  );
}

export default InfoManageCpList;
