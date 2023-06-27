import React, { useCallback } from "react";
import { Create, SimpleForm } from "react-admin";

import useSubmit from "hooks/form/useSubmit";

import { CreateTitle } from "component/Title";
import ContentProviderDetail from "../CalculationContentDetail";
import ContentProviderGroupDetail from "../CalculationContentGroupDetail";

import LABEL from "../label";

function CreateCalculationContent(props) {
  const type = props.location.pathname.split('/')[3];

  const [onCreate] = useSubmit({
    basePath: props.basePath,
  });

  // 등록
  const handleCreate = useCallback(
    (values) => {
      onCreate({
        resource: `contentProvider/${type}`,
        values: {
          ...values,
          GCD_BUSINESS_TYPE: values.cp_type_code === "C" ? "사업자" : "개인"
        }
      });
    },
    [onCreate]
  );

  return (
    <Create {...props} title={<CreateTitle tableName={LABEL.tableName} />}>
      <SimpleForm save={handleCreate}>
        {type === 'single' ? <ContentProviderDetail /> : <ContentProviderGroupDetail />}
      </SimpleForm>
    </Create>
  );
}

export default CreateCalculationContent;
