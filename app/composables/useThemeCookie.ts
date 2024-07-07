export function useThemeCookie() {
  const theme = useCookie('theme', {
    sameSite: 'lax',
    default: () => 'light',
    decode(value) {
      return value === 'dark' ? 'dark' : 'light';
    },
    encode(value) {
      return value;
    },
  });
  function toggleTheme() {
    theme.value = theme.value == 'light' ? 'dark' : 'light';
  }

  return {
    theme,
    toggleTheme,
  }
}
