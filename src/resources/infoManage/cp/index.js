import ContactsIcon from "@mui/icons-material/Contacts";

import CpList from "./CpManageList";
import CpEdit from "./CpManageEdit";
import CpCreate from "./CpCreate";

const resource = {
  icon: ContactsIcon,
  list: CpList,
  create: CpCreate,
  edit: CpEdit
};

export { ContactsIcon as CpsIcon };
export default resource;
