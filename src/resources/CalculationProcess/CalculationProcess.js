import React, { useState } from "react";
import { Box, Button, Paper, Step, Stepper, StepButton, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";

import CalculationProcessStep1 from "./CalculationProcessStep1";
// import CalculationProcessStep2 from "./CalculationProcessStep2";
// import CalculationProcessStep3 from "./CalculationProcessStep3";

const color = grey[900];

const STEPS = ["통합 정산 파일 업로드", "데이터 처리", "CP별 정산 파일 생성"];

function CalculationProcess() {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState(new Set());
  const [skipped, setSkipped] = useState(new Set());

  function isStepComplete(step) {
    return completed.has(step);
  }

  // 스텝바 클릭
  function handleSetStep(step) {
    setActiveStep(step);
  }

  // 다음 스텝
  function handleBackStep() {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }

  // 이전 스텝
  function handleNextStep() {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }

  return (
    <Box>
      <Paper
        sx={{
          width: "100%",
          height: "100%",
          flexShrink: 0,
          p: 3
        }}
      >
        <Box sx={{ borderBottom: `1px solid ${color}` }}>
          <Typography variant="h6" component="h2" sx={{ mb: 1 }}>
            정산 처리
          </Typography>
        </Box>
        {/* <Box sx={{ mt: 5 }}>
          <Stepper alternativeLabel nonLinear activeStep={activeStep}>
            {STEPS.map((label, index) => {
              const stepProps = {};
              const buttonProps = {};

              // if (isStepOptional(index)) {
              //   buttonProps.optional = <Typography variant="caption">((선택))</Typography>;
              // }
              // if (isStepSkipped(index)) {
              //   stepProps.completed = false;
              // }
              return (
                <Step key={label} {...stepProps}>
                  <StepButton onClick={handleSetStep} completed={isStepComplete(index)} {...buttonProps}>
                    {label}
                  </StepButton>
                </Step>
              );
            })}
          </Stepper>
        </Box> */}
        <Box sx={{ mt: 5 }}>
          {activeStep === 0 && <CalculationProcessStep1 />}
          {/* {activeStep === 1 && <CalculationProcessStep2 />} */}
          {/* {activeStep === 2 && <CalculationProcessStep3 />} */}
        </Box>
        {/* <Box>
          <Button disabled={activeStep === 0} onClick={handleBackStep}>
            이전
          </Button>
          <Button variant="contained" color="primary" onClick={handleNextStep} m={2}>
            다음
          </Button>
        </Box> */}
      </Paper>
    </Box>
  );
}

export default CalculationProcess;
