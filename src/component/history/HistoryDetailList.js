import { useEffect, useMemo, useRef, useState } from "react";
import { pageSizeDefalut, rowsPerPageOptions } from "common/enum/grid";
import DataGridCusutom from "component/DataGridCusutom";
import { useQuery } from "react-query";

import { getHistoryDetailList } from "../../axios/history/history";

const columns = [
  { field: "GH_IDX", headerName: "No.", flex: 0.5 },
  {
    field: "GH_DATA",
    headerName: "내용",
    align: "left",
    flex: 3,
    renderCell: (params) => (
      <div
        dangerouslySetInnerHTML={{
          __html: params.value
        }}
      />
    )
  },
  { field: "GH_MENU_NAME", headerName: "메뉴이름" },
  { field: "REG_DTM", headerName: "날짜" }
];

function HistoryDetailList(props) {
  const { menuName, ghRefIdx } = props;

  const [resultData, setresultData] = useState([]);
  const [requestParam, setRequestParam] = useState({});
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(pageSizeDefalut);

  const getParseDate = (str) => {
    return str.split(".")[0].replaceAll("T", " ");
  };

  const queryOptions = useMemo(
    () => ({
      menuName,
      ghRefIdx,
      // page: page + 1,
      // limit: pageSize,
      ...requestParam
    }),
    [page, pageSize, requestParam]
  );

  const { isLoading, refetch } = useQuery(["getHistoryDetailList"], () => getHistoryDetailList(queryOptions), {
    enabled: false,
    retry: 0,
    onSuccess: (data) => {
      setCount(data?.headers["x-total-count"]);
      setresultData(
        data?.data?.map((item) => {
          return {
            id: item.GH_IDX,
            GH_IDX: item.GH_IDX,
            GH_DATA: item.GH_DATA,
            GH_MENU_NAME: item.GH_MENU_NAME,
            REG_DTM: getParseDate(item.REG_DTM)
          };
        })
      );
    }
  });

  useEffect(() => {
    refetch();
  }, [page, pageSize, requestParam, refetch]);

  return (
    <div>
      <DataGridCusutom
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
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
        columns={columns}
      />
    </div>
  );
}
export default HistoryDetailList;
