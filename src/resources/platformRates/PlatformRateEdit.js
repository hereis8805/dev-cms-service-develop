import {
  Edit,
  TextInput,
  SelectInput,
  ReferenceInput,
  SimpleForm,
  NumberInput,
} from "react-admin";
import PlatformRateLabel from "./PlatformRateLabel";
import { EditTitle } from "../../component/Title";

const PlatformrateEdit = (props) => (
  <Edit
    {...props}
    title={
      <EditTitle
        tableName={PlatformRateLabel["tableName"]}
        nameField="platform"
      />
    }
  >
    <SimpleForm>
      <TextInput source="id" label={PlatformRateLabel["id"]} />
      <TextInput source="platform" label={PlatformRateLabel["platform"]} />
      <TextInput
        source="service_country"
        label={PlatformRateLabel["service_country"]}
      />
      <TextInput
        source="content_type"
        label={PlatformRateLabel["content_type"]}
      />
      <TextInput source="cms_url" label={PlatformRateLabel["cms_url"]} />
      <ReferenceInput
        source="cms_login_id"
        reference="cms_login"
        label={PlatformRateLabel["cms_login_id"]}
      >
        <SelectInput optionText="id" />
      </ReferenceInput>
      <TextInput
        source="cms_login_pwd"
        label={PlatformRateLabel["cms_login_pwd"]}
      />
      <TextInput
        source="service_contact_info"
        label={PlatformRateLabel["service_contact_info"]}
      />
      <TextInput source="add_info" label={PlatformRateLabel["add_info"]} />
      <ReferenceInput
        source="platform_id"
        reference="platform"
        label={PlatformRateLabel["platform_id"]}
      >
        <SelectInput optionText="id" />
      </ReferenceInput>
      <NumberInput
        source="Platform.id"
        label={PlatformRateLabel["Platform.id"]}
      />
    </SimpleForm>
  </Edit>
);

export default PlatformrateEdit;
