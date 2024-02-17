export default function ColorPicker({
  setColorNumber,
}: {
  setColorNumber: (content: string | number) => void;
}): JSX.Element {
  const colorButtons: JSX.Element[] = [];
  for (let i = 0; i < 7; i++) {
    colorButtons.push(
      <div key={i} className="flex flex-wrap rounded-full bg-white/10">
        <button
          onClick={() => setColorNumber(i)}
          className={`h-[24px] w-[24px] rounded-full outline outline-1 -outline-offset-1 outline-white/50 ${getColor(i)}`}
        ></button>
      </div>,
    );
  }

  return <div className="flex w-full justify-around">{colorButtons}</div>;
}

function getColor(colorNumber: number) {
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
      color = "bg-lime-400/30";
      break;
    case 4:
      color = "bg-emerald-400/30";
      break;
    case 5:
      color = "bg-cyan-300/30";
      break;
    case 6:
      color = "bg-blue-500/30";
      break;
  }
  return color;
}
