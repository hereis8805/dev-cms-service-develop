import { Create, SimpleForm, TextInput } from "react-admin";
import CpLabel from "./CpLabel";
import { CreateTitle } from "../../component/Title";

const CpCreate = (props) => (
  <Create {...props} title={<CreateTitle tableName={CpLabel["tableName"]} />}>
    <SimpleForm>
      <TextInput source="cp_name" label={CpLabel["cp_name"]} />
      <TextInput source="contact1" label={CpLabel["contact1"]} />
      <TextInput source="contact2" label={CpLabel["contact2"]} />
      <TextInput source="contact_email" label={CpLabel["contact_email"]} />
      <TextInput source="cp_type" label={CpLabel["cp_type"]} />
      <TextInput source="cp_type_code" label={CpLabel["cp_type_code"]} />
      <TextInput source="bank_account" label={CpLabel["bank_account"]} />
    </SimpleForm>
  </Create>
);

export default CpCreate;
