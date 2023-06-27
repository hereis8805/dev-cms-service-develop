import { Box, Button } from "@mui/material";
import DatePicker from "component/DatePicker";
import { useForm } from "react-hook-form";

function Search(props) {
  const { setRequestParam, requestParam, handleAllDownload } = props;

  const { handleSubmit, control } = useForm({
    defaultValues: {
      searchDate: requestParam?.calculateDataHistory.searchDate
    }
  });

  function onSubmit(values) {
    setRequestParam({
      ...requestParam,
      calculateDataHistory: { searchDate: requestParam?.calculateDataHistory?.searchDate }
    });
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
                value={requestParam?.calculateDataHistory?.searchDate}
                onChange={(nextDate) => {
                  // control.setValue("searchDate", nextDate);
                  setRequestParam({
                    ...requestParam,
                    calculateDataHistory: {
                      ...requestParam?.calculateDataHistory,
                      searchDate: nextDate
                    }
                  });
                }}
                margin="no"
                MuiInput-underline
              />
            </Box>
            <Button type="submit" variant="contained" color="primary" sx={{ ml: 2 }}>
              검색
            </Button>
            <Button
              type="button"
              onClick={handleAllDownload}
              variant="contained"
              color="primary"
              sx={{ margin: "auto 0 0 auto" }}
            >
              전체 다운로드
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
}

export default Search;
