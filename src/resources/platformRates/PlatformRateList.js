import { List, Datagrid, TextField, ReferenceField } from "react-admin";
import PlatformRateLabel from "./PlatformRateLabel";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  thead: {
    whiteSpace: "nowrap",
  },
});

const PlatformField = ({ record = {} }) => (
  <div style={{ width: "200px" }}>
    <div>{record?.Platform?.platform}</div>
    <div>
      웹: {record?.Platform?.rate_web} // 인앱: {record?.Platform?.rate_inapp}
    </div>
  </div>
);

const PlatformRateList = (props) => {
  const classes = useStyles();
  return (
    <List title={PlatformRateLabel["tableName"]} {...props}>
      <Datagrid rowClick="edit" classes={{ thead: classes.thead }}>
        <TextField source="id" label={PlatformRateLabel["id"]} />
        <TextField source="platform" label={PlatformRateLabel["platform"]} />
        <PlatformField source="Platform" label="플랫폼 계정별 정산정보" />
        <TextField
          source="service_country"
          label={PlatformRateLabel["service_country"]}
        />
        <TextField
          source="content_type"
          label={PlatformRateLabel["content_type"]}
        />
        <TextField source="cms_url" label={PlatformRateLabel["cms_url"]} />
        <TextField
          source="cms_login_id"
          label={PlatformRateLabel["cms_login_id"]}
        />
        <TextField
          source="cms_login_pwd"
          label={PlatformRateLabel["cms_login_pwd"]}
        />
        <TextField
          source="service_contact_info"
          label={PlatformRateLabel["service_contact_info"]}
        />
        <TextField source="add_info" label={PlatformRateLabel["add_info"]} />
      </Datagrid>
    </List>
  );
};
export default PlatformRateList;
