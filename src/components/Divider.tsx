export function Divider({
  title,
  titleAlignment = "LEFT",
}: {
  title?: string;
  titleAlignment?: "LEFT" | "CENTER" | "RIGHT";
}) {
  const divider = (
    <hr className="border-text-primary dark:border-text-primary-dark/10 my-0 grow" />
  );
  const titleElement = (
    <div className="text-text-secondary dark:text-text-secondary-dark text-xs font-semibold">
      {title}
    </div>
  );

  if (!title) return divider;
  if (titleAlignment === "LEFT")
    return (
      <div className="flex items-center gap-2">
        {titleElement}
        {divider}
      </div>
    );
  if (titleAlignment === "CENTER")
    return (
      <div className="flex items-center gap-2">
        {divider}
        {titleElement}
        {divider}
      </div>
    );
  if (titleAlignment === "RIGHT")
    return (
      <div className="flex items-center gap-2">
        {divider}
        {titleElement}
      </div>
    );
}
