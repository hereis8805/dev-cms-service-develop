import AddIcon from "@mui/icons-material/Add";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Button, Grid, Tooltip } from "@mui/material";
import { getWorkList, getCsvExport } from "axios/information/work";
import { pageSizeDefalut, rowsPerPageOptions } from "common/enum/grid";
import DataGridCusutom from "component/DataGridCusutom";
import MuiModalCustom from "component/ModalCustom";
import { useEffect, useMemo, useRef, useState } from "react";
import { Title } from "react-admin";
import { CSVLink } from "react-csv";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import CreateTypeSelect from "resources/infoManage/cp/Modal/CreateTypeSelect";
import { getTimestamp } from "utils/commonUtils";
import Search from "./Search";

const columns = [
  { field: "id", headerName: "No", flex: 0.5 },
  { field: "IDX", headerName: "IDX", hide: true },
  {
    field: "ROW_TYPE",
    headerName: "구분",
    flex: 0.5,
    description: "단일/그룹"
  },
  {
    field: "GCM_TYPE_CODE",
    headerName: "유형",
    flex: 0.5,
    description: "소설/만화/이모티콘/오디오북/웹툰단행본/메타버스"
  },
  { field: "GCM_SERIES_NAME", headerName: "작품명" },
  { field: "GCM_MANAGE_ID", headerName: "작품코드" },
  { field: "GC_NAMES", headerName: "CP명" }
];

function InfoManageWorkList(props) {
  const [resultData, setresultData] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [requestParam, setRequestParam] = useState({ searchKeyword: "", searchType: "" });
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(pageSizeDefalut);
  const [isPopup, setIsPopup] = useState(false);
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

  const getGcmTypeCodeVal = (gcmTypeCode) => {
    let retVal = "";

    if (gcmTypeCode === "N") {
      retVal = "소설";
    } else if (gcmTypeCode === "C") {
      retVal = "만화";
    } else if (gcmTypeCode === "E") {
      retVal = "이모티콘";
    } else if (gcmTypeCode === "A") {
      retVal = "오디오북";
    } else if (gcmTypeCode === "W") {
      retVal = "웹툰단행본";
    } else if (gcmTypeCode === "M") {
      retVal = "메타버스";
    }

    return retVal;
  };

  const { isFetching, refetch } = useQuery(["getWorkList"], () => getWorkList(queryOptions), {
    enabled: false,
    onSuccess: (data) => {
      setCount(data?.headers["x-total-count"]);
      setresultData(
        data?.data?.map((item, index) => {
          return {
            ...item,
            id: page * pageSize + index + 1,
            GCM_TYPE_CODE: getGcmTypeCodeVal(item.GCM_TYPE_CODE)
          };
        })
      );
      handleExcelDown(queryOptions);
    }
  });

  const handleExcelDown = async (queryOptions) => {
    await getCsvExport(queryOptions)
      .then((res) => {
        setExcelData(
          res.data?.map((item, index) => {
            return {
              ...item,
              id: page * pageSize + index + 1,
              GCM_TYPE_CODE: getGcmTypeCodeVal(item.GCM_TYPE_CODE)
            };
          })
        );
      })
      .catch(() => {
        throw new Error("Network error");
      });
  };

  const headers = columns.map((item) => {
    return { label: item.headerName, key: item.field };
  });

  useEffect(() => {
    handleExcelDown(queryOptions);
    refetch();
  }, [page, pageSize, requestParam, refetch]);

  return (
    <>
      <Title title="작품관리" />
      <Grid container direction="row" justifyContent="end" alignItems="end">
        <Grid item>
          <Button
            variant="text"
            startIcon={<AddIcon />}
            // disabled={!deadline}
            onClick={() => {
              setIsPopup(true);
            }}
          >
            {"등록"}
          </Button>
          <Button variant="text" startIcon={<FileDownloadIcon />} onClick={() => file.current.link.click()}>
            내보내기
          </Button>
          <div style={{ display: "none" }}>
            <CSVLink
              ref={file}
              data={excelData}
              headers={headers}
              filename={`work-${getTimestamp()}.csv`}
              className="hidden"
            />
          </div>
        </Grid>
      </Grid>
      <Search setRequestParam={setRequestParam} />
      <DataGridCusutom
        rows={resultData}
        rowCount={count}
        loading={isFetching}
        onrow
        // page={page}
        pageSize={pageSize}
        rowsPerPageOptions={rowsPerPageOptions}
        pagination
        onPageSizeChange={(newPage) => setPageSize(newPage)}
        // paginationMode="server"
        // onPageChange={(newPage) => setPage(newPage)}
        onRowClick={(e) =>
          history.push(
            `/infoManageWorkDetail/${e.row.IDX}?createType=${e.row?.ROW_TYPE === "단일" ? "single" : "multi"}`
          )
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

export default InfoManageWorkList;
