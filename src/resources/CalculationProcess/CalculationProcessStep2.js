import React from "react";
import { Box, Button } from "@material-ui/core";

function CalculationProcessStep2({ onComplete }) {
  // const notify = useNotify();
  // const [isLoading, onToggleLoading] = useToggle(false);

  function handleSubmit() {
    onComplete();
  }

  return (
    <>
      <Box textAlign="center">
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          데이터 처리 호출
        </Button>
      </Box>
    </>
  );
}

export default CalculationProcessStep2;
