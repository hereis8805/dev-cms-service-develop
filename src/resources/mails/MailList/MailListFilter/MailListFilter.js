import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useListContext, ExportButton } from "react-admin";
import { Box, Button, FormControl, MenuItem, InputLabel, Select } from "@mui/material";
import { Field } from "react-final-form";

import DatePickerInput from "component/DatePickerInput";
import SearchFilter, { useSearchFilter } from "component/filters/SearchFilter";
import SelectSearchInput from "component/filters/SelectSearchInput";

const RECV_CONDITIONS = [
  {
    id: "recv_name",
    name: "수신자"
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

function MailListFilter() {
  const [onSubmit] = useSearchFilter();
  const { filterValues } = useListContext();
  const initialValues = useMemo(
    () => ({
      ...filterValues,
      status_sending: typeof filterValues.status_sending === "number" ? filterValues.status_sending : "ALL"
    }),
    [filterValues]
  );

  // 정산월 변경
  function handleChangeDate(nextDate) {
    onSubmit({
      ...filterValues,
      month_calculate: nextDate
    });
  }

  // CP 타입 코드 변경
  function handleChangeCpTypeCode(onChange) {
    return function (e) {
      onChange(e.target.value);
      onSubmit({
        ...filterValues,
        cp_type_code: e.target.value
      });
    };
  }

  // 전송 상태 변경
  function handleChangeStatusSending(onChange) {
    return function (e) {
      onChange(e.target.value);
      onSubmit({
        ...filterValues,
        status_sending: e.target.value
      });
    };
  }

  // 수신자 or 수신 이메일 변경
  function handleBlurRecvField(nextFilters) {
    onSubmit(nextFilters);
  }

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
      <SearchFilter title="정산 메일 리스트 및 전송 처리" initialValues={initialValues}>
        <FormControl variant="standard" sx={{ minWidth: 120, mr: 2 }}>
          <DatePickerInput
            name="month_calculate"
            label="정산월"
            views={["year", "month"]}
            openTo="month"
            format="yyyy-MM"
            onChange={handleChangeDate}
            size="small"
          />
        </FormControl>
        <FormControl variant="standard" sx={{ minWidth: 120, mr: 2 }}>
          <InputLabel variant="standard">CP 타입</InputLabel>
          <Field name="cp_type_code">
            {({ input }) => (
              <Select {...input} size="small" label="CP 타입" onChange={handleChangeCpTypeCode(input.onChange)}>
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
              <Select
                {...input}
                size="small"
                onChange={handleChangeStatusSending(input.onChange)}
                label="메일 전송 상태"
              >
                <MenuItem value="ALL">전체</MenuItem>
                <MenuItem value={0}>대기</MenuItem>
                <MenuItem value={2}>완료</MenuItem>
                <MenuItem value={-1}>실패</MenuItem>
              </Select>
            )}
          </Field>
        </FormControl>
        <SelectSearchInput selects={RECV_CONDITIONS} onBlur={handleBlurRecvField} />
      </SearchFilter>
    </Box>
  );
}

export default MailListFilter;
