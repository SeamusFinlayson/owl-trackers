export default function ReportBugButton(): JSX.Element {
  return (
    <div className="flex flex-row gap-2 px-4 py-3">
      <a
        className="flex flex-row items-center gap-2 rounded-lg border-none bg-black/15 p-2 text-center text-text-primary no-underline hover:bg-black/35 dark:text-text-primary-dark"
        title=""
        href="https://discord.gg/WMp9bky4be"
        target="_blank"
        rel="noreferrer noopener"
      >
        <svg
          className="fill-text-primary stroke-text-primary dark:fill-text-primary-dark dark:stroke-text-primary-dark"
          height="22px"
          width="22px"
          viewBox="0 0 48.00 48.00"
          xmlns="http://www.w3.org/2000/svg"
          fill="#ffffff"
          transform="rotate(0)"
          stroke="#ffffff"
          strokeWidth="0.00048000000000000007"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            {" "}
            <title>bug-solid</title>{" "}
            <g id="Layer_2" data-name="Layer 2">
              {" "}
              <g id="invisible_box" data-name="invisible box">
                {" "}
                <rect width="48" height="48" fill="none"></rect>{" "}
              </g>{" "}
              <g id="icons_Q2" data-name="icons Q2">
                {" "}
                <path d="M42,32a2,2,0,0,0,0-4H35.9a15.7,15.7,0,0,0-.4-2.3A10,10,0,0,0,43,16a2,2,0,0,0-4,0,6.1,6.1,0,0,1-4.7,5.9,13.6,13.6,0,0,0-3-4.6A7.2,7.2,0,0,0,32,14a8.7,8.7,0,0,0-1-3.9h0a4,4,0,0,1,4-4,2,2,0,0,0,0-4,8.1,8.1,0,0,0-7.4,4.9,7.7,7.7,0,0,0-7.2,0A8.1,8.1,0,0,0,13,2a2,2,0,0,0,0,4,4,4,0,0,1,4,4h0A8.7,8.7,0,0,0,16,14a7.5,7.5,0,0,0,.7,3.3,16.1,16.1,0,0,0-3,4.5A5.9,5.9,0,0,1,9,16a2,2,0,0,0-4,0,10.2,10.2,0,0,0,7.5,9.7,15.7,15.7,0,0,0-.4,2.3H6a2,2,0,0,0,0,4h6.1a15.7,15.7,0,0,0,.4,2.3A10.2,10.2,0,0,0,5,44a2,2,0,0,0,4,0,6.1,6.1,0,0,1,4.7-5.9c2,4.7,5.9,7.9,10.3,7.9s8.3-3.2,10.3-7.9A6,6,0,0,1,39,44a2,2,0,0,0,4,0,10.2,10.2,0,0,0-7.5-9.7,15.7,15.7,0,0,0,.4-2.3ZM26,40a2,2,0,0,1-4,0V20a2,2,0,0,1,2-2,2.1,2.1,0,0,1,2,2Z"></path>{" "}
              </g>{" "}
            </g>{" "}
          </g>
        </svg>

        <p className="settings-label">Report Bug</p>
      </a>
    </div>
  );
}
