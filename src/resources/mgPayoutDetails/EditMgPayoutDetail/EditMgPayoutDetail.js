import React, { useCallback } from "react";
import { Edit, SimpleForm } from "react-admin";

import useSubmit from "hooks/form/useSubmit";

import MgPayoutDetailsDetail from "../MgPayoutDetailsDetail";

function CreateMgPayoutDetail(props) {
  const [, onEdit] = useSubmit({
    basePath: props.basePath
  });

  // 등록
  const handleEdit = useCallback(
    (values) => {
      const amount = Number.parseInt(values.amount.replace(/,/g, ""), 10);

      onEdit({
        resource: "mgPayoutDetails",
        values: {
          ...values,
          amount: isNaN(amount) ? 0 : amount
        }
      });
    },
    [onEdit]
  );

  return (
    <Edit {...props}>
      <SimpleForm save={handleEdit}>
        <MgPayoutDetailsDetail />
      </SimpleForm>
    </Edit>
  );
}

export default CreateMgPayoutDetail;
