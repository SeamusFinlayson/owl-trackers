import { IconProps } from "../components/IconPropsType";

export default function EditOffIcon(props: IconProps): React.JSX.Element {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      enableBackground="new 0 0 24 24"
      height="24px"
      viewBox="0 0 24 24"
      width="24px"
      fill="#e8eaed"
    >
      <g>
        <path d="M0 0h24v24H0V0z" fill="none" />
      </g>
      <g>
        <g>
          <g>
            <path d="M2.1 3.51c-.39.39-.39 1.02 0 1.41l6.61 6.61-5.56 5.57c-.1.1-.15.22-.15.36v3.04c0 .28.22.5.5.5h3.04c.13 0 .26-.05.35-.15l5.56-5.56 6.61 6.61c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L3.52 3.51c-.4-.39-1.03-.39-1.42 0z" />
          </g>
          <g>
            <path d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
          </g>
          <g>
            <rect
              height="5.3"
              transform="matrix(0.7071 -0.7071 0.7071 0.7071 -2.2957 13.1079)"
              width="3.56"
              x="12.89"
              y="6.67"
            />
          </g>
        </g>
      </g>
    </svg>
  );
}
