import { getDeadlineProcess, getMonthWorks } from "axios/calculation/CalculationMonthly";
import { formatterKo, pageSizeDefalut, rowsPerPageOptions } from "common/enum/grid";
import DataGridCusutom from "component/DataGridCusutom";
import { useEffect, useMemo, useState } from "react";
import { Title } from "react-admin";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { useRecoilState } from "recoil";
import { initSearchMont, searchMonthAtom } from "store/atom";
import { formatFloor } from "utils/commonUtils";
import { formatNumber } from "utils/string";
import Search from "./Search";

const columns = [
  { field: "id", headerName: "No" },
  { field: "IDX", headerName: "IDX", hide: true },
  { field: "ROW_TYPE", headerName: "구분" },
  { field: "GCM_SERIES_NAME", headerName: "작품명" },
  { field: "GCM_MANAGE_ID", headerName: "작품코드" },
  {
    field: "TOTAL_AMOUNT_SUM",
    headerName: "총매출",
    type: "number",
    valueFormatter: ({ value }) => formatterKo.format(value)
  },
  {
    field: "NET_AMOUNT_SUM",
    headerName: "순매출",
    type: "number",
    valueFormatter: ({ value }) => formatterKo.format(value)
  },
  {
    field: "AMOUNT_SUM",
    headerName: "정산액",
    type: "number",
    valueFormatter: ({ value }) => formatterKo.format(value)
  },
  { field: "GC_NAMES", headerName: "CP명" }
];

function List() {
  const [resultData, setresultData] = useState([]);
  // const [requestParam, setRequestParam] = useState({});
  // const [date, setDate] = useState(getToday("yyyy-MM"));
  const [requestParam, setRequestParam] = useRecoilState(searchMonthAtom);
  // const [searchMonth, setSearchMonth] = useRecoilState(searchMonthAtom);
  const [deadline, setDeadline] = useState(false);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(pageSizeDefalut);
  const [grade, setGrade] = useState("");
  const history = useHistory();

  const queryOptions = useMemo(
    () => ({
      // page: page + 1,
      // limit: pageSize,
      ...requestParam?.settleManageWork
      // ...requestParam
      // selectDate: requestParam?.settleManageWork,
    }),
    [requestParam]
  );

  const { isFetching, refetch } = useQuery(["getMonthWorks"], () => getMonthWorks(queryOptions), {
    enabled: false,
    onSuccess: (data) => {
      setDeadline(data?.data?.updateGcdIdxs !== "");
      setCount(data?.headers["x-total-count"]);
      setGrade(data?.data?.grade);
      setresultData(
        data?.data?.list?.map((item, index) => {
          return {
            ...item,
            id: page * pageSize + index + 1
            // TOTAL_AMOUNT_SUM: formatNumber(formatFloor(item.TOTAL_AMOUNT_SUM)),
            // NET_AMOUNT_SUM: formatNumber(formatFloor(item.NET_AMOUNT_SUM)),
            // AMOUNT_SUM: formatNumber(formatFloor(item.AMOUNT_SUM))
          };
        })
      );
    }
  });

  const { refetch: deadlineRefetch } = useQuery(
    ["getDeadlineProcess"],
    () =>
      getDeadlineProcess({
        selectDate: requestParam?.settleManageWork?.selectDate,
        plag: deadline
      }),
    {
      enabled: false,
      onSuccess: (data) => {
        refetch();
      }
    }
  );

  function onHandleDeadline() {
    deadlineRefetch();
  }

  useEffect(() => {
    history.action === "PUSH" && setRequestParam(initSearchMont);
  }, [history, setRequestParam]);

  useEffect(() => {
    refetch();
  }, [page, pageSize, requestParam, refetch]);

  return (
    <>
      <Title title="정산조회_작품별(월별)" />
      <Search
        setRequestParam={setRequestParam}
        requestParam={requestParam}
        onHandleDeadline={onHandleDeadline}
        deadline={deadline}
        grade={grade}
      />
      <DataGridCusutom
        uid="settleManageWork"
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
          history.push(`/workdetail/${e.row.IDX}?selectDate=${requestParam?.settleManageWork?.selectDate}`);
        }}
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
      />
    </>
  );
}

export default List;
