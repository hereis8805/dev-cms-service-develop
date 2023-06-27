import { useLocation } from "react-router-dom";
import { getUrlQuery } from "utils/commonUtils";
import CreateType from "../Label";
import Multi from "./Multi";
import Single from "./Single";

function InfoManageWorkDetail(props) {
  const location = useLocation();

  const value = getUrlQuery(location.search, "createType");

  return value === CreateType.single ? <Single /> : <Multi />;
}
export default InfoManageWorkDetail;
