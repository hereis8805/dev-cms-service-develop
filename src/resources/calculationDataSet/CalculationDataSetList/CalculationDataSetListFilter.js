import React from "react";
import { CreateButton, ExportButton, useRefresh, useListContext } from "react-admin";
import { Box, Button, FormControl, MenuItem, InputLabel, Select, Typography } from "@mui/material";
import { Form, Field } from "react-final-form";
import DatePickerInput from "component/DatePickerInput";

function CalculationDataSetListFilter() {
  const onRefresh = useRefresh();
  const { filterValues, setFilters } = useListContext();

  // 검색
  function onSubmit(values) {
    const filters = {
      ...values
    };

    if (Object.entries(filterValues).toString() === Object.entries(filters).toString()) {
      onRefresh();

      return;
    }

    setFilters(filters);
  }

  // 정산월 변경
  function handleChangeDate(nextDate) {
    onSubmit({
      ...filterValues,
      selectDate: nextDate
    });
  }

  return (
    <Box sx={{ width: "100%", pt: 1 }}>
      <Box sx={{ textAlign: "right", mb: 1 }}></Box>
      <Box
        sx={{
          backgroundColor: "#FFFFFF",
          boxShadow:
            "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%);",
          mb: 2,
          p: 2
        }}
      >
        <Form
          initialValues={{
            ...filterValues,
            cp_type_code: !filterValues.cp_type_code ? "ALL" : filterValues.cp_type_code
          }}
          onSubmit={onSubmit}
        >
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: "flex" }}>
                <FormControl variant="standard" sx={{ minWidth: 120, mr: 2 }}>
                  <Box>
                    <DatePickerInput
                      name="selectDate"
                      label="매출반영월"
                      views={["year", "month"]}
                      openTo="month"
                      format="yyyy-MM"
                      onChange={handleChangeDate}
                    />
                  </Box>
                </FormControl>
                <Button type="submit" variant="contained" color="primary">
                  검색
                </Button>
              </Box>
            </form>
          )}
        </Form>
      </Box>
    </Box>
  );
}

export default CalculationDataSetListFilter;
