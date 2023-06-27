import React, { useCallback } from "react";
import { Edit, Show, SimpleForm } from "react-admin";

import useSubmit from "hooks/form/useSubmit";

import { EditTitle } from "component/Title";
import CalculationMonthlyCpDetail from "../CalculationMonthlyCpDetail";
// import ContentProviderDetail from "../ContentProviderDetail";

function EditCalculationMonthlyCp(props) {
  // const [, onEdit] = useSubmit({
  //   basePath: props.basePath
  // });

  // const handleEdit = useCallback(
  //   async (values) => {
  //     onEdit({
  //       resource: "monthCps",
  //       values: {
  //         ...values
  //       }
  //     });
  //   },
  //   [onEdit]
  // );

  return (
    <Edit title={<EditTitle tableName={"No"} nameField="GCD_IDX" />} actions={null} {...props}>
      <SimpleForm
        actions={null}
        // save={handleEdit}
      >
        <CalculationMonthlyCpDetail />
      </SimpleForm>
    </Edit>
  );
}

export default EditCalculationMonthlyCp;
