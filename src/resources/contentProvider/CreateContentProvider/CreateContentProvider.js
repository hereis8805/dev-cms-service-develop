import React, { useCallback } from "react";
import { Create, SimpleForm } from "react-admin";

import useSubmit from "hooks/form/useSubmit";

import { CreateTitle } from "component/Title";
import ContentProviderDetail from "../ContentProviderDetail";
import ContentProviderGroupDetail from "../ContentProviderGroupDetail";

import LABEL from "../label";

function CreateContentProvider(props) {
  const type = props.location.pathname.split('/')[3];

  const [onCreate] = useSubmit({
    basePath: props.basePath,
  });

  // 등록
  const handleCreate = useCallback(
    (values) => {
      console.log(values);
      return;
      // values.GCD_IDX = 526;
      onCreate({
        resource: `contentProvider/${type}`,
        values: {
          ...values,
          GCD_BUSINESS_TYPE: values.GCD_BUSINESS_TYPE === "C" ? "사업자" : "개인"
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

export default CreateContentProvider;
