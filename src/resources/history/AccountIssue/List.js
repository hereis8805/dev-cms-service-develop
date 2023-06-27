import { getLoginHistories } from "axios/history/history";
import { pageSizeDefalut, rowsPerPageOptions } from "common/enum/grid";
import DataGridCusutom from "component/DataGridCusutom";
import MuiModalCustom from "component/ModalCustom";
import { format } from "date-fns";
import { useEffect, useMemo, useRef, useState } from "react";
import { Title } from "react-admin";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import CreateTypeSelect from "resources/infoManage/cp/Modal/CreateTypeSelect";
import Search from "./Search";

const columns = [
  { field: "id", headerName: "No.", flex: 0.5 },
  { field: "GLH_STATUS", headerName: "내용", align: "left" },
  { field: "GU_USER_ID", headerName: "계정" },
  {
    field: "GLH_DATE",
    headerName: "날짜"
    /*
    valueGetter: ({ value }) => {
      return moment(new Date(value)).format("YYYY-MM-DD HH:mm");
    }
    */
  }
];

function AccountIssueList(props) {
  console.log("props : ", props);
  const [resultData, setresultData] = useState([]);
  const [requestParam, setRequestParam] = useState({
    startDate: format(new Date(), "yyyy-MM-dd").toString(),
    endDate: format(new Date(), "yyyy-MM-dd").toString()
  });
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [isPopup, setIsPopup] = useState(false);
  const [pageSize, setPageSize] = useState(pageSizeDefalut);
  const file = useRef(null);
  const history = useHistory();

  const queryOptions = useMemo(
    () => ({
      // page: page + 1,
      // limit: pageSize,
      ...requestParam
    }),
    [page, pageSize, requestParam]
  );

  const { isLoading, refetch } = useQuery(["getLoginHistories"], () => getLoginHistories(queryOptions), {
    enabled: false,
    onSuccess: (data) => {
      setCount(data?.headers["x-total-count"]);
      setresultData(
        data?.data?.map((item, index) => {
          return {
            ...item,
            // id: item.GLH_IDX,
            id: page * pageSize + index + 1,
            ROWNUM: item.ROWNUM,
            GLH_DATE: item.GLH_DATE.replace("T", " ").substr(0, 16)
          };
        })
        // .sort((a, b) => new Date(b.GLH_DATE) - new Date(a.GLH_DATE))
      );
    }
  });

  useEffect(() => {
    refetch();
  }, [page, pageSize, requestParam, refetch]);

  return (
    <>
      <Title title="계정접속정보" />
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

export default AccountIssueList;
