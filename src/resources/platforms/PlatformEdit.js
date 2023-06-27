import { Edit, SimpleForm, TextInput, DateInput } from "react-admin";
import PlatformLabel from "./PlatformLabel";
import { EditTitle } from "../../component/Title";

const PlatformEdit = (props) => (
  <Edit
    {...props}
    title={
      <EditTitle tableName={PlatformLabel["tableName"]} nameField="platform" />
    }
  >
    <SimpleForm>
      <TextInput source="id" label={PlatformLabel["id"]} />
      <TextInput source="platform" label={PlatformLabel["platform"]} />
      <DateInput source="rate_web" label={PlatformLabel["rate_web"]} />
      <DateInput source="rate_inapp" label={PlatformLabel["rate_inapp"]} />
      <TextInput
        source="standard_calc"
        label={PlatformLabel["standard_calc"]}
      />
      <TextInput source="add_info" label={PlatformLabel["add_info"]} />
    </SimpleForm>
  </Edit>
);

export default PlatformEdit;
