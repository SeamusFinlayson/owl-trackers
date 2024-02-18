import { getBackgroundColor } from "../colorHelpers";

export default function ColorPicker({
  setColorNumber,
}: {
  setColorNumber: (content: string | number) => void;
}): JSX.Element {
  const colorButtons: JSX.Element[] = [];
  for (let i = 0; i < 8; i++) {
    colorButtons.push(
      <button
        key={i}
        onClick={() => setColorNumber(i)}
        className="group flex h-[30px] w-[30px] items-center justify-center"
      >
        <div
          className={`h-[24px] w-[24px] rounded-full duration-100 group-hover:h-[30px] group-hover:w-[30px] ${getBackgroundColor(i)} opacity-90`}
        ></div>
        <div
          className={`absolute h-[24px] w-[24px] rounded-full outline outline-1 -outline-offset-1 outline-white/20 duration-100 group-hover:h-[30px] group-hover:w-[30px] ${getBackgroundColor(i)}`}
        ></div>
      </button>,
    );
  }

  return <div className="grid grid-cols-2 justify-around">{colorButtons}</div>;
}
