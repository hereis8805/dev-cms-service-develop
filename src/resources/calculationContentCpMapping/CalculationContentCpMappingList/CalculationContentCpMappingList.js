import React from "react";
import { Datagrid, List, TextField, ReferenceField, ReferenceManyField, ReferenceArrayField, ReferenceManyToManyField, SingleFieldList, ChipField } from "react-admin";
import { makeStyles } from "@material-ui/core/styles";

import CalculationContentCpMappingListFilter from "./CalculationContentCpMappingListFilter";
// import CalcContentCpMapping from "./CalcContentCpMapping";

const useStyles = makeStyles({
  root: {
    width: "100%",
    "& th": {
      textAlign: "center"
    }
  }
});

const SORT = { field: "content_code", order: "ASC" };

function CalculationContentCpMappingList(props) {
  const classes = useStyles();

  return (
    <List {...props} sort={SORT} actions={null} filters={<CalculationContentCpMappingListFilter />} title="컨텐츠(정산) 파일 관리">
      <Datagrid rowClick="edit" size="small" className={classes.root}>
        {/* <TextField source="content_code" label="컨텐츠 CODE" textAlign="center" /> */}
        <TextField source="content_type" label="종류" textAlign="center" />
        <TextField source="content_title" label="컨텐츠명" textAlign="left" />
        {/* <TextField source="CalcContentCpMapping[0].cp_name" label="저작권자" textAlign="left" /> */}
        {/* <ReferenceField label="저작권자" source="CalcContentCpMapping[0].cp_id" reference="contentProvider">
            <TextField source="cp_name" />
        </ReferenceField> */}
        {/* <ReferenceManyField label="Tags" reference="contentProvider" target="CalcContentCpMapping[0].cp_id">
            <SingleFieldList>
                <ChipField source="cp_name" />
            </SingleFieldList>
        </ReferenceManyField> */}
        {/* <ReferenceArrayField label="Tags" reference="contentProvider" source="CalcContentCpMapping">
            <SingleFieldList>
                <ChipField source="cp_name" />
            </SingleFieldList>
        </ReferenceArrayField> */}
        <TextField source="author" label="저자" textAlign="left" />
        <TextField source="publisher" label="출판사" textAlign="left" />
        <TextField source="date_create" label="생성일자" textAlign="center" />
      </Datagrid>
    </List>
  );
}

export default CalculationContentCpMappingList;
