import HeaderButton from "../components/HeaderButton";

export default function ActionHeader({
  border = false,
}: {
  border?: boolean;
}): React.JSX.Element {
  return (
    <>
      <div className="grid grid-cols-[minmax(120px,auto)_repeat(3,42px)] items-center p-4">
        <h1 className="text-text-primary dark:text-text-primary-dark m-0 text-lg font-bold tracking-normal">
          Owl Trackers
        </h1>

        <HeaderButton variant="patreon" />

        <HeaderButton variant="changeLog" />

        <HeaderButton variant="help" />
      </div>

      {border && (
        <hr className="border-text-primary dark:border-text-primary-dark/10 mx-4 my-0" />
      )}
    </>
  );
}
