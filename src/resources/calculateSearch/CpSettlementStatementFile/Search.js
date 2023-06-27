// import { DatePicker } from "@material-ui/pickers";
import { Box, Button } from "@mui/material";
import DatePicker from "component/DatePicker";
import { useForm } from "react-hook-form";

function Search(props) {
  const { setRequestParam, date, setDate } = props;

  const { handleSubmit } = useForm({
    defaultValues: {
      searchKeyword: "",
      searchType: 1
    }
  });

  function onSubmit(values) {
    setRequestParam(values);
  }

  return (
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
            <Box>
              <DatePicker
                views={["year", "month"]}
                label="매출반영월"
                openTo="month"
                format="yyyy-MM"
                value={date}
                onChange={(nextDate) => {
                  setDate(nextDate);
                }}
                margin="no"
                MuiInput-underline
              />
            </Box>
            <Button type="submit" variant="contained" color="primary" sx={{ ml: 2 }}>
              검색
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
}

export default Search;
