import { format as dateFormat } from "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import ko from "date-fns/locale/ko";
import React, { useState } from "react";
import { Button, makeStyles } from "@material-ui/core";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";

function MyDagePicker({
  disabled = false,
  name,
  dirty,
  format = "yyyy-MM-dd",
  label = "",
  variant = "dialog",
  openTo = "date",
  views = ["year", "month", "date"],
  minDate = "1993-01-01",
  maxDate = "2100-12-31",
  value,
  onChange
}) {
  const [isOpen, setIsOpen] = useState(false);
  function handleChange(date) {
    const nextDate = dateFormat(new Date(date), format);

    if (onChange) {
      onChange(nextDate);
    }
  }

  return (
    <>
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ko}>
        <Button size="large" onClick={() => setIsOpen(true)}>
          {value}
        </Button>
        <div style={{ display: "none" }}>
          <DatePicker
            variant={variant}
            openTo={openTo}
            views={views}
            format={format}
            value={value}
            open={isOpen}
            onOpen={() => setIsOpen(true)}
            onClose={() => setIsOpen(false)}
            onChange={handleChange}
            label={label}
            helperText={dirty && "처리중에는 바꿀수 없습니다"}
            disabled={dirty || disabled}
            name={name}
            minDate={new Date(minDate)}
            maxDate={new Date(maxDate)}
            showTodayButton
            todayLabel="오늘"
            okLabel="설정"
            cancelLabel="취소"
            size="small"
            autoOk
          />
        </div>
      </MuiPickersUtilsProvider>
    </>
  );
}

export default MyDagePicker;
