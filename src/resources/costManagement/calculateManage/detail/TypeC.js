import React, { useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";
import { FormInputText } from "component/FormComponents/FormInputText";
import SinglePrepaidPopup from "component/popup/SinglePopup/SinglePrepaidPopup";

function TypeC(props) {
  const { control, index, setValue } = props;

  const [isCodePrepaidPopup, setIsCodePrepaidPopup] = useState(false);
  const [PrepaidpopupList, setPrepaidPopupList] = useState([]);

  const popupCpBtn = () => {
    console.log("popupCpBtn : ");
    setIsCodePrepaidPopup(true);
  };

  const isEmpty3 = (val) => {
    if (
      val === "null" ||
      val === "NULL" ||
      val === "Null" ||
      val === "" ||
      val === null ||
      val === undefined ||
      (val !== null && typeof val === "object" && !Object.keys(val).length)
    ) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    if (!isEmpty3(PrepaidpopupList)) {
      setValue(`list.${index}.PREPAID_SEQ`, PrepaidpopupList.CODE);
    }
  }, [PrepaidpopupList]);

  return (
    <>
      <Grid container spacing={2} p={2}>
        <Grid item xs>
          C형
        </Grid>
        <Grid item xs>
          <FormInputText name={`list.${index}.SETTLEMENT_RATE`} control={control} label="대체정산율(C형)" />
        </Grid>
        <Grid item xs>
          <FormInputText
            name={`list.${index}.PREPAID_SEQ`}
            control={control}
            label="선급/선수금 코드"
            search
            popupBtn={popupCpBtn}
          />
        </Grid>
        <Grid item xs />
      </Grid>
      <SinglePrepaidPopup
        isPopupPrepaid={isCodePrepaidPopup}
        setIsPopupPrepaid={setIsCodePrepaidPopup}
        setSelectPrepaid={setPrepaidPopupList}
      />
    </>
  );
}

export default TypeC;
