import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import BasePriceUpdatePopup from "./BasePriceUpdatePopup";

const columns = [
  {
    id: "GP_BASE_BALANCE",
    label: "계약",
    minWidth: 170,
    align: "center",
    format: (value) => value.toLocaleString("en-US")
  },
  {
    id: "GP_REAL_BALANCE",
    label: "실제",
    minWidth: 100,
    align: "center",
    format: (value) => value.toLocaleString("en-US")
  },
  {
    id: "GP_BASE_MODIFY",
    label: "계약",
    minWidth: 170,
    align: "center",
    format: (value) => value.toLocaleString("en-US")
  },
  {
    id: "GP_REAL_MODIFY",
    label: "실제",
    minWidth: 100,
    align: "center",
    format: (value) => value.toLocaleString("en-US")
  },
  {
    id: "GP_IDX",
    label: "수정",
    minWidth: 170,
    align: "center"
  }
];

function createData(GP_IDX, GP_BASE_BALANCE, GP_REAL_BALANCE, GP_BASE_MODIFY, GP_REAL_MODIFY) {
  return { GP_IDX, GP_BASE_BALANCE, GP_REAL_BALANCE, GP_BASE_MODIFY, GP_REAL_MODIFY };
}

function Info(props) {
  const { infoData, gpPrepaidSeq, selectDate } = props;
  const rows = [
    createData(
      infoData.GP_IDX,
      infoData.GP_BASE_BALANCE,
      infoData.GP_REAL_BALANCE,
      infoData.GP_BASE_MODIFY,
      infoData.GP_REAL_MODIFY
    )
  ];

  return (
    <div>
      <Paper sx={{ width: "100%" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell key={1} align="center" colSpan={2}>
                  기초 잔액
                </TableCell>
                <TableCell key={2} align="center" colSpan={2}>
                  기초 수정
                </TableCell>
                <TableCell key={3} align="center" colSpan={1}></TableCell>
              </TableRow>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align} style={{ top: 57, minWidth: column.minWidth }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    <TableCell key={row.GP_BASE_BALANCE} align={"center"}>
                      {Number(row.GP_BASE_BALANCE).toLocaleString("ko-KR")}
                    </TableCell>
                    <TableCell key={row.GP_REAL_BALANCE} align={"center"}>
                      {Number(row.GP_REAL_BALANCE).toLocaleString("ko-KR")}
                    </TableCell>
                    <TableCell key={row.GP_BASE_MODIFY} align={"center"}>
                      {Number(row.GP_BASE_MODIFY).toLocaleString("ko-KR")}
                    </TableCell>
                    <TableCell key={row.GP_REAL_MODIFY} align={"center"}>
                      {Number(row.GP_REAL_MODIFY).toLocaleString("ko-KR")}
                    </TableCell>
                    <TableCell align={"center"}>
                      <BasePriceUpdatePopup
                        variant="contained"
                        gpPrepaidSeq={gpPrepaidSeq}
                        gpIdx={row.GP_IDX}
                        selectDate={selectDate}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}

export default Info;
