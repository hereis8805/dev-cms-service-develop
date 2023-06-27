import DateFnsUtils from "@date-io/date-fns";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import ko from "date-fns/locale/ko";
import { Controller } from "react-hook-form";
import { nowDate } from "utils/commonUtils";

export const FormInputDate = (props) => {
  const { name, control, label, format = "yyyy-MM-dd" } = props;
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ko}>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState, formState }) => (
          <KeyboardDatePicker
            // fullWidth
            variant="inline"
            defaultValue={nowDate}
            id={`date-${Math.random()}`}
            label={label}
            // rifmFormatter={(val) => val.replace(/[^[a-zA-Z0-9-]*$]+/gi, "")}
            // refuse={/[^[a-zA-Z0-9-]*$]+/gi}
            autoOk
            KeyboardButtonProps={{
              "aria-label": "change date"
            }}
            format={format}
            {...props}
            {...field}
          />
        )}
      />
    </MuiPickersUtilsProvider>
  );
};
