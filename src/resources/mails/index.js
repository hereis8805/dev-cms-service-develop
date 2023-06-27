import AttachEmailIcon from "@mui/icons-material/AttachEmail";

import CreateMailList from "./CreateMailList";
import EditMailList from "./EditMailList";
import MailList from "./MailList";

const resource = {
  icon: AttachEmailIcon,
  list: MailList,
  create: CreateMailList,
  edit: EditMailList
};

export { AttachEmailIcon as MailsIcon };
export default resource;
