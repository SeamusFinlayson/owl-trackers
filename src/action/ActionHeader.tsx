import HeaderButton from "../components/HeaderButton";

export default function ActionHeader(): React.JSX.Element {
  return (
    <>
      <div className="grid grid-cols-[minmax(120px,auto)_repeat(3,42px)] items-center p-4">
        <h1 className="m-0 text-lg font-bold tracking-normal text-text-primary dark:text-text-primary-dark">
          Owl Trackers
        </h1>

        <HeaderButton variant="patreon"></HeaderButton>

        <HeaderButton variant="changeLog"></HeaderButton>

        <HeaderButton variant="help"></HeaderButton>
      </div>

      <hr className="mx-4 my-0 border-text-primary dark:border-text-primary-dark/10"></hr>
    </>
  );
}
