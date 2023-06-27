import { List, Datagrid, TextField } from "react-admin";
import PlatformLabel from "./PlatformLabel";

const PlatformList = (props) => (
  <List title={PlatformLabel["tableName"]} {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" label="No." />
      <TextField source="" label="구분" />
      <TextField source="GP_NAME" label={PlatformLabel["gpName"]} />
      <TextField source="" label="플랫폼2코드" />
      <TextField source="GP_OLD_PLATFORM" label={PlatformLabel["gpOldPlatform"]} />
      <TextField source="" label="서비스지역" />
      <TextField source="" label="수수료구분" />
      <TextField source="" label="수수요율(앱)" />
      <TextField source="" label="수수료율(제휴)" />
      <TextField source="" label="종합 수수료율" />
      {/* <TextField source='GP_OLD_DETAIL' label={PlatformLabel['gpOldDetail']} /> */}
      {/* <TextField source="GP_TOTAL_FEE" label={PlatformLabel["gpTotalFee"]} /> */}
      <TextField source="" label="서비스상세" />
      <TextField source="" label="거래처코드" />

      {/* <TextField source="id" label={PlatformLabel["id"]} />
      <TextField source="platform" label={PlatformLabel["platform"]} />
      <TextField source="rate_web" label={PlatformLabel["rate_web"]} />
      <TextField source="rate_inapp" label={PlatformLabel["rate_inapp"]} />
      <TextField
        source="standard_calc"
        label={PlatformLabel["standard_calc"]}
      />
      <TextField source="add_info" label={PlatformLabel["add_info"]} /> */}
    </Datagrid>
  </List>
);

export default PlatformList;

// GCM_USE_YN: "Y"
// GP_AGENCY_NAME: "교보문고"
// GP_ALLIANCE_FEE: "0.3"
// GP_APP_FEE: "0"
// GP_AREA: "국내"
// GP_BUSINESS_NAME: "(주)교보문고"
// GP_CONTRACT_NO: null
// GP_CURRENCY_CODE: null
// GP_DEPARTMENT: null
// GP_DESCRIPTION: ""
// GP_DETAIL: "교보문고_일반_B2C"
// GP_DOMESTIC: "국내"
// GP_DOWNLOAD: "TRUE"
// GP_END_DATE: null
// GP_FEE_TYPE: "B2C"
// GP_GOODS_CODE: null
// GP_IDX: 1
// GP_ISSUE_TYPE: "계산서"
// GP_LANGUAGE: "국내"
// GP_NAME: "교보문고"
// GP_OLD_DETAIL: "PL0001_001"
// GP_OLD_PLATFORM: "PL0001"
// GP_PLATFORM_TYPE: "직영"
// GP_PRE_CODE: "00217"
// GP_REALTIME: "TRUE"
// GP_REALTIME_CMS: "TRUE"
// GP_REAL_NAME: "교보문고"
// GP_SALES_MONTH_TYPE: "M"
// GP_SALES_NAME: "교보문고"
// GP_SERIES_NAME: "일반"
// GP_SERIES_NO: null
// GP_SETTLEMENT_DATE: "1일"
// GP_SETTLEMENT_TYPE: "CMS(자동)"
// GP_START_DATE: null
// GP_TAX_CODE: null
// GP_TOTAL_FEE: "0.3"
// GU_IDX: null
// REG_DTM: "2022-08-31T09:58:34.611Z"
// REG_USER_ID: "admin"
// UPD_DTM: null
// UPD_USER_ID: null

// comment on column "GP_PLATFORM"."GP_IDX" is '일련번호';
// comment on column "GP_PLATFORM"."GP_NAME" is '플랫폼 서비스명';
// comment on column "GP_PLATFORM"."GP_SERIES_NO" is '시리즈 번호';
// comment on column "GP_PLATFORM"."GP_SERIES_NAME" is '시리즈명';
// comment on column "GP_PLATFORM"."GU_IDX" is '저자 일련번호';
// comment on column "GP_PLATFORM"."GP_START_DATE" is '게시 시작일';
// comment on column "GP_PLATFORM"."GP_END_DATE" is '게시 종료일';
// comment on column "GP_PLATFORM"."GP_GOODS_CODE" is '상품코드 (소설, 만화 등)';
// comment on column "GP_PLATFORM"."GP_PRE_CODE" is '이전 거래처 코드';
// comment on column "GP_PLATFORM"."GP_DETAIL" is '서비스 상세 정보';
// comment on column "GP_PLATFORM"."GP_FEE_TYPE" is '수수료 구분';
// comment on column "GP_PLATFORM"."GP_APP_FEE" is '앱마켓 수수료';
// comment on column "GP_PLATFORM"."GP_ALLIANCE_FEE" is '제휴사 수수료';
// comment on column "GP_PLATFORM"."GP_TOTAL_FEE" is '합계 수수료(1-((1-앱마켓수수료) * (1-제휴사수수료)))';
// comment on column "GP_PLATFORM"."GP_DOMESTIC" is '국내/해외 구분';
// comment on column "GP_PLATFORM"."GP_AREA" is '지역 정보 (국내, 글로벌, 독일…)';
// comment on column "GP_PLATFORM"."GP_LANGUAGE" is '서비스 언어';
// comment on column "GP_PLATFORM"."GP_CURRENCY_CODE" is '통화 구분 (KRW, USD …)';
// comment on column "GP_PLATFORM"."GP_TAX_CODE" is '세금 구분 (면세, 부가세 별도, 부가세 포함, 인보이스 )';
// comment on column "GP_PLATFORM"."GP_DEPARTMENT" is '담당부서';
// comment on column "GP_PLATFORM"."GP_CONTRACT_NO" is '계약서 정보';
// comment on column "GP_PLATFORM"."GP_OLD_PLATFORM" is '기존 플랫폼 코드';
// comment on column "GP_PLATFORM"."GP_OLD_DETAIL" is '기존 플랫폼 상세코드';
// comment on column "GP_PLATFORM"."GP_REAL_NAME" is '실서비스 플랫폼';
// comment on column "GP_PLATFORM"."GP_AGENCY_NAME" is '대행구분 플랫폼';
// comment on column "GP_PLATFORM"."GP_SALES_NAME" is '매출구분 사업자명';
// comment on column "GP_PLATFORM"."GP_BUSINESS_NAME" is '사업자명';
// comment on column "GP_PLATFORM"."GP_PLATFORM_TYPE" is '플랫폼 정산 구분(대행, 직영 - C0000106)';
// comment on column "GP_PLATFORM"."GP_ISSUE_TYPE" is '증빙발행 구분(C0000109)';
// comment on column "GP_PLATFORM"."GP_SALES_MONTH_TYPE" is '매출집계월 기준(판매월 M)';
// comment on column "GP_PLATFORM"."GP_SETTLEMENT_DATE" is '정산보고서 수령일';
// comment on column "GP_PLATFORM"."GP_SETTLEMENT_TYPE" is '정산보고서 수령형태';
// comment on column "GP_PLATFORM"."GP_REALTIME" is '실시간 매출 상세데이터 확인가능 여부';
// comment on column "GP_PLATFORM"."GP_REALTIME_CMS" is 'CMS 실시간 정산액 확인가능 여부';
// comment on column "GP_PLATFORM"."GP_DOWNLOAD" is '데이터 다운로드 가능여부';
// comment on column "GP_PLATFORM"."GP_DESCRIPTION" is '비고';
// comment on column "GP_PLATFORM"."GCM_USE_YN" is '사용여부 (`Y` : 사용, `N` : 미사용)';
// comment on column "GP_PLATFORM"."REG_USER_ID" is '등록자';
// comment on column "GP_PLATFORM"."REG_DTM" is '등록일';
// comment on column "GP_PLATFORM"."UPD_USER_ID" is '수정자';
// comment on column "GP_PLATFORM"."UPD_DTM" is '수정일';

// comment on table "GP_PLATFORM" is '플랫폼 정보';
