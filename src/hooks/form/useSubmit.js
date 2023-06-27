import { useCallback } from "react";
import { useNotify, useMutation, useRedirect } from "react-admin";

function useSubmit({ basePath }) {
  const notify = useNotify();
  const redirect = useRedirect();
  const [mutate] = useMutation();

  const handleCreate = useCallback(
    async ({ resource, values, onFail, onSuccess }) => {
      try {
        const response = await mutate(
          {
            type: "create",
            resource,
            payload: {
              data: {
                ...values
              }
            }
          },
          { returnPromise: true }
        );

        if (onSuccess) {
          onSuccess();

          return;
        }

        redirect("list", basePath, response.data.id, response.data);
      } catch (err) {
        if (onFail) {
          onFail();

          return;
        }

        notify("등록에 실패하였습니다", { type: "error" });
      }
    },
    [basePath, mutate, notify, redirect]
  );

  const handleUpdate = useCallback(
    async ({ resource, values, onFail, onSuccess }) => {
      try {
        const response = await mutate(
          {
            type: "update",
            resource: resource,
            payload: {
              id: values.id,
              data: {
                ...values
              }
            }
          },
          { returnPromise: true }
        );

        if (onSuccess) {
          onSuccess();

          return;
        }

        redirect("list", basePath, response.data.id, response.data);
      } catch (err) {
        if (onFail) {
          onFail();

          return;
        }

        notify("수정에 실패하였습니다", { type: "error" });
      }
    },
    [basePath, mutate, notify, redirect]
  );

  return [handleCreate, handleUpdate];
}

export default useSubmit;
