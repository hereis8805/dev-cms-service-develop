import React from "react";
import { Box, Button } from "@material-ui/core";

function CalculationProcessStep3({ onComplete }) {
  // const notify = useNotify();
  // const [isLoading, onToggleLoading] = useToggle(false);

  function handleSubmit() {
    onComplete();
  }

  return (
    <>
      <Box textAlign="center">
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          CP별 정산 파일 생성
        </Button>
      </Box>
    </>
  );
}

export default CalculationProcessStep3;
