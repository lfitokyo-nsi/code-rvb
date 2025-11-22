
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

// Convert RGB to HSV (Hue 0-360, Saturation 0-100, Value 0-100)
export const rgbToHsv = (r: number, g: number, b: number) => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  const v = max;
  const d = max - min;
  const s = max === 0 ? 0 : d / max;

  if (max === min) {
    h = 0; // achromatic
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100)
  };
};

// Convert HSV to Hex
export const hsvToHex = (h: number, s: number, v: number): string => {
  const sDec = s / 100;
  const vDec = v / 100;
  const c = vDec * sDec;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = vDec - c;

  let r = 0, g = 0, b = 0;

  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else if (h >= 300 && h < 360) {
    r = c; g = 0; b = x;
  }

  const rFinal = Math.round((r + m) * 255);
  const gFinal = Math.round((g + m) * 255);
  const bFinal = Math.round((b + m) * 255);

  return rgbToHex(rFinal, gFinal, bFinal);
};

// Determine if text should be black or white based on background luminance
export const getContrastColor = (hexColor: string): string => {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return '#000000';
  
  // Calculate relative luminance
  // Formula: 0.2126 * R + 0.7152 * G + 0.0722 * B
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;

  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

export const generateShades = (hex: string): string[] => {
  const rgb = hexToRgb(hex);
  if (!rgb) return [];

  const shades: string[] = [];
  
  // Darker
  for (let i = 0.8; i > 0; i -= 0.2) {
    shades.push(rgbToHex(
      Math.round(rgb.r * i), 
      Math.round(rgb.g * i), 
      Math.round(rgb.b * i)
    ));
  }
  
  shades.push(hex); // Original

  // Lighter
  for (let i = 0.2; i < 1; i += 0.2) {
    shades.push(rgbToHex(
      Math.round(rgb.r + (255 - rgb.r) * i),
      Math.round(rgb.g + (255 - rgb.g) * i),
      Math.round(rgb.b + (255 - rgb.b) * i)
    ));
  }

  return shades.sort((a, b) => {
      // Sort by luminance to keep them ordered
      const rgbA = hexToRgb(a)!;
      const rgbB = hexToRgb(b)!;
      const lumA = 0.299 * rgbA.r + 0.587 * rgbA.g + 0.114 * rgbA.b;
      const lumB = 0.299 * rgbB.r + 0.587 * rgbB.g + 0.114 * rgbB.b;
      return lumB - lumA; // Light to dark
  });
};
