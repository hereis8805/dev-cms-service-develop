import { TextField, DateField } from "react-admin";

const LabelTextField = (labelList, source) => (
  <TextField source={source} label={labelList[source] || source} />
);

export const LabelField = (fieldType, labelList, source) => {
  if (fieldType === "text") {
    return <TextField source={source} label={labelList[source] || source} />;
  }
  if (fieldType === "date") {
    return <DateField source={source} label={labelList[source] || source} />;
  }
};

export default LabelTextField;
