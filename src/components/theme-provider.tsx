/* eslint-disable react-refresh/only-export-components */
import * as React from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
  disableTransitionOnChange?: boolean
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeProviderContext = React.createContext<
  ThemeProviderState | undefined
>(undefined)

export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  // 1. Hardcode the theme state to always be "light"
  const theme: Theme = "light"

  // 2. Create a dummy setTheme function so other components don't crash
  // if they attempt to change the theme.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const setTheme = React.useCallback((_: Theme) => {
    console.warn("Theme is currently locked to light mode.")
  }, [])

  // 3. Enforce the light class on the HTML root element exactly once on mount
  React.useEffect(() => {
    const root = document.documentElement
    root.classList.remove("dark")
    root.classList.add("light")

    // Optional: explicitly tell the browser the colour scheme is light
    root.style.colorScheme = "light"
  }, [])

  const value = React.useMemo(
    () => ({
      theme,
      setTheme,
    }),
    [theme, setTheme]
  )

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext)

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}
