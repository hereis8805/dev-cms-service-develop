import React, { useEffect } from "react";
import { SelectInput } from "react-admin";
import { useFormState } from "react-final-form";

function MailTitleInput({ onSetCpTypeCode, ...others }) {
  const { values } = useFormState();

  useEffect(() => {
    onSetCpTypeCode(values.cp_type_code);
  }, [values.cp_type_code, onSetCpTypeCode]);

  return (
    <SelectInput
      {...others}
      size="small"
      label="CP 타입"
      source="cp_type_code"
      choices={[
        { name: "사업자", id: "C" },
        { name: "개인", id: "P" }
      ]}
    />
  );
}

export default MailTitleInput;
