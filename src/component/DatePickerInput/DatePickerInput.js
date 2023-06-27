import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { format as dateFormat } from "date-fns";
import { useField } from "react-final-form";

import { getUrlQuery } from "utils/commonUtils";

import DatePicker from "component/DatePicker";

function DatePickerInput({
  disabled = false,
  initialDate = "",
  name,
  dirty,
  format = "yyyy-MM-dd",
  label = "",
  variant = "dialog",
  openTo = "date",
  views = ["year", "month", "date"],
  minDate = "1993-01-01",
  maxDate = "2100-12-31",
  onChange
}) {
  const location = useLocation();
  const initialValue = useMemo(() => {
    const filter = getUrlQuery(location.search, "filter");
    const filterObj = !!filter ? JSON.parse(filter) : null;

    return !!filterObj && filterObj[name] ? filterObj[name] : "";
  }, [location.search, name]);
  const {
    input: { onChange: handleChange, value }
  } = useField(name, {
    initialValue: initialValue || initialDate || dateFormat(new Date(), format)
  });

  function handleChangeDate(date) {
    const nextDate = dateFormat(new Date(date), format);

    handleChange(nextDate);

    if (onChange) onChange(nextDate);
  }

  return (
    <DatePicker
      variant={variant}
      openTo={openTo}
      views={views}
      format={format}
      value={value}
      onChange={handleChangeDate}
      label={label}
      helperText={dirty && "처리중에는 바꿀수 없습니다"}
      disabled={dirty || disabled}
      name={name}
      minDate={new Date(minDate)}
      maxDate={new Date(maxDate)}
      showTodayButton
      todayLabel="오늘!"
      okLabel="설정"
      cancelLabel="취소"
      autoOk
    />
  );
}

export default DatePickerInput;
