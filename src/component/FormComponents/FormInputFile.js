import { useRef, useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import ButtonBase from "@material-ui/core/ButtonBase";

const FileInput = (props) => {
  const { label, onChange, error, attachment, setAttachment, setAttachmentFile } = props;

  const ref = useRef();
  const classes = useStyles();

  const handleChange = (event) => {
    const files = Array.from(event.target.files);
    // const [file] = files;
    // console.log("file : ", file);

    setAttachmentFile(event.target.files);
    setAttachment(files);
    if (!!onChange) onChange({ target: { value: files } });
  };

  return (
    <Box position="relative" height={98}>
      <Box position="absolute" top={0} bottom={0} left={0} right={0}>
        <TextField
          variant="outlined"
          className={classes.field}
          InputProps={{ disableUnderline: true }}
          margin="normal"
          fullWidth
          disabled
          label={label}
          value={attachment?.name || ""}
          error={!!error}
          helperText={error?.message || " "}
        />
      </Box>
      <ButtonBase
        className={classes.button}
        component="label"
        onKeyDown={(e) => e.keyCode === 32 && ref.current?.click()}
      >
        <input ref={ref} type="file" multiple hidden onChange={handleChange} />
      </ButtonBase>
    </Box>
  );
};

const useStyles = makeStyles((theme) => ({
  field: {
    "& .MuiFormLabel-root.Mui-disabled": {
      color: theme.palette.text.secondary
    }
  },
  button: {
    width: "100%",
    height: "100%",
    overflow: "hidden"
  }
}));

export default FileInput;
