import React from "react";
import { format as dateFormat } from "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import ko from "date-fns/locale/ko";
import { MuiPickersUtilsProvider, DatePicker, KeyboardDatePicker } from "@material-ui/pickers";
import { Controller } from "react-hook-form";
import { nowDate } from "utils/commonUtils";

function KeyboardMonthPicker({
  disabled = false,
  name,
  dirty,
  format = "yyyy-MM",
  label = "",
  variant = "dialog",
  openTo = "month",
  views = ["year", "month"],
  minDate = "1993-01-01",
  maxDate = "2100-12-31",
  value,
  onChange,
  control
}) {
  function handleChange(date) {
    const nextDate = dateFormat(new Date(date), format);

    if (onChange) {
      onChange(nextDate);
    }
  }

  return (
    <>
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ko}>
        <Controller
          name={name}
          control={control}
          render={({ field, fieldState, formState }) => (
            <KeyboardDatePicker
              variant={variant}
              openTo={openTo}
              views={views}
              format={format}
              value={value}
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
              // fullWidth
              // variant="inline"
              defaultValue={nowDate}
              id={`date-${Math.random()}`}
              // label={label}
              // rifmFormatter={(val) => val.replace(/[^[a-zA-Z0-9-]*$]+/gi, "")}
              // refuse={/[^[a-zA-Z0-9-]*$]+/gi}
              KeyboardButtonProps={{
                "aria-label": "change date"
              }}
              {...field}
            />
          )}
        />
      </MuiPickersUtilsProvider>
    </>
  );
}

export default KeyboardMonthPicker;
