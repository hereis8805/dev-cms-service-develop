import React from "react";
import { Grid, Typography } from "@mui/material";
import { FormInputText } from "component/FormComponents/FormInputText";

function TypeDE(props) {
  const { control, index } = props;

  return (
    <>
      <Grid container spacing={2} p={2}>
        <Grid item xs>
          D, E형
        </Grid>
        <Grid item xs>
          <FormInputText name={`list.${index}.BASE_AMOUNT`} control={control} label="기준금액" />
        </Grid>
        <Grid item xs>
          <FormInputText name={`list.${index}.SETTLEMENT_UP`} control={control} label="정산율(기준+)" />
        </Grid>
        <Grid item xs>
          <FormInputText name={`list.${index}.SETTLEMENT_DOWN`} control={control} label="정산율(기준-)" />
        </Grid>
      </Grid>
    </>
  );
}

export default TypeDE;
