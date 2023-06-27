import { useState } from "react";
import { format } from "date-fns";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepButton from "@material-ui/core/StepButton";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { Title } from "react-admin";

import FileUpload from "./FileUpload";
import DatePicker from "./component/DatePicker";

const BUCKET = "msh-cms-upload";
const FOLDER = "calculate_data/";
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%"
  },
  button: {
    marginRight: theme.spacing(1)
  },
  completed: {
    display: "inline-block"
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    width: "100%",
    minHeight: "200px",
    "& div": {
      textAlign: "center",
      padding: "20px"
    },
    "& section": {
      margin: "0 auto"
    }
  }
}));

function getSteps() {
  return [
    "취합 데이터 업로드",
    "데이터 처리(1) - 데이터 매핑",
    "데이터 처리(2) - 정산율 계산",
    "처리 데이터 확인(다운로드 & 업로드)",
    "CP별 정산 파일 생성"
  ];
}

const CustomPage2 = (props) => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState(new Set());
  const [skipped, setSkipped] = useState(new Set());
  const [status, setStatus] = useState("INIT");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM"));
  const [dirty, setDirty] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploadedData, setUploadedData] = useState([]);

  function handleChangeDate() {
    setDate(date);
  }

  function getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        const handleSetFiles = (files) => {
          setFiles((prevFiles) => {
            const nextFiles = [...prevFiles, ...files];

            return nextFiles.filter((file, index, self) => self.findIndex((f) => f.path === file.path) === index);
          });
        };

        const handleRemoveFile = (removeIndex) => {
          setFiles((prevFiles) => prevFiles.filter((_, index) => removeIndex !== index));
        };

        return (
          <FileUpload
            date={date}
            files={files}
            onRemoveFile={handleRemoveFile}
            onSetFiles={handleSetFiles}
            onComplete={handleComplete}
            bucket={BUCKET}
            folder={FOLDER}
            onSetUploadedData={setUploadedData}
          />
        );
      case 1:
        return (
          <div>
            <div>데이터 매핑중입니다....</div>
            {uploadedData.map((data) => (
              <>
                <div key={data.Key}>
                  <div>Bucket : {data.Bucket}</div>
                  <div>Key : {data.Key}</div>
                </div>
              </>
            ))}
          </div>
        );
      case 2:
        return "정산율 계산중입니다....";
      case 3:
        return "다운로드중입니다....";
      case 4:
        return "정산파일 생성중입니다....";
      default:
        return "Unknown stepIndex";
    }
  }

  const steps = getSteps();

  const totalSteps = () => {
    return getSteps().length;
  };

  const isStepOptional = (step) => {
    return step === 1;
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const skippedSteps = () => {
    return skipped.size;
  };

  const completedSteps = () => {
    return completed.size;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps() - skippedSteps();
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed
          // find the first step that has been completed
          steps.findIndex((step, i) => !completed.has(i))
        : activeStep + 1;

    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    if (!dirty) {
      setDirty(true);
    }
    const newCompleted = new Set(completed);
    newCompleted.add(activeStep);
    setCompleted(newCompleted);

    /**
     * Sigh... it would be much nicer to replace the following if conditional with
     * `if (!this.allStepsComplete())` however state is not set when we do this,
     * thus we have to resort to not being very DRY.
     */
    if (completed.size !== totalSteps() - skippedSteps()) {
      handleNext();
    }
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted(new Set());
    setSkipped(new Set());
    setDirty(false);
    setFiles([]);
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  function isStepComplete(step) {
    return completed.has(step);
  }

  return (
    <div className={classes.root}>
      <Title title="정산 처리" />
      <Box p={2}>
        <DatePicker
          label="정산월"
          views={["year", "month"]}
          openTo="month"
          format="yyyy-MM"
          value={date}
          onChange={handleChangeDate}
          margin="no"
        />
      </Box>
      <Stepper alternativeLabel nonLinear activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const buttonProps = {};
          if (isStepOptional(index)) {
            buttonProps.optional = <Typography variant="caption">((선택))</Typography>;
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepButton onClick={handleStep(index)} completed={isStepComplete(index)} {...buttonProps}>
                {label}
              </StepButton>
            </Step>
          );
        })}
      </Stepper>

      <div>
        {allStepsCompleted() ? (
          <div>
            <div className={classes.instructions}>
              <Typography>모든 단계 완료</Typography>
            </div>
            <Button onClick={handleReset}>Reset</Button>
          </div>
        ) : (
          <div>
            <div className={classes.instructions}>
              <div>{getStepContent(activeStep)}</div>
            </div>
            <div>
              <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                이전
              </Button>
              <Button variant="contained" color="primary" onClick={handleNext} m={2} className={classes.button}>
                다음
              </Button>
              {isStepOptional(activeStep) && !completed.has(activeStep) && (
                <Button variant="contained" color="primary" onClick={handleSkip} className={classes.button}>
                  스킵
                </Button>
              )}
              {activeStep !== steps.length &&
                (completed.has(activeStep) ? (
                  <Typography variant="caption" className={classes.completed}>
                    {activeStep + 1}단계는 이미 완료되었습니다
                  </Typography>
                ) : (
                  <Button variant="contained" color="primary" onClick={handleComplete}>
                    {completedSteps() === totalSteps() - 1 ? "모든 단계 완료" : "현재 단계 완료"}
                  </Button>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomPage2;
