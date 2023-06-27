import { Box, Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useState } from "react";
import { useHistory } from "react-router-dom";

function CreateTypeSelect(props) {
  const history = useHistory();
  const { url } = props;
  const [age, setAge] = useState("");

  function onHandleChange(params) {
    setAge(params.target.value);
  }
  return (
    <div>
      <FormControl fullWidth>
        <InputLabel id="create-type">구분</InputLabel>
        <Select labelId="create-type" value={age} label="구분" onChange={onHandleChange}>
          <MenuItem value={"single"}>단일</MenuItem>
          <MenuItem value={"multi"}>그룹</MenuItem>
        </Select>
      </FormControl>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            history.push(`/${url}/create?createType=${age}`);
          }}
        >
          등록
        </Button>
      </Box>
    </div>
  );
}

export default CreateTypeSelect;
