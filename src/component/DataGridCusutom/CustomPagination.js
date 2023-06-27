import { Box, FormControl, Grid, MenuItem, Select } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import {
  gridPageCountSelector,
  gridPageSelector,
  gridPageSizeSelector,
  useGridApiContext,
  useGridSelector
} from "@mui/x-data-grid";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { searchMonthAtom } from "store/atom";

function CustomPagination(props) {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);

  const pageSize = useGridSelector(apiRef, gridPageSizeSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);
  const [searchMonth, setSearchMonth] = useRecoilState(searchMonthAtom);

  useEffect(() => {
    searchMonth?.[props?.uid]?.page && apiRef.current.setPage(searchMonth?.[props?.uid]?.page);
  }, []);

  return (
    <Grid container direction="row" justifyContent="flex-end" alignItems="center">
      <Box mr={3} display="flex" justifyContent="center" alignItems="center">
        페이지당 행 수
        <FormControl variant="standard" sx={{ marginLeft: 1 }}>
          <Select
            value={pageSize}
            style={{ textAlign: "center", fontSize: "0.875rem" }}
            disableUnderline
            onChange={(e) => {
              apiRef.current.setPageSize(e.target.value);
              apiRef.current.setPage(0);
            }}
          >
            {props.rowsPerPageOptions.map((item) => (
              <MenuItem value={item}>{item}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box mr={3}>
        전체 {apiRef.current.getRowsCount()} 중 {page * pageSize + 1}-
        {page === 0 ? pageSize : page + 1 === pageCount ? apiRef.current.getRowsCount() : page * pageSize + pageSize}
      </Box>
      <Pagination
        count={pageCount}
        page={page + 1}
        onChange={(_, value) => {
          props?.uid &&
            setSearchMonth({
              ...searchMonth,
              [props?.uid]: {
                ...searchMonth?.[props?.uid],
                page: value - 1
              }
            });

          apiRef.current.setPage(value - 1);
        }}
      />
    </Grid>
  );
}

export default CustomPagination;
