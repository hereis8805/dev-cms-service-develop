import { Edit, SimpleForm, TextInput, DateInput } from "react-admin";
import { EditTitle } from "component/Title";

const PlatformEdit = (props) => (
  <Edit {...props} title={<EditTitle tableName={"tableName"} nameField="platform" />}>
    <SimpleForm>
      <TextInput source="id" label={"id"} />
      <TextInput source="platform" label={"platform"} />
      <DateInput source="rate_web" label={"rate_web"} />
      <DateInput source="rate_inapp" label={"rate_inapp"} />
      <TextInput source="standard_calc" label={"standard_calc"} />
      <TextInput source="add_info" label={"add_info"} />
    </SimpleForm>
  </Edit>
);

export default PlatformEdit;
