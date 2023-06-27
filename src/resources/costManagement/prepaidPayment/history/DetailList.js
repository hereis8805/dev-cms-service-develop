import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Button } from "@mui/material";
import MonthHistoryUpdatePopup from "./MonthHistoryUpdatePopup";

const columns = [
  {
    id: "GPM_ACTUAL_MONTH",
    label: "월",
    minWidth: 170,
    align: "center"
  },
  {
    id: "GPM_CONTACT",
    label: "계약",
    minWidth: 170,
    align: "center"
  },
  { id: "GPM_REAL", label: "실제", minWidth: 170, align: "center" },
  {
    id: "GPM_CONTACT_DEDUCTION",
    label: "계약",
    minWidth: 170,
    align: "center"
  },
  {
    id: "GPM_REAL_DEDUCTION",
    label: "실제",
    minWidth: 170,
    align: "center"
  },
  {
    id: "GPM_CONTACT_TERMINATION",
    label: "계약",
    minWidth: 170,
    align: "center"
  },
  {
    id: "GPM_REAL_TERMINATION",
    label: "실제",
    minWidth: 170,
    align: "center"
  },
  {
    id: "GPM_CONTACT_BALANCE",
    label: "계약",
    minWidth: 170,
    align: "center"
  },
  {
    id: "GPM_REAL_BALANCE",
    label: "실제",
    minWidth: 170,
    align: "center"
  },
  {
    id: "GPM_DESCRIPTION",
    label: "비고",
    minWidth: 170,
    align: "center"
  },
  {
    id: "GPM_IDX",
    label: "수정",
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
                <TableCell align="center" colSpan={2}>
                  당기지급
                </TableCell>
                <TableCell align="center" colSpan={2}>
                  당기차감
                </TableCell>
                <TableCell align="center" colSpan={2}>
                  당기차감(해지)
                </TableCell>
                <TableCell align="center" colSpan={2}>
                  월말 잔액
                </TableCell>
                <TableCell align="center" colSpan={1}></TableCell>
                <TableCell align="center" colSpan={1}></TableCell>
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
              {listData
                .sort((a, b) => {
                  if (a.GPM_ACTUAL_MONTH < b.GPM_ACTUAL_MONTH) return -1;
                  if (a.GPM_ACTUAL_MONTH > b.GPM_ACTUAL_MONTH) return 1;
                })
                .map((row) => {
                  TOTAL_GPM_CONTACT += row.GPM_CONTACT;
                  TOTAL_GPM_REAL += row.GPM_REAL;
                  TOTAL_GPM_CONTACT_DEDUCTION += row.GPM_CONTACT_DEDUCTION;
                  TOTAL_GPM_REAL_DEDUCTION += row.GPM_REAL_DEDUCTION;
                  TOTAL_GPM_CONTACT_TERMINATION += row.GPM_CONTACT_TERMINATION;
                  TOTAL_GPM_REAL_TERMINATION += row.GPM_REAL_TERMINATION;
                  TOTAL_GPM_CONTACT_BALANCE += row.GPM_CONTACT_BALANCE;
                  TOTAL_GPM_REAL_BALANCE += row.GPM_REAL_BALANCE;

                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                      <TableCell key={row.GPM_ACTUAL_MONTH} align={"center"}>
                        {Number(row.GPM_ACTUAL_MONTH).toLocaleString("ko-KR")}
                      </TableCell>
                      <TableCell key={row.GPM_CONTACT} align={"center"}>
                        {Number(row.GPM_CONTACT).toLocaleString("ko-KR")}
                      </TableCell>
                      <TableCell key={row.GPM_REAL} align={"center"}>
                        {Number(row.GPM_REAL).toLocaleString("ko-KR")}
                      </TableCell>
                      <TableCell key={row.GPM_CONTACT_DEDUCTION} align={"center"}>
                        {Number(row.GPM_CONTACT_DEDUCTION).toLocaleString("ko-KR")}
                      </TableCell>
                      <TableCell key={row.GPM_REAL_DEDUCTION} align={"center"}>
                        {Number(row.GPM_REAL_DEDUCTION).toLocaleString("ko-KR")}
                      </TableCell>
                      <TableCell key={row.GPM_CONTACT_TERMINATION} align={"center"}>
                        {Number(row.GPM_CONTACT_TERMINATION).toLocaleString("ko-KR")}
                      </TableCell>
                      <TableCell key={row.GPM_REAL_TERMINATION} align={"center"}>
                        {Number(row.GPM_REAL_TERMINATION).toLocaleString("ko-KR")}
                      </TableCell>
                      <TableCell key={row.GPM_CONTACT_BALANCE} align={"center"}>
                        {Number(row.GPM_CONTACT_BALANCE).toLocaleString("ko-KR")}
                      </TableCell>
                      <TableCell key={row.GPM_REAL_BALANCE} align={"center"}>
                        {Number(row.GPM_REAL_BALANCE).toLocaleString("ko-KR")}
                      </TableCell>
                      <TableCell key={row.GPM_DESCRIPTION} align={"center"}>
                        {row.GPM_DESCRIPTION}
                      </TableCell>
                      <TableCell key={row.GPM_IDX} align={"center"}>
                        <MonthHistoryUpdatePopup
                          gpPrepaidSeq={gpPrepaidSeq}
                          gpIdx={row.GP_IDX}
                          gpmIdx={row.GPM_IDX}
                          selectMonth={row.GPM_ACTUAL_MONTH}
                          selectDate={selectDate}
                          rowData={row}
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

export default DetailList;
