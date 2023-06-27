import { Create, SimpleForm, TextInput, DateInput } from "react-admin";
import PlatformLabel from "./PlatformLabel";
import { CreateTitle } from "../../component/Title";

const PlatformEdit = (props) => (
  <Create
    {...props}
    title={<CreateTitle tableName={PlatformLabel["tableName"]} />}
  >
    <SimpleForm>
      <TextInput source="id" label={PlatformLabel["id"]} />
      <TextInput source="platform" label={PlatformLabel["platform"]} />
      <TextInput source="rate_web" label={PlatformLabel["rate_web"]} />
      <TextInput source="rate_inapp" label={PlatformLabel["rate_inapp"]} />
      <TextInput
        source="standard_calc"
        label={PlatformLabel["standard_calc"]}
      />
      <TextInput source="add_info" label={PlatformLabel["add_info"]} />
    </SimpleForm>
  </Create>
);

export default PlatformEdit;
