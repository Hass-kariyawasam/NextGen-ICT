// File: src/context/ThemeContext.jsx
import React, { createContext, useState, useMemo, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

export default function ThemeContextProvider({ children }) {
  // කලින් තෝරපු Theme එක මතක තියාගන්නවා (LocalStorage)
  const [mode, setMode] = useState(localStorage.getItem('themeMode') || 'dark');

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const colorMode = useMemo(() => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }), [],
  );

  const theme = useMemo(() =>
      createTheme({
        palette: {
          mode,
          primary: { main: '#0E46A3' }, // Nextgen Blue
          secondary: { main: '#9AC8CD' }, // Nextgen Teal
          background: {
            default: mode === 'dark' ? '#1E0342' : '#F0F4F8',
            paper: mode === 'dark' ? '#15022E' : '#FFFFFF',
          },
          text: {
            primary: mode === 'dark' ? '#E1F7F5' : '#1E0342',
          },
        },
        typography: {
          fontFamily: '"Poppins", sans-serif',
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}