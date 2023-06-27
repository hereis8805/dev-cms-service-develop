import * as React from "react";
import {
  Edit,
  FormWithRedirect,
  DateInput,
  SelectArrayInput,
  TextInput,
  SaveButton,
  DeleteButton,
  NullableBooleanInput,
  ReferenceInput,
  SelectInput,
  AutocompleteInput,
} from "react-admin";
import { Typography, Box, Toolbar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import ContentLabel from "./ContentLabel";
import { EditTitle } from "../../component/Title";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiFormControl-root": {
      margin: theme.spacing(1),
    },
  },
  container: {
    width: "190px",
    height: "71px",
    display: "inline-flex",
  },
}));

const ContentEditForm = (props) => {
  const classes = useStyles();
  return (
    <FormWithRedirect
      {...props}
      render={(formProps) => (
        // here starts the custom form layout
        <form>
          <Box p="1em">
            <Box display="flex" className={classes.root}>
              <Box flex={1} mr="1em">
                {/* <Typography variant="h6" gutterBottom>
                  1단
                </Typography> */}
                <TextInput source="id" label={ContentLabel["id"]} />
                <TextInput
                  source="content_type"
                  label={ContentLabel["content_type"]}
                />
                <TextInput
                  source="content_group1"
                  label={ContentLabel["content_group1"]}
                />
                <TextInput
                  source="content_group2"
                  label={ContentLabel["content_group2"]}
                />
                <TextInput
                  source="content_title"
                  label={ContentLabel["content_title"]}
                />
                <TextInput
                  source="series_title"
                  label={ContentLabel["series_title"]}
                />
                <TextInput source="author" label={ContentLabel["author"]} />
                <TextInput
                  source="author_draw"
                  label={ContentLabel["author_draw"]}
                />
                <TextInput
                  source="author_translate"
                  label={ContentLabel["author_translate"]}
                />
                <TextInput
                  source="author_etc"
                  label={ContentLabel["author_etc"]}
                />
                <TextInput
                  source="publisher"
                  label={ContentLabel["publisher"]}
                />
                <TextInput source="cp_name" label={ContentLabel["cp_name"]} />
                <TextInput source="cp_info" label={ContentLabel["cp_info"]} />
                <ReferenceInput
                  source="cp_id"
                  reference="cp"
                  label={ContentLabel["cp_id"]}
                  perPage={100}
                >
                  {/* <SelectInput optionText="cp_name" /> */}
                  <AutocompleteInput
                    optionText="cp_name"
                    className={classes.container}
                  />
                </ReferenceInput>
                <TextInput source="isbn" label={ContentLabel["isbn"]} />
                <TextInput
                  source="date_publish"
                  label={ContentLabel["date_publish"]}
                />
                <TextInput
                  source="category_main"
                  label={ContentLabel["category_main"]}
                />
                <TextInput
                  source="category_sub"
                  label={ContentLabel["category_sub"]}
                />
              </Box>
              <Box flex={1} mr="1em">
                {/* <Typography variant="h6" gutterBottom>
                  2단
                </Typography> */}
                <TextInput
                  source="flag_complete"
                  label={ContentLabel["flag_complete"]}
                />
                <TextInput
                  source="flag_adult"
                  label={ContentLabel["flag_adult"]}
                />
                <TextInput
                  source="summary_content"
                  label={ContentLabel["summary_content"]}
                />
                <TextInput
                  source="summary_author"
                  label={ContentLabel["summary_author"]}
                />
                <TextInput
                  source="summary_publisher"
                  label={ContentLabel["summary_publisher"]}
                />
                <TextInput source="keywords" label={ContentLabel["keywords"]} />
                <TextInput source="price" label={ContentLabel["price"]} />
                <TextInput
                  source="price_sales"
                  label={ContentLabel["price_sales"]}
                />
                <TextInput
                  source="flag_sole_contract"
                  label={ContentLabel["flag_sole_contract"]}
                />
                <TextInput
                  source="date_start_sole"
                  label={ContentLabel["date_start_sole"]}
                />
                <TextInput
                  source="date_end_sole"
                  label={ContentLabel["date_end_sole"]}
                />
                <TextInput
                  source="total_episode"
                  label={ContentLabel["total_episode"]}
                />
                <TextInput
                  source="total_free_episode"
                  label={ContentLabel["total_free_episode"]}
                />
                <TextInput
                  source="sales_type"
                  label={ContentLabel["sales_type"]}
                />
                <TextInput
                  source="service_country"
                  label={ContentLabel["service_country"]}
                />
                <TextInput
                  source="country_code"
                  label={ContentLabel["country_code"]}
                />
                <TextInput
                  source="original_ip"
                  label={ContentLabel["original_ip"]}
                />
                <TextInput
                  source="flag_service"
                  label={ContentLabel["flag_service"]}
                />
                <TextInput
                  source="service_add_info"
                  label={ContentLabel["service_add_info"]}
                />
              </Box>
            </Box>
          </Box>

          <Toolbar>
            <Box display="flex" justifyContent="space-between" width="100%">
              <SaveButton
                saving={formProps.saving}
                // disabled={true}
                handleSubmitWithRedirect={formProps.handleSubmitWithRedirect}
              />
              <DeleteButton record={formProps.record} />
            </Box>
          </Toolbar>
        </form>
      )}
    />
  );
};
const ContentEdit = (props) => (
  <Edit
    {...props}
    title={
      <EditTitle
        tableName={ContentLabel["tableName"]}
        nameField="content_title"
      />
    }
  >
    <ContentEditForm />
  </Edit>
);

export default ContentEdit;
