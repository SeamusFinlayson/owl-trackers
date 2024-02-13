import { useState } from "react";

export default function BubbleInput({ color }: { color: string }): JSX.Element {
  const [content, setContent] = useState("");

  return (
    <input
      placeholder=""
      value={content}
      onChange={(e) => setContent(e.target.value)}
      className={`h-[44px] w-[44px] pb-[2px] pr-[0px] ${color} justify-center rounded-full bg-red-700/60 text-center font-medium outline outline-2 -outline-offset-2 outline-white/40`}
    ></input>
  );
}
