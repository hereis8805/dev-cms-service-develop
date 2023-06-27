import { List, Datagrid, TextField, Pagination } from "react-admin";
import { makeStyles } from "@material-ui/core/styles";
import ContentProviderListFilter from "./ContentProviderListFilter";

const useStyles = makeStyles({
  root: {
    width: "100%",
    "& th": {
      textAlign: "center"
    }
  }
});

const SORT = { field: "GCD_IDX", order: "DESC" };

function ContentProviderList(props) {
  const classes = useStyles();

  return (
    <List {...props} sort={SORT} actions={null} filters={<ContentProviderListFilter />} title="작품 관리" pagination={<Pagination rowsPerPageOptions={[10, 30, 50, 100]} />} >
      <Datagrid rowClick="show" size="small" className={classes.root}>
        <TextField source="isGroup" label='구분' />
        <TextField source="GCD_BUSINESS_TYPE" label='유형' />
        <TextField source="GCD_OWNER_NAME" label='CP명' />
        <TextField source="GCD_OLD_GROUP" label='CP코드' />
        <TextField source="GCD_OLD" label='CP 상세코드' />
        <TextField source="GCD_MANAGER01" label='담당자명' />
        <TextField source="GCD_EMAIL" label='이메일' />
        <TextField source="GCD_CONTACT_TEL" label='연락처' />
      </Datagrid>
    </List>
  );
}

export default ContentProviderList;