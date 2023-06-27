import React from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

function Loader() {
  return (
    <Box
      sx={{
        zIndex: 1300,
        position: "fixed",
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(25, 25, 30, 0.2)"
      }}>
      <CircularProgress />
    </Box>
  );
}

export default Loader;
