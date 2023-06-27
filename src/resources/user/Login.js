import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import { CardContent } from "@material-ui/core";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { setLoginHistories } from "../../axios/history/history";

import { isLogin } from "../../axios/user/user";

const theme = createTheme();

export default function SignIn() {
  useEffect(() => {}, []);

  const handleIsLogin = async (param) => {
    return await isLogin(param);
  };

  const handleSetLoginHistories = async (data) => {
    await setLoginHistories(data);
  };

  // 쿠키 저장
  // expiredays 는 일자 정수 - 365년 1년 쿠키
  const setCookie = (key, value, expiredays) => {
    let todayDate = new Date();
    todayDate.setDate(todayDate.getDate() + expiredays); // 현재 시각 + 일 단위로 쿠키 만료 날짜 변경
    //todayDate.setTime(todayDate.getTime() + (expiredays * 24 * 60 * 60 * 1000)); // 밀리세컨드 단위로 쿠키 만료 날짜 변경
    document.cookie = key + "=" + escape(value) + "; path=/; expires=" + todayDate.toGMTString() + ";";
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const loginParam = {
      loginId: data.get("loginId"),
      loginPw: data.get("loginPw")
    };
    handleIsLogin(loginParam)
      .then((res) => {
        handleSetLoginHistories({
          GU_USER_ID: loginParam.loginId,
          GLH_STATUS: "로그인"
        });
        setCookie("token", res.data.token, 1);
        window.location.href = "/";
      })
      .catch((e) => {
        alert("로그인 정보가 잘못되었습니다.");
        throw e;
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <CardContent>
            <img src="/only_logo.png" />
          </CardContent>
          <Typography component="h1" variant="h5">
            엠스토리허브 정산시스템
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="loginId"
              label="아이디"
              placeholder="아이디를 입력해주세요."
              name="loginId"
              autoComplete="loginId"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="loginPw"
              label="패스워드"
              placeholder="비밀번호를 입력해주세요."
              type="password"
              id="loginPw"
              autoComplete="current-password"
            />
            {/*<FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />*/}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3, mb: 2, height: "60px", backgroundColor: "black" }}
            >
              로그인
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
