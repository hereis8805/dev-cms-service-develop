import { makeStyles } from "@material-ui/core/styles";
import { Alert, Box, Snackbar } from "@mui/material";
import { DataGrid, GridOverlay, useGridApiRef } from "@mui/x-data-grid";
import * as React from "react";
import { useEffect } from "react";
import { useState } from "react";
import CustomPagination from "./CustomPagination";

const useStyles = makeStyles({
  root: {
    width: "100%",
    "& th": {
      textAlign: "center"
    },
    "& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer": {
      display: "none"
    }
  }
});

function DataGridCusutom(props) {
  const classes = useStyles();
  const apiRef = useGridApiRef();

  const OverLay = (props) => {
    const [open, setOpen] = useState(false);
    useEffect(() => {
      setOpen(true);
    }, []);

    const handleClose = (event, reason) => {
      if (reason === "clickaway") {
        return;
      }

      setOpen(false);
    };
    return (
      <>
        <GridOverlay className={classes.root}>
          <div className={classes.label}>데이터가 없습니다.</div>
        </GridOverlay>
        <Snackbar
          open={open}
          autoHideDuration={4000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert onClose={handleClose} severity="warning" sx={{ width: "100%" }}>
            검색 조건에 맞는 데이터가 없습니다.
          </Alert>
        </Snackbar>
      </>
    );
  };

  return (
    <Box
      sx={{
        height: "auto",
        width: "100%",
        backgroundColor: "#FFFFFF",
        // positions: "initial",

        boxShadow:
          "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%);",
        mb: 2,
        p: 2,
        "& .MuiDataGrid-columnHeaderTitle": {
          fontWeight: "bold"
        },
        "& .super-app-theme--header": {
          backgroundColor: "lightgray"
        },
        "& .MuiDataGrid-columnHeaderDraggableContainer": {
          backgroundColor: "lightgray"
        }
      }}
    >
      <DataGrid
        {...props}
        className={classes.root}
        sx={{
          ".MuiDataGrid-columnSeparator": {
            display: "none"
          },
          "&.MuiDataGrid-root": {
            border: "none"
          },
          "& .MuiDataGrid-cell": {
            py: "8px",
            whiteSpace: "normal !important",
            wordWrap: "break-word !important"
          }
        }}
        columns={props.columns.map((item) => {
          return {
            ...item,
            headerClassName: "super-app-theme--header",
            flex: item?.flex ? item?.flex : 1,
            headerAlign: "center",
            align: item.type === "number" ? (item.align ? item.align : "right") : item.align ? item.align : "center",
            width: 100,
            renderCell: item.renderCell && item.renderCell
            // : (params) => (
            //     <div
            //       dangerouslySetInnerHTML={{
            //         __html: params.value
            //       }}
            //     />
            //   )
          };
        })}
        disableColumnMenu
        // rowHeight={50}
        getRowHeight={() => "auto"}
        getEstimatedRowHeight={() => 200}
        autoHeight
        hideFooterPagination={!props.pagination}
        hideFooter={!props.pagination}
        hideFooterSelectedRowCount={!props.pagination}
        components={{
          Pagination: props.pagination ? CustomPagination : null,
          NoRowsOverlay: OverLay
        }}
        componentsProps={{
          pagination: {
            uid: props?.uid,
            rowsPerPageOptions: props.rowsPerPageOptions
          }
        }}
        pageSize={props.pageSize ?? 10}
        apiRef={apiRef}
        rowsPerPageOptions={[props.rowsPerPageOptions ?? 5]}
      />
    </Box>
  );
}

export default DataGridCusutom;
