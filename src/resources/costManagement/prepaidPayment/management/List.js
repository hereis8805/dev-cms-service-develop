import AddIcon from "@mui/icons-material/Add";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Button, Grid } from "@mui/material";
import { prepaidPaymentCSV, prepaidPaymentList } from "axios/costManagement/prepaidPayment/prepaidPayment";
import { pageSizeDefalut, rowsPerPageOptions } from "common/enum/grid";
import DataGridCusutom from "component/DataGridCusutom";
import { useEffect, useMemo, useRef, useState } from "react";
import { Title } from "react-admin";
import { CSVLink } from "react-csv";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { useRecoilState } from "recoil";
import { initSearchMont, searchMonthAtom } from "store/atom";
import { getTimestamp, isEmpty } from "utils/commonUtils";
import Search from "./Search";

function PrepaidPaymentManagementList(props) {
  const [resultData, setresultData] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [requestParam, setRequestParam] = useRecoilState(searchMonthAtom);
  const [count, setCount] = useState(0);
  const [pageSize, setPageSize] = useState(pageSizeDefalut);
  const file = useRef(null);
  const history = useHistory();

  const RenderDate = (value) => {
    return (
      <>
        <Button
          variant="contained"
          color="primary"
          onClick={(e) => {
            if (isEmpty(value.row.GPM_ACTUAL_MONTH)) {
              alert("선급금 내역이 존재하지 않습니다.");
            } else {
              history.push(`/prepaidHistory/${value.row.GP_PREPAID_SEQ}?selectDate=${value.row.GPM_ACTUAL_MONTH}`);
            }
          }}
        >
          내역
        </Button>
      </>
    );
  };

  const RenderDate2 = (value) => {
    return (
      <>
        <Button
          variant="contained"
          color="primary"
          onClick={(e) => {
            history.push(`/prepaidDetail/${value.row.GP_IDX}`);
          }}
        >
          상세
        </Button>
      </>
    );
  };

  const columns = [
    { field: "ROWNUM", headerName: "No.", flex: 0.5, type: "number" },
    { field: "GP_PREPAID_TYPE", headerName: "유형", flex: 0.5 },
    { field: "GP_PREPAID_SEQ", headerName: "선급원가코드", flex: 1.2 },
    { field: "GP_NAME", headerName: "내용", align: "left" },
    { field: "GC_CP_NAME", headerName: "저작권자" },
    { field: "GP_TYPE_NAME", headerName: "작품유형" },
    { field: "GP_MANAGE_NAME", headerName: "작품코드" },
    { field: "GPD_PLATFORM_NAME", headerName: "플랫폼코드" },
    { field: "GP_STATUS", headerName: "계약상태" },
    { field: "GP_ADVANCE_PAYMENT_HISTORY_LINK", headerName: "내역보기", renderCell: RenderDate },
    { field: "GP_ADVANCE_PAYMENT_HISTORY_LINK2", headerName: "상세보기", renderCell: RenderDate2 }
  ];

  const queryOptions = useMemo(
    () => ({
      // page: page + 1,
      // limit: pageSize,
      ...requestParam.prepaid
    }),
    [requestParam]
  );

  const { isLoading, refetch } = useQuery(["prepaidPaymentList"], () => prepaidPaymentList(queryOptions), {
    enabled: false,
    onSuccess: (data) => {
      setCount(data?.headers["x-total-count"]);
      setresultData(
        data?.data?.map((item) => {
          return {
            ...item,
            ROWNUM: parseInt(item.ROWNUM),
            id: item.GP_IDX
          };
        })
      );
      handleExcelDown(queryOptions);
    }
  });

  const handleExcelDown = async (queryOptions) => {
    await prepaidPaymentCSV(queryOptions)
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
    history.action === "PUSH" && setRequestParam(initSearchMont);
  }, [history, setRequestParam]);

  useEffect(() => {
    refetch();
  }, [pageSize, requestParam, refetch]);

  return (
    <>
      <Title title="선급금 관리" />
      <Grid container direction="row" justifyContent="end" alignItems="end">
        <Grid item>
          <Button
            variant="text"
            startIcon={<AddIcon />}
            onClick={(e) => {
              history.push(`/prepaidDetail`);
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
              filename={`prepaid-${getTimestamp()}.csv`}
              className="hidden"
            />
          </div>
        </Grid>
      </Grid>
      <Search setRequestParam={setRequestParam} requestParam={requestParam} />
      <DataGridCusutom
        uid="prepaid"
        rows={resultData}
        rowCount={count}
        loading={isLoading}
        onrow
        // page={page}
        pageSize={pageSize}
        rowsPerPageOptions={rowsPerPageOptions}
        pagination
        onPageSizeChange={(newPage) => setPageSize(newPage)}
        // paginationMode="server"
        // onPageChange={(newPage) => setPage(newPage)}
        //onRowClick={(e) => history.push(`/prepaidDetail/${e.row.GP_IDX}`)}
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
        columns={columns}
      />
    </>
  );
}

export default PrepaidPaymentManagementList;
