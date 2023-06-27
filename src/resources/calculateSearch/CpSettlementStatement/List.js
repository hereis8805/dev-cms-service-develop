import { Box, Typography } from "@mui/material";
import { getCpSettlements } from "axios/cpSettlementStatement/cpSettlementStatement";
import { formatter1, pageSizeDefalut, percentFormatter, rowsPerPageOptions } from "common/enum/grid";
import DataGridCusutom from "component/DataGridCusutom";
import { useEffect, useMemo, useState } from "react";
import { Title } from "react-admin";
import { useQuery } from "react-query";
import { getToday } from "utils/date";
import Search from "./Search";

const columns = [
  {
    field: "SUM_GCD_AMOUNT",
    headerName: "정산금",
    type: "number",
    valueFormatter: ({ value }) => formatter1.format(value)
  },
  {
    field: "SUM_GCD_RECALCULATE",
    headerName: "재정산",
    type: "number",
    valueFormatter: ({ value }) => formatter1.format(value)
  },
  {
    field: "TOTAL_AMOUNT",
    headerName: "정산금(최종)",
    type: "number",
    valueFormatter: ({ value }) => formatter1.format(value)
  },
  { field: "TAX_AMOUNT", headerName: "세금", type: "number", valueFormatter: ({ value }) => formatter1.format(value) },
  {
    field: "REAL_AMOUNT",
    headerName: "실지급액",
    type: "number",
    valueFormatter: ({ value }) => formatter1.format(value)
  },
  { field: "GCD_PAY_DATE", headerName: "지급예정일" }
];

const settlementHistoryColumns1 = [
  { field: "GP_TYPE_NAME", headerName: "구분" },
  { field: "GCM_SERIES_NAME", headerName: "작품명" },
  {
    field: "SALE_AMOUNT",
    headerName: "매출액",
    type: "number",
    valueFormatter: ({ value }) => formatter1.format(value)
  },
  {
    field: "ORIGINAL_AMOUNT",
    headerName: "원작료",
    type: "number",
    valueFormatter: ({ value }) => formatter1.format(value)
  },
  {
    field: "PREDEDUCTION_AMOUNT",
    headerName: "선차감MG",
    type: "number",
    valueFormatter: ({ value }) => formatter1.format(value)
  },
  {
    field: "GCD_SETTLEMENT_RATE",
    headerName: "정산율",
    valueFormatter: ({ value }) => percentFormatter.format(value)
  },
  {
    field: "POSTDEDUCTION_AMOUNT",
    headerName: "후차감MG",
    type: "number",
    valueFormatter: ({ value }) => formatter1.format(value)
  },
  { field: "PAY_AMOUNT", headerName: "정산금", type: "number", valueFormatter: ({ value }) => formatter1.format(value) }
];

const settlementHistoryColumns2 = [
  { field: "GP_NAME", headerName: "플랫폼명" },
  { field: "GP_FEE_TYPE", headerName: "결제방법" },
  {
    field: "SALE_AMOUNT",
    headerName: "매출액",
    type: "number",
    valueFormatter: ({ value }) => formatter1.format(value)
  },
  {
    field: "ORIGINAL_AMOUNT",
    headerName: "원작료",
    type: "number",
    valueFormatter: ({ value }) => formatter1.format(value)
  },
  {
    field: "PREDEDUCTION_AMOUNT",
    headerName: "선차감MG",
    type: "number",
    valueFormatter: ({ value }) => formatter1.format(value)
  },
  {
    field: "GCD_SETTLEMENT_RATE",
    headerName: "정산율",
    valueFormatter: ({ value }) => percentFormatter.format(value)
  },
  {
    field: "POSTDEDUCTION_AMOUNT",
    headerName: "후차감MG",
    type: "number",
    valueFormatter: ({ value }) => formatter1.format(value)
  },
  { field: "PAY_AMOUNT", headerName: "정산금", type: "number", valueFormatter: ({ value }) => formatter1.format(value) }
];

const advancePaymentColumns = [
  { field: "GP_NAME", headerName: "내용", align: "left" },
  {
    field: "GPM_PREVIOUS_CONTACT",
    headerName: "전월이월",
    type: "number",
    valueFormatter: ({ value }) => formatter1.format(value)
  },
  {
    field: "GPM_CONTACT",
    headerName: "추가금액",
    type: "number",
    valueFormatter: ({ value }) => formatter1.format(value)
  },
  {
    field: "GPM_CONTACT_DEDUCTION",
    headerName: "당월차감금액",
    type: "number",
    valueFormatter: ({ value }) => formatter1.format(value)
  },
  {
    field: "GPM_CONTACT_BALANCE",
    headerName: "잔액",
    type: "number",
    valueFormatter: ({ value }) => formatter1.format(value)
  }
];

const isEmpty3 = (val) => {
  if (
    val === "null" ||
    val === "NULL" ||
    val === "Null" ||
    val === "" ||
    val === null ||
    val === undefined ||
    (val !== null && typeof val === "object" && !Object.keys(val).length)
  ) {
    return true;
  } else {
    return false;
  }
};

function CpSettlementStatementList() {
  const [requestParam, setRequestParam] = useState();
  const [date, setDate] = useState(getToday("yyyy-MM"));
  const [pageSize1, setPageSize1] = useState(pageSizeDefalut);
  const [pageSize2, setPageSize2] = useState(pageSizeDefalut);
  const [pageSize3, setPageSize3] = useState(pageSizeDefalut);
  const [resultData, setresultData] = useState([]);
  const [settlementHistory1, setSettlementHistory1] = useState([]);
  const [settlementHistory2, setSettlementHistory2] = useState([]);
  const [advancePaymentList, setAdvancePaymentList] = useState([]);

  const queryOptions = useMemo(
    () => ({
      selectDate: date,
      ...requestParam
    }),
    [requestParam, date]
  );

  const { isFetching, refetch } = useQuery(["getCpSettlements"], () => getCpSettlements(queryOptions), {
    enabled: false,
    onSuccess: (data) => {
      if (isEmpty3(data.data.cpId)) {
        alert("계정에 CP ID 가 없습니다.");
      }

      setSettlementHistory1(
        data?.data?.settlementHistory1.map((item, index) => {
          return {
            ...item,
            id: index + 1
          };
        })
      );
      setSettlementHistory2(
        data?.data?.settlementHistory2.map((item, index) => {
          return {
            ...item,
            id: index + 1
          };
        })
      );
      setAdvancePaymentList(
        data?.data?.advancePaymentList.map((item, index) => {
          return {
            ...item,
            id: index + 1
          };
        })
      );
      setresultData(
        data?.data?.info
          ? [data?.data?.info].map((item, index) => {
              return {
                ...item,
                id: index + 1
              };
            })
          : []
      );
    }
  });

  useEffect(() => {
    refetch();
  }, [date, requestParam, refetch]);

  return (
    <>
      <Title title="CP 정산내역서 조회" />
      <Search setRequestParam={setRequestParam} date={date} setDate={setDate} />
      <Box
        component="form"
        sx={{
          height: "auto",
          width: "100%",
          backgroundColor: "#FFFFFF"
        }}
        noValidate
        autoComplete="off"
      >
        <Typography variant="h6" gutterBottom m={2}>
          1. 정산 안내
        </Typography>
        <DataGridCusutom
          rows={resultData}
          columns={columns}
          loading={isFetching}
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
        />

        <Typography variant="h6" gutterBottom m={2}>
          2-1. 정산 내역
        </Typography>

        <DataGridCusutom
          rows={settlementHistory1}
          columns={settlementHistoryColumns1}
          loading={isFetching}
          rowsPerPageOptions={rowsPerPageOptions}
          pageSize={pageSize1}
          onPageSizeChange={(newPage) => setPageSize1(newPage)}
          pagination
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
        />

        <Typography variant="h6" gutterBottom m={2}>
          2-2. 정산 내역
        </Typography>

        <DataGridCusutom
          rows={settlementHistory2}
          columns={settlementHistoryColumns2}
          loading={isFetching}
          rowsPerPageOptions={rowsPerPageOptions}
          pageSize={pageSize2}
          onPageSizeChange={(newPage) => setPageSize2(newPage)}
          pagination
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
        />

        <Typography variant="h6" gutterBottom m={2}>
          3. 선급 내역 (MG, 선인세, 제작비)
        </Typography>

        <DataGridCusutom
          rows={advancePaymentList}
          columns={advancePaymentColumns}
          rowsPerPageOptions={rowsPerPageOptions}
          pageSize={pageSize3}
          onPageSizeChange={(newPage) => setPageSize3(newPage)}
          pagination
          loading={isFetching}
        />
      </Box>
    </>
  );
}

export default CpSettlementStatementList;
