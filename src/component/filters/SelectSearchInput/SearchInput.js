import React, { useRef, useEffect } from "react";
import { useField } from "react-final-form";
import TextField from "@mui/material/TextField";

function SearchInput({ name, onBlur, ...others }) {
  const {
    input: { onChange, value },
    meta: { touched, error }
  } = useField(name);
  const prevName = useRef(name);

  function handleBlur() {
    onBlur(value);
  }

  useEffect(() => {
    if (prevName.current !== name) {
      prevName.current = name;

      onChange("");
    }
  }, [name, onChange]);

  return (
    <TextField
      {...others}
      value={value}
      name={name}
      onChange={onChange}
      onBlur={handleBlur}
      error={!!(touched && error)}
      helperText={touched && error}
    />
  );
}

export default SearchInput;
