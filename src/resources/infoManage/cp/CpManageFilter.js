import { Box, Button } from "@mui/material";
import SearchFilter, { useSearchFilter } from "component/filters/SearchFilter";
import SelectSearchInput from "component/filters/SelectSearchInput";
import { CreateButton, ExportButton, useListContext, useRefresh } from "react-admin";
import { Form } from "react-final-form";

const MG_PAYOUT_DETAILS_CONDITIONS = [
  {
    id: "CPCODE",
    name: "CP코드"
  },
  {
    id: "CP1",
    name: "CP명"
  },
  {
    id: "CP1",
    name: "거래처코드"
  }
];

function CpManageFilter() {
  const [onSubmit] = useSearchFilter();
  const { filterValues, setFilters } = useListContext();

  function handleBlurMgPayoutDetailsConditioins(nextFiters) {
    console.log("nextFiters : ", nextFiters);
    onSubmit(nextFiters);
  }

  return (
    <Box sx={{ width: "100%", pt: 1 }}>
      <Box sx={{ textAlign: "right", mb: 1 }}>
        <CreateButton label="등록" basePath="calculation-content/create/single" />
        {/* <CreateButton label='그룹' basePath='calculation-content/create/group' /> */}
        <ExportButton />
      </Box>
      <SearchFilter>
        <SelectSearchInput selects={MG_PAYOUT_DETAILS_CONDITIONS} onBlur={handleBlurMgPayoutDetailsConditioins} />
      </SearchFilter>
    </Box>
  );
}

export default CpManageFilter;
