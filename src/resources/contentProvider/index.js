import CpIcon from "@mui/icons-material/Book";

import ContentProviderList from "./ContentProviderList";
import CreateContentProvider from "./CreateContentProvider";
import EditContentProvider from "./EditContentProvider";

const resource = {
  icon: CpIcon,
  list: ContentProviderList,
  create: CreateContentProvider,
  edit: EditContentProvider
};

export { CpIcon as ContentProviderIcon };
export default resource;
