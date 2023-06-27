import React, { useCallback, useState } from "react";
import { useNotify, fetchUtils, Title } from "react-admin";
import { Box, Button } from "@material-ui/core";
import { format, parse } from "date-fns";
import useToggle from "hooks/useToggle";
import s3Upload from "utils/s3Upload";
import DatePicker from "component/DatePicker";
import FileUploader from "component/FileUploader";
import * as XLSX from "@sheet/core";
import Loader from "component/Loader";
import CAL_RAW_SHEET_HEADER from "./CalRawSheetHeader";
import { saveFilesZip } from "utils/commonUtils";

const BUCKET_NAME = "jhb-test-bucket";
const BUCKET_FOLDER_NAME = "Calc-Data";

function CalculationProcessStep1() {
  const notify = useNotify();
  const [isLoading, onToggleLoading] = useToggle(false);
  const [date, setDate] = useState(format(new Date(), "yyyy-MM"));
  const [preDate, setPreDate] = useState(format(new Date(), "yyyy-MM"));
  const [file, setFile] = useState(null);
  const [wb, setWb] = useState(null);
  const [files, setFiles] = useState(null);
  const [ws, setWs] = useState(null);
  const [emptyListCnt, setEmptyListCnt] = useState(null);
  let resultFile;

  // 정산 파일 업로드
  const handleDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];

    if (file?.length <= 0) {
      alert("file?.length <= 0");
      return;
    }

    // 로딩 on
    onToggleLoading();

    // 파일을 전역 변수에 할당
    setFile(file);

    /**
     * 파일 이벤트 핸들링
     */
    const reader = new FileReader();

    // abort (en-US) 이벤트의 핸들러. 이 이벤트는 읽기 동작이 중단 될 때마다 발생합니다.
    reader.onabort = () => {
      notify("중단", { type: "error" });
    };

    // error (en-US) 이벤트의 핸들러. 이 이벤트는 읽기 동작에 에러가 생길 때마다 발생합니다.
    reader.onerror = () => {
      notify("에러", { type: "error" });
    };

    // loadstart (en-US) 이벤트 핸들러. 이 이벤트는 읽기 동작이 실행 될 때마다 발생합니다.
    reader.onloadstart = () => {
      notify("파일 로드 중", { type: "info" });
    };

    // load 이벤트의 핸들러. 이 이벤트는 읽기 동작이 성공적으로 완료 되었을 때마다 발생합니다.
    reader.onload = (e) => {
      const wb = XLSX.read(e.target.result, { type: "binary" });
      setWb(wb);
      notify("성공", { type: "success" });
      // 로딩 off
      onToggleLoading();
      return;
    };

    reader.readAsBinaryString(file);
  }, []);

  // 정산월 변경
  function handleChangeDate(date) {
    const parseDate = parse(date, "yyyy-MM", new Date());
    const oneMonthAgo = new Date(parseDate.setMonth(parseDate.getMonth() - 1));
    setDate(date);
    setPreDate(format(oneMonthAgo, "yyyy-MM"));
  }

  // 파일 삭제
  function handleDeleteFile() {
    setFile(null);
  }

  async function checkAllContentsExist() {
    // "정산내역" 시트의 데이터를 json 형태로 변환

    const ws = XLSX.utils.sheet_to_json(wb.Sheets["정산내역"], { header: CAL_RAW_SHEET_HEADER });

    /**
     * 컨텐츠 번호와 플랫폼 코드로 V_CP를 조회하여 데이터가 없는 경우
     */
    let emptyAry = [];
    for (let i = 2, cnt = ws.length; i < cnt; i++) {
      // 콘솔에 진행상황 표출 ex) 345 / 7364
      console.log(`컨텐츠 검증 중: ${i - 1}/${cnt - 2}`);

      const row = ws[i];

      const gpgOldDetail = row["플랫폼 상세코드"];
      const gcmManageId = row["컨텐츠번호"];

      // 해당 ROW의 컨텐츠 번호, 플랫폼 코드에 해당하는 CP 목록 추출
      const vPriority = await fetchUtils
        .fetchJson(`${process.env.REACT_APP_API_PATH}/pg/v_priority`, {
          headers: new Headers({ Accept: "application/json", "x-auth-token": getCookie("token") }),
          method: "POST",
          body: JSON.stringify({
            MANAGE_ID: gcmManageId,
            PLATFORM_CODE: gpgOldDetail
          })
        })
        .then((res) => {
          return JSON.parse(res.body);
        })
        .catch((e) => {
          throw e;
        });

      if (vPriority.length > 0) continue;

      emptyAry.push(row);
    }

    if (emptyAry.length == 0) return;

    // 새로운 엑셀 파일 생성
    const resultWorkBook = XLSX.utils.book_new();
    // 데이터가 저장된 시트 파일을 새로운 엑셀 파일의 시트로 설정
    XLSX.utils.book_append_sheet(resultWorkBook, XLSX.utils.json_to_sheet(emptyAry, { header: CAL_RAW_SHEET_HEADER }));
    // 엑셀파일 로컬로 다운로드
    XLSX.writeFile(resultWorkBook, `Fail List_${format(new Date(), "yyyyMMddhhmmss").toString()}.xlsx`);

    throw "컨텐츠 누락으로 정산이 불가합니다. 파일을 확인해 주세요.";
  }

  async function doCalc() {
    /**
     * DB에서 설정한 정산월 이후 데이터를 삭제
     */
    await fetchUtils
      .fetchJson(`${process.env.REACT_APP_API_PATH}/pg/call_proc_deletedata`, {
        headers: new Headers({ Accept: "application/json" }),
        method: "POST",
        body: JSON.stringify({
          ACTUAL_MONTH: preDate
        })
      })
      .then((res) => {
        return JSON.parse(res.body);
      })
      .catch((e) => {
        throw e;
      });

    // "정산내역" 시트의 데이터를 json 형태로 변환
    const ws = XLSX.utils.sheet_to_json(wb.Sheets["정산내역"], { header: CAL_RAW_SHEET_HEADER });
    const emptyList = [];

    for (let i = 1, cnt = ws.length; i < cnt; i++) {
      // 콘솔에 진행상황 표출 ex) 345 / 7364
      console.log(`${i}/${cnt - 1}`);

      const row = ws[i];
      // CP, 플랫폼 정보가 없는 row를 담을 배열 생성

      if (row["컨텐츠번호"] == "CM02046") row["컨텐츠번호"] = "CM02032";

      const gpgOldDetail = row["플랫폼 상세코드"];
      let gcmManageId = row["컨텐츠번호"];
      const grossSales = row["총매출(구매금액+대여금액-취소금액)"];
      const grossSalesMinusAppMarketFee = row["총매출 - 앱마켓 수수료"];
      const netSales = row["외화수수료 보정 순매출"];

      // if (gcmManageId != 'NV034687' && gcmManageId != 'NV034756' && gcmManageId != 'NV034892') continue;

      /**
       * 해당 ROW의 컨텐츠 번호, 플랫폼 코드에 해당하는 CP 목록 추출
       */
      const vPriority = await fetchUtils
        .fetchJson(`${process.env.REACT_APP_API_PATH}/pg/v_priority`, {
          headers: new Headers({ Accept: "application/json", "x-auth-token": getCookie("token") }),
          method: "POST",
          body: JSON.stringify({
            // 'GUBUN': 'CP',
            MANAGE_ID: gcmManageId,
            PLATFORM_CODE: gpgOldDetail
          })
        })
        .then((res) => {
          return JSON.parse(res.body);
        })
        .catch((e) => {
          throw e;
        });

      if (vPriority.length == 0) emptyList.push(row);

      // vPriority.forEach(v => {
      //   if (gcmManageId == 'CM01126') {
      //     v['GUBUN'] = 'CP';
      //     row['정산 타입'] = 'F-type';
      //   }
      // });

      // F타입 예외처리
      for (let i = 0; i < vPriority.length; i++) {
        if (vPriority[i]["GC_SETTLEMENT_TYPE"] == "F-type") {
          vPriority.forEach((v) => (v["GUBUN"] = "CP"));
          row["정산 타입"] = "F-type";
          break;
        }
      }

      // // 제작비 처리
      // for (let i = 0; i < vPriority.length; i++) {
      //   const cpGroup = vPriority[i]['CP_GROUP'];
      //   if (cpGroup != '' && cpGroup != 'Null') {
      //     vPriority.forEach(v => v['GUBUN'] = 'CP');
      //     row['정산 타입'] = 'F-type';
      //     break;
      //   }
      // }

      const cpList = vPriority.filter((v) => v["GUBUN"] == "CP");

      let topPrioritySettlementRate = 0;
      let secondPrioritySettlementRate = 0;
      let topPriorityRealBalance = 0;
      cpList.forEach((v) => {
        if (v["SETTLEMENT_PRIORITY"] == 1) {
          if (v["PREPAID_PRIORITY"] == 0) {
            topPrioritySettlementRate = Number(v["SETTLEMENT_RATE"]);
            topPriorityRealBalance = Number(v["REAL_BALANCE"]);
          } else {
            row["1순위 정산율 raw"] = Number(v["SETTLEMENT_RATE"]);
          }
        } else if (v["SETTLEMENT_PRIORITY"] == 2) {
          secondPrioritySettlementRate = Number(v["SETTLEMENT_RATE"]);
        }
      });

      // CP 목록 순회
      for (let j = 0, cnt = cpList.length; j < cnt; j++) {
        const cpName = cpList[j]["CP_NAME"];
        const cpCode = cpList[j]["CP_CODE"];
        const gcType = cpList[j]["GC_TYPE"];
        const saleType = cpList[j]["SALE_TYPE"];
        const settlementPriority = cpList[j]["SETTLEMENT_PRIORITY"];
        const gcSettlementType = cpList[j]["GC_SETTLEMENT_TYPE"];
        const gcdBusinessType = cpList[j]["GCD_BUSINESS_TYPE"];

        row[`CP${gcType} 정산순위`] = settlementPriority;

        const ppList = vPriority.filter((v) => v["GUBUN"] == "PP" && v["CP_CODE"] == cpCode);

        let realBalance = cpList[j]["REAL_BALANCE"],
          oldPrepaidSeq = "",
          settlementRate = Number(cpList[j]["SETTLEMENT_RATE"]),
          cpGroup = "";

        row[`CP${gcType} 정산률 raw`] = settlementRate;
        row[`CP${gcType} 일반정산 정산률`] =
          settlementPriority != 1 && gcSettlementType != "B-type"
            ? settlementRate - settlementRate * topPrioritySettlementRate
            : settlementRate;

        if (ppList.length > 0) {
          ppList.forEach((v) => {
            if (v["REAL_BALANCE"] > 0) {
              realBalance = v["REAL_BALANCE"];
              cpGroup = v["CP_GROUP"];
              oldPrepaidSeq = v["OLD_PREPAID_SEQ"];
              // cp group이 존재(제작비 케이스)하는 경우 개인별 정산서 생성 시 후처리 예정
              settlementRate = cpGroup != "" && cpGroup != "Null" ? settlementRate : Number(v["SETTLEMENT_RATE"]);
              return false;
            }
          });
        }

        row[`CP 그룹`] = cpGroup;

        let settlementRateAfterCalc = 0;

        if (cpList.length == 3 && row["정산 타입"] == "F-type" && settlementPriority == 2) {
          settlementRateAfterCalc =
            settlementRate - settlementRate * (topPrioritySettlementRate + row["1순위 정산율 raw"]);
        } else {
          settlementRateAfterCalc =
            settlementPriority != 1 && gcSettlementType != "B-type"
              ? settlementRate - settlementRate * topPrioritySettlementRate
              : settlementRate;
        }

        if (gcSettlementType == "C-type" && settlementPriority == 2 && realBalance > 0) {
          settlementRateAfterCalc = 0;
        } else if (gcSettlementType == "B-type") {
          settlementRateAfterCalc = row[`CP${gcType} 정산률 raw`];
        } else if (gcSettlementType == "D-type" || gcSettlementType == "E-type") {
          if (settlementPriority == 2 && !oldPrepaidSeq) {
            settlementRateAfterCalc = row[`CP${gcType} 정산률 raw`];
          } else if (settlementPriority == 3) {
            settlementRateAfterCalc =
              (1 -
                (topPrioritySettlementRate +
                  (secondPrioritySettlementRate - secondPrioritySettlementRate * topPrioritySettlementRate))) *
              settlementRate;
          }
        }

        // 정산금 계산
        const amt =
          saleType == "총매출"
            ? settlementRateAfterCalc * grossSales
            : saleType == "순매출"
            ? settlementRateAfterCalc * netSales
            : settlementRateAfterCalc * grossSalesMinusAppMarketFee;

        // CP1 ~ CP4 값을 채움
        row[`CP${gcType}`] = cpName;
        row[`CP${gcType} 코드`] = cpCode;
        row[`CP${gcType} 정산코드/선급원가 코드`] = oldPrepaidSeq;
        row[`CP${gcType}정산기준`] = saleType;
        row[`CP${gcType} 정산율`] = `${(settlementRate * 100).toFixed(2)}%`;
        row[`CP${gcType} 선차감 제외 정산률`] = `${(settlementRateAfterCalc * 100).toFixed(2)}%`;
        row[`CP${gcType} 정산금`] = Math.round(amt);
        row[`CP${gcType} 정산 구분`] = amt == 0 ? "D해당없음" : oldPrepaidSeq ? "선급원가 차감" : "일반정산";
        row[`CP${gcType} 비고`] = "";
        row[`CP${gcType} 구분`] = gcdBusinessType;

        row[`CP${gcType} 선급금`] = Number(realBalance);
        row[`CP${gcType} 선차감 제외 정산률 raw`] = settlementRateAfterCalc;
      }
    }

    /**
     * 선급금이 모두 차감된 경우 이후 건은 일반정산 정산율로 변경 처리
     */
    let arySortedByCpIdContent = {};
    for (let i = 1, cnt = ws.length; i < cnt; i++) {
      for (let j = 1; j <= 4; j++) {
        const cpCode = ws[i][`CP${j} 코드`];
        const manageId = ws[i][`컨텐츠번호`];

        const arySortedByCpIdContentKey = `${cpCode}#${manageId}#${j}`;

        if (!cpCode) continue;

        // ws[i][`CP 선차감 제외 정산률`] = ws[i][`CP${j} 선차감 제외 정산률 raw`];
        // ws[i][`CP 정산률`] = ws[i][`CP${j} 정산률 raw`];
        // ws[i][`CP 정산금`] = ws[i][`CP${j} 정산금`];
        // ws[i][`CP 선급금`] = ws[i][`CP${j} 선급금`];
        // ws[i][`CP 코드`] = ws[i][`CP${j} 코드`];

        !arySortedByCpIdContent[arySortedByCpIdContentKey]
          ? (arySortedByCpIdContent[arySortedByCpIdContentKey] = [ws[i]])
          : arySortedByCpIdContent[arySortedByCpIdContentKey].push(ws[i]);
      }
    }

    // let arySortedByCpIdContentPrepaidSeq = {}
    // for (let i = 1, cnt = ws.length; i < cnt; i++) {
    //   for (let j = 1; j <= 4; j++) {
    //     const cpName = ws[i][`CP${j}`];
    //     const cpCode = ws[i][`CP${j} 코드`];
    //     const manageId = ws[i]['컨텐츠번호'];
    //     const platformCode = ws[i]['플랫폼 코드'];
    //     const prepaidSeq = ws[i][`CP${j} 정산코드/선급원가 코드`];
    //     const gcdBusinessType = ws[i][`CP${j} 구분`];

    //     const arySortedByCpIdContentPrepaidSeqKey = `${cpCode}#${prepaidSeq}`;

    //     if (!cpName || !cpCode) continue;

    //     ws[i][`CP 선차감 제외 정산률`] = ws[i][`CP${j} 선차감 제외 정산률 raw`];
    //     ws[i][`CP 정산금`] = ws[i][`CP${j} 정산금`];
    //     ws[i][`CP 선급금`] = ws[i][`CP${j} 선급금`];
    //     ws[i][`CP 코드`] = ws[i][`CP${j} 코드`];
    //     ws[i][`CP 타입`] = j;

    //     !arySortedByCpIdContentPrepaidSeq[arySortedByCpIdContentPrepaidSeqKey] ? arySortedByCpIdContentPrepaidSeq[arySortedByCpIdContentPrepaidSeqKey] = [ws[i]] : arySortedByCpIdContentPrepaidSeq[arySortedByCpIdContentPrepaidSeqKey].push(ws[i]);
    //   }
    // }

    for (const key in arySortedByCpIdContent) {
      const cpType = key.split("#")[2];
      arySortedByCpIdContent[key].sort((a, b) => b[`CP${cpType} 정산금`] - a[`CP${cpType} 정산금`]);
      let realBalance = Math.round(arySortedByCpIdContent[key][0][`CP${cpType} 선급금`]);
      const origRealBalance = realBalance;
      if (!realBalance) continue;
      for (let i = 0; i < arySortedByCpIdContent[key].length; i++) {
        const v = arySortedByCpIdContent[key][i];
        const cpGroup = v["CP 그룹"];
        const amt = Number(v[`CP${cpType} 정산금`]);
        if (origRealBalance < amt) {
          ws.forEach((_v) => {
            if (_v[`매출 코드`] == v[`매출 코드`]) {
              _v[`CP${cpType} 선차감 제외 정산률`] = `${(v[`CP${cpType} 일반정산 정산률`] * 100).toFixed(2)}%`;
              _v[`CP${cpType} 정산금`] = Math.round(
                (v[`CP${cpType} 정산금`] / v[`CP${cpType} 선차감 제외 정산률 raw`]) * v[`CP${cpType} 일반정산 정산률`]
              );
            }
          });
        } else {
          realBalance -= amt;
          if (cpGroup != "" && cpGroup != "Null") {
            // if (realBalance < 0) {
            //   ws.forEach(_v => {
            //     if (_v[`매출 코드`] == v[`매출 코드`]) {
            //       _v[`CP${cpType} 선차감 제외 정산률`] = v[`CP${cpType} 선차감 제외 정산률 raw`];
            //       _v[`CP${cpType} 정산금`] = Math.round(v[`CP${cpType} 정산금`] / v[`CP${cpType} 선차감 제외 정산률`] * v[`CP${cpType} 선차감 제외 정산률 raw`]);
            //     }
            //   })
            // } else {
            //   if (v[`CP${cpType} 정산순위`] != 1) {
            //     ws.forEach(_v => {
            //       if (_v[`매출 코드`] == v[`매출 코드`]) {
            //         _v[`CP${cpType} 선차감 제외 정산률`] = '0%';
            //         _v[`CP${cpType} 정산금`] = 0;
            //       }
            //     })
            //   }
            // }
          } else {
            if (realBalance < 0) {
              ws.forEach((_v) => {
                if (_v[`매출 코드`] == v[`매출 코드`]) {
                  _v[`CP${cpType} 선차감 제외 정산률`] = `${(v[`CP${cpType} 일반정산 정산률`] * 100).toFixed(2)}%`;
                  _v[`CP${cpType} 정산금`] = Math.round(
                    (v[`CP${cpType} 정산금`] / v[`CP${cpType} 선차감 제외 정산률 raw`]) *
                      v[`CP${cpType} 일반정산 정산률`]
                  );
                  _v[`CP${cpType} 정산코드/선급원가 코드`] = "";
                  _v[`CP${cpType} 정산 구분`] = "일반정산";
                }
              });
            }
          }
        }
      }
    }

    /**
     * 정산 후 파일 로컬로 다운로드
     */
    const resultWorkBook = XLSX.utils.book_new();
    ws.splice(0, 1);
    XLSX.utils.book_append_sheet(resultWorkBook, XLSX.utils.json_to_sheet(ws, { header: CAL_RAW_SHEET_HEADER }));
    resultFile = new File(
      [XLSX.write(resultWorkBook, { type: "array" })],
      `result_${format(new Date(), "yyyyMMddhhmmss")}.xlsx`,
      {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      }
    );
    // XLSX.writeFile(resultWorkBook, `result_${format(new Date(), "yyyyMMddhhmmss")}.xlsx`); // 파일다운로드

    // await fetchUtils
    //   .fetchJson(`${process.env.REACT_APP_API_PATH}/pg/insert_gp_raw_file`, {
    //     headers: new Headers({ Accept: "application/json", "x-auth-token": getCookie("token") }),
    //     method: "POST",
    //     body: JSON.stringify({
    //       GRF_ACTUAL_DATE: date,
    //       GRF_UPLOAD_COUNT: ws.length,
    //       GRF_NORMAL_COUNT: ws.length - emptyList.length,
    //       GRF_ABNORMAL_COUNT: emptyList.length
    //     })
    //   })
    //   .then((res) => {
    //     return JSON.parse(res.body);
    //   })
    //   .catch((e) => {
    //     throw e;
    //   });

    return { ws, emptyList };
  }

  async function createIndividualCalcFile(ws) {
    let arySortedByCpId = {};
    let arySortedByCpIdContent = {};
    let arySortedByCpIdPlatform = {};
    let arySortedByCpIdPrepaidSeq = {};
    for (let i = 0, cnt = ws.length; i < cnt; i++) {
      for (let j = 1; j <= 4; j++) {
        const cpName = ws[i][`CP${j}`];
        const cpCode = ws[i][`CP${j} 코드`];
        const manageId = ws[i]["컨텐츠번호"];
        const platformCode = ws[i]["플랫폼 코드"];
        const prepaidSeq = ws[i][`CP${j} 정산코드/선급원가 코드`];
        const gcdBusinessType = ws[i][`CP${j} 구분`];

        const arySortedByCpIdKey = `${gcdBusinessType}#${cpName}#${cpCode}#${j}`;
        const arySortedByCpIdContentKey = `${cpCode}#${manageId}#${j}`;
        const arySortedByCpIdPlatformKey = `${cpCode}#${platformCode}#${j}`;
        const arySortedByCpIdPrepaidSeqKey = `${cpCode}#${prepaidSeq}#${j}`;

        if (!cpCode) continue;

        !arySortedByCpId[arySortedByCpIdKey]
          ? (arySortedByCpId[arySortedByCpIdKey] = [ws[i]])
          : arySortedByCpId[arySortedByCpIdKey].push(ws[i]);
        !arySortedByCpIdContent[arySortedByCpIdContentKey]
          ? (arySortedByCpIdContent[arySortedByCpIdContentKey] = [ws[i]])
          : arySortedByCpIdContent[arySortedByCpIdContentKey].push(ws[i]);
        !arySortedByCpIdPlatform[arySortedByCpIdPlatformKey]
          ? (arySortedByCpIdPlatform[arySortedByCpIdPlatformKey] = [ws[i]])
          : arySortedByCpIdPlatform[arySortedByCpIdPlatformKey].push(ws[i]);
        !arySortedByCpIdPrepaidSeq[arySortedByCpIdPrepaidSeqKey]
          ? (arySortedByCpIdPrepaidSeq[arySortedByCpIdPrepaidSeqKey] = [ws[i]])
          : arySortedByCpIdPrepaidSeq[arySortedByCpIdPrepaidSeqKey].push(ws[i]);
      }
    }

    let files = [];
    const thisYear = date.split("-")[0];
    const thisMonth = date.split("-")[1];
    const newDate = new Date(date);
    const nextMonth = (newDate.getMonth() + 2).toString();
    const lastDayOfNextMonth = new Date(newDate.getFullYear(), newDate.getMonth() + 2, 0).getDate();
    const lastMonth = format(new Date(newDate.getFullYear(), newDate.getMonth() - 1), "yyyy-MM");

    for (const key in arySortedByCpId) {
      const gcdBusinessType = key.split("#")[0];
      const cpName = key.split("#")[1];
      const cpCode = key.split("#")[2];
      let cpGroup = "";

      // , ['', '구분', '작품명', '매출액', '원작료', '선차감 MG', '정산율', '후차감 MG', '정산금']
      const a = [];
      for (const key in arySortedByCpIdContent) {
        if (cpCode != key.split("#")[0]) continue;
        const cpType = key.split("#")[2];

        let grossSales = 0;
        let sum = 0;
        let title = "";
        let contentType = "";
        let rate = 0;
        let prepaidSeq = "";
        let rawRate = 0;
        arySortedByCpIdContent[key].forEach((v) => {
          prepaidSeq = v[`CP${cpType} 정산코드/선급원가 코드`];
          title = v["제목"];
          contentType = v["작품 유형"];
          rate = v[`CP${cpType} 선차감 제외 정산률`];
          grossSales += v["외화수수료 보정 순매출"];
          sum += v[`CP${cpType} 정산금`];
          rawRate = v[`CP${cpType} 정산률 raw`];
        });

        a.push([prepaidSeq, contentType, title, grossSales, "", "", rate, "", sum, rawRate]);
      }

      console.log(a);

      // , ['', '플랫폼명', '결제방법', '매출액', '원작료', '선차감 MG', '정산율', '후차감 MG', '정산금']
      const b = [];
      for (const key in arySortedByCpIdPlatform) {
        if (cpCode != key.split("#")[0]) continue;
        const cpType = key.split("#")[2];

        let platformName = "";
        let grossSales = 0;
        let rate = 0;
        let sum = 0;
        arySortedByCpIdPlatform[key].forEach((v) => {
          platformName = v["서비스"];
          grossSales += v["외화수수료 보정 순매출"];
          rate = v[`CP${cpType} 선차감 제외 정산률`];
          sum += v[`CP${cpType} 정산금`];
        });

        b.push(["", platformName, "", grossSales, "", "", rate, "", sum]);
      }

      let grossSales = 0;
      let sum = 0;
      let secondSheetData = [];

      for (let j = 0, cnt = arySortedByCpId[key].length; j < cnt; j++) {
        const cpType = key.split("#")[3];
        cpGroup = arySortedByCpId[key][j]["CP 그룹"];

        grossSales += arySortedByCpId[key][j]["외화수수료 보정 순매출"];
        sum += arySortedByCpId[key][j][`CP${cpType} 정산금`];

        secondSheetData.push({
          순번: j + 1,
          판매월: lastMonth, // To do: 정산 전 월 계산
          서비스: arySortedByCpId[key][j]["서비스"],
          제목: arySortedByCpId[key][j]["제목"],
          저자: arySortedByCpId[key][j]["저자"],
          출판사: arySortedByCpId[key][j]["출판사"],
          "구매 건수": arySortedByCpId[key][j]["구매 건수"],
          "구매 금액": arySortedByCpId[key][j]["구매 금액"],
          "대여 건수": arySortedByCpId[key][j]["대여 건수"],
          "대여 금액": arySortedByCpId[key][j]["대여 금액"],
          "자유이용권 건수": arySortedByCpId[key][j]["자유이용권 건수"],
          "자유이용권 금액": arySortedByCpId[key][j]["자유이용권 금액"],
          "취소 건수": arySortedByCpId[key][j]["취소 건수"],
          "취소 금액": arySortedByCpId[key][j]["취소 금액"],
          "결제수수료 보정": arySortedByCpId[key][j]["결제수수료 보정액"],
          "총매출(구매금액+대여금액-취소금액)": arySortedByCpId[key][j]["총매출(구매금액+대여금액-취소금액)"],
          "플랫폼 수령금액(총매출액-결제수수료)": arySortedByCpId[key][j]["플랫폼 수령금액(총매출액-결제수수료)"],
          "순매출(플랫폼 수령금액-제휴사 수수료)": arySortedByCpId[key][j]["순매출(플랫폼 수령금액-제휴사 수수료)"],
          "저작권자 정산율": arySortedByCpId[key][j][`CP${cpType} 선차감 제외 정산률`],
          "저작권자 정산금": arySortedByCpId[key][j][`CP${cpType} 정산금`],
          "작품 유형 구분": arySortedByCpId[key][j][`작품 유형`],
          작품코드: arySortedByCpId[key][j][`컨텐츠번호`]
        });
      }

      const thirdSheetData = [
        [
          "내용",
          "대상플랫폼",
          "관리코드",
          "정산월",
          "매출반영월",
          "추가금액",
          "",
          "",
          "차감금액",
          "",
          "",
          "잔여금액(C-F)",
          "비고"
        ],
        [
          "",
          "",
          "",
          "",
          "",
          "전월이월금액(A)",
          "당월추가금액(B)",
          "합계(C:A-B)",
          "차감대상금액(D)",
          "비용(E)",
          "합계(F:D+E)",
          "",
          ""
        ]
      ];

      const c = [];
      for (const key in arySortedByCpIdPrepaidSeq) {
        if (cpCode != key.split("#")[0]) continue;
        const prepaidSeq = key.split("#")[1];
        if (prepaidSeq) c.push(prepaidSeq);
      }

      const d = [];
      for (let i = 0, cnt = c.length; i < cnt; i++) {
        /**
         * 해당 ROW의 컨텐츠 번호, 플랫폼 코드에 해당하는 CP 목록 추출
         */
        const aryPrepaidMonthly = await fetchUtils
          .fetchJson(`${process.env.REACT_APP_API_PATH}/pg/gp_prepaid_monthly`, {
            headers: new Headers({ Accept: "application/json" }),
            method: "POST",
            body: JSON.stringify({
              GPM_PREPAID_SEQ: c[i]
            })
          })
          .then((res) => {
            return JSON.parse(res.body);
          })
          .catch((e) => {
            throw e;
          });

        let gpName = "";
        let gpmPreviousContract = 0;
        let gpmContract = 0;
        let gpmPrepaidSeq = "";
        let gpmOldPrepaid = "";
        aryPrepaidMonthly.forEach((v) => {
          gpName = v["GP_NAME"];
          gpmPrepaidSeq = v["GPM_PREPAID_SEQ"];
          gpmOldPrepaid = v["GPM_OLD_PREPAID"];
          const gpmActualMonth = v["GPM_ACTUAL_MONTH"];
          if (gpmActualMonth == lastMonth) {
            gpmPreviousContract = Math.round(v["GPM_PREVIOUS_CONTACT"]);
            gpmContract = Math.round(v["GPM_CONTACT"]);
          }
          thirdSheetData.push([
            gpName,
            ,
            gpmPrepaidSeq,
            ,
            gpmActualMonth,
            Math.round(v["GPM_PREVIOUS_REAL"]),
            Math.round(v["GPM_REAL"]),
            Math.round(v["GPM_PREVIOUS_REAL"]) + Math.round(v["GPM_REAL"]),
            Math.round(v["GPM_REAL_DEDUCTION"]),
            ,
            ,
            Math.round(v["GPM_REAL_BALANCE"])
          ]);
        });
        let gpmContactDeduction = 0;
        const beforeDeduction = gpmPreviousContract + gpmContract;
        let correctionValue = 0;
        a.forEach((v) => {
          if (v[0] == gpmOldPrepaid) {
            gpmContactDeduction = v[8];
            if (cpGroup != "" && cpGroup != "Null") correctionValue = beforeDeduction * v[9];
          }
        });
        if (beforeDeduction > 0) {
          d.push([
            "",
            gpName,
            gpmPreviousContract,
            gpmContract,
            gpmContactDeduction,
            beforeDeduction - gpmContactDeduction,
            correctionValue
          ]);
          if (cpGroup != "" && cpGroup != "Null") {
            await fetchUtils
              .fetchJson(`${process.env.REACT_APP_API_PATH}/pg/update_gp_prepaid_monthly`, {
                headers: new Headers({ Accept: "application/json" }),
                method: "POST",
                body: JSON.stringify({
                  GPM_OLD_PREPAID: gpmOldPrepaid,
                  GPM_ACTUAL_MONTH: lastMonth,
                  GPM_CONTACT_DEDUCTION: correctionValue * 2
                })
              })
              .then((res) => {
                return JSON.parse(res.body);
              })
              .catch((e) => {
                throw e;
              });
          } else {
            await fetchUtils
              .fetchJson(`${process.env.REACT_APP_API_PATH}/pg/update_gp_prepaid_monthly`, {
                headers: new Headers({ Accept: "application/json" }),
                method: "POST",
                body: JSON.stringify({
                  GPM_OLD_PREPAID: gpmOldPrepaid,
                  GPM_ACTUAL_MONTH: lastMonth,
                  GPM_CONTACT_DEDUCTION: gpmContactDeduction
                })
              })
              .then((res) => {
                return JSON.parse(res.body);
              })
              .catch((e) => {
                throw e;
              });
          }
        }
      }

      const totalDeduction = d.reduce((acc, cur) => acc + Number(cur[4]), 0);

      // To do: 제작비 후처리 예정
      // 제작비 케이스인 경우
      if (cpGroup != "" && cpGroup != "Null" && d.length > 0) {
        const correctionValue = d[0][6];
        sum -= correctionValue;
        // 제작비 케이스가 아닌 경우
      } else {
        sum -= totalDeduction;
      }

      let tax = sum > 0 && sum > 33400 ? Math.floor((sum * 0.03) / 10) * 10 + Math.floor((sum * 0.003) / 10) * 10 : 0;
      tax = tax - (tax % 10); // 1의 자리 절삭

      const firstSheetData = [
        ,
        ["", `${thisYear}년 ${thisMonth}월 정산`],
        ,
        ,
        ["", "1. 정산안내"],
        ["", "구분", "", "정산금", "재정산", "정산금(최종)", "세금", "실지급액", "지급예정일"],
        [
          "",
          `${thisYear}년 ${thisMonth}월 정산`,
          "",
          sum,
          "",
          "",
          tax,
          sum - tax,
          `${thisYear}년 ${nextMonth}월 ${lastDayOfNextMonth}일`
        ],
        ,
        ["", "2-1. 정산내역"],
        ["", "구분", "작품명", "매출액", "원작료", "선차감 MG", "정산율", "후차감 MG", "정산금"],
        ,
        ["", "2-2. 정산내역"],
        ["", "플랫폼명", "결제방법", "매출액", "원작료", "선차감 MG", "정산율", "후차감 MG", "정산금"],
        ,
        ["", "3. 선급내역 (MG, 선인세, 제작비)"],
        ["", "내용", "전월이월금액(A)", "추가금액(B)", "당월차감금액(C)", "잔액(A+B-C)"],
        ,
        ["", "- 정산에 대한 상세 내역은 하단의 상세내역 시트에서 확인할 수 있습니다."],
        ["", "- 정산관련문의 : tax@mstoryhub.com"]
      ];

      // 불필요한 데이터 제거
      a.forEach((v) => {
        v[0] = "";
        v[9] = "";
      });
      d.forEach((v) => {
        v[6] = "";
      });

      firstSheetData.splice(10, 0, ...a);
      firstSheetData.splice(13 + a.length, 0, ...b);
      firstSheetData.splice(16 + a.length + b.length, 0, ...d);

      // , ['', '', '', grossSales, '', '', '', '', sum]

      // , ['', '', '', '', '', '', '', '', '']

      const firstSheet = XLSX.utils.aoa_to_sheet(firstSheetData);

      // merge 적용
      const merge = [{ s: { r: 1, c: 1 }, e: { r: 1, c: 8 } }];
      firstSheet["!merges"] = merge;

      const secondSheet = XLSX.utils.json_to_sheet(secondSheetData);

      const thirdSheet = XLSX.utils.json_to_sheet(thirdSheetData, { skipHeader: true });

      /**
       * 정산서 시트 스타일 적용
       */
      // MERGE
      firstSheet["!merges"] = [
        { s: { r: 1, c: 1 }, e: { r: 1, c: 8 } },
        { s: { r: 5, c: 1 }, e: { r: 5, c: 2 } },
        { s: { r: 6, c: 1 }, e: { r: 6, c: 2 } },
        { s: { r: 10 + a.length, c: 1 }, e: { r: 10 + a.length, c: 2 } },
        { s: { r: 14 + a.length + b.length, c: 1 }, e: { r: 14 + a.length + b.length, c: 2 } },
        { s: { r: 17 + a.length + b.length, c: 1 }, e: { r: 17 + a.length + b.length, c: 4 } },
        { s: { r: 18 + a.length + b.length + d.length, c: 1 }, e: { r: 18 + a.length + b.length + d.length, c: 4 } }
      ];
      d.forEach((v, i) => {
        firstSheet["!merges"].push({
          s: { r: 18 + a.length + b.length + i, c: 1 },
          e: { r: 18 + a.length + b.length + i, c: 4 }
        });
      });
      // 00년 0월 정산
      XLSX.utils.sheet_set_range_style(firstSheet, "B2:I2", { alignment: { horizontal: "center" }, bold: true });
      // 1. 정산안내
      XLSX.utils.sheet_set_range_style(firstSheet, "B6:I7", {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
        incol: { style: "thin" },
        inrow: { style: "thin" },
        alignment: { horizontal: "center" }
      });
      XLSX.utils.sheet_set_range_style(firstSheet, "D7:H7", { z: "#,##", alignment: { horizontal: "right" } });
      // 2-1. 정산내역
      XLSX.utils.sheet_set_range_style(firstSheet, `B10:I${11 + a.length}`, {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
        incol: { style: "thin" },
        inrow: { style: "thin" },
        alignment: { horizontal: "center" }
      });
      XLSX.utils.sheet_set_range_style(firstSheet, `D11:F${11 + a.length}`, {
        z: "#,##",
        alignment: { horizontal: "right" }
      });
      XLSX.utils.sheet_set_range_style(firstSheet, `H11:I${11 + a.length}`, {
        z: "#,##",
        alignment: { horizontal: "right" }
      });
      // 2-2. 정산내역
      XLSX.utils.sheet_set_range_style(firstSheet, `B${14 + a.length}:I${15 + a.length + b.length}`, {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
        incol: { style: "thin" },
        inrow: { style: "thin" },
        alignment: { horizontal: "center" }
      });
      XLSX.utils.sheet_set_range_style(firstSheet, `D${15 + a.length}:F${15 + a.length + b.length}`, {
        z: "#,##",
        alignment: { horizontal: "right" }
      });
      XLSX.utils.sheet_set_range_style(firstSheet, `H${15 + a.length}:I${15 + a.length + b.length}`, {
        z: "#,##",
        alignment: { horizontal: "right" }
      });
      // 3. 선급내역 (MG, 선인세, 제작비)
      XLSX.utils.sheet_set_range_style(
        firstSheet,
        `B${18 + a.length + b.length}:I${19 + a.length + b.length + d.length}`,
        {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
          incol: { style: "thin" },
          inrow: { style: "thin" },
          alignment: { horizontal: "center" }
        }
      );
      XLSX.utils.sheet_set_range_style(
        firstSheet,
        `F${19 + a.length + b.length}:I${19 + a.length + b.length + d.length}`,
        { z: "#,##", alignment: { horizontal: "right" } }
      );
      // WIDTH
      firstSheet["!sheetFormat"] = { col: { wpx: 114 } };
      if (!firstSheet["!cols"]) firstSheet["!cols"] = [];
      firstSheet["!cols"][0] = { auto: 1 };

      /**
       * 상세내역 시트 스타일 적용
       */
      XLSX.utils.sheet_set_range_style(secondSheet, `A1:W1`, {
        alignment: { vertical: "center" },
        fgColor: { rgb: "#F2F2F2" }
      });
      XLSX.utils.sheet_set_range_style(secondSheet, `P1:R1`, { alignment: { wrapText: true } });
      XLSX.utils.sheet_set_range_style(secondSheet, `A1:W${1 + secondSheetData.length}`, {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
        incol: { style: "thin" },
        inrow: { style: "thin" },
        alignment: { horizontal: "center" }
      });
      XLSX.utils.sheet_set_range_style(secondSheet, `G2:R${1 + secondSheetData.length}`, {
        z: "#,##",
        alignment: { horizontal: "right" }
      });
      XLSX.utils.sheet_set_range_style(secondSheet, `T2:T${1 + secondSheetData.length}`, {
        z: "#,##",
        alignment: { horizontal: "right" }
      });
      // WIDTH
      if (!secondSheet["!cols"]) secondSheet["!cols"] = [];
      secondSheet["!cols"][15] = { wpx: 220 };
      secondSheet["!cols"][16] = { wpx: 220 };
      secondSheet["!cols"][17] = { wpx: 220 };

      /**
       * 선급차감내역 시트 스타일 적용
       */
      // MERGE
      thirdSheet["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } },
        { s: { r: 0, c: 1 }, e: { r: 1, c: 1 } },
        { s: { r: 0, c: 2 }, e: { r: 1, c: 2 } },
        { s: { r: 0, c: 3 }, e: { r: 1, c: 3 } },
        { s: { r: 0, c: 4 }, e: { r: 1, c: 4 } },
        { s: { r: 0, c: 5 }, e: { r: 0, c: 7 } },
        { s: { r: 0, c: 8 }, e: { r: 0, c: 10 } },
        { s: { r: 0, c: 11 }, e: { r: 1, c: 11 } },
        { s: { r: 0, c: 12 }, e: { r: 1, c: 12 } }
      ];
      XLSX.utils.sheet_set_range_style(thirdSheet, `A1:M${thirdSheetData.length}`, {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
        incol: { style: "thin" },
        inrow: { style: "thin" },
        alignment: { horizontal: "center" }
      });
      XLSX.utils.sheet_set_range_style(thirdSheet, `F3:L${thirdSheetData.length}`, {
        z: "#,##",
        alignment: { horizontal: "right" }
      });
      // WIDTH
      XLSX.utils.sheet_set_range_style(thirdSheet, `A1:M1`, {
        alignment: { vertical: "center" },
        fgColor: { rgb: "#F2F2F2" }
      });
      XLSX.utils.sheet_set_range_style(thirdSheet, `F2:K2`, {
        alignment: { vertical: "center" },
        fgColor: { rgb: "#F2F2F2" }
      });
      if (!thirdSheet["!cols"]) thirdSheet["!cols"] = [];
      thirdSheet["!cols"][5] = { wpx: 200 };
      thirdSheet["!cols"][6] = { wpx: 200 };
      thirdSheet["!cols"][7] = { wpx: 200 };
      thirdSheet["!cols"][8] = { wpx: 200 };
      thirdSheet["!cols"][9] = { wpx: 200 };
      thirdSheet["!cols"][10] = { wpx: 200 };

      // 새로운 엑셀 파일 생성
      const resultWorkBook = XLSX.utils.book_new();
      // 데이터가 저장된 시트 파일을 새로운 엑셀 파일의 시트로 설정
      XLSX.utils.book_append_sheet(resultWorkBook, firstSheet, "정산서");
      XLSX.utils.book_append_sheet(resultWorkBook, secondSheet, "상세내역");
      XLSX.utils.book_append_sheet(resultWorkBook, thirdSheet, "선급차감내역");

      const fileName =
        gcdBusinessType == "개인"
          ? `PER#${cpName} 작가님_${thisYear}년${thisMonth}월정산.xlsx`
          : `COM#${cpName}_${thisYear}년${thisMonth}월정산.xlsx`;

      const modifiedFile = new File([XLSX.write(resultWorkBook, { type: "array" })], fileName, {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });

      files.push({ file: modifiedFile, code: cpCode });

      // XLSX.writeFile(resultWorkBook, `${fileName}`); // 파일 다운로드
    }

    const downloadFiles = files.concat({ file: resultFile, code: "" });

    saveFilesZip(downloadFiles, `${date}_정산데이터`);
    return files;
  }

  const getCookie = (key) => {
    key = new RegExp(key + "=([^;]*)"); // 쿠키들을 세미콘론으로 구분하는 정규표현식 정의
    return key.test(document.cookie) ? unescape(RegExp.$1) : ""; // 인자로 받은 키에 해당하는 키가 있으면 값을 반환
  };

  async function changeDB() {
    /**
     * INSERT GP_RAW_DATA
     */
    for (let i = 0, cnt = ws.length; i < cnt; i++) {
      console.log(`changeDB ${i + 1}/${cnt}`);

      const gcmManageId = ws[i]["컨텐츠번호"];

      // if (gcmManageId != 'CM01275') continue;

      // 정산 Raw Data 입력
      await fetchUtils
        .fetchJson(`${process.env.REACT_APP_API_PATH}/pg/insert_gp_raw_data`, {
          headers: new Headers({ Accept: "application/json", "x-auth-token": getCookie("token") }),
          method: "POST",
          body: JSON.stringify(ws[i])
        })
        .then((res) => {
          return JSON.parse(res.body);
        })
        .catch((e) => {
          throw e;
        });

      /**
       * INSERT GP_CALCULATE_DATA
       */
      for (let j = 1; j <= 4; j++) {
        const gcdCpCode = ws[i][`CP${j} 코드`];

        if (!gcdCpCode) continue;

        await fetchUtils
          .fetchJson(`${process.env.REACT_APP_API_PATH}/pg/insert_gp_calculate_data`, {
            headers: new Headers({ Accept: "application/json", "x-auth-token": getCookie("token") }),
            method: "POST",
            body: JSON.stringify({
              GCD_MANAGE_ID: ws[i]["컨텐츠번호"] || "",
              GCD_OLD_DETAIL: ws[i]["플랫폼 상세코드"] || "",
              GCD_CP_SEQ: j,
              GCD_CP_CODE: gcdCpCode,
              GCD_SETTLEMENT_TYPE: ws[i][`CP${j} 정산 구분`] || "",
              GCD_SETTLEMENT_RATE: ws[i][`CP${j} 선차감 제외 정산률 raw`] || 0,
              GCD_AMOUNT: ws[i][`CP${j} 정산금`] || 0,
              GCD_SALE_MONTH: ws[i]["판매월"] || "",
              GCD_OLD_PREPAID: ws[i][`CP${j} 정산코드/선급원가 코드`] || ""
            })
          })
          .then((res) => {
            return JSON.parse(res.body);
          })
          .catch((e) => {
            throw e;
          });
      }
    }
  }

  async function uploadFileToAWSS3() {
    try {
      for (let i = 0, cnt = files.length; i < cnt; i++) {
        console.log(`uploadFileToAWSS3 ${i + 1}/${cnt}`);
        const bucket = `${BUCKET_NAME}/${date}-${files[i].file.name.split("#")[0]}`;
        const bucketName = `${date}-${files[i].file.name.split("#")[0]}`;
        const key = files[i].file.name.split("#")[1];
        const result = await s3Upload({
          file: files[i].file,
          bucket,
          key
        });
        if (!result.success) {
          throw new Error();
        }
        await fetchUtils
          .fetchJson(`${process.env.REACT_APP_API_PATH}/pg/insert_gp_file`, {
            headers: new Headers({ Accept: "application/json", "x-auth-token": getCookie("token") }),
            method: "POST",
            body: JSON.stringify({
              GF_REF_IDX: files[i].file.name.split("#")[1],
              GF_FILE_PATH: `/${bucketName}`,
              GF_FILE_NAME: key,
              GF_FILE_REAL: key,
              CP_CODE: files[i].code,
              GF_DESCRIPTION: "",
              GRF_ACTUAL_DATE: date,
              GRF_UPLOAD_COUNT: ws.length,
              GRF_NORMAL_COUNT: ws.length - emptyListCnt.length,
              GRF_ABNORMAL_COUNT: emptyListCnt.length
            })
          })
          .then((res) => {
            return JSON.parse(res.body);
          })
          .catch((e) => {
            throw e;
          });
      }
      notify("파일 업로드 완료", { type: "success" });
    } catch (err) {
      notify("통합 정산 파일 업로드에 실패하였습니다", { type: "error" });
    }
  }

  async function handleStep1() {
    // Loader Start
    onToggleLoading();

    try {
      /** pre validation start */
      // if (!file) { notify("통합 정산 파일을 업로드해주세요", { type: "warning" }); return; }
      if (!file) {
        throw "통합 정산 파일을 업로드해주세요";
      }
      if (!wb.Sheets["정산내역"]) {
        throw "정산내역 시트가 없습니다.";
      }
      /** pre validation end */

      /**
       * 데이터 누락 체크
       */
      const checkAllContentsExistStart = performance.now();
      // await checkAllContentsExist();
      const checkAllContentsExistEnd = performance.now();

      /**
       * 정산 처리
       */
      const doCalcStart = performance.now();
      const { ws, emptyList } = await doCalc();
      setEmptyListCnt(emptyList);
      const doCalcEnd = performance.now();

      setWs(ws);

      /**
       * 개인별 정산서 생성
       */
      const createIndividualCalcFileStart = performance.now();
      const files = await createIndividualCalcFile(ws);
      const createIndividualCalcFileEnd = performance.now();

      setFiles(files);

      /**
       * 속도 측정
       */
      console.log(`checkAllContentsExist - ${checkAllContentsExistEnd - checkAllContentsExistStart}ms`);
      console.log(`doCalc - ${doCalcEnd - doCalcStart}ms`);
      console.log(`createIndividualCalcFile - ${createIndividualCalcFileEnd - createIndividualCalcFileStart}ms`);
    } catch (e) {
      notify(e, { type: "warning" });
      // notify(e, { type: "error", autoHideDuration: 10000 });
    } finally {
      // Loader End
      onToggleLoading();
    }
  }

  async function handleStep2() {
    // Loader Start
    onToggleLoading();

    try {
      /** pre validation start */
      if (!files) {
        notify("정산을 완료해주세요", { type: "warning" });
        return;
      }
      /** pre validation end */

      /**
       * DB 데이터 변경
       */
      const changeDBStart = performance.now();
      await changeDB();
      const changeDB4End = performance.now();

      /**
       * AWS S3 업로드
       */
      const uploadFileToAWSS3Start = performance.now();
      await uploadFileToAWSS3();
      const uploadFileToAWSS3End = performance.now();

      /**
       * 속도 측정
       */
      console.log(`changeDB - ${changeDB4End - changeDBStart}ms`);
      console.log(`uploadFileToAWSS3 - ${uploadFileToAWSS3End - uploadFileToAWSS3Start}ms`);
    } catch (e) {
      notify(e, { type: "warning" });
      // notify(e, { type: "error", autoHideDuration: 10000 });
    } finally {
      // Loader End
      onToggleLoading();
    }
  }

  return (
    <>
      {isLoading && <Loader />}
      <Title title="정산처리" />
      <Box sx={{ mt: 3, mb: 3, flexGrow: 1 }}>
        <DatePicker
          label="정산월"
          value={date}
          onChange={handleChangeDate}
          format="yyyy-MM"
          views={["year", "month"]}
        />
      </Box>
      <FileUploader multiple={false} files={file} onDrop={handleDrop} onDeleteFile={handleDeleteFile} />
      <Box sx={{ mt: 1 }} textAlign="center">
        <Button variant="contained" color="primary" onClick={handleStep1}>
          정산
        </Button>
      </Box>
      <Box sx={{ mt: 3 }} textAlign="center">
        <Button variant="contained" color="primary" onClick={handleStep2}>
          AWS S3 업로드
        </Button>
      </Box>
    </>
  );
}

export default CalculationProcessStep1;
