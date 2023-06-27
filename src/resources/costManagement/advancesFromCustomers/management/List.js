import AddIcon from "@mui/icons-material/Add";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Button, Grid } from "@mui/material";
import { pageSizeDefalut, rowsPerPageOptions } from "common/enum/grid";
import { useEffect, useMemo, useRef, useState } from "react";
import DataGridCusutom from "component/DataGridCusutom";
import MuiModalCustom from "component/ModalCustom";
import { CSVLink } from "react-csv";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import CreateTypeSelect from "resources/infoManage/cp/Modal/CreateTypeSelect";
import { getTimestamp } from "utils/commonUtils";
import Search from "./Search";
import {
  unearnedRevenuesList,
  unearnedRevenuesCSV
} from "axios/costManagement/advancesFromCustomers/advancesFromCustomers";
import { Title } from "react-admin";
import { useRecoilState } from "recoil";
import { initSearchMont, searchMonthAtom } from "store/atom";

function AdvancesFromCustomersManagementList(props) {
  const [resultData, setresultData] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [searchMonth, setSearchMonth] = useRecoilState(searchMonthAtom);
  // const [requestParam, setRequestParam] = useState({ searchKeyword: "", searchType: "" });
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [isPopup, setIsPopup] = useState(false);
  const [pageSize, setPageSize] = useState(pageSizeDefalut);
  const file = useRef(null);
  const history = useHistory();

  const RenderDate = (value) => {
    return (
      <>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            history.push(
              `/unearnedRevenueHistory/${value.row.GP_PREPAID_SEQ}?selectDate=${value.row.GPM_ACTUAL_MONTH}`
            );
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
            history.push(`/advancesDetail/${value.row.GP_IDX}`);
          }}
        >
          상세
        </Button>
      </>
    );
  };

  const columns = [
    { field: "GP_IDX", headerName: "No.", flex: 0.5 },
    { field: "GP_PREPAID_SEQ", headerName: "선수수익코드", flex: 0.5 },
    { field: "GP_NAME", headerName: "내용", align: "left" },
    { field: "BUSINESS_NAME", headerName: "거래처" },
    { field: "GCM_SERIES_NAME", headerName: "작품명" },
    { field: "GCM_TYPE_CODE_NAME", headerName: "유형", flex: 0.4 },
    { field: "GP_CURRENCY", headerName: "통화", flex: 0.4 },
    { field: "GER_EXCHANGE_CODE", headerName: "잔액" },
    { field: "GP_ADVANCE_PAYMENT_HISTORY_LINK", headerName: "내역보기", renderCell: RenderDate, flex: 0.5 },
    { field: "GP_ADVANCE_PAYMENT_HISTORY_LINK2", headerName: "상세보기", renderCell: RenderDate2, flex: 0.5 }
  ];

  const queryOptions = useMemo(
    () => ({
      // page: page + 1,
      // limit: pageSize,
      ...searchMonth.advances
    }),
    [page, pageSize, searchMonth]
  );

  const { isLoading, refetch } = useQuery(["unearnedRevenuesList"], () => unearnedRevenuesList(queryOptions), {
    enabled: false,
    onSuccess: (data) => {
      setCount(data?.headers["x-total-count"]);
      setresultData(
        data?.data?.map((item) => {
          return {
            ...item,
            id: item.GP_IDX
            // GPM_CONTACT: formatNumber(formatFloor(item.GPM_CONTACT)),
          };
        })
      );
    }
  });

  const handleExcelDownload = async () => {
    await unearnedRevenuesCSV(queryOptions)
      .then((res) => {
        setExcelData(res.data);
      })
      .catch((e) => {
        throw e;
      });
  };

  const headers = columns.map((item) => {
    return { label: item.headerName, key: item.field };
  });

  useEffect(() => {
    history.action === "PUSH" && setSearchMonth(initSearchMont);
  }, [history, setSearchMonth]);

  useEffect(() => {
    handleExcelDownload();
    refetch();
  }, [page, pageSize, searchMonth, refetch]);

  return (
    <>
      <Title title="선수금 관리" />
      <Grid container direction="row" justifyContent="end" alignItems="end">
        <Grid item>
          <Button
            variant="text"
            startIcon={<AddIcon />}
            onClick={() => {
              history.push(`/advancesDetail`);
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
      <Search setRequestParam={setSearchMonth} requestParam={searchMonth} />
      <DataGridCusutom
        uid="advances"
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
        // onRowClick={(e) => history.push(`/advancesDetail/${e.id}`)}
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
        columns={columns}
      />
    </>
  );
}

export default AdvancesFromCustomersManagementList;
