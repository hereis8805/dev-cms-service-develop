import { useCallback } from "react";
import { useListContext, useRefresh } from "react-admin";

function useSearchFilter() {
  const onRefresh = useRefresh();
  const { filterValues, setFilters } = useListContext();
  const handleSubmit = useCallback(
    (values) => {
      const filters = { ...values };

      console.log(123, filters);

      // ALL: 전체 검색
      Object.entries(filters).forEach(([key, value]) => {
        if (value === "ALL") delete filters[key];
      });

      if (Object.entries(filterValues).toString() === Object.entries(filters).toString()) {
        onRefresh();

        return;
      }

      setFilters(filters);
    },
    [filterValues, setFilters, onRefresh]
  );

  return [handleSubmit];
}

export default useSearchFilter;
