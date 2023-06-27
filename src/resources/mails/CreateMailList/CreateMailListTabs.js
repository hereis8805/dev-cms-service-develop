import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button, Box } from "@mui/material";

function getTabValue(path) {
  if (path.includes("/check-validation")) return 2;

  if (path.includes("upload")) return 1;

  return 0;
}

const TABS = [
  {
    to: "/mail/create/mails",
    name: "정산 메일 리스트 등록",
  },
  {
    to: "/mail/create/upload",
    name: "정산 파일 업로드",
  },
  {
    to: "/mail/create/check-validation",
    name: "정산 메일 리스트 검증",
  },
  {
    to: "/mail",
    name: "목록",
  },
];

function CreateMailListMenu() {
  const location = useLocation();
  const [value, setValue] = useState(getTabValue(window.location.href));

  useEffect(() => {
    setValue(getTabValue(location.pathname));
  }, [location?.pathname]);

  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
      {TABS.map((tab, index) => (
        <Button
          component={Link}
          key={tab.to}
          to={tab.to}
          sx={{
            minWidth: 0,
            fontWeight: value === index ? "900" : "500",
          }}
        >
          {tab.name}
        </Button>
      ))}
    </Box>
  );
}

export default CreateMailListMenu;
