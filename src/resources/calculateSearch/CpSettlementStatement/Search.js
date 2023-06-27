import { IconButton } from "@material-ui/core";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Box, Grid } from "@mui/material";
import DatePicker from "component/CustomDatePicker";
import { add, format, parse } from "date-fns";
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
          <Grid container direction="row" justifyContent="space-between" alignItems="baseline">
            <Grid item>
              <Box />
            </Grid>
            <Grid item>
              <IconButton
                aria-label="search"
                color="black"
                onClick={() => {
                  setDate(format(add(parse(date, "yyyy-MM", new Date()), { months: -1 }), "yyyy-MM"));
                }}
              >
                <ArrowBackIosIcon />
              </IconButton>
              <DatePicker
                views={["year", "month"]}
                openTo="month"
                format="yyyy-MM"
                value={date}
                onChange={(nextDate) => {
                  setDate(nextDate);
                }}
                margin="no"
                MuiInput-underline
              />
              <IconButton
                aria-label="search"
                color="black"
                onClick={() => {
                  setDate(format(add(parse(date, "yyyy-MM", new Date()), { months: 1 }), "yyyy-MM"));
                }}
              >
                <ArrowForwardIosIcon />
              </IconButton>
            </Grid>
            <Grid item></Grid>
          </Grid>
          <br />
        </form>
      </Box>
    </Box>
  );
}

export default Search;
