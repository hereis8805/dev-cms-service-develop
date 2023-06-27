import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Button, Grid } from "@mui/material";
import {
  prepaidPaymentMonthDetailsList,
  prepaidPaymentMonthDetailsListExcelDown
} from "axios/costManagement/prepaidPayment/prepaidPayment";
import { formatterKo, pageSizeDefalut, rowsPerPageOptions } from "common/enum/grid";
import DataGridCusutom from "component/DataGridCusutom";
import MuiModalCustom from "component/ModalCustom";
import { useEffect, useMemo, useRef, useState } from "react";
import { Title } from "react-admin";
import { CSVLink } from "react-csv";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { useRecoilState } from "recoil";
import CreateTypeSelect from "resources/infoManage/cp/Modal/CreateTypeSelect";
import { initSearchMont, searchMonthAtom } from "store/atom";
import { formatFloor, getTimestamp } from "utils/commonUtils";
import { formatNumber } from "utils/string";
import Search from "./Search";

function PrepaidPaymentMonthlyDetailtList(props) {
  const [resultData, setresultData] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [searchMonth, setSearchMonth] = useRecoilState(searchMonthAtom);
  // const [requestParam, setRequestParam] = useState({
  //   searchKeyword: "",
  //   searchType: "",
  //   startDate: format(new Date(), "yyyy-MM"),
  //   endDate: format(new Date(), "yyyy-MM")
  // });
  const [count, setCount] = useState(0);
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
            history.push(`/prepaidHistory/${value.row.GP_PREPAID_SEQ}?selectDate=${value.row.GPM_ACTUAL_MONTH}`);
          }}
        >
          내역
        </Button>
      </>
    );
  };

  const columns = [
    { field: "ROWNUM", headerName: "No..", flex: 0.5, type: "number" },
    { field: "GP_PREPAID_TYPE", headerName: "유형", flex: 0.5 },
    { field: "GP_PREPAID_SEQ", headerName: "선급원가코드", flex: 0.5 },
    { field: "GCM_AUTHOR", headerName: "저작권자" },
    { field: "GCM_SERIES_NAME", headerName: "작품명" },
    {
      field: "BASIC_AMOUNT_SUM",
      headerName: "기초",
      type: "number",
      valueFormatter: ({ value }) => formatterKo.format(value)
    },
    {
      field: "PAID_AMOUNT_SUM",
      headerName: "지급",
      type: "number",
      valueFormatter: ({ value }) => formatterKo.format(value)
    },
    {
      field: "DEDUCTION_AMOUNT_SUM",
      headerName: "차감",
      type: "number",
      valueFormatter: ({ value }) => formatterKo.format(value)
    },
    // { field: "GPM_CONTACT_DEDUCTION", headerName: "차감" },
    {
      field: "FINAL_AMOUNT_SUM",
      headerName: "기말",
      type: "number",
      valueFormatter: ({ value }) => formatterKo.format(value)
    },
    { field: "null", headerName: "내역보기", renderCell: RenderDate }
  ];

  const queryOptions = useMemo(
    () => ({
      // page: page + 1,
      // limit: pageSize,
      param: searchMonth?.prepaidMonthly?.startDate,
      ...searchMonth?.prepaidMonthly
    }),
    [searchMonth]
  );

  const { isLoading, refetch } = useQuery(
    ["prepaidPaymentMonthDetailsList"],
    () => prepaidPaymentMonthDetailsList(queryOptions),
    {
      enabled: false,
      onSuccess: (data) => {
        setCount(data?.headers["x-total-count"]);
        setresultData(
          data?.data?.map((item) => {
            return {
              ...item,
              ROWNUM: parseInt(item.ROWNUM),
              id: item.ROWNUM
              // BASIC_AMOUNT_SUM: formatNumber(formatFloor(item.BASIC_AMOUNT_SUM)),
              // PAID_AMOUNT_SUM: formatNumber(formatFloor(item.PAID_AMOUNT_SUM)),
              // DEDUCTION_AMOUNT_SUM: formatNumber(formatFloor(item.DEDUCTION_AMOUNT_SUM)),
              // FINAL_AMOUNT_SUM: formatNumber(formatFloor(item.FINAL_AMOUNT_SUM)),
              // GPM_CONTACT: formatNumber(formatFloor(item.GPM_CONTACT)),
              // GPM_CONTACT_DEDUCTION: formatNumber(formatFloor(item.GPM_CONTACT_DEDUCTION)),
              // GPM_REAL_BALANCE: formatNumber(formatFloor(item.GPM_REAL_BALANCE)),
              // GP_BASE: formatNumber(formatFloor(item.GP_BASE))
            };
          })
        );
        // console.log(queryOptions);
        handleExcelDown(queryOptions);
      }
    }
  );

  const handleExcelDown = async (queryOptions) => {
    await prepaidPaymentMonthDetailsListExcelDown(queryOptions)
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
    history.action === "PUSH" && setSearchMonth(initSearchMont);
  }, [history, setSearchMonth]);

  useEffect(() => {
    refetch();
  }, [pageSize, searchMonth, refetch]);

  return (
    <>
      <Title title="선급금 월별 상세" />
      <Grid container direction="row" justifyContent="end" alignItems="end">
        <Grid item>
          {/* <Button
            variant="text"
            startIcon={<AddIcon />}
            // disabled={!deadline}
            onClick={() => {
              setIsPopup(true);
            }}
          >
            {"등록"}
          </Button> */}
          <Button variant="text" startIcon={<FileDownloadIcon />} onClick={() => file.current.link.click()}>
            내보내기
          </Button>
          <div style={{ display: "none" }}>
            <CSVLink
              ref={file}
              data={excelData}
              headers={headers}
              filename={`prepaid-month-${getTimestamp()}.csv`}
              className="hidden"
            />
          </div>
        </Grid>
      </Grid>
      <Search setRequestParam={setSearchMonth} requestParam={searchMonth} />
      <DataGridCusutom
        uid="prepaidMonthly"
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
        onRowClick={
          (e) => console.log("e : ", e)
          // history.push(`/infoManageWorkDetail/${e.id}?createType=${e.row?.ROW_TYPE === "단일" ? "single" : "multi"}`)
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
        <CreateTypeSelect url={"infoManageWorkDetail"} />
      </MuiModalCustom>
    </>
  );
}

export default PrepaidPaymentMonthlyDetailtList;
