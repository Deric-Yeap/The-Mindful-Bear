export const adjustHexColor = (hex, percent) => {
    hex = hex.replace(/^#/, '');
  
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
  
    r = Math.min(255, Math.max(0, Math.floor(r + (255 - r) * percent)));
    g = Math.min(255, Math.max(0, Math.floor(g + (255 - g) * percent)));
    b = Math.min(255, Math.max(0, Math.floor(b + (255 - b) * percent)));
  
    const toHex = (value) => value.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };