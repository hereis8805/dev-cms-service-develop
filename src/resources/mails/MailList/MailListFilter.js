import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ExportButton, useListContext } from "react-admin";
import { Box, Button, FormControl, MenuItem, InputLabel, Select, TextField, Typography } from "@mui/material";
import { Form, Field } from "react-final-form";
import { format } from "date-fns";

import DatePicker from "component/DatePicker";

const RECEV_CONDITION = [
  {
    id: "recv_name",
    name: "받는 사람"
  },
  {
    id: "recv_email",
    name: "수신 이메일"
  }
];

const TABS = [
  {
    to: "/mail/create/mails",
    name: "정산 메일 리스트 등록"
  },
  {
    to: "/mail/create/upload",
    name: "정산 파일 업로드"
  },
  {
    to: "/mail/create/check-validation",
    name: "정산 메일 리스트 검증"
  }
];

function MailListFilter({ defaultMonthCalculate }) {
  const { filterValues, setFilters } = useListContext();
  const [date, setDate] = useState(defaultMonthCalculate);
  const [recvCondition, setRecvCondition] = useState(RECEV_CONDITION[0].id);

  function handleChangeDate(nextDate) {
    console.log(nextDate);
    setDate(nextDate);
  }

  // 검색 필터 변경
  function handleChangeRecvCondition(event) {
    setRecvCondition(event.target.value);
  }

  const onSubmit = (values) => {
    const filters = {
      ...values
    };

    if (filters.status_sending === "ALL") {
      filters.status_sending = "";
    }

    if (date) {
      filters.month_calculate = date;
    }

    setFilters(filters);
  };

  return (
    <Box sx={{ width: "100%", pt: 1 }}>
      <Box sx={{ textAlign: "right", mb: 1 }}>
        {TABS.map((tab) => (
          <Button
            component={Link}
            key={tab.to}
            to={tab.to}
            sx={{
              minWidth: 0
            }}
          >
            {tab.name}
          </Button>
        ))}
        <ExportButton />
      </Box>
      <Box
        sx={{
          backgroundColor: "#FFFFFF",
          boxShadow:
            "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%);",
          mb: 2,
          p: 2
        }}
      >
        <Typography variant="subtitle1" component="h1" sx={{ mb: 2 }}>
          정산 메일 리스트 및 전송 처리
        </Typography>
        <Form
          initialValues={{
            ...filterValues,
            status_sending: "ALL"
          }}
          onSubmit={onSubmit}
        >
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: "flex" }}>
                <FormControl variant="standard" sx={{ minWidth: 120, mr: 2 }}>
                  <Box>
                    <DatePicker
                      label="정산월"
                      value={date || format(new Date(), "yyyy-MM")}
                      onChange={handleChangeDate}
                      format="yyyy-MM"
                      openTo="month"
                      views={["year", "month"]}
                    />
                  </Box>
                </FormControl>
                <FormControl variant="standard" sx={{ minWidth: 120, mr: 2 }}>
                  <InputLabel variant="standard">CP 타입</InputLabel>
                  <Field name="cp_type_code">
                    {({ input }) => (
                      <Select {...input} label="CP 타입">
                        <MenuItem value="P">개인</MenuItem>
                        <MenuItem value="C">사업자</MenuItem>
                      </Select>
                    )}
                  </Field>
                </FormControl>
                <FormControl variant="standard" sx={{ minWidth: 120, mr: 2 }}>
                  <InputLabel variant="standard">메일 전송 상태</InputLabel>
                  <Field name="status_sending">
                    {({ input }) => (
                      <Select {...input} label="메일 전송 상태">
                        <MenuItem value="ALL">전체</MenuItem>
                        <MenuItem value={0}>대기</MenuItem>
                        <MenuItem value={2}>완료</MenuItem>
                        <MenuItem value={9}>실패</MenuItem>
                      </Select>
                    )}
                  </Field>
                </FormControl>
                <FormControl variant="standard" sx={{ minWidth: 120, mr: 2 }}>
                  <InputLabel variant="standard" />
                  <Select label="검색" value={recvCondition} onChange={handleChangeRecvCondition}>
                    {RECEV_CONDITION.map((condition) => (
                      <MenuItem key={condition.id} value={condition.id}>
                        {condition.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {!!recvCondition && (
                  <FormControl variant="standard" sx={{ minWidth: 120, mr: 2 }}>
                    <Field name={recvCondition}>
                      {({ input }) => <TextField {...input} label={recvCondition} variant="standard" />}
                    </Field>
                  </FormControl>
                )}
                <Button type="submit" variant="contained" color="primary">
                  검색
                </Button>
              </Box>
            </form>
          )}
        </Form>
      </Box>
    </Box>
  );
}

export default MailListFilter;
