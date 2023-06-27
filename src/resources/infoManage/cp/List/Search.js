import { Box, Button } from "@mui/material";
import SelectSearchInputCustom from "component/filters/SelectSearchInputCustom";
import { useForm } from "react-hook-form";

const MG_PAYOUT_DETAILS_CONDITIONS = [
  { id: "1", name: "CP명" },
  { id: "2", name: "CP코드" },
  { id: "3", name: "거래처코드" }
];

function Search(props) {
  const { setRequestParam } = props;

  const { control, register, handleSubmit } = useForm({
    defaultValues: {
      searchKeyword: "",
      searchType: 1
    }
  });

  function onSubmit(values) {
    setRequestParam(values);
  }
  return (
    <div>
      <Box sx={{ width: "100%", pt: 1 }}>
        <Box
          sx={{
            backgroundColor: "#FFFFFF",
            boxShadow:
              "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%);",
            mb: 2,
            p: 2
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: "flex" }}>
              <SelectSearchInputCustom
                selects={MG_PAYOUT_DETAILS_CONDITIONS}
                onBlur={onSubmit}
                register={register}
                control={control}
              />
              <Button type="submit" variant="contained" color="primary">
                검색
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </div>
  );
}

export default Search;
