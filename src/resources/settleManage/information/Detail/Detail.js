import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

const currencies = [
  {
    value: "서비스중",
    label: "서비스중"
  },
  {
    value: "유효",
    label: "유효"
  },
  {
    value: "종료",
    label: "종료"
  },
  {
    value: "해지",
    label: "해지"
  }
];

function informationWorkDetail(props) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [resultData, setResultData] = useState([]);

  return (
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": { m: 1, width: "25ch" }
      }}
      noValidate
      autoComplete="off"
    >
      <div>
        <h3>{"작품정보"}</h3>
      </div>
      <div>
        <TextField id="outlined-helperText" label="작품 유형" defaultValue="" />
        <TextField id="outlined-helperText" label="작품 코드" defaultValue="" />
        <TextField id="outlined-helperText" label="작품명" defaultValue="" />
        <TextField id="outlined-select-currency" select label="계약상태" defaultValue="서비스중">
          {currencies.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </div>
      <br />
      <div>
        <h3>{"CP정보 (돋보기 버튼으로 조회 후 추가)"}</h3>
      </div>
      <div>
        <Paper component="form" sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: 400 }}>
          <TextField
            id="outlined-helperText"
            label="CP상세코드"
            defaultValue=""
            InputProps={{
              readOnly: true
            }}
          />
          <TextField
            id="outlined-helperText"
            label="CP명"
            defaultValue=""
            InputProps={{
              readOnly: true
            }}
          />
          <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>
      </div>
      <br />
      <div>
        <h3>{"기타 정보"}</h3>
      </div>
      <div>
        <TextField id="outlined-helperText" label="작품명1" defaultValue="" />
        <TextField id="outlined-helperText" label="작품명2" defaultValue="" />
        <TextField id="outlined-helperText" label="저자명1" defaultValue="" />
        <TextField id="outlined-helperText" label="저자명2" defaultValue="" />
        <br />
        <TextField id="outlined-helperText" label="출판사1" defaultValue="" />
        <TextField id="outlined-helperText" label="출판사2" defaultValue="" />
        <TextField id="outlined-helperText" label="담당부서" defaultValue="" />
        <Paper component="form" sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: 400 }}>
          <TextField
            id="outlined-helperText"
            label="계약서 번호"
            defaultValue=""
            InputProps={{
              readOnly: true
            }}
          />
          <TextField
            id="outlined-helperText"
            label="계약 상태"
            defaultValue=""
            InputProps={{
              readOnly: true
            }}
          />
          <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>
        <br />
        <FormControl fullWidth sx={{ m: 1 }} variant="standard">
          <InputLabel htmlFor="standard-adornment-amount">비고</InputLabel>
          <Input id="standard-adornment-amount" startAdornment={<InputAdornment position="start"></InputAdornment>} />
        </FormControl>
      </div>
      <br />
      <div>
        <Stack spacing={2} direction="row">
          <Button variant="contained">저장</Button>
        </Stack>
      </div>
    </Box>
  );
}

export default informationWorkDetail;
