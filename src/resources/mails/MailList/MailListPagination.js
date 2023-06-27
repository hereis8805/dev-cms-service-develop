import React from "react";
import { Pagination } from "react-admin";

const PAGE_OPTIONS = [10, 30, 50, 100];

function MailListPagination(props) {
  return <Pagination {...props} rowsPerPageOptions={PAGE_OPTIONS} />;
}

export default MailListPagination;
