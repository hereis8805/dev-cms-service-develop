import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { getMailManageSendHistories, putMailManageTemplates } from "axios/mail/mail";
import { pageSizeDefalut, rowsPerPageOptions } from "common/enum/grid";
import DataGridCusutom from "component/DataGridCusutom";
import FileInput from "component/FormComponents/FormInputFile";
import MuiModalCustom from "component/ModalCustom";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { getToday } from "utils/date";
import Search from "./Search";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { IconButton } from "@mui/material";

import { useForm } from "react-hook-form";

import { postMailManageSendHistories, getMailManageTemplates } from "axios/mail/mail";
import { Title, useNotify } from "react-admin";
import { saveZip } from "utils/commonUtils";

function MailSendManageList(props) {
  const notify = useNotify();
  const [resultData, setresultData] = useState([]);
  const [requestParam, setRequestParam] = useState({ searchKeyword: "", searchType: "" });
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [isPopup, setIsPopup] = useState(false);
  const [date, setDate] = useState(getToday("yyyy-MM"));
  const [gmhIdx, setGmhIdx] = useState("");
  const [gmtIdx, setGmtIdx] = useState("");
  const [updateGmtIdx, setUpdateGmtIdx] = useState("");
  const [pageSize, setPageSize] = useState(pageSizeDefalut);
  const [attachment, setAttachment] = useState([]);
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [refKey, setRefKey] = useState(null);
  const [templateList, setTemplateList] = useState([]);
  const [gmhIdxs, setGmhIdxs] = useState("");
  const [gmhAllIdxs, setGmhAllIdxs] = useState([]);

  const isEmpty3 = (val) => {
    if (
      val === 0 ||
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

  const RenderDate = (value) => {
    return (
      <>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setUpdateGmtIdx("");
            setGmtIdx(value.row.GMT_IDX);
            setGmhIdx(value.row.GMH_IDX);
            setIsPopup(true);
          }}
        >
          편집
        </Button>
      </>
    );
  };

  const downloadFile = (url) => {
    if (url.indexOf(",") !== -1) {
      saveZip("downloadZip", url?.split(","));
    } else {
      const filename = url.split("/")[4];
      fetch(url, { method: "GET" })
        .then((res) => {
          return res.blob();
        })
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          setTimeout((_) => {
            window.URL.revokeObjectURL(url);
          }, 60000);
          a.remove();
        })
        .catch((err) => {
          console.error("err: ", err);
        });
    }
  };

  const RenderDate2 = (value) => {
    return (
      <>
        <IconButton
          aria-label="FileDownloadIcon"
          size="small"
          onClick={(e) => {
            // window.open(value.row.DOWNLOAD, "_blank");
            downloadFile(value.row.DOWNLOAD);
          }}
        >
          <FileDownloadIcon />
        </IconButton>
      </>
    );
  };

  const columns = [
    { field: "id", headerName: "No.", flex: 0.5 },
    { field: "GMT_IDX", headerName: "템플릿번호", flex: 0.5 },
    { field: "GCD_OWNER_NAME", headerName: "CP명" },
    { field: "GCD_OLD", headerName: "CP코드" },
    { field: "GMH_RECEIVER", headerName: "수신 이메일" },
    { field: "GF_FILE_NAME", headerName: "첨부파일" },
    { field: "DOWNLOAD", headerName: "파일 다운로드", renderCell: RenderDate2, type: "boolean" },
    { field: "GMH_STATUS", headerName: "전송상태" },
    { field: "GMH_SEND_DTM", headerName: "전송일자" },
    { field: "GP_PRE_CODE", headerName: "편집", renderCell: RenderDate }
  ];

  const queryOptions = useMemo(
    () => ({
      // page: page + 1,
      // limit: pageSize,
      selectDate: date,
      ...requestParam
    }),
    [page, pageSize, requestParam, date]
  );

  const { isFetching, refetch } = useQuery(
    ["getMailManageSendHistories"],
    () => getMailManageSendHistories(queryOptions),
    {
      enabled: false,
      onSuccess: (data) => {
        let retGmhAllIdxArr = new Array();
        setCount(data?.headers["x-total-count"]);
        setresultData(
          data?.data?.map((item) => {
            retGmhAllIdxArr.push(item.GMH_IDX);

            return {
              id: parseInt(item.GMH_IDX),
              GMT_IDX: item.GMT_IDX,
              GMH_IDX: item.GMH_IDX,
              GCD_OWNER_NAME: item.GCD_OWNER_NAME,
              GCD_OLD: item.GCD_OLD,
              GMH_RECEIVER: item.GMH_RECEIVER,
              GF_FILE_NAME: item.GF_FILE_NAME,
              DOWNLOAD: item.DOWNLOAD,
              GMH_STATUS: getGmhStatusVal(item.GMH_STATUS),
              GMH_SEND_DTM: getParseDate(item.GMH_SEND_DTM)
            };
          })
          // .filter((arr, index, callback) => index === callback.findIndex((t) => t.GMH_IDX === arr.GMH_IDX))
        );
        setGmhAllIdxs(retGmhAllIdxArr.toString());
      }
    }
  );

  const getParseDate = (str) => {
    return str.split(".")[0].replaceAll("T", " ");
  };

  const getGmhStatusVal = (str) => {
    let ret = "대기";
    if (str === "1") {
      ret = "전송";
    } else if (str === "-1") {
      ret = "실패";
    }
    return ret;
  };

  const handleMailManageSendHistories = async (param) => {
    console.log("handleMailManageSendHistories : ", param);
    const formData = new FormData();
    // return null
    // formData.append("uploadFile", param.uploadFile);
    for (let i = 0; i < param?.uploadFile.length; i++) {
      formData.append("file" + String(i), param?.uploadFile[i]);
    }
    // param?.uploadFile?.forEach((element, index) => {
    //   formData.append("file" + String(index), element);
    // });
    const data = await postMailManageSendHistories(param.gmhIdx, param.gmtIdx, formData);
    if (data?.status === 200) {
      notify("파일 첨부 성공", { type: "success" });
      setRefKey(data?.data?.GF_REF_IDX);
      refetch();
    } else {
      notify("파일 첨부 실패", { type: "error" });
    }
  };

  const handleDeleteHistory = async () => {
    const param = {
      GF_REF_IDX: refKey,
      GMH_IDX: gmhIdx
    };
    const data = await putMailManageTemplates(param);
    if (data?.status === 200) {
      notify("원복 되었습니다.", { type: "success" });
    } else {
      notify("원복 실패", { type: "error" });
    }
  };

  const handleMailManageTemplates = async () => {
    const data = await getMailManageTemplates();
    const dateList = data.data.map((item) => item.GMT_IDX);
    const duplicateList = dateList.filter((val, idx) => {
      return dateList.indexOf(val) === idx; //값이 처음나오는 배열 인덱스와 현재 인덱스가 같으면 포함
    });
    setTemplateList(duplicateList);
  };

  useEffect(() => {
    refetch();
    handleMailManageTemplates();
  }, [page, pageSize, requestParam, date, refetch]);

  useEffect(() => {
    setAttachment([]);
  }, [isPopup]);

  return (
    <>
      <Title title="메일 발송 관리" />
      <Search
        setRequestParam={setRequestParam}
        date={date}
        setDate={setDate}
        gmhIdxs={gmhIdxs}
        gmhAllIdxs={gmhAllIdxs}
      />
      <DataGridCusutom
        rows={resultData}
        rowCount={count}
        loading={isFetching}
        onrow
        // page={page}
        pageSize={pageSize}
        rowsPerPageOptions={rowsPerPageOptions}
        onSelectionModelChange={(itm) => setGmhIdxs(itm.toString())}
        pagination
        checkboxSelection
        onPageSizeChange={(newPage) => setPageSize(newPage)}
        // paginationMode="server"
        // onPageChange={(newPage) => setPage(newPage)}
        experimentalFeatures={{ newEditingApi: true }}
        columns={columns}
      />
      <MuiModalCustom
        isOpen={isPopup}
        onClose={(e) => {
          setIsPopup(false);
        }}
        title={"편집"}
      >
        <Grid>
          <FormControl sx={{ m: 1, minWidth: 220 }}>
            <InputLabel id="create-type">템플릿 번호</InputLabel>
            <Select
              labelId="create-type"
              value={isEmpty3(updateGmtIdx) ? gmtIdx : updateGmtIdx}
              label="템플릿번호"
              onChange={(e) => {
                //setGmtIdx(e.target.value);
                setUpdateGmtIdx(e.target.value);
              }}
            >
              <MenuItem value={"1"}>1</MenuItem>
              <MenuItem value={"2"}>2</MenuItem>
              <MenuItem value={"3"}>3</MenuItem>
              <MenuItem value={"4"}>4</MenuItem>
              <MenuItem value={"5"}>5</MenuItem>
              <MenuItem value={"6"}>6</MenuItem>
              <MenuItem value={"7"}>7</MenuItem>
              <MenuItem value={"8"}>8</MenuItem>
              <MenuItem value={"9"}>9</MenuItem>
              <MenuItem value={"10"}>10</MenuItem>
              {/*templateList &&
                templateList.map((row) => {
                  <MenuItem key={row.GMT_IDX} value={row.GMT_IDX}>
                    {row.GMT_IDX}
                  </MenuItem>;
                })*/}
            </Select>
          </FormControl>
        </Grid>
        {/* <FileInput
          sx={{ m: 1, minWidth: 220 }}
          name="GMT_NAME"
          label="파일등록"
          setAttachment={setAttachment}
          attachment={attachment}
          setAttachmentFile={setAttachmentFile}
        /> */}
        {attachment.length ? (
          attachment.map((item) => (
            <FileInput
              sx={{ m: 1, minWidth: 220 }}
              name="GMT_NAME"
              label="파일등록"
              setAttachment={setAttachment}
              attachment={item}
              setAttachmentFile={setAttachmentFile}
            />
          ))
        ) : (
          <FileInput
            sx={{ m: 1, minWidth: 220 }}
            name="GMT_NAME"
            label="파일등록"
            setAttachment={setAttachment}
            attachment={attachment}
            setAttachmentFile={setAttachmentFile}
          />
        )}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={(e) => {
              const putGmtIdx = isEmpty3(updateGmtIdx) ? gmtIdx : updateGmtIdx;
              const putUploadFile = isEmpty3(attachmentFile) ? "" : attachmentFile;
              // console.log("attachmentFile : ", attachmentFile);
              // return null;

              handleMailManageSendHistories({
                gmhIdx: gmhIdx,
                gmtIdx: putGmtIdx,
                uploadFile: putUploadFile
              });

              // alert("저장이 완료되었습니다.");
              // setIsPopup(false);
              // window.location.reload();
            }}
          >
            등록
          </Button>
          &nbsp;&nbsp;
          <Button
            variant="contained"
            color="primary"
            onClick={(e) => {
              if (refKey) {
                handleDeleteHistory();
                setRefKey(null);
                refetch();
              }
              setIsPopup(false);
            }}
          >
            취소
          </Button>
        </Box>
      </MuiModalCustom>
    </>
  );
}

export default MailSendManageList;
