import { createTheme, ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// Add Inter font from Google Fonts
  

  const theme = createTheme({
    typography: {
      fontFamily: 'Inter, sans-serif',
    },
    palette: {
      mode: 'dark',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#f50057',
      },
      background: {
        default: '#121212',
        paper: '#1e1e1e',
      },
      text: {
        primary: '#ffffff',
        secondary: '#b0bec5',
      },
    },
  });
  
  const style = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    marginTop: '16px',
  };
  
  export default theme;
  export {theme};


