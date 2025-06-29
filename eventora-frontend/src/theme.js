import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2D3E50", 
    },
    secondary: {
      main: "#FF6347", 
    },
    background: {
      default: "#F4F6F9", 
    },
    text: {
      primary: "#333", 
    },
  },
  shape: {
    borderRadius: 8, 
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif", 
    h4: {
      fontWeight: 600, 
    },
  },
});

export default theme;
