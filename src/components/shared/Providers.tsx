"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Lang, Theme } from "@/types";

interface AppContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
  lang: Lang;
  setLang: (l: Lang) => void;
  isAdmin: boolean;
  setIsAdmin: (v: boolean) => void;
}

const AppContext = createContext<AppContextType>({
  theme: "dark",
  setTheme: () => {},
  lang: "th",
  setLang: () => {},
  isAdmin: false,
  setIsAdmin: () => {},
});

export function useApp() {
  return useContext(AppContext);
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [lang, setLangState]   = useState<Lang>("th");
  const [isAdmin, setIsAdmin]  = useState(false);

  useEffect(() => {
    const savedTheme = (localStorage.getItem("portfolio.theme") as Theme) || "dark";
    const savedLang  = (localStorage.getItem("portfolio.lang")  as Lang)  || "th";
    setThemeState(savedTheme);
    setLangState(savedLang);
    document.documentElement.setAttribute("data-theme", savedTheme);
    document.documentElement.lang = savedLang;
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem("portfolio.theme", t);
    document.documentElement.setAttribute("data-theme", t);
  };

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("portfolio.lang", l);
    document.documentElement.lang = l;
  };

  return (
    <AppContext.Provider value={{ theme, setTheme, lang, setLang, isAdmin, setIsAdmin }}>
      {children}
    </AppContext.Provider>
  );
}