import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
// import { createTheme } from "@mui/system";
import clsx from "clsx";
import { useState, useEffect } from "react";
import { DashboardMenuItem, MenuItemLink, useTranslate } from "react-admin";
import { useSelector } from "react-redux";

import AccountBoxIcon from "@mui/icons-material/AccountBox";
import AssuredWorkloadIcon from "@mui/icons-material/AssuredWorkload";
import AttachEmailIcon from "@mui/icons-material/AttachEmail";
import CalculateIcon from "@mui/icons-material/Calculate";
import CalculateOutlinedIcon from "@mui/icons-material/CalculateOutlined";
import CalculateTwoToneIcon from "@mui/icons-material/CalculateTwoTone";
import CallToActionIcon from "@mui/icons-material/CallToAction";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import ContactEmergencyIcon from "@mui/icons-material/ContactEmergency";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import ContactsIcon from "@mui/icons-material/Contacts";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import CurtainsIcon from "@mui/icons-material/Curtains";
import CurtainsClosedIcon from "@mui/icons-material/CurtainsClosed";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import SwitchAccountIcon from "@mui/icons-material/SwitchAccount";
import MemoryIcon from "@mui/icons-material/Memory";
// import SubMenu from "./SubMenu";

import SubMenu from "./SubMenu";

import { isGrade } from "axios/user/user";

const getCookie = (key) => {
  key = new RegExp(key + "=([^;]*)"); // 쿠키들을 세미콘론으로 구분하는 정규표현식 정의
  return key.test(document.cookie) ? unescape(RegExp.$1) : ""; // 인자로 받은 키에 해당하는 키가 있으면 값을 반환
};

// const theme = createTheme();
const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    paddingBottom: (props) => (props.addPadding ? "80px" : "20px"),
    "& .MuiListItem-root": {
      fontSize: "14px",
      color: "#212121",
      "& .MuiTypography-root": {
        color: "#212121"
      }
    },
    "& .MuiListItemIcon-root": {
      color: "#212121"
    }
  },
  open: {
    width: 215,
    height: "100%"
  },
  closed: {
    width: 45,
    height: "100%"
  },
  active: {
    color: theme.palette.text.primary,
    fontWeight: "bold"
  },
  MenuItemLinkRoot: {
    color: "#00ffff"
  },
  MenuItemLinkActive: {
    fontWeight: 700,
    "& .MuiListItemIcon-root": {
      color: "#212121"
    }
  }
}));

function MyMenu(props) {
  const [grade, setGrade] = useState("");
  const classes = useStyles();
  const translate = useTranslate();
  const theme = useTheme();
  const isXSmall = useMediaQuery(theme.breakpoints.down("xs"));

  const open = useSelector((state) => state.admin.ui.sidebarOpen);
  const [openedMenus, setOpenedMenus] = useState({
    cps: false,
    platforms: false,
    users: false,
    costManage: false,
    calculateManage: false,
    calculateSearch: false,
    calculate: false,
    history: false,
    settleManage: false,
    mail: false,
    etcManage: false,
    settleInquiry: false,
    usersManage: false
  });
  const { dense, logout, onMenuClick: et } = props;

  function handleToggle(menu) {
    return function () {
      setOpenedMenus((prevState) => ({
        ...prevState,
        [menu]: !prevState[menu]
      }));
    };
  }

  function onMenuClick(params) {
    console.log("param : ", params.target.innerText);
  }

  const setUserGrade = async () => {
    const token = getCookie("token");
    await isGrade({
      token: token
    })
      .then((res) => {
        setGrade(res.data);
      })
      .catch((e) => {
        throw e;
      });
  };

  useEffect(() => {
    setUserGrade();
  }, []);

  return (
    <div
      {...props}
      className={clsx(classes.root, {
        [classes.open]: open,
        [classes.closed]: !open
      })}
    >
      <DashboardMenuItem onClick={onMenuClick} sidebarIsOpen={open} />

      {(grade === "S" || grade === "M") && (
        <SubMenu
          dense={dense}
          isOpened={openedMenus.history}
          isOpenedSidebar={open}
          name="히스토리"
          onToggle={handleToggle("history")}
        >
          <MenuItemLink
            to="/workHistroy"
            dense={dense}
            sidebarIsOpen={open}
            classes={{ active: classes.MenuItemLinkActive }}
            leftIcon={<AssuredWorkloadIcon fontSize="small" />}
            primaryText={translate(`작업내역`, { smart_count: 2 })}
            onClick={onMenuClick}
          />
          <MenuItemLink
            to="/accountAccess"
            dense={dense}
            sidebarIsOpen={open}
            classes={{ active: classes.MenuItemLinkActive }}
            leftIcon={<PersonAddIcon fontSize="small" />}
            primaryText={translate(`계정발급정보`, { smart_count: 2 })}
            onClick={onMenuClick}
          />
          <MenuItemLink
            to="/accountIssue"
            dense={dense}
            sidebarIsOpen={open}
            classes={{ active: classes.MenuItemLinkActive }}
            leftIcon={<ManageAccountsIcon fontSize="small" />}
            primaryText={translate(`계정접속정보`, { smart_count: 2 })}
            onClick={onMenuClick}
          />
        </SubMenu>
      )}

      {(grade === "S" || grade === "M") && (
        <SubMenu
          dense={dense}
          isOpened={openedMenus.cps}
          isOpenedSidebar={open}
          name="정보 관리"
          onToggle={handleToggle("cps")}
        >
          <MenuItemLink
            to={{ pathname: "/infoManageWork", state: `/infoManageWorkDetail` }}
            dense={dense}
            sidebarIsOpen={open}
            classes={{ active: classes.MenuItemLinkActive }}
            leftIcon={<ContactEmergencyIcon fontSize="small" />}
            primaryText={translate(`작품 관리`, { smart_count: 2 })}
            onClick={onMenuClick}
          />
          <MenuItemLink
            to="/infoManageCp"
            dense={dense}
            sidebarIsOpen={open}
            classes={{
              active: classes.MenuItemLinkActive
            }}
            leftIcon={<CallToActionIcon fontSize="small" />}
            primaryText={translate(`CP 관리`, {
              smart_count: 2
            })}
            onClick={onMenuClick}
          />
          <MenuItemLink
            to="/infoManagePlatform"
            dense={dense}
            sidebarIsOpen={open}
            classes={{
              active: classes.MenuItemLinkActive
            }}
            leftIcon={<ContactsIcon fontSize="small" />}
            primaryText={translate(`플랫폼 관리`, {
              smart_count: 2
            })}
            onClick={onMenuClick}
          />
        </SubMenu>
      )}

      {(grade === "S" || grade === "M") && (
        <SubMenu
          dense={dense}
          isOpened={openedMenus.costManage}
          isOpenedSidebar={open}
          name="비용 관리"
          onToggle={handleToggle("costManage")}
        >
          <MenuItemLink
            to="/prepaid"
            dense={dense}
            sidebarIsOpen={open}
            classes={{ active: classes.MenuItemLinkActive }}
            leftIcon={<CardMembershipIcon fontSize="small" />}
            primaryText={translate(`선급금 관리`, { smart_count: 2 })}
            onClick={onMenuClick}
          />
          <MenuItemLink
            to="/prepaidMonthly"
            dense={dense}
            sidebarIsOpen={open}
            classes={{ active: classes.MenuItemLinkActive }}
            leftIcon={<CreditCardIcon fontSize="small" />}
            primaryText={translate(`선급금 월별상세`, { smart_count: 2 })}
            onClick={onMenuClick}
          />
          <MenuItemLink
            to="/advances"
            dense={dense}
            sidebarIsOpen={open}
            classes={{ active: classes.MenuItemLinkActive }}
            leftIcon={<PriceChangeIcon fontSize="small" />}
            primaryText={translate(`선수금 관리`, { smart_count: 2 })}
            onClick={onMenuClick}
          />
          <MenuItemLink
            to="/advancesMonthly"
            dense={dense}
            sidebarIsOpen={open}
            classes={{ active: classes.MenuItemLinkActive }}
            leftIcon={<RequestQuoteIcon fontSize="small" />}
            primaryText={translate(`선수금 월별상세`, { smart_count: 2 })}
            onClick={onMenuClick}
          />
        </SubMenu>
      )}

      {/* 
      <SubMenu
        dense={dense}
        isOpened={openedMenus.settleManage}
        isOpenedSidebar={open}
        name="정산 관리"
        onToggle={handleToggle("settleManage")}
      >
        <MenuItemLink
          to="/settleManage"
          dense={dense}
          sidebarIsOpen={open}
          classes={{
            active: classes.MenuItemLinkActive
          }}
          leftIcon={<InsertDriveFileIcon fontSize="small" />}
          primaryText={translate(`정산관리 종합`, {
            smart_count: 2
          })}
          onClick={onMenuClick}
        />
      </SubMenu> */}

      {(grade === "S" || grade === "M" || grade === "C") && (
        <SubMenu
          dense={dense}
          isOpened={openedMenus.calculate}
          isOpenedSidebar={open}
          name="정산 조회"
          onToggle={handleToggle("calculate")}
        >
          {(grade === "S" || grade === "M") && (
            <MenuItemLink
              to="/process"
              dense={dense}
              sidebarIsOpen={open}
              classes={{
                active: classes.MenuItemLinkActive
              }}
              leftIcon={<MemoryIcon fontSize="small" />}
              primaryText={translate(`정산 처리`, {
                smart_count: 2
              })}
              onClick={onMenuClick}
            />
          )}

          {(grade === "S" || grade === "M" || grade === "C") && (
            <MenuItemLink
              to="/calculateDataHistory"
              dense={dense}
              sidebarIsOpen={open}
              classes={{
                active: classes.MenuItemLinkActive
              }}
              leftIcon={<CalculateIcon fontSize="small" />}
              primaryText={translate(`정산 데이터 내역`, {
                smart_count: 2
              })}
              onClick={onMenuClick}
            />
          )}

          {(grade === "S" || grade === "M") && (
            <MenuItemLink
              to="/calculateManageGenerals"
              dense={dense}
              sidebarIsOpen={open}
              classes={{
                active: classes.MenuItemLinkActive
              }}
              leftIcon={<CalculateTwoToneIcon fontSize="small" />}
              primaryText={translate(`정산 관리 종합`, {
                smart_count: 2
              })}
              onClick={onMenuClick}
            />
          )}

          {(grade === "S" || grade === "M") && (
            <MenuItemLink
              to="/work"
              dense={dense}
              sidebarIsOpen={open}
              classes={{
                active: classes.MenuItemLinkActive
              }}
              leftIcon={<CalculateOutlinedIcon fontSize="small" />}
              primaryText={translate(`정산조회_작품별(월별)`, {
                smart_count: 2
              })}
              onClick={onMenuClick}
            />
          )}

          {(grade === "S" || grade === "M") && (
            <MenuItemLink
              to="/cp"
              dense={dense}
              sidebarIsOpen={open}
              classes={{
                active: classes.MenuItemLinkActive
              }}
              leftIcon={<CalculateOutlinedIcon fontSize="small" />}
              primaryText={translate(`정산조회_CP별(월별)`, {
                smart_count: 2
              })}
              onClick={onMenuClick}
            />
          )}
          {(grade === "S" || grade === "M") && (
            <MenuItemLink
              to="/cpSettlementStatement"
              dense={dense}
              sidebarIsOpen={open}
              classes={{
                active: classes.MenuItemLinkActive
              }}
              leftIcon={<CurtainsIcon fontSize="small" />}
              primaryText={translate(`CP 정산내역서 조회`, {
                smart_count: 2
              })}
              onClick={onMenuClick}
            />
          )}
          <MenuItemLink
            to="/cpSettlementStatementFile"
            dense={dense}
            sidebarIsOpen={open}
            classes={{
              active: classes.MenuItemLinkActive
            }}
            leftIcon={<CurtainsClosedIcon fontSize="small" />}
            primaryText={translate(`CP 정산내역서 파일`, {
              smart_count: 2
            })}
            onClick={onMenuClick}
          />
        </SubMenu>
      )}

      {(grade === "S" || grade === "M") && (
        <SubMenu
          dense={dense}
          isOpened={openedMenus.mail}
          isOpenedSidebar={open}
          name="메일 발송 관리"
          onToggle={handleToggle("mail")}
        >
          <MenuItemLink
            to="/mailSend"
            dense={dense}
            sidebarIsOpen={open}
            classes={{
              active: classes.MenuItemLinkActive
            }}
            leftIcon={<AttachEmailIcon fontSize="small" />}
            primaryText={translate(`메일 발송 관리`, {
              smart_count: 2
            })}
            onClick={onMenuClick}
          />
          <MenuItemLink
            to="/mailTemplete"
            dense={dense}
            sidebarIsOpen={open}
            classes={{
              active: classes.MenuItemLinkActive
            }}
            leftIcon={<ContactMailIcon fontSize="small" />}
            primaryText={translate(`메일 템플릿 관리`, {
              smart_count: 2
            })}
            onClick={onMenuClick}
          />
        </SubMenu>
      )}

      {(grade === "S" || grade === "M") && (
        <SubMenu
          dense={dense}
          isOpened={openedMenus.etcManage}
          isOpenedSidebar={open}
          name="기타 관리"
          onToggle={handleToggle("etcManage")}
        >
          <MenuItemLink
            to="/forexRatios"
            dense={dense}
            sidebarIsOpen={open}
            classes={{
              active: classes.MenuItemLinkActive
            }}
            leftIcon={<CurrencyExchangeIcon fontSize="small" />}
            primaryText={translate(`외환 비율 관리`, {
              smart_count: 2
            })}
            onClick={onMenuClick}
          />
        </SubMenu>
      )}

      {(grade === "S" || grade === "M" || grade === "C") && (
        <SubMenu
          dense={dense}
          isOpened={openedMenus.usersManage}
          isOpenedSidebar={open}
          name="계정 관리"
          onToggle={handleToggle("usersManage")}
        >
          {(grade === "S" || grade === "M") && (
            <MenuItemLink
              to="/userList"
              dense={dense}
              sidebarIsOpen={open}
              classes={{
                active: classes.MenuItemLinkActive
              }}
              leftIcon={<SwitchAccountIcon fontSize="small" />}
              primaryText={translate(`계정 리스트`, {
                smart_count: 2
              })}
              onClick={onMenuClick}
            />
          )}
          {(grade === "S" || grade === "M" || grade === "C") && (
            <MenuItemLink
              to="/myinfo"
              dense={dense}
              sidebarIsOpen={open}
              classes={{
                active: classes.MenuItemLinkActive
              }}
              leftIcon={<AccountBoxIcon fontSize="small" />}
              primaryText={translate(`내정보`, {
                smart_count: 2
              })}
              onClick={onMenuClick}
            />
          )}
        </SubMenu>
      )}

      {/* {(grade === "S" || grade === "M" || grade === "C") && (
        <SubMenu
          dense={dense}
          isOpened={openedMenus.settleInquiry}
          isOpenedSidebar={open}
          name="정산조회"
          onToggle={handleToggle("settleInquiry")}
        >
          
        </SubMenu>
      )} */}

      {isXSmall && (
        <MenuItemLink
          to="/configuration"
          primaryText={translate("pos.configuration")}
          onClick={onMenuClick}
          sidebarIsOpen={open}
          dense={dense}
        />
      )}
      {isXSmall && logout}
    </div>
  );
}

export default MyMenu;
