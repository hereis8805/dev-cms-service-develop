import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { IconButton } from "@mui/material";
import { getCpSettlementsFiles } from "axios/cpSettlementStatement/cpSettlementStatement";
import { pageSizeDefalut, rowsPerPageOptions } from "common/enum/grid";
import DataGridCusutom from "component/DataGridCusutom";
import { useEffect, useMemo, useState } from "react";
import { Title } from "react-admin";
import { useQuery } from "react-query";
import { getToday } from "utils/date";
import Search from "./Search";

function CpSettlementStatementFile(props) {
  const [requestParam, setRequestParam] = useState();
  const [date, setDate] = useState(getToday("yyyy-MM"));
  const [resultData, setresultData] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(pageSizeDefalut);

  const downloadFile = (url) => {
    fetch(url, { method: "GET" })
      .then((res) => {
        return res.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "파일명";
        document.body.appendChild(a);
        a.click();
        setTimeout((_) => {
          window.URL.revokeObjectURL(url);
        }, 60000);
        a.remove();
      })
      .catch((err) => {
        console.error("err: ", err);
      });
  };

  const RenderDate = (value) => {
    return (
      <>
        <IconButton
          aria-label="FileDownloadIcon"
          size="small"
          onClick={(e) => {
            // window.open(value.row.DOWNLOAD, "_blank");
            downloadFile(value.row.DOWNLOAD);
          }}
        >
          <FileDownloadIcon />
        </IconButton>
      </>
    );
  };

  const columns = [
    { field: "GF_IDX", headerName: "No.", flex: 0.2 },
    { field: "GRF_ACTUAL_DATE", headerName: "매출반영월", type: "date" },
    { field: "GF_FILE_NAME", headerName: "파일명" },
    { field: "DOWNLOAD", headerName: "파일 다운로드", renderCell: RenderDate, type: "boolean" }
  ];

  const queryOptions = useMemo(
    () => ({
      selectDate: date,
      ...requestParam
    }),
    [requestParam, date]
  );

  const { isFetching, refetch } = useQuery(["getCpSettlementsFiles"], () => getCpSettlementsFiles(queryOptions), {
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

  useEffect(() => {
    refetch();
  }, [date, requestParam, refetch]);

  return (
    <>
      <Title title="CP 정산내역서 파일" />
      <Search setRequestParam={setRequestParam} date={date} setDate={setDate} />
      <DataGridCusutom
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

export default CpSettlementStatementFile;
