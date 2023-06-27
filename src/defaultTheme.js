const theme = {
  palette: {
    primary: {
      light: "#78d7ff",
      main: "#31a6ff",
      dark: "#0078cb",
      contrastText: "#000000"
    },
    secondary: {
      light: "#484848",
      main: "#212121",
      dark: "#000000",
      contrastText: "#ffffff"
    },
    danger: {}
  },
  typography: {
    h6: {
      fontWeight: 400
    }
  },
  sidebar: {
    width: 215,
    closedWidth: 45
  },
  overrides: {
    RaLayout: {
      root: {
        backgroundColor: "#FFFFFF"
      },
      content: {
        backgroundColor: "#fafafa",
        borderLeft: "1px solid #f0f0f0"
      }
    },
    MuiFilledInput: {
      root: {
        backgroundColor: "rgba(0, 0, 0, 0.04)",
        "&$disabled": {
          backgroundColor: "rgba(0, 0, 0, 0.04)"
        }
      }
    },
    MuiButtonBase: {
      root: {
        "&:hover:active::after": {
          // recreate a static ripple color
          // use the currentColor to make it work both for outlined and contained buttons
          // but to dim the background without dimming the text,
          // put another element on top with a limited opacity
          content: '""',
          display: "block",
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          right: 0,
          backgroundColor: "currentColor",
          opacity: 0.3,
          borderRadius: "inherit"
        }
      }
    },
    RaDatagrid: {
      headerCell: {
        fontWeight: "bold",
        backgroundColor: "lightgray"
      }
    },
    // targeting refresh button
    RaAppBar: {
      toolbar: {
        "& button": {
          "&:nth-last-child(1)": {
            display: "none"
          }
        }
      }
    }
  },
  props: {
    MuiButtonBase: {
      disableRipple: true
    }
  },
  spacing: 8
};

export default theme;
