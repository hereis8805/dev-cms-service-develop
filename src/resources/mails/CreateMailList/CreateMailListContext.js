import React, { createContext, useContext, useReducer } from "react";
import { format } from "date-fns";

const CreateMailListStateContext = createContext(null);
const CreateMailListDispatchContext = createContext(null);

function reducer(state, action) {
  if (action.type === "SET_MAILS") {
    return {
      ...state,
      mails: {
        ...state.mails,
        ...action.mails
      }
    };
  }

  if (action.type === "SET_UPLOAD") {
    return {
      ...state,
      upload: {
        ...state.upload,
        ...action.upload
      }
    };
  }

  if (action.type === "SET_VALIDATION") {
    return {
      ...state,
      validation: {
        ...state.validation,
        ...action.validation
      }
    };
  }
}

export function useCreateMailListState() {
  const state = useContext(CreateMailListStateContext);

  if (!state) throw new Error("CreateMailListStateContext not found");

  return state;
}

export function useCreateMailListDispatch() {
  const dispatch = useContext(CreateMailListDispatchContext);

  if (!dispatch) throw new Error("CreateMailListDispatchContext not found");

  return dispatch;
}

export function CreateMailListContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    mails: {
      cpType: "",
      date: format(new Date(), "yyyy-MM"),
      mailContent: "",
      mailTitle: "",
      file: null,
      convertFile: null // 파일을 변환한 내용
    },
    upload: {
      cpType: "",
      date: format(new Date(), "yyyy-MM"),
      files: [],
      uploadedFiles: []
    },
    validation: {
      cpType: "",
      date: format(new Date(), "yyyy-MM")
    }
  });

  return (
    <CreateMailListDispatchContext.Provider value={dispatch}>
      <CreateMailListStateContext.Provider value={state}>{children}</CreateMailListStateContext.Provider>
    </CreateMailListDispatchContext.Provider>
  );
}
