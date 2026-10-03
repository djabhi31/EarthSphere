"use client";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useEarthSphereStore, type AccentTheme } from "@/lib/store";

export function Preferences() {
  const { theme, setTheme } = useTheme();
  const accent = useEarthSphereStore(state => state.accentTheme);
  const setAccent = useEarthSphereStore(state => state.setAccentTheme);
  return <div className="es-preferences"><button onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label={theme === "light" ? "Switch to dark appearance" : "Switch to light appearance"}>{theme === "light" ? <Moon size={17} /> : <Sun size={17} />}</button><select aria-label="Accent color" value={accent} onChange={event => setAccent(event.target.value as AccentTheme)}><option value="cyan">Orbital blue</option><option value="pink">Rose</option><option value="orange">Sunset</option><option value="emerald">Aurora</option></select></div>;
}
