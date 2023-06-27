import AttachFileIcon from "@mui/icons-material/AttachFile";

import CreateCalculationDataManagement from "./CreateCalculationDataManagement";
import CalculationFileManagementList from "./CalculationFileManagementList";

const resource = {
  create: CreateCalculationDataManagement,
  icon: AttachFileIcon,
  list: CalculationFileManagementList
};

export { AttachFileIcon as CalculationDataIcon };
export default resource;
