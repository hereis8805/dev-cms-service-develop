import React, { useCallback } from "react";
import { SelectInput, TextInput, Button, Labeled, required } from "react-admin";
import { Box, Grid } from "@mui/material";

import LABEL from "../label";

function ContentProviderDetail() {
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
        <Labeled label='CP 정보'></Labeled>
        <Grid container spacing={1}>
          <SelectInput
            margin="none"
            source="GCD_BUSINESS_TYPE"
            variant="standard"
            label='구분'
            choices={[
              { id: "P", name: "개인" },
              { id: "C", name: "사업자" }
            ]}
          />
          <Grid item xs={4}>
            <TextInput fullWidth margin="none" source="GCD_OLD_GROUP" size="small" variant="outlined" label='CP 코드' />
          </Grid>
          <Grid item xs={4}>
            <TextInput fullWidth margin="none" source="GCD_OWNER_NAME" size="small" variant="outlined" label='CP명' />
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <TextInput fullWidth margin="none" source="GCD_OLD" size="small" variant="outlined" label='CP 상세코드' />
          </Grid>
          <Grid item xs={8}>
            <TextInput fullWidth margin="none" source=" " size="small" variant="outlined" label='상세코드설명' />
          </Grid>
        </Grid>
        <TextInput fullWidth margin="none" source="GCD_EMAIL" size="small" variant="outlined" label='이메일' />
        <Labeled label='기타정보'></Labeled>
        <Grid container spacing={1}>
          <Grid item xs={3}>
            <TextInput fullWidth margin="none" source="GCD_COMPANY_NAME" size="small" variant="outlined" label='업체명' />
          </Grid>
          <Grid item xs={3}>
            <TextInput fullWidth margin="none" source="GCD_MANAGER01" size="small" variant="outlined" label='담당자명' />
          </Grid>
          <Grid item xs={3}>
            <TextInput fullWidth margin="none" source="GCD_CONTACT_TEL" size="small" variant="outlined" label='연락처' />
          </Grid>
          <Grid item xs={3}>
            <TextInput fullWidth margin="none" source="GCD_ADDRESS" size="small" variant="outlined" label='주소' />
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={3}>
            <TextInput fullWidth margin="none" source="GCD_BANK" size="small" variant="outlined" label='은행' />
          </Grid>
          <Grid item xs={3}>
            <TextInput fullWidth margin="none" source="GCD_BANK_CODE" size="small" variant="outlined" label='은행 코드' />
          </Grid>
          <Grid item xs={3}>
            <TextInput fullWidth margin="none" source="GCD_ACCOUNT_NO" size="small" variant="outlined" label='계좌번호' />
          </Grid>
          <Grid item xs={3}>
            <TextInput fullWidth margin="none" source="GCD_ACCOUNT_OWNER" size="small" variant="outlined" label='계좌주' />
          </Grid>
        </Grid>
        <TextInput fullWidth margin="none" source="GCD_DESCRIPTION" size="small" variant="outlined" label='비고' />
      </Box>
    </>
  );
}

export default ContentProviderDetail;
