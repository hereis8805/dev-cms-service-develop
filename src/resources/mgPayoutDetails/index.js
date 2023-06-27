// import MailIcon from "@material-ui/icons/Mail";
import PaymentIcon from "@mui/icons-material/Payment";

import CreateMgPayoutDetail from "./CreateMgPayoutDetail";
import EditMgPayoutDetail from "./EditMgPayoutDetail";
import MgPayoutDetailsList from "./MgPayoutDetailsList";

const resource = {
  icon: PaymentIcon,
  create: CreateMgPayoutDetail,
  edit: EditMgPayoutDetail,
  list: MgPayoutDetailsList
};
export { PaymentIcon as MgPayoutDetailsIcon };
export default resource;
