import {
  Edit,
  SimpleForm,
  TextInput,
  ReferenceInput,
  NumberInput,
  SelectInput,
} from "react-admin";
import CpRateLabel from "./CpRateLabel";

const CprateEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <ReferenceInput
        source="cp_id"
        reference="cp"
        label={CpRateLabel["cp_id"]}
      >
        <SelectInput optionText="cp_name" />
      </ReferenceInput>
      <TextInput source="cp_name" label={CpRateLabel["cp_name"]} />
      <TextInput source="cp_type" label={CpRateLabel["cp_type"]} />
      <TextInput
        source="cp_service_country"
        label={CpRateLabel["cp_service_country"]}
      />
      <TextInput
        source="b2c_down_rate_std"
        label={CpRateLabel["b2c_down_rate_std"]}
      />
      <NumberInput
        source="b2c_down_rate"
        label={CpRateLabel["b2c_down_rate"]}
      />
      <TextInput
        source="b2c_rent_rate_std"
        label={CpRateLabel["b2c_rent_rate_std"]}
      />
      <NumberInput
        source="b2c_rent_rate"
        label={CpRateLabel["b2c_rent_rate"]}
      />
      <TextInput
        source="b2c_fixed_rate_std"
        label={CpRateLabel["b2c_fixed_rate_std"]}
      />
      <TextInput
        source="b2c_fixed_rate"
        label={CpRateLabel["b2c_fixed_rate"]}
      />
      <TextInput source="b2bc_rate_std" label={CpRateLabel["b2bc_rate_std"]} />
      <NumberInput source="b2bc_rate" label={CpRateLabel["b2bc_rate"]} />
      <TextInput source="b2b_rate_std" label={CpRateLabel["b2b_rate_std"]} />
      <TextInput source="b2b_rate" label={CpRateLabel["b2b_rate"]} />
      <TextInput source="date_send" label={CpRateLabel["date_send"]} />
      <TextInput source="add_info" label={CpRateLabel["add_info"]} />
    </SimpleForm>
  </Edit>
);

export default CprateEdit;
