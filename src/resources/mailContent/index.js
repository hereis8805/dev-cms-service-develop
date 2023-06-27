import MailIcon from "@mui/icons-material/Mail";

import CreateMailContent from "./CreateMailContent";
import EditMailContent from "./EditMailContent";
import MailContentList from "./MailContentList";

const resource = {
  icon: MailIcon,
  create: CreateMailContent,
  edit: EditMailContent,
  list: MailContentList
};

export { MailIcon as MailContentIcon };
export default resource;
