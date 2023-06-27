import { List, Datagrid, TextField, ReferenceField, Pagination } from "react-admin";
import TeamLabel from "./TeamLabel";

const TeamList = (props) => {
  return (
    <List {...props} title={TeamLabel["tableName"]} pagination={<Pagination rowsPerPageOptions={[10, 30, 50, 100]} />}>
      <Datagrid rowClick="edit">
        <TextField source="id" label={TeamLabel["id"]} />
        <TextField source="team_name" label={TeamLabel["team_name"]} />
        <TextField source="team_email" label={TeamLabel["team_email"]} />
        <TextField source="team_desc" label={TeamLabel["team_desc"]} />
        {/* <ReferenceField
          source="team_leader_id"
          reference="team_leaders"
          label={TeamLabel["team_leader"]}
        >
          <TextField source="id" />
        </ReferenceField> */}
      </Datagrid>
    </List>
  );
};

export default TeamList;
