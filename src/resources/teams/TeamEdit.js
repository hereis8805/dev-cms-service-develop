import {
  Edit,
  SimpleForm,
  TextInput,
  ReferenceInput,
  SelectInput,
} from "react-admin";
import TeamLabel from "./TeamLabel";
import { EditTitle } from "../../component/Title";

const TeamEdit = (props) => (
  <Edit
    {...props}
    title={
      <EditTitle tableName={TeamLabel["tableName"]} nameField="team_name" />
    }
  >
    <SimpleForm>
      <TextInput source="id" label={TeamLabel["id"]} />
      <TextInput source="team_name" label={TeamLabel["team_name"]} />
      <TextInput source="team_email" label={TeamLabel["team_email"]} />
      <TextInput source="team_desc" label={TeamLabel["team_desc"]} />
      <ReferenceInput
        source="team_leader_id"
        reference="team_leaders"
        label={TeamLabel["team_leader"]}
      >
        <SelectInput optionText="id" />
      </ReferenceInput>
    </SimpleForm>
  </Edit>
);

export default TeamEdit;
