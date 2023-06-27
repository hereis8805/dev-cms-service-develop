import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { IconButton } from "@mui/material";
import { getSettlementDatas } from "axios/costManagement/calculateDataHistory/calculateDataHistory";
import { pageSizeDefalut, rowsPerPageOptions } from "common/enum/grid";
import DataGridCusutom from "component/DataGridCusutom";
import { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import { Title } from "react-admin";
import { useQuery } from "react-query";
import { useRecoilState } from "recoil";
import { initSearchMont, searchMonthAtom } from "store/atom";
import { saveZip } from "utils/commonUtils";
import Search from "./Search";

function CalculateDataHistoryList(props) {
  const item = JSON.parse(localStorage.getItem("userInfo"));
  const [resultData, setresultData] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(pageSizeDefalut);
  const [requestParam, setRequestParam] = useRecoilState(searchMonthAtom);
  const history = useHistory();

  const RenderDate = (value) => {
    return (
      <>
        <IconButton
          aria-label="FileDownloadIcon"
          size="small"
          onClick={(e) => {
            window.open(value.row.DOWNLOAD_LINK, "_blank");
          }}
        >
          <FileDownloadIcon />
        </IconButton>
      </>
    );
  };

  const columns = [
    { field: "id", headerName: "No.", flex: 0.2 },
    { field: "GRF_IDX", headerName: "GRF_IDX", hide: true },
    { field: "GRF_ACTUAL_DATE", headerName: "매출반영월", type: "date" },
    { field: "work_history", headerName: "작업 히스토리" },
    { field: "GF_FILE_NAME", headerName: "파일명" },
    { field: "DOWNLOAD_LINK", headerName: "파일 다운로드", renderCell: RenderDate, type: "boolean" }
  ];

  const queryOptions = useMemo(
    () => ({
      selectDate: requestParam?.calculateDataHistory.searchDate,
      // ...requestParam
      gcOld: item?.user?.grade === "S" ? null : item?.user?.guCpId
    }),
    [requestParam]
  );

  const { isFetching, refetch } = useQuery(["getSettlementDatas"], () => getSettlementDatas(queryOptions), {
    enabled: false,
    onSuccess: (data) => {
      setCount(data?.headers["x-total-count"]);
      setresultData(
        data?.data?.map((item, index) => {
          return {
            ...item,
            id: page * pageSize + index + 1
            // SUM_GCD_AMOUNT: formatNumber(formatFloor(item.SUM_GCD_AMOUNT)),
            // SUM_GCD_RECALCULATE: formatNumber(formatFloor(item.SUM_GCD_RECALCULATE)),
            // TOTAL_AMOUNT: formatNumber(formatFloor(item.TOTAL_AMOUNT)),
            // TAX_AMOUNT: formatNumber(formatFloor(item.TAX_AMOUNT)),
            // REAL_AMOUNT: formatNumber(formatFloor(item.REAL_AMOUNT))
          };
        })
      );
    }
  });

  const handleAllDownload = () => {
    saveZip(
      "downloadZip",
      resultData.map((item) => item.DOWNLOAD_LINK)
    );
  };

  useEffect(() => {
    refetch();
  }, [requestParam, refetch]);

  useEffect(() => {
    history.action === "PUSH" && setRequestParam(initSearchMont);
  }, [history, setRequestParam]);

  return (
    <>
      <Title title="정산 데이터 내역" />
      <Search setRequestParam={setRequestParam} requestParam={requestParam} handleAllDownload={handleAllDownload} />
      <DataGridCusutom
        uid="calculateDataHistory"
        rows={resultData}
        rowCount={count}
        columns={columns}
        loading={isFetching}
        pageSize={pageSize}
        onPageSizeChange={(newPage) => setPageSize(newPage)}
        rowsPerPageOptions={rowsPerPageOptions}
        pagination
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
      />
    </>
  );
}

export default CalculateDataHistoryList;
