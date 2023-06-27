import DateFnsUtils from "@date-io/date-fns";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { Box, Button } from "@mui/material";
import Loader from "component/Loader";
import MuiModalCustom from "component/ModalCustom";
import { ko } from "date-fns/locale";

function MonthlySelect(props) {
  const { setIsPopup, isPopup, onHandleSubmit, date, setDate, loading } = props;

  return (
    <MuiModalCustom
      isOpen={isPopup}
      onClose={() => {
        setIsPopup(false);
      }}
      title={"매출반영월 선택"}
    >
      {loading && <Loader />}
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
        <Button variant="contained" color="primary" onClick={onHandleSubmit} sx={{ mr: 2 }}>
          확인
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            setIsPopup(false);
          }}
        >
          닫기
        </Button>
      </Box>
    </MuiModalCustom>
  );
}

export default MonthlySelect;
