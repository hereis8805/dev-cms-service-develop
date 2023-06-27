import { InputAdornment } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import SearchIcon from "@material-ui/icons/Search";
import { Controller, useController } from "react-hook-form";
// import { FormInputProps } from "./FormInputProps";

export const FormInputText = (props) => {
  const {
    field,
    fieldState: { error }
  } = useController(props);

  const { name, control, label, multiline, rows, required } = props;
  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: required
      }}
      render={({ field: { onChange, value }, fieldState: { error }, formState }) => (
        <TextField
          {...props}
          {...field}
          InputLabelProps={{ shrink: value && true }}
          InputProps={{
            endAdornment: props.search && (
              <InputAdornment position="end" onClick={props.popupBtn} style={{ cursor: "pointer" }}>
                <SearchIcon />
              </InputAdornment>
            )
          }}
          helperText={error ? error.message : null}
          size="small"
          error={!!error}
          onChange={onChange}
          value={value}
          fullWidth
          label={label}
          multiline={multiline}
          minRows={rows}
          variant="outlined"
        />
      )}
    />
  );
};
