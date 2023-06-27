import { getHistoriesMain } from "axios/history/history";
import { pageSizeDefalut, rowsPerPageOptions } from "common/enum/grid";
import DataGridCusutom from "component/DataGridCusutom";
import MuiModalCustom from "component/ModalCustom";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { Title } from "react-admin";
import { useQuery } from "react-query";
import CreateTypeSelect from "resources/infoManage/cp/Modal/CreateTypeSelect";
import { nowDate } from "utils/commonUtils";
import Search from "./Search";

const columns = [
  { field: "ROWNUM", headerName: "No.", flex: 0.5, type: "number", align: "center" },
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
  { field: "REG_USER_ID", headerName: "계정" },
  {
    field: "REG_DTM",
    headerName: "날짜",
    valueGetter: ({ value }) => {
      return moment(new Date(value)).format("YYYY-MM-DD HH:mm");
    }
  }
];

function WorkHistroyList(props) {
  const [resultData, setresultData] = useState([]);
  const [requestParam, setRequestParam] = useState({ startDate: nowDate, endDate: nowDate });
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [isPopup, setIsPopup] = useState(false);
  const [pageSize, setPageSize] = useState(pageSizeDefalut);

  const queryOptions = useMemo(
    () => ({
      // page: page + 1,
      // limit: pageSize,
      ...requestParam
    }),
    [page, pageSize, requestParam]
  );

  const { isLoading, refetch } = useQuery(["getHistoriesMain"], () => getHistoriesMain(queryOptions), {
    enabled: false,
    retry: 0,
    onSuccess: (data) => {
      setCount(data?.headers["x-total-count"]);
      setresultData(
        data?.data?.map((item) => {
          return {
            ROWNUM: parseInt(item.ROWNUM),
            id: item.GH_IDX,
            ...item
          };
        })
      );
    }
  });

  useEffect(() => {
    refetch();
  }, [page, pageSize, requestParam, refetch]);

  return (
    <>
      <Title title="작업내역" />
      <Search setRequestParam={setRequestParam} />
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

export default WorkHistroyList;
