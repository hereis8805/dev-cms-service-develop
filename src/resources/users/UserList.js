import {
  Filter,
  TextInput,
  SearchInput,
  List,
  Datagrid,
  EmailField,
  TextField,
  EditButton,
} from "react-admin";
import UserLabel from "./UserLabel";

const UserFilter = (props) => (
  // <Filter {...props}>
  //   <TextInput label="Search" source="q" alwaysOn />
  // </Filter>
  <Filter {...props}>
    <SearchInput source="q" alwaysOn />
  </Filter>
);

const UserList = (props) => (
  <List
    {...props}
    filters={<UserFilter />}
    title={UserLabel["tableName"]} // 페이지 헤더부분
  >
    <Datagrid rowClick="edit">
      <EmailField source="email" label={UserLabel["email"]} />
      <TextField source="id" label={UserLabel["id"]} />
      <TextField source="name" label={UserLabel["name"]} />
      <EditButton label="수정" />
    </Datagrid>
  </List>
);

export default UserList;
