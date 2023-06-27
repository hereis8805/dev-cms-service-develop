import AddIcon from "@mui/icons-material/Add";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Button, Grid } from "@mui/material";
import {
  getCalculateManageGeneralcsvExportList,
  getCalculateManageGeneralList
} from "axios/costManagement/calculateManageGeneral/calculateManageGeneral";
import { pageSizeDefalut, rowsPerPageOptions } from "common/enum/grid";
import DataGridCusutom from "component/DataGridCusutom";
import { useEffect, useMemo, useRef, useState } from "react";
import { Title } from "react-admin";
import { CSVLink } from "react-csv";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { getTimestamp } from "utils/commonUtils";
import Search from "./Search";
import { useRecoilState } from "recoil";
import { initSearchMont, searchMonthAtom } from "store/atom";

function AdvancesFromCustomersManagementList(props) {
  const [resultData, setResultData] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [requestParam, setRequestParam] = useRecoilState(searchMonthAtom);
  // const [requestParam, setRequestParam] = useState({ searchKeyword: "", searchType: "" });
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const history = useHistory();
  // const [isPopup, setIsPopup] = useState(false);
  const [pageSize, setPageSize] = useState(pageSizeDefalut);
  const file = useRef(null);

  const columns = [
    { field: "ROWNUM", headerName: "ROWNUM", hide: true },
    { field: "id", headerName: "No", flex: 0.3 },
    { field: "GP_TYPE_NAME", headerName: "유형", flex: 0.5 },
    { field: "GUBUN", headerName: "구분" },
    { field: "GCM_MANAGE_ID", headerName: "작품코드" },
    { field: "GCM_SERIES_NAME", headerName: "작품명" },
    { field: "GC_NAME", headerName: "CP명", flex: 0.4 },
    { field: "GC_OLD", headerName: "CP코드", flex: 0.4 }
  ];

  const queryOptions = useMemo(
    () => ({
      ...requestParam?.calculateManageGenerals
    }),
    [requestParam]
  );

  const handleExcelDown = async (queryOptions) => {
    await getCalculateManageGeneralcsvExportList(queryOptions)
      .then((res) => {
        setExcelData(res.data);
      })
      .catch(() => {
        throw new Error("Network error");
      });
  };

  const { isFetching, refetch } = useQuery(
    ["getCalculateManageGeneralList"],
    () => getCalculateManageGeneralList(queryOptions),
    {
      enabled: false,
      onSuccess: (data) => {
        setCount(data?.headers["x-total-count"]);
        setResultData(
          data?.data?.map((item, index) => {
            return {
              id: index + 1,
              ROWNUM: parseInt(item.ROWNUM),
              // id: item.ROWNUM,
              ...item
            };
          })
        );
        handleExcelDown(queryOptions);
      }
    }
  );

  const headers = columns.map((item) => {
    return { label: item.headerName, key: item.field };
  });

  useEffect(() => {
    history.action === "PUSH" && setRequestParam(initSearchMont);
  }, [history, setRequestParam]);

  useEffect(() => {
    handleExcelDown(queryOptions);
    // handleExcelDown(queryOptions);
    refetch();
  }, [page, pageSize, requestParam, refetch]);

  return (
    <>
      <Title title="정산관리종합" />
      <Grid container direction="row" justifyContent="end" alignItems="end">
        <Grid item>
          <Button
            variant="text"
            startIcon={<AddIcon />}
            disabled={isFetching}
            onClick={() => {
              history.push("/calculateManageDetail/create");
              // setIsPopup(true);
            }}
          >
            {"등록"}
          </Button>
          <Button
            variant="text"
            startIcon={<FileDownloadIcon />}
            onClick={() => file.current.link.click()}
            disabled={isFetching}
          >
            내보내기
          </Button>
          <div style={{ display: "none" }}>
            <CSVLink
              ref={file}
              data={excelData}
              headers={headers}
              filename={`info-manage-work-${getTimestamp()}.csv`}
              className="hidden"
            />
          </div>
        </Grid>
      </Grid>
      <Search setRequestParam={setRequestParam} requestParam={requestParam} isLoading={isFetching} />
      <DataGridCusutom
        uid="calculateManageGenerals"
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
        onRowClick={(e) => {
          history.push(`/calculateManageDetail/${e.row.GCM_MANAGE_ID}`);
        }}
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
        columns={columns}
      />
    </>
  );
}

export default AdvancesFromCustomersManagementList;
