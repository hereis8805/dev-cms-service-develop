import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { Controller } from "react-hook-form";

function SelectSearchInput({ selects, onBlur, register, control }) {
  return (
    <>
      {selects && (
        <Controller
          control={control}
          name={"searchType"}
          render={({ field: { onChange, value } }) => (
            <FormControl variant="standard" sx={{ minWidth: 120, mr: 2 }}>
              <InputLabel variant="standard" />
              <Select onChange={onChange} value={value}>
                {selects.map((condition) => (
                  <MenuItem key={condition.id} value={condition.id}>
                    {condition.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      )}
      <Controller
        name={"searchKeyword"}
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextField
            sx={{ mr: 2, margin: 0.4 }}
            onChange={onChange}
            value={value}
            size="small"
            variant="standard"
            label={"검색어"}
          />
        )}
      />
    </>
  );
}

export default SelectSearchInput;
