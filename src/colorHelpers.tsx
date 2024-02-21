export function getBackgroundColor(colorNumber: number) {
  let color: string;
  switch (colorNumber) {
    default:
    case 0:
      color = "bg-fuchsia-500/40";
      break;
    case 1:
      color = "bg-pink-600/50";
      break;
    case 2:
      color = "bg-red-700/70";
      break;
    case 3:
      color = "bg-orange-600/60";
      break;
    case 4:
      color = "bg-yellow-500/40";
      break;
    case 5:
      color = "bg-lime-400/30";
      break;
    case 6:
      color = "bg-emerald-400/30";
      break;
    case 7:
      color = "bg-cyan-300/30";
      break;
    case 8:
      color = "bg-blue-500/30";
      break;
  }
  return color;
}

export function getColor(colorNumber: number) {
  let color: string;
  switch (colorNumber) {
    default:
    case 0:
      color = "#9c43b2";
      break;
    case 1:
      color = "#af2d6c";
      break;
    case 2:
      color = "#ab2022";
      break;
    case 3:
      color = "#a34e26";
      break;
    case 4:
      color = "#bc6c13";
      break;
    case 5:
      color = "#6d9142";
      break;
    case 6:
      color = "#378873";
      break;
    case 7:
      color = "#5092a3";
      break;
    case 8:
      color = "#4064a4";
      break;
  }
  return color;
}
