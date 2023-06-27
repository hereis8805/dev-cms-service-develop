import React, { useCallback } from "react";
import { Edit, SimpleForm } from "react-admin";

import useSubmit from "hooks/form/useSubmit";

import { EditTitle } from "component/Title";
import ContentProviderDetail from "../ContentProviderDetail";

import LABEL from "../label";

function EditContentProvider(props) {
  const [, onEdit] = useSubmit({
    basePath: props.basePath
  });

  const handleEdit = useCallback(
    async (values) => {
      onEdit({
        resource: "contentProvider",
        values: {
          ...values,
          cp_type: values.cp_type_code === "C" ? "사업자" : "개인"
        }
      });
    },
    [onEdit]
  );

  return (
    <Edit {...props} title={<EditTitle tableName={LABEL["tableName"]} nameField="cp_name" />}>
      <SimpleForm save={handleEdit}>
        <ContentProviderDetail />
      </SimpleForm>
    </Edit>
  );
}

export default EditContentProvider;
