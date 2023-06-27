import { Box, Button } from "@mui/material";
import TextField from "@mui/material/TextField";

function PlatformSearchPopup(props) {
  const { searchKeyword, setSearchKeyword, handlePopup } = props;

  return (
    <div>
      <Box sx={{ width: "100%", pt: 1 }}>
        <Box
          sx={{
            backgroundColor: "#FFFFFF",
            boxShadow:
              "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%);",
            mb: 2,
            p: 2
          }}
        >
          <Box sx={{ display: "flex" }}>
            <TextField
              required
              id="outlined-required"
              label="검색어를 입력해주세요"
              value={searchKeyword}
              onChange={(e) => {
                setSearchKeyword(e.target.value);
              }}
            />
            &nbsp;&nbsp;
            <Button type="submit" variant="contained" color="primary" onClick={handlePopup}>
              검색
            </Button>
          </Box>
        </Box>
      </Box>
    </div>
  );
}

export default PlatformSearchPopup;
