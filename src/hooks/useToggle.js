import { useCallback, useState } from "react";

function useToggle(initialState = false, fn) {
  const [state, setState] = useState(initialState);

  const handleToggle = useCallback(() => {
    setState((prevState) => !prevState);
  }, []);

  return [state, handleToggle];
}

export default useToggle;
