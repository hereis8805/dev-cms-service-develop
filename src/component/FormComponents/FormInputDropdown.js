import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import { Controller, useController } from "react-hook-form";

export const FormInputDropdown = ({ name, control, label, options, required }) => {
  const generateSingleOptions = () => {
    return options.map((option) => {
      return (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      );
    });
  };

  const {
    fieldState: { error }
  } = useController({
    name,
    control,
    rules: { required }
  });

  return (
    <FormControl size={"small"} fullWidth variant="outlined" required={required} error={error}>
      <InputLabel id={`demo-simple-select-${required ? "required" : "helper"}-label`}>{label}</InputLabel>
      <Controller
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <Select
            onChange={onChange}
            value={value ? value : ""}
            label={label}
            labelId={`demo-simple-select-${required ? "required" : "helper"}-label`}
            id={`demo-simple-select-${required ? "required" : "helper"}`}
          >
            {generateSingleOptions()}
          </Select>
        )}
        control={control}
        name={name}
      />
    </FormControl>
  );
};
