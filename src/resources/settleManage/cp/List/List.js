import { getMonthCps } from "axios/calculation/CalculationMonthly";
import { formatterKo, pageSizeDefalut, rowsPerPageOptions } from "common/enum/grid";
import DataGridCusutom from "component/DataGridCusutom";
import { useEffect, useMemo, useState } from "react";
import { Title } from "react-admin";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { useRecoilState } from "recoil";
import { initSearchMont, searchMonthAtom } from "store/atom";
import Search from "./Search";

const columns = [
  { field: "id", headerName: "No" },
  { field: "ROWNUM", headerName: "ROWNUM", hide: true },
  { field: "GCD_BUSINESS_TYPE", headerName: "구분" },
  { field: "GCD_OWNER_NAME", headerName: "CP명" },
  { field: "GCD_OLD_GROUP", headerName: "CP코드" },
  {
    field: "GRD_TOTAL_AMOUNT",
    headerName: "총매출",
    type: "number",
    valueFormatter: ({ value }) => formatterKo.format(value)
  },
  {
    field: "GRD_NET_AMOUNT",
    headerName: "순매출",
    type: "number",
    valueFormatter: ({ value }) => formatterKo.format(value)
  },
  {
    field: "GCD_AMOUNT",
    headerName: "총정산액",
    type: "number",
    valueFormatter: ({ value }) => formatterKo.format(value)
  },
  { field: "MANAGE_ID_SUM", headerName: "작품수" }
];

function List() {
  const [resultData, setresultData] = useState([]);
  // const [requestParam, setRequestParam] = useState({});
  const [requestParam, setRequestParam] = useRecoilState(searchMonthAtom);
  // const [searchMonth, setSearchMonth] = useRecoilState(searchMonthAtom);
  // const [date, setDate] = useState(getToday("yyyy-MM"));
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(pageSizeDefalut);
  const history = useHistory();

  const queryOptions = useMemo(
    () => ({
      // page: page + 1,
      // limit: pageSize,
      ...requestParam?.settleManageCp
      // ...requestParam
    }),
    [requestParam]
  );

  const { isFetching, refetch } = useQuery(["getMonthCps"], () => getMonthCps(queryOptions), {
    enabled: false,
    onSuccess: (data) => {
      setCount(data?.headers["x-total-count"]);
      setresultData(
        data?.data?.map((item, index) => {
          return {
            ...item,
            id: page * pageSize + index + 1
            // GRD_NET_AMOUNT: formatNumber(formatFloor(item.GRD_NET_AMOUNT)),
            // GRD_TOTAL_AMOUNT: formatNumber(formatFloor(item.GRD_TOTAL_AMOUNT)),
            // GCD_AMOUNT: formatNumber(formatFloor(item.GCD_AMOUNT))
          };
        })
      );
    }
  });

  useEffect(() => {
    refetch();
  }, [page, pageSize, requestParam, refetch]);

  useEffect(() => {
    history.action === "PUSH" && setRequestParam(initSearchMont);
  }, [history, setRequestParam]);

  useEffect(() => {
    console.log("isFetching : ", isFetching);
  }, [isFetching]);

  return (
    <>
      <Title title="정산조회_CP별(월별)" />
      <Search setRequestParam={setRequestParam} requestParam={requestParam} />
      <DataGridCusutom
        uid="settleManageCp"
        rows={resultData}
        columns={columns}
        loading={isFetching}
        pageSize={pageSize}
        onPageSizeChange={(newPage) => {
          setPageSize(newPage);
        }}
        rowsPerPageOptions={rowsPerPageOptions}
        pagination
        // paginationMode="server"
        rowCount={count}
        // onPageChange={(newPage) => setPage(newPage)}
        // page={page}
        onRowClick={(e) => {
          history.push(`/cpdetail/${e.row.GCD_IDX}?selectDate=${requestParam?.settleManageCp?.selectDate}`);
        }}
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
      />
    </>
  );
}

export default List;
