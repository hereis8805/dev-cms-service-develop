import React from "react";

import { CalculationFileManagemenProvider } from "./CalculationFileManagementContext";

import CalculationFileManagementListFilter from "./CalculationFileManagementListFilter";
import CalculationFileManagementListDagaGrid from "./CalculationFileManagementListDagaGrid";

function CalculationFileManagementList() {
  return (
    <CalculationFileManagemenProvider>
      <CalculationFileManagementListFilter />
      <CalculationFileManagementListDagaGrid />
    </CalculationFileManagemenProvider>
  );
}

export default CalculationFileManagementList;
