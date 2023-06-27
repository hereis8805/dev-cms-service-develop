import { Create, SimpleForm, TextInput, DateInput } from "react-admin";
import { CreateTitle } from "component/Title";

const PlatformEdit = (props) => (
  <Create {...props} title={<CreateTitle tableName={"tableName"} />}>
    <SimpleForm>
      <TextInput source="id" label={"id"} />
      <TextInput source="platform" label={"platform"} />
      <TextInput source="rate_web" label={"rate_web"} />
      <TextInput source="rate_inapp" label={"rate_inapp"} />
      <TextInput source="standard_calc" label={"standard_calc"} />
      <TextInput source="add_info" label={"add_info"} />
    </SimpleForm>
  </Create>
);

export default PlatformEdit;
