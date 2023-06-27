import React from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import { Form } from "react-final-form";

import useSearchFilter from "./useSearchFilter";

function SearchFilter({ children, initialValues, title }) {
  const [onSubmit] = useSearchFilter();

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#FFFFFF",
        boxShadow:
          "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%);",
        mb: 2,
        p: 2
      }}
    >
      <Typography variant="subtitle1" component="h1" sx={{ mb: 2 }}>
        {title}
      </Typography>
      <Form initialValues={initialValues} onSubmit={onSubmit}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item>{children}</Grid>
              <Grid item>
                <Button type="submit" variant="contained" color="primary">
                  검색
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Form>
    </Box>
  );
}

export default SearchFilter;
