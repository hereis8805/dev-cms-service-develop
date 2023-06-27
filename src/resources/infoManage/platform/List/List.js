import AddIcon from "@mui/icons-material/Add";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Button, Grid } from "@mui/material";
import { getCsvExport, getPlatformList } from "axios/information/platform";
import { pageSizeDefalut, rowsPerPageOptions } from "common/enum/grid";
import DataGridCusutom from "component/DataGridCusutom";
import MuiModalCustom from "component/ModalCustom";
import { useEffect, useMemo, useRef, useState } from "react";
import { Title } from "react-admin";
import { CSVLink } from "react-csv";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import CreateTypeSelect from "resources/infoManage/cp/Modal/CreateTypeSelect";
import { getTimestamp } from "utils/commonUtils";
import Search from "./Search";

const columns = [
  { field: "id", headerName: "No.", flex: 0.5 },
  { field: "IDX", headerName: "IDX", hide: true },
  { field: "ROW_TYPE", headerName: "구분", flex: 0.5 },
  { field: "NAME", headerName: "플랫폼명" },
  { field: "OLD_DETAIL", headerName: "플랫폼2코드" },
  { field: "OLD_PLATFORM", headerName: "플랫폼코드" },
  { field: "AREA", headerName: "서비스지역", flex: 0.7 },
  { field: "FEE_TYPE", headerName: "수수료 구분" },
  { field: "APP_FEE", headerName: "수수료율(앱)", valueFormatter: ({ value }) => `${value ? value : 0}%` },
  {
    field: "ALLIANCE_FEE",
    headerName: "수수료율(제휴)",
    valueFormatter: ({ value }) => `${value ? value : 0}%`
  },
  { field: "TOTAL_FEE", headerName: "종합 수수료율", valueFormatter: ({ value }) => `${value ? value : 0}%` },
  { field: "DETAIL", headerName: "서비스 상세" },
  { field: "PRE_CODE", headerName: "거래처코드" }
];

function InfoManagePlatformList(props) {
  const [resultData, setresultData] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [requestParam, setRequestParam] = useState({ searchKeyword: "", searchType: "" });
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [isPopup, setIsPopup] = useState(false);
  const [pageSize, setPageSize] = useState(pageSizeDefalut);
  const file = useRef(null);
  const history = useHistory();

  const queryOptions = useMemo(
    () => ({
      // // page: page + 1,
      // // limit: pageSize,
      ...requestParam
    }),
    [page, pageSize, requestParam]
  );

  const { isFetching, refetch } = useQuery(["getPlatformList"], () => getPlatformList(queryOptions), {
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
    await getCsvExport(queryOptions)
      .then((res) => {
        setExcelData(res.data);
      })
      .catch(() => {
        throw new Error("Network error");
      });
  };

  const headers = columns.map((item) => {
    return { label: item.headerName, key: item.field };
  });

  useEffect(() => {
    refetch();
  }, [page, pageSize, requestParam, refetch]);

  return (
    <>
      <Title title="플랫폼관리" />
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
        // // page={page}
        pageSize={pageSize}
        rowsPerPageOptions={rowsPerPageOptions}
        pagination
        onPageSizeChange={(newPage) => setPageSize(newPage)}
        // // paginationMode="server"
        // // onPageChange={(newPage) => setPage(newPage)}
        onRowClick={(e) =>
          history.push(
            `/infoManagePlatformDetail/${e.row.IDX}?createType=${e.row?.ROW_TYPE === "단일" ? "single" : "multi"}`
          )
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
        <CreateTypeSelect url={"infoManagePlatformDetail"} />
      </MuiModalCustom>
    </>
  );
}

export default InfoManagePlatformList;
