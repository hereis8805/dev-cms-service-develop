import { useEffect } from "react";
import { Route } from "react-router-dom";
import { Admin, ListGuesser, EditGuesser, Resource } from "react-admin";

import { createBrowserHistory as createHistory } from "history";
import AWS from "aws-sdk";
import { Toaster } from "react-hot-toast";
import jwt_decode from "jwt-decode";

import authProvider from "providers/authProvider";
import dataProvider from "providers/dataProvider";
import i18nProvider from "providers/i18nProvider";

import SignupPage from "auth/SignupPage";
import Layout from "layout/Layout";
import defaultTheme from "defaultTheme";

import users from "resources/users";
import contentProvider from "resources/contentProvider";
// import contentProvider from "resources/contentProvider"; // @park contentProvider 소스 추가 작업 필요
import cprates from "resources/cprates";
import contents from "resources/contents";
import mailContent from "resources/mailContent";
import mails from "resources/mails";
import platforms from "resources/platforms";
import platform from "resources/platform";
import InfoManage from "resources/infoManage/cp";
import platformRate from "resources/platformRates";
import teams from "resources/teams";
import calculationData from "resources/calculationData";
import mgPayoutDetails from "resources/mgPayoutDetails";
// import calculationDataManagement from "resources/calculationFileManagement";
import calculationContent from "resources/calculationContent";
import calcContentCpMapping from "resources/calculationContentCpMapping";
import CalculationProcess from "resources/CalculationProcess";
import CalculationDataSet from "resources/calculationDataSet";
import CalculationSearchAll from "resources/calculationSearchAll";
import CalculationMonthlyWork from "resources/calculationMonthlyWork";
import calculationMonthlyCp from "resources/calculationMonthlyCp";
// import informationManagement from "resources/informationManagement";

import Dashboard from "./Dashboard";
import LoginPage from "resources/user/Login";
import MyLoginPage2 from "./MyLoginPage2";
import CustomPage from "./Custompage";
import CustomPage2 from "./Custompage2";
import FileUploadPage from "./FileUploadPage";
import Cp from "resources/settleManage/cp";
import CpDetail from "resources/settleManage/cp/Detail/Detail";
import Work from "resources/settleManage/work";
import WorkDetail from "resources/settleManage/work/Detail/Detail";
import CalculationMonthlyCpDetailTest from "resources/calculationMonthlyCp/CalculationMonthlyCpDetail/CalculationMonthlyCpDetailTest";
import CalculationMonthlyCpDetailTestDetail from "resources/calculationMonthlyCp/CalculationMonthlyCpDetail/CalculationMonthlyCpDetailTestDetail";

// 정보관리 > 작품관리
import InformationWork from "resources/settleManage/information";
import informationWorkDetail from "resources/settleManage/information/Detail/Detail";
import InfoManageCpList from "resources/infoManage/cp/List/List";
import InfoManageCpDetail from "resources/infoManage/cp/Detail/Detail";
import InfoManagePlatformList from "resources/infoManage/platform/List/List";
import InfoManagePlatformDetail from "resources/infoManage/platform/Detail/Detail";
import InfoManageWorkList from "resources/infoManage/work/List/List";
import InfoManageWorkDetail from "resources/infoManage/work/Detail/Detail";
import WorkHistroy from "resources/history/WorkHistroy/List";
import AccountIssueList from "resources/history/AccountIssue/List";
import AccountAccessList from "resources/history/AccountAccess/List";
import MailTempleteManageList from "resources/mail/MailTempleteManage/List";
import MailSendManageList from "resources/mail/MailSendManage/List";
import MailTempleteManageCreate from "resources/mail/MailTempleteManage/Create";
import prepaidPaymentManagementList from "resources/costManagement/prepaidPayment/management/List";
import prepaidPaymentManagementDetail from "resources/costManagement/prepaidPayment/management/Detail";
import prepaidPaymentManagementWrite from "resources/costManagement/prepaidPayment/management/Write";
import prepaidPaymentMonthlyDetailtList from "resources/costManagement/prepaidPayment/monthlyDetail/List";
import prepaidPaymentHistoryList from "resources/costManagement/prepaidPayment/history/List";
import unearnedRevenueHistoryList from "resources/costManagement/unearnedRevenue/history/List";
import advancesFromCustomersManagementList from "resources/costManagement/advancesFromCustomers/management/List";
import advanceDetailForm from "resources/costManagement/advancesFromCustomers/management/Detail";
import advanceDetailWriteForm from "resources/costManagement/advancesFromCustomers/management/Write";
import calculateManageGeneralList from "resources/costManagement/calculateManage/general/List";
import advancesFromCustomersMonthlyDetailtList from "resources/costManagement/advancesFromCustomers/monthlyDetail/List";
import ForexRatiosList from "resources/etc/forexRatios/List";
import ForexRatiosListCreate from "resources/etc/forexRatios/Create";
import ForexRatiosDetail from "resources/etc/forexRatios/Detail";
import { RecoilRoot } from "recoil";
import UserList from "resources/user/List";
import UserCreate from "resources/user/Create";
import UserDetail from "resources/user/Detail";
import Myinfo from "resources/user/MyInfo";
import CpSettlementStatement from "resources/calculateSearch/CpSettlementStatement/List";
import CpSettlementStatementFile from "resources/calculateSearch/CpSettlementStatementFile/List";
import CalculateManageDetail from "resources/costManagement/calculateManage/detail/Detail";
import CalculateDataHistoryList from "resources/costManagement/calculateDataHistory/List/List";

const App = () => {
  const history = createHistory();

  // 쿠키 읽기
  const getCookie = (key) => {
    key = new RegExp(key + "=([^;]*)"); // 쿠키들을 세미콘론으로 구분하는 정규표현식 정의
    return key.test(document.cookie) ? unescape(RegExp.$1) : ""; // 인자로 받은 키에 해당하는 키가 있으면 값을 반환
  };

  const isEmpty3 = (val) => {
    if (
      val === "null" ||
      val === "NULL" ||
      val === "Null" ||
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

  useEffect(() => {
    if (AWS.config.credentials) return;

    AWS.config.update({
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_ID_KEY,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
      region: "ap-northeast-2"
    });

    const token = getCookie("token");
    if (token) {
      const decode = jwt_decode(token);
      localStorage.setItem("userInfo", JSON.stringify(decode));
    }

    if (isEmpty3(token)) {
      history.push("/mstoryLogin");
    }
  }, []);

  if (!dataProvider) {
    return <div>Loading</div>;
  }

  return (
    <>
      <RecoilRoot>
        <Admin
          theme={defaultTheme}
          title="엠스토리허브 정산 조회 시스템"
          history={history}
          loginPage={LoginPage}
          dashboard={Dashboard}
          // authProvider={authProvider}
          dataProvider={dataProvider}
          i18nProvider={i18nProvider}
          customRoutes={[
            <Route path="/mstoryLogin" component={LoginPage} noLayout /> /* 로그인 */,
            <Route path="/signup" component={SignupPage} noLayout />,
            <Route path="/custom1" component={CustomPage} />,
            <Route path="/fileupload" component={FileUploadPage} />,
            <Route path="/infoManagePlatform" component={InfoManagePlatformList} />,
            <Route path="/process" component={CalculationProcess} />,
            <Route path="/workHistroy" component={WorkHistroy} />, // 히스토리 > 작업내역
            <Route path="/accountAccess" component={AccountAccessList} />, // 히스토리 > 계정발급정보
            <Route path="/accountIssue" component={AccountIssueList} />, // 히스토리 > 계정접속정보
            <Route path="/prepaid" component={prepaidPaymentManagementList} /> /* 선급금 관리 */,
            <Route path="/prepaidDetail/:id" component={prepaidPaymentManagementDetail} /> /* 선급금 관리 상세 */,
            <Route path="/prepaidDetail" component={prepaidPaymentManagementWrite} /> /* 선급금 관리 등록 */,
            <Route path="/prepaidMonthly" component={prepaidPaymentMonthlyDetailtList} /> /* 선급금 월별 상세 */,
            <Route path="/prepaidHistory/:id" component={prepaidPaymentHistoryList} /> /* 선급금 내역 조회 */,
            <Route path="/unearnedRevenueHistory/:id" component={unearnedRevenueHistoryList} /> /* 선수금 내역 조회 */,
            <Route path="/advances" component={advancesFromCustomersManagementList} /> /* 선수금 관리 */,
            <Route path="/advancesDetail/:id" component={advanceDetailForm} /> /* 선수금 관리 상세 */,
            <Route path="/advancesDetail" component={advanceDetailWriteForm} /> /* 선수금 관리 등록 */,
            <Route path="/calculateDataHistory" component={CalculateDataHistoryList} /> /* 정산관리종합 */,
            <Route path="/calculateManageGenerals" component={calculateManageGeneralList} /> /* 정산관리종합 */,
            <Route path="/calculateManageDetail/:id" component={CalculateManageDetail} /> /* 정산관리종합 > 상세*/,
            <Route path="/advancesMonthly" component={advancesFromCustomersMonthlyDetailtList} />, // 선수금 월별상세
            <Route path="/mailTemplete" component={MailTempleteManageList} />, // 메일 템플릿 관리
            <Route path="/mailTempleteCreate" component={MailTempleteManageCreate} />,
            <Route path="/mailSend" component={MailSendManageList} />, // 메일 발송 관리
            <Route path="/infoManageWork" component={InfoManageWorkList} />, // 작품관리
            <Route path="/infoManageWorkDetail" component={InfoManageWorkDetail} />, // 작품관리 > 수정
            <Route path="/infoManageCp" component={InfoManageCpList} />, // CP 관리
            <Route path="/infoManageCpDetail" component={InfoManageCpDetail} />, // CP 관리 > 수정
            <Route path="/infoManagePlatform" component={InfoManagePlatformList} />, // 플랫폼 관리
            <Route path="/infoManagePlatformDetail" component={InfoManagePlatformDetail} />, // 플랫폼 관리 > 수정
            <Route path="/forexRatios" component={ForexRatiosList} />, // 외한 비율관리
            <Route path="/cpSettlementStatement" component={CpSettlementStatement} />, // CP 정산내역서 조회
            <Route path="/cpSettlementStatementFile" component={CpSettlementStatementFile} />, // CP 정산내역서 파일
            <Route path="/forexRatiosCreate/:id" component={ForexRatiosListCreate} />,
            <Route path="/forexRatiosDetail/:id" component={ForexRatiosDetail} />,
            <Route path="/myinfo" component={Myinfo} />, // 내정보
            <Route path="/userList" component={UserList} />, // 계정리스트
            <Route path="/userCreate" component={UserCreate} />,
            <Route path="/userDetail/:id" component={UserDetail} />,
            <Route path="/work" component={Work} />, // 정산조회_작품별(월별)
            <Route path="/cp" component={Cp} />, // 정산조회_CP별(월별)
            <Route path="/workdetail/:id" component={WorkDetail} />, // 정산조회_작품별(월별) > 상세
            <Route path="/cpdetail/:id" component={CpDetail} /> // 정산조회_CP별(월별) > 상세
          ]}
          layout={Layout}
        >
          <Resource
            name="User" // 라우터, api
            {...users}
          />
          <Resource
            name="contentProvider" // 라우터, api
            edit={EditGuesser}
            list={ListGuesser}
            {...contentProvider}
          />
          <Resource
            name="cprate" // 라우터, api
            edit={EditGuesser}
            {...cprates}
          />
          <Resource
            name="content" // 라우터, api
            edit={EditGuesser}
            {...contents}
          />
          <Resource
            name="mailContent" // 라우터, api
            {...mailContent}
          />
          <Resource
            name="mail" // 라우터, api
            {...mails}
          />
          <Resource
            name="calculationData" // 라우터, api
            {...calculationData}
          />
          {/* <Resource name="calucationDataManagement" {...calculationDataManagement} /> */}
          <Resource
            name="mgPayoutDetails" // 라우터, api
            {...mgPayoutDetails}
          />
          <Resource name="calculation-content" {...calculationContent} />
          <Resource name="cost/settlement/datas" {...CalculationDataSet} />
          <Resource name="cost/settlement/integrations" {...CalculationSearchAll} />
          <Resource name="cost/settlement/monthWorks" {...CalculationMonthlyWork} />
          <Resource name="cost/settlement/monthCps" edit={EditGuesser} {...calculationMonthlyCp} />
          {/* <Resource name="information/work/list" edit={EditGuesser} {...informationManagement} /> */}
          <Resource name="calcContentCpMapping" {...calcContentCpMapping} />
          <Resource name="team" {...teams} />
          <Resource name="information/platform/list" edit={EditGuesser} {...platform} />
          <Resource name="information/cp/list" edit={EditGuesser} {...InfoManage} />
          <Resource name="platformGroup" />
          <Resource name="platformrate" edit={EditGuesser} {...platformRate} />
          <Resource name="group" edit={EditGuesser} list={ListGuesser} />
        </Admin>
        <Toaster
          toastOptions={{
            style: {
              padding: "16px",
              fontWeight: "bold"
            }
          }}
        />
      </RecoilRoot>
    </>
  );
};

export default App;
