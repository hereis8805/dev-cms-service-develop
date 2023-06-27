import { getAccountIssuances } from "axios/history/history";
import { dateFormatter, pageSizeDefalut, rowsPerPageOptions } from "common/enum/grid";
import DataGridCusutom from "component/DataGridCusutom";
import MuiModalCustom from "component/ModalCustom";
import moment from "moment";
import { useEffect, useMemo, useRef, useState } from "react";
import { Title } from "react-admin";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import CreateTypeSelect from "resources/infoManage/cp/Modal/CreateTypeSelect";
import { nowDate } from "utils/commonUtils";
import Search from "./Search";

// 상태 (`R`: 반려, `W` : 승인대기, `Y` : 승인, `C` : 취소, `D` : 삭제)
const guStatusVal = (guStatus, id) => {
  let ret = "";
  if (guStatus === "R") {
    ret = "반려 / " + id;
  } else if (guStatus === "W") {
    ret = "승인대기 / " + id;
  } else if (guStatus === "Y") {
    ret = "승인 / " + id;
  } else if (guStatus === "C") {
    ret = "취소 / " + id;
  } else if (guStatus === "D") {
    ret = "삭제 / " + id;
  }
  return ret;
};

const columns = [
  { field: "ROWNUM", headerName: "No.", flex: 0.5, type: "number", align: "center" },
  { field: "GU_STATUS", headerName: "내용", align: "left" },
  { field: "REG_USER_ID", headerName: "계정" },
  {
    field: "REG_DTM",
    headerName: "날짜",
    type: "dateTime",
    valueGetter: ({ value }) => {
      return moment(new Date(value)).format("YYYY-MM-DD HH:mm");
    }
  }
];

function AccountAccessList(props) {
  const [resultData, setresultData] = useState([]);
  const [requestParam, setRequestParam] = useState({ startDate: nowDate, endDate: nowDate });
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

  const { isLoading, refetch } = useQuery(["getAccountIssuances"], () => getAccountIssuances(queryOptions), {
    enabled: false,
    onSuccess: (data) => {
      setCount(data?.headers["x-total-count"]);
      setresultData(
        data?.data?.map((item) => {
          return {
            ...item,
            id: item.GU_IDX,
            ROWNUM: item.ROWNUM,
            GU_STATUS: guStatusVal(item.GU_STATUS, item.GU_USER_ID)
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
      <Title title="계정발급정보" />
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
        // initialState={{
        //   sorting: {
        //     sortModel: [{ field: "id", sort: "asc" }]
        //   }
        // }}
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

export default AccountAccessList;
