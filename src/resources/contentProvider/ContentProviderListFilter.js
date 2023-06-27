import React from "react";
import { CreateButton, ExportButton, useListContext } from "react-admin";
import { Box } from "@mui/material";
import SearchFilter, { useSearchFilter } from "component/filters/SearchFilter";
import SelectSearchInput from "component/filters/SelectSearchInput";

const MG_PAYOUT_DETAILS_CONDITIONS = [
  {
    id: "GCD_OWNER_NAME",
    name: "CP명"
  },
  {
    id: "GCD_OLD",
    name: "CP코드"
  },
  {
    id: "GCD_MANAGER01",
    name: "담당자명"
  },
];

function CalculationContentListFilter() {
  const [onSubmit] = useSearchFilter();
  // const onRefresh = useRefresh();
  const { filterValues, setFilters } = useListContext();

  function handleBlurMgPayoutDetailsConditioins(nextFiters) {
    onSubmit(nextFiters);
  }

  return (
    <Box sx={{ width: "100%", pt: 1 }}>
      <Box sx={{ textAlign: "right", mb: 1 }}>
        <CreateButton label='단일' basePath='contentProvider/create/single' />
        {/* <CreateButton label='그룹' basePath='contentProvider/create/group' /> */}
        <ExportButton />
      </Box>
      <SearchFilter>
        <SelectSearchInput selects={MG_PAYOUT_DETAILS_CONDITIONS} onBlur={handleBlurMgPayoutDetailsConditioins} />
      </SearchFilter>
    </Box>
  );
}

export default CalculationContentListFilter;
