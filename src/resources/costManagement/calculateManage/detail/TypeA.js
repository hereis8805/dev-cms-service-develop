import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { FormInputText } from "component/FormComponents/FormInputText";
import { FormInputDropdown } from "component/FormComponents/FormInputDropdown";
import { CALCULATE_TYPE } from "../enum/constant";
import SingleCpPopup from "component/popup/SinglePopup/SingleCpPopup";
import SinglePlatformPopup from "component/popup/SinglePopup/SinglePlatformPopup";
import { RANK_TYPE, SALES_TYPE } from "resources/infoManage/enum/constant";
import { isEmpty3 } from "utils/commonUtils";

function TypeA(props) {
  const { control, index, setValue } = props;
  const [isCodeCpPopup, setIsCodeCpPopup] = useState(false);
  const [CppopupList, setCpPopupList] = useState([]);
  const [isCodePlatformPopup, setIsCodePlatformPopup] = useState(false);
  const [PlatformpopupList, setPlatformPopupList] = useState([]);

  const popupCpBtn = () => {
    setIsCodeCpPopup(true);
  };
  const popupPlatformBtn = () => {
    setIsCodePlatformPopup(true);
  };

  useEffect(() => {
    if (!isEmpty3(CppopupList)) {
      setValue(`list.${index}.GC_OLD`, CppopupList.CODE);
      setValue(`list.${index}.GC_NAME`, CppopupList.NAME);
    }
  }, [CppopupList, index, setValue]);

  useEffect(() => {
    if (!isEmpty3(PlatformpopupList)) {
      setValue(`list.${index}.GC_OLD_PLATFORM`, PlatformpopupList.CODE);
      setValue(`list.${index}.GC_PLATFORM_NAME`, PlatformpopupList.NAME);
    }
  }, [PlatformpopupList, index, setValue]);

  return (
    <>
      <Grid container spacing={2} p={2}>
        <Grid item xs>
          <FormInputText
            name={`list.${index}.GC_OLD`}
            control={control}
            label="CP상세코드"
            search
            popupBtn={popupCpBtn}
          />
        </Grid>
        <Grid item xs>
          <FormInputText name={`list.${index}.GC_NAME`} control={control} label="CP명" />
        </Grid>
        <Grid item xs>
          <FormInputText
            name={`list.${index}.GC_OLD_PLATFORM`}
            control={control}
            label="플랫폼코드"
            search
            popupBtn={popupPlatformBtn}
          />
        </Grid>
        <Grid item xs>
          <FormInputText name={`list.${index}.GC_PLATFORM_NAME`} control={control} label="플랫폼명" disabled />
        </Grid>
      </Grid>
      <Grid container spacing={2} p={2}>
        <Grid item xs>
          <FormInputDropdown
            name={`list.${index}.GC_PRIORITY`}
            control={control}
            label="우선순위"
            options={RANK_TYPE}
          />
        </Grid>
        <Grid item xs>
          <FormInputDropdown
            name={`list.${index}.GC_SETTLEMENT_TYPE`}
            control={control}
            label="정산유형"
            options={CALCULATE_TYPE}
          />
          {/* <FormInputText name={`list.${index}.GC_SETTLEMENT_TYPE`} control={control} label="정산유형" /> */}
        </Grid>
        <Grid item xs>
          <FormInputDropdown
            name={`list.${index}.GC_SALES_TYPE`}
            control={control}
            label="정산대상매출"
            options={SALES_TYPE}
          />
        </Grid>
        <Grid item xs>
          <FormInputText name={`list.${index}.GC_SETTLEMENT_RATE`} control={control} label="정산율" />
        </Grid>
      </Grid>
      <SingleCpPopup isPopupCp={isCodeCpPopup} setIsPopupCp={setIsCodeCpPopup} setSelectCp={setCpPopupList} />
      <SinglePlatformPopup
        isPopupPlatform={isCodePlatformPopup}
        setIsPopupPlatform={setIsCodePlatformPopup}
        setSelectPlatform={setPlatformPopupList}
      />
    </>
  );
}

export default TypeA;
