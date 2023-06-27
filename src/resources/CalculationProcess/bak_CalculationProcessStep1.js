import React, { useCallback, useState } from "react";
import { useNotify, fetchUtils } from "react-admin";
import { Box, Button } from "@material-ui/core";
import { format } from "date-fns";
import useToggle from "hooks/useToggle";
import s3Upload from "utils/s3Upload";
import DatePicker from "component/DatePicker";
import FileUploader from "component/FileUploader";
import { read, writeFile, utils } from "xlsx";
import Loader from "component/Loader";
import CAL_RAW_SHEET_HEADER from "./CalRawSheetHeader";

const BUCKET_NAME = "jhb-test-bucket";
const BUCKET_FOLDER_NAME = "Calc-Data";

function CalculationProcessStep1() {
  const notify = useNotify();
  const [isLoading, onToggleLoading] = useToggle(false);
  const [date, setDate] = useState(format(new Date(), "yyyy-MM"));
  const [file, setFile] = useState(null);
  const [wb, setWb] = useState(null);

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
    reader.onabort = () => {notify("중단", { type: "error" });};

    // error (en-US) 이벤트의 핸들러. 이 이벤트는 읽기 동작에 에러가 생길 때마다 발생합니다.
    reader.onerror = () => {notify("에러", { type: "error" });};

    // loadstart (en-US) 이벤트 핸들러. 이 이벤트는 읽기 동작이 실행 될 때마다 발생합니다.
    reader.onloadstart = () => {notify("정산 내역 읽는 중", { type: "info" });};

    // load 이벤트의 핸들러. 이 이벤트는 읽기 동작이 성공적으로 완료 되었을 때마다 발생합니다.
    reader.onload = (e) => {
      const wb = read(e.target.result, { type: "binary" });
      // console.log(file.path);
      setWb(wb);
      notify("성공", { type: "success" });
      // 로딩 off
      onToggleLoading();
      return;
    };

    reader.readAsBinaryString(file);
  },[]);

  // 정산월 변경
  function handleChangeDate(date) {
    setDate(date);
  }

  // 파일 삭제
  function handleDeleteFile() {
    setFile(null);
  }

  async function doCalc() {
    // "정산내역" 시트의 데이터를 json 형태로 변환
    const ws = utils.sheet_to_json(wb.Sheets["정산내역"], {header: CAL_RAW_SHEET_HEADER});
    
    // 정산내역 시트 row 순회
    const currentBalance = {};

    for (let i = 1, cnt = ws.length; i < cnt; i++) {
      // 콘솔에 진행상황 표출 ex) 345 / 7364
      console.log(`${i}/${cnt - 1}`);

      const row = ws[i];

      const gpgOldDetail = row["플랫폼 상세코드"];
      const gcmManageId = row["컨텐츠번호"];
      const grossSales = row['총매출(구매금액+대여금액-취소금액)'];
      const grossSalesMinusAppMarketFee = row['총매출 - 앱마켓 수수료'];
      const netSales = row['외화수수료 보정 순매출'];

      // 해당 ROW의 컨텐츠 번호, 플랫폼 코드에 해당하는 CP 목록 추출
      const cpList = await fetchUtils.fetchJson(
        `${process.env.REACT_APP_API_PATH}/pg/v_cp`
        , {
            headers: new Headers({Accept: "application/json"})
            , method: "POST"
            , body: JSON.stringify({
                'GC_MANAGE_ID': gcmManageId
                , 'GPG_OLD_DETAIL': gpgOldDetail
              })
          }
      )
      .then(res => { return JSON.parse(res.body); })
      .catch(e => { throw e; });

      // CP 목록 순회
      for (let j = 0, cnt = cpList.length; j < cnt; j++) {
        const gcName = cpList[j]['GC_NAME']; // 저작권자
        const gcOld = cpList[j]['GC_OLD'];
        const gcSalesType = cpList[j]['GC_SALES_TYPE']; // ex) 순매출, 총매출
        const gcSettlementRate = cpList[j]['GC_SETTLEMENT_RATE']; // ex) 0.2
        const gcPriority = cpList[j]['GC_PRIORITY'];
        // const gcType = gcPriority == 1 ? gcPriority : cpList[j]['GC_TYPE']; // ex) 1, 2, 3, 4
        const gcType = (j + 1);
        const gcSettlementType = cpList[j]['GC_SETTLEMENT_TYPE'];

        /**
         * 선급금 존재 여부 판단 Start
         */
        const prepaidList = await fetchUtils.fetchJson(
          `${process.env.REACT_APP_API_PATH}/pg/v_prepaid`
          , {
              headers: new Headers({Accept: "application/json"})
              , method: "POST"
              , body: JSON.stringify({
                  'MANAGE_ID': gcmManageId
                  , 'PLATFORM_CODE': gpgOldDetail
                  , 'CP_CODE': gcOld
                })
            }
        )
        .then(res => { return JSON.parse(res.body); })
        .catch(e => { throw e; });

        let isPrepaid = false;
        let prepaidSeq = '';
        let prepaidType = '';
        let realBalance = 0;
        if (prepaidList.length > 0) {
          for (let k = 0, cnt = prepaidList.length; k < cnt; k++) {
            prepaidSeq = prepaidList[k]['PREPAID_SEQ'];
            prepaidType = prepaidList[k]['PREPAID_TYPE'];
            realBalance = prepaidList[k]['REAL_BALANCE'];
            if (realBalance > 0) {
              isPrepaid = true;
              break;
            }
          }
        }

        // 선급금 차감 정보
        const prepaidDeductionList = await fetchUtils.fetchJson(
          `${process.env.REACT_APP_API_PATH}/pg/gp_prepaid_monthly`
          , {
              headers: new Headers({Accept: "application/json"})
              , method: "POST"
              , body: JSON.stringify({
                  'GPM_OLD_SEQ': prepaidSeq
                  , 'GPM_ACTUAL_MONTH': date
                })
            }
        )
        .then(res => { return JSON.parse(res.body); })
        .catch(e => { throw e; });
        
        let gpmRealBalance = prepaidDeductionList.length > 0 ? prepaidDeductionList[0]['GPM_REAL_BALANCE'] : 0;
        // 차감 테이블을 조회했을 때 데이터가 존재하고 잔액이 0 이상을 모두 만족할 때 true
        isPrepaid = prepaidDeductionList.length > 0 && gpmRealBalance > 0;
        /**
         * 선급금 존재 여부 판단 End
         */
        
        /**
         * 0순위 존재 여부 판단
         */ 
         const topPriorityList = await fetchUtils.fetchJson(
          `${process.env.REACT_APP_API_PATH}/pg/v_prepaid_exception`
          , {
              headers: new Headers({Accept: "application/json"})
              , method: "POST"
              , body: JSON.stringify({
                  // 'PREPAID_SEQ': prepaidSeq
                  'MANAGE_ID': gcmManageId
                })
            }
        )
        .then(res => { return JSON.parse(res.body); })
        .catch(e => { throw e; });

        /**
         * 선차감 제외 정산률 계산
         * topPriorityList.length > 0 -> 해당 컨텐츠에 0순위가 존재한다.
         * gcType != 1 -> gcType 1은 0순위이기 때문에 제외
         */
        let gcSettlementRateAfterCalc = 0;
        switch (gcSettlementType) {
          case 'A-type':
            /**
             * A형
	           * 정산구조 1 : 일반정산 = 매출액 x 정산율
	           * 정산구조 2 : 선차감 (매출액 - 선급잔액) x 정산율
	           * 	(매출액 x 차감율 - 선급잔액) >=< 0
	           * 	a. 일반정산
	           * 	b. 선급원가 차감
	           * 정산구조 3 : 후차감 (매출액 x 정산율) - 선급잔액
	           * 정산구조 4 : (매출액 - 정산순위1 계산값) x 정산율
	           * 정산구조 5 : CP1 주고 남은돈 (선차감)
	           * 정산구조 6 : CP1 주고 남은돈 (후차감)
             */
            const topPrioritySettlementRate = cpList[0]['GC_SETTLEMENT_RATE'];
            gcSettlementRateAfterCalc = topPriorityList.length > 0 && gcPriority != 1
                                        ? gcSettlementRate - (gcSettlementRate * topPrioritySettlementRate)
                                        : gcSettlementRate;
            break;
          case 'B-type':
            /**
             * B형
             * 정산구조 7 : 정산순위 2 계산방식
             * (정산순위1 정산율 - 20%)
             */
            if (gcPriority == 2) {
              gcSettlementRateAfterCalc = row[`CP${cpList[0]['GC_TYPE']} 선차감 제외 정산률`] - 0.2;
            }
            break;
          case 'C-type':
            /**
             * C형
             * 정산순위1의 선급원가 차감이 완료될 때까지
             * 정산순위2의 일반정산이 없는 경우
             */
            if (gcPriority == 2) {
              gcSettlementRateAfterCalc = row[`CP${cpList[0]['GC_TYPE']} 비고`] > 0 ? 0 : gcSettlementRateAfterCalc;
            }
            break;
          case 'D-type':
            /**
             * D형
	           * 누적매출액, 누적투자액
	           * 	a. 정산율
	           * 	b. (누적매출액 - 누적투자액) x (정산율 + 가산) + (누적투자액 x 정산율)
             */
          case 'E-type':
            /**
             * E형
	           * 누적매출, 일정금액
	           * 	a. 정산율
	           * 	b. (누적매출액 - 일정금액) x (정산율 + 가산) + (일정금액 x 정산율)
             */
            // 월별 매출 목록
            // const monthSalesList = await fetchUtils.fetchJson(
            //   `${process.env.REACT_APP_API_PATH}/pg/month_sales`
            //   , {
            //       headers: new Headers({Accept: "application/json"})
            //       , method: "POST"
            //       , body: JSON.stringify({
            //           'MANAGE_ID': gcmManageId
            //           , 'PLATFORM_DETAIL': gpgOldDetail
            //         })
            //     }
            // )
            // .then(res => { return JSON.parse(res.body); })
            // .catch(e => { throw e; });
            // const sum = monthSalesList.length > 0
            //             ? monthSalesList.reduce((sum, v) => sum + Number(v['TOTAL_SALES']), 0)
            //             : '매출없음';
            // console.log('monthSalesList', monthSalesList);
            // console.log('sum', sum);
            // gcSettlementRateAfterCalc = gpmRealBalance > 0 ? 
            



            break;
          case 'F-type':
            /**
             * F형
	           * 선급원가 차감 후 일반정산
             */
            break;
        }

        // 정산금 계산
        const amt = gcSalesType == '총매출'
                    ? gcSettlementRateAfterCalc * grossSales
                    : gcSalesType == '순매출'
                    ? gcSettlementRateAfterCalc * netSales
                    : gcSalesType == '플랫폼 수령금액'
                    ? gcSettlementRateAfterCalc * grossSalesMinusAppMarketFee
                    : 0;

        // 선급금 잔액 계산
        const key = `${gcOld}_${gcmManageId}_${gpgOldDetail}`;
        if (isPrepaid) {
          currentBalance[key] = currentBalance[key] ? currentBalance[key] - amt : gpmRealBalance - amt;
          // 정산금 > 선급금 일 때 로직
          // if (currentBalance[key] < 0) {
            // currentBalance[key] = 0;
          // }
        }

        // CP1 ~ CP4 값을 채움
        row[`CP${cpList[j]['GC_TYPE']}`] = gcName;
        row[`CP${cpList[j]['GC_TYPE']} 코드`] = gcOld;
        row[`CP${cpList[j]['GC_TYPE']} 정산코드/선급원가 코드`] = isPrepaid ? prepaidSeq : '';
        row[`CP${cpList[j]['GC_TYPE']}정산기준`] = gcSalesType;
        row[`CP${cpList[j]['GC_TYPE']} 정산율`] = gcSettlementRate;
        row[`CP${cpList[j]['GC_TYPE']} 선차감 제외 정산률`] = gcSettlementRateAfterCalc == 0 ? gcSettlementRateAfterCalc : gcSettlementRateAfterCalc;
        row[`CP${cpList[j]['GC_TYPE']} 정산금`] = Math.ceil(amt, 1);
        row[`CP${cpList[j]['GC_TYPE']} 정산 구분`] = gcSettlementRateAfterCalc == 0 ? 'D해당없음' : isPrepaid ? prepaidType : '일반정산';
        // row[`CP${cpList[j]['GC_TYPE']} 비고`] = isPrepaid ? `선급금 잔액: ${currentBalance[key]}` : '';
        row[`CP${cpList[j]['GC_TYPE']} 비고`] = isPrepaid ? `${currentBalance[key]}` : '';
        // row[`CP${cpList[j]['GC_TYPE']} 비고`] = '';
      }
    }

    return ws;
  }

  async function createIndividualCalcFile(ws) {
    let arySortedByCpId = {}
    for (let i = 2, cnt = ws.length; i < cnt; i++) {
      for (let j = 1; j < 5; j++) {
        const cpName = ws[i][`CP${j}`];
        const cpCode = ws[i][`CP${j} 코드`];
        const manageId = ws[i]['컨텐츠번호'];
        const platformCode = ws[i]['플랫폼 상세코드'];
        const key = `${cpName}_${cpCode}_${manageId}_${platformCode}`;

        if (!cpName || !cpCode)
          continue;

        !arySortedByCpId[key] ? arySortedByCpId[key] = [ws[i]] : arySortedByCpId[key].push(ws[i]);
      }
    }

    for (let key in arySortedByCpId) {
      if (arySortedByCpId[key].length > 1) {
        console.log(arySortedByCpId); // {양혜원_CPDV00310_01_1: [{}, {}], 곽두팔_CPDV00310_02_3: [{}, {}], ...}
      }
    }

    let wbs = [];
    for (const key in arySortedByCpId) {
      const cpName = key.split('_')[0];
      const cpCode = key.split('_')[1];
      const cpType = key.split('_')[2];
      const manageId = key.split('_')[3];
      const platformCode = key.split('_')[4];

      // To do: 식제
      // 테스트를 위한 코드
      // 양혜원만
      if (cpCode != 'CPDV00310_01')
        continue;

      const thisYear = date.split('-')[0];
      const thisMonth = date.split('-')[1];
      const newDate = new Date(date);
      const nextMonth = (newDate.getMonth() + 2).toString();
      const lastDayOfNextMonth = new Date(newDate.getFullYear(), (newDate.getMonth() + 2), 0).getDate();
      const lastMonth = format(new Date(newDate.getFullYear(), (newDate.getMonth() - 1)), 'yyyy-MM');

      let grossSales = 0;
      let sum = 0;
      let secondWsData = [];
      for (let j = 0, cnt = arySortedByCpId[key].length; j < cnt; j++) {
        grossSales += arySortedByCpId[key][j]['외화수수료 보정 순매출'];
        sum += arySortedByCpId[key][j][`CP${cpType} 정산금`];

        secondWsData.push({
          '순번': (j + 1)
          , '판매월': lastMonth // To do: 정산 전 월 계산
          , '서비스': arySortedByCpId[key][j]['서비스']
          , '제목': arySortedByCpId[key][j]['제목']
          , '저자': arySortedByCpId[key][j]['저자']
          , '출판사': arySortedByCpId[key][j]['출판사']
          , '구매 건수': arySortedByCpId[key][j]['구매 건수']
          , '구매 금액': arySortedByCpId[key][j]['구매 금액']
          , '대여 건수': arySortedByCpId[key][j]['대여 건수']
          , '대여 금액': arySortedByCpId[key][j]['대여 금액']
          , '취소 건수': arySortedByCpId[key][j]['취소 건수']
          , '취소 금액': arySortedByCpId[key][j]['취소 금액']
          , '결제수수료 보정액': arySortedByCpId[key][j]['결제수수료 보정액']
          , '매출(구매금액+대여금액-취소금액-제휴사 수수료)': arySortedByCpId[key][j]['외화수수료 보정 순매출']
          , '저작권자 정산율': arySortedByCpId[key][j][`CP${cpType} 선차감 제외 정산률`]
          , '저작권자 정산금': arySortedByCpId[key][j][`CP${cpType} 정산금`]
        })
      }

      let tax = sum > 0 && sum > 33400 ? Math.floor(sum * 0.033) : 0;
      tax = tax - (tax % 10); // 1의 자리 절삭

      const firstWsData = [
        [`${thisYear}년 ${thisMonth}월 정산`]
        ,
        ,
        , ['', '1. 정산 안내']
        , ['', '내용', '정산금', '세액', '지급액', '과세여부', '지급예정일']
        , ['', `${thisMonth}월 정산`, sum, tax , (sum - tax), '원천징수', `${thisYear}년 ${nextMonth}월 ${lastDayOfNextMonth}일`]
        , 
        ,
        ,
        ,
        , ['', '2. 정산내역']
        , ['', '내용', '매출(정산대상)(A)', '정산금(B)', '선급 차감(C), 지급 예정(B-C)']
        , ['', '', grossSales, sum]
        ,
        ,
        , ['', '정산에 대한 상세 내역은 하단의 상세내역 시트에서 확인할 수 있습니다.']
        , ['', '정산관련문의 : tax@mstoryhub.com']
      ];

      const testWs = utils.aoa_to_sheet(firstWsData);
      
      // merge 적용
      const merge = [
        { s: { r: 0, c: 0 }, e: { r: 1, c: 7 } }
      ];
      testWs["!merges"] = merge;

      const detailWs = utils.json_to_sheet(secondWsData);
      
      // 새로운 엑셀 파일 생성
      const resultWorkBook = utils.book_new();
      // 데이터가 저장된 시트 파일을 새로운 엑셀 파일의 시트로 설정 
      utils.book_append_sheet(resultWorkBook, testWs, "정산서");
      utils.book_append_sheet(resultWorkBook, detailWs, "상세내역");

      wbs.push(resultWorkBook);

      // To do: 삭제
      writeFile(wbs[0], '개인별 정산서.xlsx');
    }

    return wbs;
  }

  async function uploadFileToAWSS3(wbs) {
    const bucket = `${BUCKET_NAME}/${date}-${BUCKET_FOLDER_NAME}`;
    
    for (let i = 0, cnt = wbs.length; i < cnt; i++) {
      const fileTexts = file.name.split(".");
      const fileTypeIndex = fileTexts.length - 1;
  
      if (fileTypeIndex <= 0) {
        notify("파일 형식을 확인할 수 없습니다", { type: "warning" });
        return;
      }
      try {
        const result = await s3Upload({
          file,
          bucket,
          // key: `${date}-Calc-Raw.${fileTexts[fileTypeIndex]}`
          key: `${date}-Calc-Raw.${i}`
        });
  
        if (!result.success) {
          throw new Error();
        }
  
        notify("파일 업로드 완료", { type: "success" });
      } catch (err) {
        notify("통합 정산 파일 업로드에 실패하였습니다", { type: "error" });
      }
    }
  }

  async function checkAllContentsExist() {
    // "정산내역" 시트의 데이터를 json 형태로 변환
    const ws = utils.sheet_to_json(wb.Sheets["정산내역"], {header: CAL_RAW_SHEET_HEADER});

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
      const cpList = await fetchUtils.fetchJson(
        `${process.env.REACT_APP_API_PATH}/pg/v_cp`
        , {
            headers: new Headers({Accept: "application/json"})
            , method: "POST"
            , body: JSON.stringify({
                'GC_MANAGE_ID': gcmManageId
                , 'GPG_OLD_DETAIL': gpgOldDetail
              })
          }
      )
      .then(res => { return JSON.parse(res.body); })
      .catch(e => { throw e; });

      if (cpList.length > 0) continue;
      
      emptyAry.push(row);
    }

    if (emptyAry.length == 0) return;

    // 새로운 엑셀 파일 생성
    const resultWorkBook = utils.book_new();
    // 데이터가 저장된 시트 파일을 새로운 엑셀 파일의 시트로 설정 
    utils.book_append_sheet(resultWorkBook, utils.json_to_sheet(emptyAry, {header: CAL_RAW_SHEET_HEADER}));
    // 엑셀파일 로컬로 다운로드
    writeFile(resultWorkBook, `Fail List_${format(new Date(), 'yyyyMMddhhmmss').toString()}.xlsx`);

    throw '컨텐츠 누락으로 정산이 불가합니다. 파일을 확인해 주세요.'
  }

  async function handleSubmit(e) {
    // Loader Start
    onToggleLoading();

    try {
      /** pre validation start */
      // if (!file) { notify("통합 정산 파일을 업로드해주세요", { type: "warning" }); return; }
      if (!file) { throw '통합 정산 파일을 업로드해주세요' }
      if (!wb.Sheets["정산내역"]) { throw '정산내역 시트가 없습니다.' }
      /** pre validation end */

      /**
       * step 0. 데이터 누락 체크
       */
      // const step0Start = performance.now();
      // await checkAllContentsExist();
      // const step0End = performance.now();

      /**
       * step 1. 정산 처리
       */
      const step1Start = performance.now();
      const ws = await doCalc();
      const step1End = performance.now();
      // To do: 삭제
      // 새로운 엑셀 파일 생성
      const resultWorkBook = utils.book_new();
      // 데이터가 저장된 시트 파일을 새로운 엑셀 파일의 시트로 설정 
      utils.book_append_sheet(resultWorkBook, utils.json_to_sheet(ws, {header: CAL_RAW_SHEET_HEADER}));
      // 엑셀파일 로컬로 다운로드
      writeFile(resultWorkBook, `result_${format(new Date(), 'yyyyMMddhhmmss')}.xlsx`);

      /**
       * step 2. 개인별 정산서 생성
       */ 
      // const wbs = await createIndividualCalcFile(ws);

      /**
       * step 3. AWS S3 업로드
       */
      // uploadFileToAWSS3(wbs);

      /**
       * 속도 측정
       */
      // console.log(`step 0 - ${step0End - step0Start}ms`);
      console.log(`step 1 - ${step1End - step1Start}ms`);
    } catch(e) {
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
      <Box sx={{ mt: 3, mb: 3, flexGrow: 1 }}>
        <DatePicker label="정산월" value={date} onChange={handleChangeDate} format='yyyy-MM' views={["year", "month"]} />
      </Box>
      <FileUploader multiple={false} files={file} onDrop={handleDrop} onDeleteFile={handleDeleteFile} />
      <Box textAlign="center">
        <Button variant="contained" color="primary" onClick={handleSubmit} diabled={isLoading}>정산</Button>
      </Box>
    </>
  );
}

export default CalculationProcessStep1;





