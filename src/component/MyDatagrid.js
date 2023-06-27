import { Children, cloneElement } from "react";
import { Datagrid, DatagridBody, List, TextField } from "react-admin";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Checkbox from "@material-ui/core/Checkbox";

const fwef = "!2312";
const MyDatagridRow = ({
  record,
  resource,
  id,
  onToggleItem,
  children,
  selected,
  basePath,
}) => (
  <TableRow key={id}>
    {/* first column: selection checkbox */}
    <TableCell padding="checkbox">
      <Checkbox
        disabled={record.selectable}
        checked={selected}
        onClick={() => onToggleItem(id)}
      />
    </TableCell>
    {/* data columns based on children */}
    {Children.map(children, (field) => (
      <TableCell key={`${id}-${field.props.source}`}>
        {cloneElement(field, {
          record,
          basePath,
          resource,
        })}
      </TableCell>
    ))}
  </TableRow>
);

const MyDatagridBody = (props) => (
  <DatagridBody {...props} row={<MyDatagridRow />} />
);
const MyDatagrid = (props) => <Datagrid {...props} body={<MyDatagridBody />} />;

export default MyDatagrid;
