import React from "react";
import { useListContext, CreateButton, ExportButton } from "react-admin";
import { Box, FormControl } from "@mui/material";

import DatePickerInput from "component/DatePickerInput";
import SearchFilter, { useSearchFilter } from "component/filters/SearchFilter";
import SelectSearchInput from "component/filters/SelectSearchInput";

const MG_PAYOUT_DETAILS_CONDITIONS = [
  {
    id: "cp_name",
    name: "저작권자"
  },
  {
    id: "content_title",
    name: "내용"
  }
];

function MgPayoutDetailsListFilter() {
  const [onSubmit] = useSearchFilter();
  const { filterValues } = useListContext();

  // 정산월 변경
  function handleChangeDate(nextDate) {
    onSubmit({
      ...filterValues,
      month_sales: nextDate
    });
  }

  function handleBlurMgPayoutDetailsConditioins(nextFiters) {
    onSubmit(nextFiters);
  }

  return (
    <Box sx={{ width: "100%", pt: 1 }}>
      <Box sx={{ textAlign: "right", mb: 1 }}>
        <CreateButton />
        <ExportButton />
      </Box>
      <SearchFilter title="선급원가 내역">
        <FormControl variant="standard" sx={{ minWidth: 120, mr: 2 }}>
          <DatePickerInput
            name="month_sales"
            label="정산월"
            views={["year", "month"]}
            openTo="month"
            format="yyyy-MM"
            onChange={handleChangeDate}
          />
        </FormControl>
        <SelectSearchInput selects={MG_PAYOUT_DETAILS_CONDITIONS} onBlur={handleBlurMgPayoutDetailsConditioins} />
      </SearchFilter>
    </Box>
  );
}

export default MgPayoutDetailsListFilter;
