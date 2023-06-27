import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

const columns = [
  {
    id: "GPM_ACTUAL_MONTH",
    label: "월",
    minWidth: 170,
    align: "center"
  },
  {
    id: "GPM_PREVIOUS_REAL",
    label: "원화",
    minWidth: 170,
    align: "center"
  },
  { id: "GPM_PREVIOUS_FOREIGN", label: "외화", minWidth: 170, align: "center" },
  {
    id: "GP_CURRENCY_RATE",
    label: "환율",
    minWidth: 170,
    align: "center"
  },
  {
    id: "GPM_REAL_DEDUCTION",
    label: "원화",
    minWidth: 170,
    align: "center"
  },
  {
    id: "GPM_FOREIGN_DEDUCTION",
    label: "외화",
    minWidth: 170,
    align: "center"
  },
  {
    id: "GPM_REAL",
    label: "원화",
    minWidth: 170,
    align: "center"
  },
  {
    id: "GPM_FOREIGN",
    label: "외화",
    minWidth: 170,
    align: "center"
  },
  {
    id: "GPM_REAL_TERMINATION",
    label: "원화",
    minWidth: 170,
    align: "center"
  },
  {
    id: "GPM_FOREIGN_TERMINATION",
    label: "외화",
    minWidth: 170,
    align: "center"
  },
  {
    id: "GPM_REAL_BALANCE",
    label: "원화",
    minWidth: 170,
    align: "center"
  },
  {
    id: "GPM_FOREIGN_BALANCE",
    label: "외화",
    minWidth: 170,
    align: "center"
  },
  {
    id: "GPM_DESCRIPTION",
    label: "비고",
    minWidth: 170,
    align: "center"
  }
];

function DetailList(props) {
  const { listData, gpPrepaidSeq, selectDate } = props;

  let TOTAL_GPM_CONTACT = 0;
  let TOTAL_GPM_REAL = 0;
  let TOTAL_GPM_CONTACT_DEDUCTION = 0;
  let TOTAL_GPM_REAL_DEDUCTION = 0;
  let TOTAL_GPM_CONTACT_TERMINATION = 0;
  let TOTAL_GPM_REAL_TERMINATION = 0;
  let TOTAL_GPM_CONTACT_BALANCE = 0;
  let TOTAL_GPM_REAL_BALANCE = 0;

  return (
    <div>
      <Paper sx={{ width: "100%" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell align="center" colSpan={1}></TableCell>
                <TableCell align="center" colSpan={3}>
                  기초잔액
                </TableCell>
                <TableCell align="center" colSpan={2}>
                  차감
                </TableCell>
                <TableCell align="center" colSpan={2}>
                  수령
                </TableCell>
                <TableCell align="center" colSpan={2}>
                  해지
                </TableCell>
                <TableCell align="center" colSpan={2}>
                  장부금액
                </TableCell>
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
              {listData.map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    <TableCell key={row.GPM_ACTUAL_MONTH} align={"center"}>
                      {Number(row.GPM_ACTUAL_MONTH).toLocaleString("ko-KR")}
                    </TableCell>
                    <TableCell key={row.GPM_PREVIOUS_REAL} align={"center"}>
                      {Number(row.GPM_PREVIOUS_REAL).toLocaleString("ko-KR")}
                    </TableCell>
                    <TableCell key={row.GPM_PREVIOUS_FOREIGN} align={"center"}>
                      {Number(row.GPM_PREVIOUS_FOREIGN).toLocaleString("ko-KR")}
                    </TableCell>
                    <TableCell key={row.GP_CURRENCY_RATE} align={"center"}>
                      {Number(row.GP_CURRENCY_RATE).toLocaleString("ko-KR")}
                    </TableCell>
                    <TableCell key={row.GPM_REAL_DEDUCTION} align={"center"}>
                      {Number(row.GPM_REAL_DEDUCTION).toLocaleString("ko-KR")}
                    </TableCell>
                    <TableCell key={row.GPM_FOREIGN_DEDUCTION} align={"center"}>
                      {Number(row.GPM_FOREIGN_DEDUCTION).toLocaleString("ko-KR")}
                    </TableCell>
                    <TableCell key={row.GPM_REAL} align={"center"}>
                      {Number(row.GPM_REAL).toLocaleString("ko-KR")}
                    </TableCell>
                    <TableCell key={row.GPM_FOREIGN} align={"center"}>
                      {Number(row.GPM_FOREIGN).toLocaleString("ko-KR")}
                    </TableCell>
                    <TableCell key={row.GPM_REAL_TERMINATION} align={"center"}>
                      {Number(row.GPM_REAL_TERMINATION).toLocaleString("ko-KR")}
                    </TableCell>
                    <TableCell key={row.GPM_FOREIGN_TERMINATION} align={"center"}>
                      {Number(row.GPM_FOREIGN_TERMINATION).toLocaleString("ko-KR")}
                    </TableCell>
                    <TableCell key={row.GPM_REAL_BALANCE} align={"center"}>
                      {Number(row.GPM_REAL_BALANCE).toLocaleString("ko-KR")}
                    </TableCell>
                    <TableCell key={row.GPM_FOREIGN_BALANCE} align={"center"}>
                      {Number(row.GPM_FOREIGN_BALANCE).toLocaleString("ko-KR")}
                    </TableCell>
                    <TableCell key={row.GPM_DESCRIPTION} align={"center"}>
                      {Number(row.GPM_DESCRIPTION).toLocaleString("ko-KR")}
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

export default DetailList;
