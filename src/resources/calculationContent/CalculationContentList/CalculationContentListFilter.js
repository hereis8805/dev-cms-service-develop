import React from "react";
import { CreateButton, ExportButton, useListContext } from "react-admin";
import { Box } from "@mui/material";
import SearchFilter, { useSearchFilter } from "component/filters/SearchFilter";
import SelectSearchInput from "component/filters/SelectSearchInput";

const MG_PAYOUT_DETAILS_CONDITIONS = [
  {
    id: "22",
    name: "구분"
  },
  {
    id: "33",
    name: "유형"
  },
  {
    id: "GCM_SERIES_NAME",
    name: "작품명"
  },
  {
    id: "GCM_MANAGE_ID",
    name: "작품코드"
  },
  {
    id: "44",
    name: "계약상태"
  }
];

function CalculationContentListFilter() {
  const [onSubmit] = useSearchFilter();
  // const onRefresh = useRefresh();
  const { filterValues, setFilters } = useListContext();

  function handleBlurMgPayoutDetailsConditioins(nextFiters) {
    console.log("nextFiters : ", nextFiters);
    onSubmit(nextFiters);
  }

  return (
    <Box sx={{ width: "100%", pt: 1 }}>
      <Box sx={{ textAlign: "right", mb: 1 }}>
        <CreateButton label="단일" basePath="calculation-content/create/single" />
        {/* <CreateButton label='그룹' basePath='calculation-content/create/group' /> */}
        <ExportButton />
      </Box>
      <SearchFilter>
        <SelectSearchInput selects={MG_PAYOUT_DETAILS_CONDITIONS} onBlur={handleBlurMgPayoutDetailsConditioins} />
      </SearchFilter>
    </Box>
  );
}

export default CalculationContentListFilter;
