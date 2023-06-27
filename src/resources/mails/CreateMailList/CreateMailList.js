import React from "react";
import { Route } from "react-router-dom";
import { Box, Paper } from "@mui/material";

import { CreateMailListContextProvider } from "./CreateMailListContext";
import CreateMailListTabs from "./CreateMailListTabs";
import CreateMailListMails from "./CreateMailListMails";
import CreateMailListUpload from "./CreateMailListUpload";
import CreateMailListValidation from "./CreateMailListValidation";

function CreateMailList() {
  return (
    <CreateMailListContextProvider>
      <Box>
        <CreateMailListTabs />
        <Paper
          sx={{
            width: "100%",
            height: "100%",
            flexShrink: 0,
            p: 3,
          }}
        >
          <Route path="/mail/create/mails" children={<CreateMailListMails />} />
          <Route
            path="/mail/create/upload"
            children={<CreateMailListUpload />}
          />
          <Route
            path="/mail/create/check-validation"
            children={<CreateMailListValidation />}
          />
        </Paper>
      </Box>
    </CreateMailListContextProvider>
  );
}

export default CreateMailList;
