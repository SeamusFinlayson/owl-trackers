import { IconProps } from "../components/IconPropsType";

export default function MathIcon(svgProps: IconProps): React.JSX.Element {
  return (
    <svg
      {...svgProps}
      xmlns="http://www.w3.org/2000/svg"
      height="24"
      width="24"
      viewBox="0 -960 960 960"
    >
      <path d="M500-480 253-708q-6-6-9.5-13.5T240-737v-23q0-17 11.5-28.5T280-800h380q25 0 42.5 17.5T720-740q0 25-17.5 42.5T660-680H431l184 171q13 12 13 29t-13 29L431-280h229q25 0 42.5 17.5T720-220q0 25-17.5 42.5T660-160H269q-12 0-20.5-8.5T240-189v-38q0-6 2-11.5t7-10.5l251-231Z" />
    </svg>
  );
}
