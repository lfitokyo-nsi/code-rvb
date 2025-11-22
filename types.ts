export interface ColorInfo {
  hex: string;
  rgb: { r: number; g: number; b: number };
}

export interface PaletteColor {
  name: string;
  hex: string;
}

export const PRESET_PALETTE: PaletteColor[] = [
  { name: "Rouge Vif", hex: "#ef4444" },
  { name: "Orange", hex: "#f97316" },
  { name: "Ambre", hex: "#f59e0b" },
  { name: "Émeraude", hex: "#10b981" },
  { name: "Ciel", hex: "#0ea5e9" },
  { name: "Indigo", hex: "#6366f1" },
  { name: "Violet", hex: "#8b5cf6" },
  { name: "Rose", hex: "#ec4899" },
  { name: "Ardoise", hex: "#64748b" },
  { name: "Noir", hex: "#000000" },
];