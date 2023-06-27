import React, { useState } from "react";
import { useListContext } from "react-admin";
import { FormControl, MenuItem, InputLabel, Select } from "@mui/material";

import SearchInput from "./SearchInput";

function SelectSearchInput({ selects, onBlur }) {
  const { filterValues } = useListContext();
  const [selected, setSelected] = useState({
    index: 0,
    ...selects[0]
  });

  function handleChangeSelect(event) {
    setSelected({
      index: event.target.value,
      ...selects[event.target.value]
    });
  }

  function handleBlur(value) {
    const nextFilters = {
      ...filterValues,
      ["searchType"]: selected.id
    };

    selects.forEach((select) => {
      if (select.id !== selected.id) {
        delete nextFilters[select.id];
      }
    });

    if (onBlur) onBlur(nextFilters);
  }

  return (
    <>
      <FormControl variant="standard" sx={{ minWidth: 120, mr: 2 }}>
        <InputLabel variant="standard" />
        <Select label="검색" size="small" value={selected.index} onChange={handleChangeSelect}>
          {selects.map((condition, index) => (
            <MenuItem key={condition.id} value={index}>
              {condition.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {!!selected && (
        <FormControl variant="standard" sx={{ minWidth: 120, mr: 2 }}>
          <SearchInput size="small" variant="standard" name={"searchKeyword"} label={"검색어"} onBlur={handleBlur} />
        </FormControl>
      )}
    </>
  );
}

export default SelectSearchInput;
