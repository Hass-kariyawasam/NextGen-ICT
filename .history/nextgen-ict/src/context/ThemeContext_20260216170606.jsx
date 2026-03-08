import React, { createContext, useState, useMemo, useEffect, useContext } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Context එක හදනවා (Internal use only)
const ColorModeContext = createContext({ toggleColorMode: () => {} });

// --- FIX EKA: Pahala peliya ekathu kala ---
// eslint-disable-next-line react-refresh/only-export-components
export const useColorMode = () => useContext(ColorModeContext);

export default function ThemeContextProvider({ children }) {
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
          primary: { main: '#0a0a0a' },
          secondary: { main: '#101111' },
          background: {
            default: mode === 'dark' ? '#1E0342' : '#F0F4F8',
            paper: mode === 'dark' ? '#15022E' : '#0f0e0e',
          },
          text: {
            primary: mode === 'dark' ? '#E1F7F5' : '#1E0342',
          },
        },
        typography: { fontFamily: '"Poppins", sans-serif' },
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
