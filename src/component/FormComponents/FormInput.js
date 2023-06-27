const { TextField } = require("@material-ui/core");
const { useController } = require("react-hook-form");

export const FormInput = ({ textFieldProps, ...props }) => {
  const {
    field,
    fieldState: { error }
  } = useController(props);

  return (
    <TextField
      {...textFieldProps}
      {...field}
      error={!!error}
      helperText={!!error && error.message}
      size="small"
      variant="outlined"
      label={props.label}
    />
  );
};
