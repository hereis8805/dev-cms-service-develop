import AddIcon from "@mui/icons-material/Add";
import { Button, Grid } from "@mui/material";
import { getMailManageTemplates } from "axios/mail/mail";
import { pageSizeDefalut, rowsPerPageOptions } from "common/enum/grid";
import DataGridCusutom from "component/DataGridCusutom";
import { useEffect, useMemo, useState } from "react";
import { Title } from "react-admin";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";

const columns = [
  { field: "ROWNUM", headerName: "템플릿번호", flex: 0.5, type: "number" },
  { field: "GMT_NAME", headerName: "템플릿명" },
  { field: "GMT_SENDER", headerName: "송신이메일" },
  { field: "GMT_TITLE", headerName: "메일제목" }
];

function MailTempleteManageList(props) {
  const [resultData, setresultData] = useState([]);
  const [requestParam, setRequestParam] = useState({ searchKeyword: "", searchType: "" });
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  // const [isPopup, setIsPopup] = useState(false);
  const [pageSize, setPageSize] = useState(pageSizeDefalut);
  const history = useHistory();

  const queryOptions = useMemo(
    () => ({
      // page: page + 1,
      // limit: pageSize,
      ...requestParam
    }),
    [page, pageSize, requestParam]
  );

  const { isLoading, refetch } = useQuery(["getMailManageTemplates"], () => getMailManageTemplates(queryOptions), {
    enabled: false,
    onSuccess: (data) => {
      setCount(data?.headers["x-total-count"]);
      setresultData(
        data?.data?.map((item) => {
          return {
            ...item,
            ROWNUM: parseInt(item.ROWNUM),
            id: item.GMT_IDX
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
      <Title title="메일 템플릿 관리" />
      <Grid container direction="row" justifyContent="end" alignItems="end">
        <Grid item>
          <Button
            variant="text"
            startIcon={<AddIcon />}
            onClick={() => {
              history.push("/mailTempleteCreate");
            }}
          >
            {"등록"}
          </Button>
        </Grid>
      </Grid>
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
        // // paginationMode="server"
        // onPageChange={(newPage) => setPage(newPage)}
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
        columns={columns}
        onRowClick={(e) => {
          history.push(`/mailTempleteCreate/${e.id}`);
        }}
      />
    </>
  );
}

export default MailTempleteManageList;
