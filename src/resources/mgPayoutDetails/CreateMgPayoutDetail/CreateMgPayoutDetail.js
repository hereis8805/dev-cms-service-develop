import React, { useCallback } from "react";
import { Create, SimpleForm } from "react-admin";

import useSubmit from "hooks/form/useSubmit";

import MgPayoutDetailsDetail from "../MgPayoutDetailsDetail";

function CreateMgPayoutDetail(props) {
  const [onCreate] = useSubmit({
    basePath: props.basePath
  });

  // 등록
  const handleCreate = useCallback(
    (values) => {
      const amount = Number.parseInt(values.amount.replace(/,/g, ""), 10);

      onCreate({
        resource: "mgPayoutDetails",
        values: {
          ...values,
          amount: isNaN(amount) ? 0 : amount
        }
      });
    },
    [onCreate]
  );

  return (
    <Create {...props}>
      <SimpleForm save={handleCreate}>
        <MgPayoutDetailsDetail />
      </SimpleForm>
    </Create>
  );
}

export default CreateMgPayoutDetail;
