import React, { useEffect, useState } from "react";
import { Checkbox, FormControl, FormControlLabel, FormLabel } from "@material-ui/core";
import { Controller } from "react-hook-form";

const options = [
  {
    label: "Checkbox Option 1",
    value: "1"
  },
  {
    label: "Checkbox Option 2",
    value: "2"
  }
];

export const FormInputMultiCheckbox = ({ name, control, setValue, label }) => {
  const [selectedItems, setSelectedItems] = useState([]);

  const handleSelect = (value) => {
    const isPresent = selectedItems.indexOf(value);
    if (isPresent !== -1) {
      const remaining = selectedItems.filter((item) => item !== value);
      setSelectedItems(remaining);
    } else {
      setSelectedItems((prevItems) => [...prevItems, value]);
    }
  };

  useEffect(() => {
    setValue(name, selectedItems);
  }, [selectedItems]);

  return (
    <FormControl size={"small"} variant={"outlined"}>
      <FormLabel component="legend">{label}</FormLabel>

      <div>
        {options.map((option) => {
          return (
            <FormControlLabel
              control={
                <Controller
                  name={name}
                  render={({}) => {
                    return (
                      <Checkbox
                        checked={selectedItems.includes(option.value)}
                        onChange={() => handleSelect(option.value)}
                      />
                    );
                  }}
                  control={control}
                />
              }
              label={option.label}
              key={option.value}
            />
          );
        })}
      </div>
    </FormControl>
  );
};
