import BookIcon from '@mui/icons-material/Book';

import CalculationContentList from "./CalculationContentList";
import CreateCalculationContent from "./CreateCalculationContent";

const resource = {
  icon: BookIcon,
  create: CreateCalculationContent,
  list: CalculationContentList
};

export { BookIcon as CalculationContentIcon };
export default resource;
