import { createContext, useContext, useReducer } from "react";

import { getToday } from "utils/date";

const CalculationFileManagementStateContext = createContext(null);
const CalculationFileManagementDispatchContext = createContext(null);

function reducer(state, action) {
  if (action.type === "SET_FILTER_VALUES") {
    return {
      ...state,
      filterValues: {
        ...action.filterValues
      },
      calculationFiles: []
    };
  }

  if (action.type === "SET_FILES") {
    return {
      ...state,
      calculationFiles: state.calculationFiles.concat(action.calculationFiles)
    };
  }

  if (action.type === "SELECT_FILES") {
    return {
      ...state,
      selectedCalculationFiles: action.selectedCalculationFiles
    };
  }
}

export function useCalculationFileManagementState() {
  const state = useContext(CalculationFileManagementStateContext);

  if (!state) throw new Error("CalculationFileManagementStateContext not found");

  return state;
}

export function useCalculationFileManagementDispatch() {
  const dispatch = useContext(CalculationFileManagementDispatchContext);

  if (!dispatch) throw new Error("CalculationFileManagementDispatchContext not found");

  return dispatch;
}

export function CalculationFileManagemenProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    filterValues: {
      cpType: "COM",
      fileName: "",
      monthCalculate: getToday("yyyy-MM")
    },
    calculationFiles: [],
    selectedCalculationFiles: []
  });

  return (
    <CalculationFileManagementDispatchContext.Provider value={dispatch}>
      <CalculationFileManagementStateContext.Provider value={state}>
        {children}
      </CalculationFileManagementStateContext.Provider>
    </CalculationFileManagementDispatchContext.Provider>
  );
}
