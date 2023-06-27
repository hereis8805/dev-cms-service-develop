import { TextInput, NullableBooleanInput, useListContext, useNotify, SearchInput } from "react-admin";
import { Form } from "react-final-form";
import { Box, Button, InputAdornment, IconButton, Typography } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import ReplayIcon from "@material-ui/icons/Replay";
import ContentFilterIcon from "@material-ui/icons/FilterList";

const ContentFilter = (props) => {
  //   return props.context === "button" ? (
  //     <ContentFilterButton {...props} />
  //   ) : (
  //     <ContentFilterForm {...props} />
  //   );
  return props.context === "button" ? null : <ContentFilterForm {...props} />;
};

// const ContentFilterButton = () => {
//   const { showFilter } = useListContext();
//   return (
//     <Button
//       size="small"
//       color="primary"
//       onClick={() => showFilter("main")}
//       startIcon={<ContentFilterIcon />}
//     >
//       Filter
//     </Button>
//   );
// };

const ContentFilterForm = ({ open }) => {
  const { displayedFilters, filterValues, setFilters, hideFilter, total } = useListContext();
  const notify = useNotify();
  const t = useListContext();
  console.log("check useListContext() -", t);
  const onSubmit = (values) => {
    console.log("Content Filters -", values);

    if (values?.q?.length > 1) {
      setFilters(values);
    } else if (!values.q) {
      resetFilter();
    } else {
      notify("두글자 이상 검색", { type: "warning" });
    }
  };

  const resetFilter = () => {
    setFilters({}, []);
  };

  return (
    <div>
      <Form onSubmit={onSubmit} initialValues={filterValues}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Box mt={8} />
            <Box display="flex" alignItems="center">
              <Box component="span" mr={1}>
                <TextInput source="q" helperText={false} label="검색" />
              </Box>
              <Box component="span">
                <IconButton aria-label="search" type="submit" color="primary">
                  <SearchIcon />
                </IconButton>
                <IconButton aria-label="search" type="button" onClick={() => resetFilter()}>
                  <ReplayIcon style={{ color: "red" }} />
                </IconButton>
                {/* 리셋버튼 */}
              </Box>
              {filterValues.q && (
                <Box component="span">
                  <Typography color="secondary">검색결과 {total || 0}개</Typography>
                </Box>
              )}
            </Box>
          </form>
        )}
      </Form>
    </div>
  );
};

export default ContentFilter;
