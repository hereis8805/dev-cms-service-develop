export const CreateTitle = ({ tableName }) => {
  return <span>{tableName} 생성</span>;
};

export const EditTitle = ({ record, tableName, nameField }) => {
  return (
    <span>
      {tableName}#{record ? `${record[nameField]}` : ""}
    </span>
  );
};
