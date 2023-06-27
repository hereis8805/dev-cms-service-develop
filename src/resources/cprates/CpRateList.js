import { Fragment } from "react";
import { cloneElement } from "react";
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  ReferenceField,
  BulkExportButton,
  BulkDeleteButton,
  Show,
  SimpleShowLayout,
  RichTextField,
  useListContext,
  TopToolbar,
  CreateButton,
  ExportButton,
  Button,
  sanitizeListRestProps,
} from "react-admin";
import IconEvent from "@material-ui/icons/Event";
import { makeStyles } from "@material-ui/core/styles";

import CpRateLabel from "./CpRateLabel";

const useStyles = makeStyles({
  thead: {
    whiteSpace: "nowrap",
  },
});

const ListActions = (props) => {
  const { className, filters, maxResults, ...rest } = props;
  const {
    currentSort,
    resource,
    displayedFilters,
    filterValues,
    hasCreate,
    basePath,
    selectedIds,
    showFilter,
    total,
  } = useListContext();
  return (
    <TopToolbar className={className} {...sanitizeListRestProps(rest)}>
      {filters &&
        cloneElement(filters, {
          resource,
          showFilter,
          displayedFilters,
          filterValues,
          context: "button",
        })}
      {/* <CreateButton basePath={basePath} /> */}
      <ExportButton
        disabled={total === 0}
        resource={resource}
        sort={currentSort}
        filterValues={filterValues}
        maxResults={maxResults}
      />
      <ExportButton label="JSON다운로드" exporter={exporter}>
        <IconEvent />
      </ExportButton>
    </TopToolbar>
  );
};

const CpRateBulkActionButtons = (props) => (
  <Fragment>
    <BulkExportButton label="jsonexport" {...props} exporter={exporter} />
    <BulkExportButton {...props} />
    <BulkDeleteButton {...props} />
  </Fragment>
);

const CpRateShow = (props) => (
  <Show
    {...props}
    /* disable the app title change when shown */
    title=" "
  >
    <SimpleShowLayout>
      <RichTextField source="add_info" />
    </SimpleShowLayout>
  </Show>
);

const exporter = (cprates) => {
  const cprates_s = JSON.stringify(cprates, null, "\t");
  var dataUri =
    "data:application/json;charset=utf-8," + encodeURIComponent(cprates_s);

  // Creating the hyperlink and auto click it to start the download
  let link = document.createElement("a");
  link.href = dataUri;
  link.download = "dump_2.json";
  link.click();
};

const RateField = ({ record = {} }) => (
  <div style={{ width: "200px" }}>
    <div>
      B2C 다운 : {record.b2c_down_rate_std} - {record.b2c_down_rate}
    </div>
    <div>
      B2C 대여 : {record.b2c_rent_rate_std} - {record.b2c_rent_rate}
    </div>
    <div>
      B2C 정액 : {record.b2c_fixed_rate_std} - {record.b2c_fixed_rate}
    </div>
    <div>
      B2BC : {record.b2bc_rate_std} - {record.b2bc_rate}
    </div>
    <div>
      B2B : {record.b2b_rate_std} - {record.b2b_rate}
    </div>
  </div>
);

export const CpRateList = (props) => {
  const classes = useStyles();

  return (
    <List
      {...props}
      title="저작권자 정산율"
      bulkActionButtons={<CpRateBulkActionButtons />}
      actions={<ListActions />}
    >
      <Datagrid expand={<CpRateShow />} classes={{ thead: classes.thead }}>
        <TextField source="id" label={CpRateLabel["id"]} />
        {/* <ReferenceField source="cp_id" reference="cp">
        <TextField source="id" />
      </ReferenceField> */}
        <TextField source="cp_name" label={CpRateLabel["cp_name"]} />
        <TextField source="cp_type" label={CpRateLabel["cp_type"]} />
        <TextField source="Cp.contact1" label={CpRateLabel["Cp.contact1"]} />
        <TextField source="Cp.contact2" label={CpRateLabel["Cp.contact2"]} />
        <TextField
          source="cp_service_country"
          label={CpRateLabel["cp_service_country"]}
        />
        {/* <TextField source="b2c_down_rate_std" />
        <NumberField source="b2c_down_rate" />
        <TextField source="b2c_rent_rate_std" />
        <NumberField source="b2c_rent_rate" />
        <TextField source="b2c_fixed_rate_std" />
        <NumberField source="b2c_fixed_rate" />
        <TextField source="b2bc_rate_std" />
        <NumberField source="b2bc_rate" />
        <TextField source="b2b_rate_std" />
        <NumberField source="b2b_rate" /> */}
        <RateField source="통합데이터" />
        <TextField source="date_send" label={CpRateLabel["date_send"]} />
        {/* <TextField source="add_info" /> */}
      </Datagrid>
    </List>
  );
};
export default CpRateList;
