import {
  Edit,
  TabbedForm,
  FormTab,
  SimpleForm,
  TextInput,
  DateInput,
  NumberInput,
} from "react-admin";
import CpLabel from "./CpLabel";
import { EditTitle } from "../../component/Title";

const CpEdit = (props) => (
  <Edit
    {...props}
    title={<EditTitle tableName={CpLabel["tableName"]} nameField="cp_name" />}
  >
    <TabbedForm>
      <FormTab label="1단">
        <TextInput source="cp_name" label={CpLabel["cp_name"]} />
        <TextInput source="contact1" label={CpLabel["contact1"]} />
        <TextInput source="contact2" label={CpLabel["contact2"]} />
        <TextInput source="cp_password" label={CpLabel["cp_password"]} />
        <TextInput
          source="cp_account_number"
          label={CpLabel["cp_account_number"]}
        />
        <TextInput source="contact_tel" label={CpLabel["contact_tel"]} />
        <TextInput source="contract_state" label={CpLabel["contract_state"]} />
        <TextInput source="address" label={CpLabel["address"]} />
        <TextInput source="zipcode" label={CpLabel["zipcode"]} />
        <DateInput source="date_create" label={CpLabel["date_create"]} />
        <TextInput source="cp_names" label={CpLabel["cp_names"]} />
        {/* <NumberInput
          source="status_contract"
          label={CpLabel["status_contract"]}
        /> */}
      </FormTab>
      <FormTab label="2단">
        <TextInput source="contact_email" label={CpLabel["contact_email"]} />
        <TextInput source="cp_type" label={CpLabel["cp_type"]} />
        <TextInput source="cp_type_code" label={CpLabel["cp_type_code"]} />
        <TextInput source="bank_account" label={CpLabel["bank_account"]} />
      </FormTab>
    </TabbedForm>
  </Edit>
);

export default CpEdit;
