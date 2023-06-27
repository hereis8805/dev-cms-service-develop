import React, { useEffect } from "react";
import { useField } from "react-final-form";
import TextField from "@mui/material/TextField";

function DefaultValueInput({ defaultValue, name, ...others }) {
  const {
    input: { onChange, value },
    meta: { touched, error }
  } = useField(name);

  useEffect(() => {
    if (!defaultValue) return;

    onChange(defaultValue);
  }, [defaultValue, onChange]);

  return (
    <TextField
      {...others}
      value={value}
      name={name}
      onChange={onChange}
      error={!!(touched && error)}
      helperText={touched && error}
    />
  );
}

export default DefaultValueInput;
