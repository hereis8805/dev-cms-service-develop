import { Box, Button } from "@mui/material";
import { FormInputDate } from "component/FormComponents/FormInputDate";
import { useForm } from "react-hook-form";
import { nowDate } from "utils/commonUtils";

function Search(props) {
  const { setRequestParam } = props;

  const { control, handleSubmit } = useForm({
    defaultValues: {
      startDate: nowDate,
      endDate: nowDate
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
              <Box sx={{ m: 1 }}>
                <FormInputDate control={control} name={"startDate"} label={"시작일정"} />
              </Box>
              <Box sx={{ m: 1 }}>
                <FormInputDate control={control} name={"endDate"} label={"종료일정"} />
              </Box>
              <Box sx={{ m: 1 }}>
                <Button type="submit" variant="contained" color="primary">
                  검색
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
      </Box>
    </div>
  );
}

export default Search;
