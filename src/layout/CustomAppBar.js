import { Box, Button, MenuItem, Select } from "@material-ui/core";
import { Typography } from "@mui/material";
import React, { useEffect } from "react";
import { AppBar, useLogout } from "react-admin";
import { useHistory } from "react-router-dom";
import { setLoginHistories } from "../axios/history/history";

function CustomAppBar(props) {
  const [age, setAge] = React.useState("M");
  const item = JSON.parse(localStorage.getItem("userInfo"));
  const logout = useLogout();
  const history = useHistory();

  const handleSetLoginHistories = async (data) => {
    await setLoginHistories(data);
  };

  const handleClick = () => {
    handleSetLoginHistories({
      GU_USER_ID: item?.user?.id,
      GLH_STATUS: "로그아웃"
    });
    logout();
  };
  const handleChange = (event) => {
    setAge(event.target.value);
  };

  useEffect(() => {
    item && setAge(item?.user?.grade);
  }, [item]);

  return (
    <AppBar>
      <div class="container" style={{ display: "flex", width: "100%" }}>
        <div class="left-items" style={{ textAlign: "center" }}>
          <Typography
            variant="h6"
            color="inherit"
            sx={{
              flex: 1,
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden"
            }}
            id="react-admin-title"
          />
        </div>
        <div class="right-items" style={{ marginLeft: "auto", color: "bule" }}>
          <Box>
            <Typography variant="h7" sx={{ fontSize: 12, color: "#1876D2" }}>
              {item?.user?.name}
            </Typography>
            <Typography variant="h7" sx={{ fontSize: 12 }}>
              님 환영합니다.
            </Typography>
            <Select
              style={{ backgroundColor: "#ffffff", height: "25px", marginLeft: 5, marginRight: 5, fontSize: 12 }}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={age}
              label="Age"
              onChange={handleChange}
              variant="outlined"
              // disabled={true}
            >
              <MenuItem value={"S"}>슈퍼관리자</MenuItem>
              <MenuItem value={"M"}>담당자</MenuItem>
              <MenuItem value={"C"}>CP</MenuItem>
            </Select>
            <Button
              size="small"
              variant="contained"
              style={{ height: "25px", marginRight: 5 }}
              onClick={() => {
                history.push("/myinfo");
              }}
            >
              내정보
            </Button>
            <Button
              size="small"
              variant="contained"
              style={{ height: "25px", marginRight: 5, backgroundColor: "gray", color: "#FFFFFF" }}
              onClick={handleClick}
            >
              로그아웃
            </Button>
            <Button />
          </Box>
        </div>
      </div>
      {/* <div style={{ width: "100%" }}>AA</div> */}
    </AppBar>
  );
}

export default CustomAppBar;
