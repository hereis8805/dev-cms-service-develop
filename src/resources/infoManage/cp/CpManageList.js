import { List, Datagrid, TextField } from "react-admin";
import CpManageFilter from "./CpManageFilter";

const PlatformList = (props) => (
  <List title={"CP 관리 목록"} {...props} filters={<CpManageFilter />} empty={false} actions={null}>
    <Datagrid rowClick="edit">
      <TextField source="id" label="No." />
      <TextField source="ROW_TYPE" label="구분" />
      <TextField source="GCD_BUSINESS_TYPE" label="유형1" />
      <TextField source="" label="유형2" />
      <TextField source="GCD_OWNER_NAME" label="CP명" />
      <TextField source="GC_OLD_GROUP" label="CP코드" />
      <TextField source="GCD_OLDS" label="CP상세코드" />
      <TextField source="GCD_WRITER_NAME" label="필명" />
      <TextField source="GCD_KCLEP_CODE" label="거래처코드" />
      <TextField source="GCD_EMAIL" label="이메일" />
    </Datagrid>
  </List>
);

export default PlatformList;
