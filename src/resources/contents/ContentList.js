import { Fragment } from "react";
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  ReferenceField,
  BulkExportButton,
  BulkDeleteButton,
  DateField,
  Filter,
  SelectInput,
  ReferenceInput,
  SearchInput,
} from "react-admin";
import { makeStyles } from "@material-ui/core/styles";

import ContentLabel from "./ContentLabel";
import ContentFilter from "./ContentFilter";

const useStyles = makeStyles({
  root: {
    width: 960,
    overflowX: "scroll",
  },
  thead: {
    whiteSpace: "nowrap",
  },
});

const ContentBulkActionButtons = (props) => (
  <Fragment>
    <BulkExportButton {...props} />
    <BulkDeleteButton {...props} />
  </Fragment>
);

const ContentFilter2 = (props) => {
  return (
    <Filter {...props}>
      <SelectInput
        label="카테고리"
        source="category_main"
        choices={[
          { id: "순정", name: "순정" },
          { id: "판타지", name: "판타지" },
          { id: "드라마", name: "드라마" },
        ]}
        alwaysOn
      />
      <SearchInput source="q" alwaysOn />
      {/* 검색필터 - 작품제목, 시리즈제목, 저자, 그림저자, 번역저자, 기타저자, 출판사, 저작권자 */}
    </Filter>
  );
};

const ContentList = (props) => {
  const classes = useStyles();

  return (
    <List
      {...props}
      title={ContentLabel["tableName"]}
      filters={<ContentFilter />}
      bulkActionButtons={<ContentBulkActionButtons />}
      classes={{ content: classes.root }}
    >
      <Datagrid rowClick="edit" classes={{ thead: classes.thead }}>
        <TextField source="id" label={ContentLabel["id"]} />
        <TextField source="content_type" label={ContentLabel["content_type"]} />
        <TextField
          source="content_group1"
          label={ContentLabel["content_group1"]}
        />
        <TextField
          source="content_group2"
          label={ContentLabel["content_group2"]}
        />
        <TextField
          source="content_title"
          label={ContentLabel["content_title"]}
        />
        <TextField source="series_title" label={ContentLabel["series_title"]} />
        <TextField source="author" label={ContentLabel["author"]} />
        <TextField source="author_draw" label={ContentLabel["author_draw"]} />
        <TextField
          source="author_translate"
          label={ContentLabel["author_translate"]}
        />
        <TextField source="author_etc" label={ContentLabel["author_etc"]} />
        <TextField source="publisher" label={ContentLabel["publisher"]} />
        <TextField source="cp_name" label={ContentLabel["cp_name"]} />
        <TextField source="cp_info" label={ContentLabel["cp_info"]} />
        <TextField source="isbn" />
        <TextField source="date_publish" label={ContentLabel["date_publish"]} />
        <TextField
          source="category_main"
          label={ContentLabel["category_main"]}
        />
        <TextField source="category_sub" label={ContentLabel["category_sub"]} />
        <TextField
          source="flag_complete"
          label={ContentLabel["flag_complete"]}
        />
        <TextField source="flag_adult" label={ContentLabel["flag_adult"]} />
        {/* <TextField source="summary_content" />
              <TextField source="summary_author" />
              <TextField source="summary_publisher" /> */}
        {/* <TextField source="keywords" label={ContentLabel["keywords"]} /> */}
        <TextField source="price" label={ContentLabel["price"]} />
        <TextField source="price_sales" label={ContentLabel["price_sales"]} />
        <TextField
          source="flag_sole_contract"
          label={ContentLabel["flag_sole_contract"]}
        />
        <TextField
          source="date_start_sole"
          label={ContentLabel["date_start_sole"]}
        />
        <TextField
          source="date_end_sole"
          label={ContentLabel["date_end_sole"]}
        />
        <TextField
          source="total_episode"
          label={ContentLabel["total_episode"]}
        />
        <TextField
          source="total_free_episode"
          label={ContentLabel["total_free_episode"]}
        />
        <TextField source="sales_type" label={ContentLabel["sales_type"]} />
        <TextField
          source="service_country"
          label={ContentLabel["service_country"]}
        />
        <TextField source="country_code" label={ContentLabel["country_code"]} />
        <TextField source="original_ip" label={ContentLabel["original_ip"]} />
      </Datagrid>
    </List>
  );
};

export default ContentList;
