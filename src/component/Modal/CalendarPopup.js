import DateFnsUtils from "@date-io/date-fns";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ko from "date-fns/locale/ko";
import { useState } from "react";
// import DatePicker from "component/CustomDatePicker";
import { getToday } from "utils/date";
function CalendarPopup(props) {
  const [date, setDate] = useState(getToday("yyyy-MM"));
  return (
    <>
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ko}>
        <DatePicker
          views={["year", "month"]}
          variant="static"
          openTo="month"
          format="yyyy-MM"
          value={date}
          onChange={(nextDate) => {
            setDate(nextDate);
          }}
          margin="no"
          MuiInput-underline
          size="small"
        />
      </MuiPickersUtilsProvider>

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            //   setIsPopup(false);
          }}
        >
          확인
        </Button>
      </Box>
    </>
  );
}

export default CalendarPopup;
