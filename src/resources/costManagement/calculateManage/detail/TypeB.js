import React from "react";
import { Grid, Typography } from "@mui/material";
import { FormInputText } from "component/FormComponents/FormInputText";

function TypeB(props) {
  const { control, index } = props;

  return (
    <>
      <Grid container spacing={2} p={2}>
        <Grid item xs>
          B형
        </Grid>
        <Grid item xs>
          <FormInputText name={`list.${index}.SETTLEMENT_RATE`} control={control} label="대체정산율(B형)" />
        </Grid>
        <Grid item xs />
        <Grid item xs />
      </Grid>
    </>
  );
}

export default TypeB;
