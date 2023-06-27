import {
  Create,
  SimpleForm,
  TextInput,
  ReferenceInput,
  NumberInput,
  SelectInput,
  DateInput,
  ArrayInput,
  SimpleFormIterator,
  AutocompleteInput,
} from "react-admin";
import TeamLabel from "./TeamLabel";
import { CreateTitle } from "../../component/Title";

const MailCreate = (props) => (
  <Create {...props} title={<CreateTitle tableName={TeamLabel["tableName"]} />}>
    <SimpleForm>
      <TextInput source="team_name" label={TeamLabel["team_name"]} />
      <TextInput source="team_email" label={TeamLabel["team_email"]} />
      <TextInput source="team_desc" label={TeamLabel["team_desc"]} />
      {/* <ReferenceInput source="team_leader_id" reference="team_leaders">
        <SelectInput optionText="id" />
      </ReferenceInput> */}
    </SimpleForm>
  </Create>
);

export default MailCreate;
