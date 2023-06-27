import React, { useCallback } from "react";
import { SelectInput, TextInput, Button, Labeled } from "react-admin";
import { Box, Grid, TextField } from "@mui/material";
import { LabelField } from "component/LabelTextField";

function CalculationContentDetail() {
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
        <Labeled label='작품정보'></Labeled>
        <Grid container spacing={1}>
          <SelectInput
            margin="none"
            source="cp_type_code"
            variant="standard"
            label='작품 유형'
            // choices={[
            //   { id: "P", name: "개인" },
            //   { id: "C", name: "사업자" }
            // ]}
          />
          <Grid item xs={4}>
            <TextInput fullWidth margin="none" source="cp_code" size="small" variant="outlined" label='작품 코드' />
          </Grid>
          <Grid item xs={4}>
            <TextInput fullWidth margin="none" source="cp_name" size="small" variant="outlined" label='작품명' />
          </Grid>
          <SelectInput
              margin="none"
              source="cp_type_code"
              variant="standard"
              label='계약 상태'
              // choices={[
              //   { id: "P", name: "개인" },
              //   { id: "C", name: "사업자" }
              // ]}
            />
        </Grid>
        <Labeled label='CP정보'></Labeled>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <TextInput
              fullWidth
              margin="none"
              source="manager1"
              size="small"
              variant="outlined"
              label={'CP 상세코드'}
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
              label='CP명'
              helperText={false}
            />
          </Grid>
        </Grid>
      </Box>
      <Box>
        <Labeled label='기타정보'></Labeled>
        <Grid container spacing={1}>
          <Grid item xs={3}>
            <TextInput fullWidth margin="none" source=" " size="small" variant="outlined" label='작품명1' />
          </Grid>
          <Grid item xs={3}>
            <TextInput fullWidth margin="none" source=" " size="small" variant="outlined" label='작품명2' />
          </Grid>
          <Grid item xs={3}>
            <TextInput fullWidth margin="none" source=" " size="small" variant="outlined" label='작품명3' />
          </Grid>
          <Grid item xs={3}>
            <TextInput fullWidth margin="none" source=" " size="small" variant="outlined" label='작품명4' />
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={3}>
            <TextInput fullWidth margin="none" source=" " size="small" variant="outlined" label='저자명1' />
          </Grid>
          <Grid item xs={3}>
            <TextInput fullWidth margin="none" source=" " size="small" variant="outlined" label='저자명2' />
          </Grid>
          <Grid item xs={3}>
            <TextInput fullWidth margin="none" source=" " size="small" variant="outlined" label='저자명3' />
          </Grid>
          <Grid item xs={3}>
            <TextInput fullWidth margin="none" source=" " size="small" variant="outlined" label='저자명4' />
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={3}>
            <TextInput fullWidth margin="none" source=" " size="small" variant="outlined" label='출판사1' />
          </Grid>
          <Grid item xs={3}>
            <TextInput fullWidth margin="none" source=" " size="small" variant="outlined" label='출판사2' />
          </Grid>
          <Grid item xs={3}>
            <TextInput fullWidth margin="none" source=" " size="small" variant="outlined" label='담당부서' />
          </Grid>
          <Grid item xs={3}>
            <TextInput fullWidth margin="none" source=" " size="small" variant="outlined" label='계약서 번호' />
          </Grid>
        </Grid>
        <TextInput fullWidth margin="none" source=" " size="small" variant="outlined" label='비고' />
      </Box>
    </>
  );
}

export default CalculationContentDetail;
