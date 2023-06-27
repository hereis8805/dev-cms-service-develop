import React, { useCallback } from "react";
import { SelectInput, TextInput, Button } from "react-admin";
import { Box, Grid } from "@mui/material";

import LABEL from "../label";

function CalculationContentGroupDetail() {
  // 숫자만 입력할 수 있게 한다
  const handleChangeOnlyNumber = useCallback((value) => {
    if (!value) return "";

    return value.replace(/[^0-9]/g, "");
  }, []);

  return (
    <>
      <Box
        sx={{
          pb: 4
        }}
      >
        <Grid container spacing={1}>
          <SelectInput
            margin="none"
            source="cp_type_code"
            variant="standard"
            label={LABEL.cp_type}
            choices={[
              { id: "P", name: "개인" },
              { id: "C", name: "사업자" }
            ]}
          />
          <Grid item xs={4}>
            <TextInput fullWidth margin="none" source="cp_code" size="small" variant="outlined" label={LABEL.cp_code} />
          </Grid>
          <Grid item xs={4}>
            <TextInput fullWidth margin="none" source="cp_name" size="small" variant="outlined" label={LABEL.cp_name} />
          </Grid>
        </Grid>
        {/* <TextInput
          fullWidth
          margin="none"
          source="cp_pen_name"
          size="small"
          variant="outlined"
          label={LABEL.cp_pen_name}
        /> */}
        {/* <TextInput
          fullWidth
          margin="none"
          source="cp_account_number"
          size="small"
          variant="outlined"
          label={LABEL.cp_account_number}
        /> */}
        <TextInput fullWidth margin="none" source="email" size="small" variant="outlined" label={LABEL.email} />
        <TextInput fullWidth margin="none" source="contract" size="small" variant="outlined" label={LABEL.contract} />
        <TextInput fullWidth margin="none" source="address" size="small" variant="outlined" label={LABEL.address} />
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <TextInput
              fullWidth
              margin="none"
              source="manager1"
              size="small"
              variant="outlined"
              label={LABEL.manager1}
              helperText={false}
            />
          </Grid>
          <Grid item xs={6}>
            <TextInput
              fullWidth
              margin="none"
              source="manager2"
              size="small"
              variant="outlined"
              label={LABEL.manager2}
              helperText={false}
            />
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          borderTop: "1px solid rgb(192, 192, 192)",
          pt: 4
        }}
      >
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <TextInput fullWidth margin="none" source="bank" size="small" variant="outlined" label={LABEL.bank} />
          </Grid>
          <Grid item xs={8}>
            <TextInput
              fullWidth
              margin="none"
              source="bank_account_number"
              size="small"
              variant="outlined"
              format={handleChangeOnlyNumber}
              label={LABEL.bank_account_number}
            />
          </Grid>
        </Grid>
        <TextInput
          fullWidth
          margin="none"
          source="bank_account_name"
          size="small"
          variant="outlined"
          label={LABEL.bank_account_name}
        />
        <TextInput
          fullWidth
          margin="none"
          source="bank_account_holder"
          size="small"
          variant="outlined"
          label={LABEL.bank_account_holder}
        />
        <TextInput
          fullWidth
          margin="none"
          source="description"
          size="small"
          variant="outlined"
          label={LABEL.description}
          helperText={false}
        />
      </Box>
    </>
  );
}

export default CalculationContentGroupDetail;
