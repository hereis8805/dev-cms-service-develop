import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

const totalColumns = [
  {
    id: "GPM_CONTACT",
    label: "계약 (Total)",
    minWidth: 170,
    align: "center"
  },
  { id: "GPM_REAL", label: "실제 (Total)", minWidth: 170, align: "center" },
  {
    id: "GPM_CONTACT_DEDUCTION",
    label: "계약 (Total)",
    minWidth: 170,
    align: "center"
  },
  {
    id: "GPM_REAL_DEDUCTION",
    label: "실제 (Total)",
    minWidth: 170,
    align: "center"
  },
  {
    id: "GPM_CONTACT_TERMINATION",
    label: "계약 (Total)",
    minWidth: 170,
    align: "center"
  },
  {
    id: "GPM_REAL_TERMINATION",
    label: "실제 (Total)",
    minWidth: 170,
    align: "center"
  },
  {
    id: "GPM_CONTACT_BALANCE",
    label: "계약 (Total)",
    minWidth: 170,
    align: "center"
  },
  {
    id: "GPM_REAL_BALANCE",
    label: "실제 (Total)",
    minWidth: 170,
    align: "center"
  }
];

function TotalDetailList(props) {
  const { listData } = props;

  let TOTAL_GPM_CONTACT = 0;
  let TOTAL_GPM_REAL = 0;
  let TOTAL_GPM_CONTACT_DEDUCTION = 0;
  let TOTAL_GPM_REAL_DEDUCTION = 0;
  let TOTAL_GPM_CONTACT_TERMINATION = 0;
  let TOTAL_GPM_REAL_TERMINATION = 0;
  let TOTAL_GPM_CONTACT_BALANCE = 0;
  let TOTAL_GPM_REAL_BALANCE = 0;

  listData.map((row) => {
    TOTAL_GPM_CONTACT += row.GPM_CONTACT;
    TOTAL_GPM_REAL += row.GPM_REAL;
    TOTAL_GPM_CONTACT_DEDUCTION += row.GPM_CONTACT_DEDUCTION;
    TOTAL_GPM_REAL_DEDUCTION += row.GPM_REAL_DEDUCTION;
    TOTAL_GPM_CONTACT_TERMINATION += row.GPM_CONTACT_TERMINATION;
    TOTAL_GPM_REAL_TERMINATION += row.GPM_REAL_TERMINATION;
    TOTAL_GPM_CONTACT_BALANCE += row.GPM_CONTACT_BALANCE;
    TOTAL_GPM_REAL_BALANCE += row.GPM_REAL_BALANCE;
  });

  return (
    <div>
      <Paper sx={{ width: "100%" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell key={1} align="center" colSpan={11}>
                  <b>Total</b>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center" colSpan={2}>
                  당기지급 (Total)
                </TableCell>
                <TableCell align="center" colSpan={2}>
                  당기차감 (Total)
                </TableCell>
                <TableCell align="center" colSpan={2}>
                  당기차감(해지) (Total)
                </TableCell>
                <TableCell align="center" colSpan={2}>
                  월말 잔액 (Total)
                </TableCell>
              </TableRow>
              <TableRow>
                {totalColumns.map((column) => (
                  <TableCell key={column.id} align={column.align} style={{ top: 57, minWidth: column.minWidth }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableCell align={"center"}>{Number(TOTAL_GPM_CONTACT).toLocaleString("ko-KR")}</TableCell>
              <TableCell align={"center"}>{Number(TOTAL_GPM_REAL).toLocaleString("ko-KR")}</TableCell>
              <TableCell align={"center"}>{Number(TOTAL_GPM_CONTACT_DEDUCTION).toLocaleString("ko-KR")}</TableCell>
              <TableCell align={"center"}>{Number(TOTAL_GPM_REAL_DEDUCTION).toLocaleString("ko-KR")}</TableCell>
              <TableCell align={"center"}>{Number(TOTAL_GPM_CONTACT_TERMINATION).toLocaleString("ko-KR")}</TableCell>
              <TableCell align={"center"}>{Number(TOTAL_GPM_REAL_TERMINATION).toLocaleString("ko-KR")}</TableCell>
              <TableCell align={"center"}>{Number(TOTAL_GPM_CONTACT_BALANCE).toLocaleString("ko-KR")}</TableCell>
              <TableCell align={"center"}>{Number(TOTAL_GPM_REAL_BALANCE).toLocaleString("ko-KR")}</TableCell>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}

export default TotalDetailList;
