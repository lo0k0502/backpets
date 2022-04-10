import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    primary: {
      100: '#be9a78',
    },
    bg: {
      100: '#f0e5da',
      200: '#ece1d7',
      300: '#dfcdbc',
      400: '#cbae93',
    },
    border: {
      100: '#bbb',
    },
  },
});

export default theme;