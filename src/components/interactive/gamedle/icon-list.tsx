import type { ReactElement } from "react";

export const IconList = ({
  icon,
  elements,
  label,
}: {
  icon: ReactElement;
  elements: string[];
  label: string;
}) => {
  return (
    <div className="flex items-start gap-1">
      {icon}
      <ul>
        <li className="mb-1 font-bold">{label}</li>
        {elements.map((element, i) => (
          <li
            className="text-sm text-neutral-600 dark:text-neutral-400"
            key={i}
          >
            {element}
          </li>
        ))}
      </ul>
    </div>
  );
};
