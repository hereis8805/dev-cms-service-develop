import { Edit, SimpleForm, TextInput } from "react-admin";
import UserLabel from "./UserLabel";
import { EditTitle } from "../../component/Title";

const UserEdit = (props) => (
  <Edit
    {...props}
    title={<EditTitle tableName={UserLabel["tableName"]} nameField="name" />}
  >
    <SimpleForm>
      <TextInput source="email" label={UserLabel["email"]} />
      <TextInput source="name" label={UserLabel["name"]} />
    </SimpleForm>
  </Edit>
);

export default UserEdit;
