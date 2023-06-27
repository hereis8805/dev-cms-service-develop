import AddIcon from "@mui/icons-material/Add";
import { Button, Grid } from "@mui/material";
import { getAccountsList, getAccountsListGrade } from "axios/user/user";
import { pageSizeDefalut, rowsPerPageOptions } from "common/enum/grid";
import DataGridCusutom from "component/DataGridCusutom";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { Title } from "react-admin";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import Search from "./Search";

function UserList(props) {
  const [resultData, setresultData] = useState([]);
  const [requestParam, setRequestParam] = useState({ searchKeyword: "", searchType: "" });
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(pageSizeDefalut);
  const [grade, setGrade] = useState("");
  const history = useHistory();

  const columns = [
    { field: "ROWNUM", headerName: "No.", flex: 0.5 },
    { field: "GU_USER_ID", headerName: "아이디", flex: 0.5 },
    { field: "GU_GRADE", headerName: "회원구분" },
    { field: "GU_NAME", headerName: "이름" },
    { field: "GU_EMAIL", headerName: "이메일" },
    { field: "GU_DESCRIPTION", headerName: "기타정보" },
    {
      field: "REG_DTM",
      headerName: "생성일",
      valueGetter: ({ value }) => {
        return moment(new Date(value)).format("YYYY-MM-DD HH:mm");
      }
    }
  ];

  const queryOptions = useMemo(
    () => ({
      // page: page + 1,
      // limit: pageSize,
      ...requestParam
    }),
    [page, pageSize, requestParam]
  );

  const getGcmTypeCodeVal = (gcmTypeCode) => {
    let retVal = "";

    if (gcmTypeCode === "S") {
      retVal = "슈퍼관리자";
    } else if (gcmTypeCode === "M") {
      retVal = "담당자";
    } else if (gcmTypeCode === "C") {
      retVal = "CP";
    }

    return retVal;
  };

  const { isLoading, refetch } = useQuery(["getAccountsList"], () => getAccountsList(queryOptions), {
    enabled: false,
    onSuccess: (data) => {
      setCount(data?.headers["x-total-count"]);
      setresultData(
        data?.data?.map((item) => {
          return {
            ...item,
            id: parseInt(item.GU_IDX),
            ROWNUM: parseInt(item.ROWNUM),
            GU_GRADE: getGcmTypeCodeVal(item.GU_GRADE)
          };
        })
      );
    }
  });

  const headers = columns.map((item) => {
    return { label: item.headerName, key: item.field };
  });

  const handleGetAccountsListGrade = async () => {
    await getAccountsListGrade()
      .then((res) => {
        setGrade(res.data);
      })
      .catch((e) => {
        throw e;
      });
  };

  useEffect(() => {
    handleGetAccountsListGrade();
    refetch();
  }, [page, pageSize, requestParam, refetch]);

  return (
    <>
      <Title title="계정 리스트" />
      {grade === "S" && (
        <Grid container direction="row" justifyContent="end" alignItems="end">
          <Grid item>
            <Button
              variant="text"
              startIcon={<AddIcon />}
              onClick={() => {
                history.push(`/userCreate`);
              }}
            >
              {"등록"}
            </Button>
          </Grid>
        </Grid>
      )}
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
        onRowClick={(e) => history.push(`/userDetail/${e.id}`)}
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
        columns={columns}
      />
    </>
  );
}

export default UserList;
