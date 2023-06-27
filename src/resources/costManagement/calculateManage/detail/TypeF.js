import React from "react";
import { Grid, Typography } from "@mui/material";
import { FormInputText } from "component/FormComponents/FormInputText";

function TypeF(props) {
  const { control, index } = props;

  return (
    <>
      <Grid container spacing={2} p={2}>
        <Grid item xs>
          F형
        </Grid>
        <Grid item xs>
          <FormInputText name={`list.${index}.SETTLEMENT_RATE`} control={control} label="대체정산율(F형)" />
        </Grid>
        {/* <Grid item xs>
          <FormInputText name={`list.${index}.GC_SETTLEMENT_RATE`} control={control} label="선급금차감율(F형)" />
        </Grid> */}
        <Grid item xs />
        <Grid item xs />
      </Grid>
    </>
  );
}

export default TypeF;
