import { Affiliate, Folders } from "tabler-icons-react";
import IconLink from "./icon-link";
import Keywords from "./keywords";

export interface ProjectProps {
  img: string;
  title: string;
  description?: string;
  tech: string[];
  demoLink?: string;
  codeLink?: string;
}

export default function Project({
  description,
  img,
  tech,
  title,
  codeLink,
  demoLink,
}: ProjectProps) {
  return (
    <div className="flex w-72 flex-col rounded-lg border border-zinc-300 p-4">
      <img src={img} alt={title} className="w-full rounded-md" />
      <strong className="my-2 mb-1">{title}</strong>
      {description && <p className="mb-2">{description}</p>}
      <div className="mt-auto flex flex-wrap overflow-x-auto">
        <Keywords words={tech} />
      </div>
      <div className="mt-2 flex gap-2">
        {demoLink && (
          <IconLink
            href={demoLink}
            text="Demo"
            icon={<Affiliate className="w-4" />}
            className="translate-all w-full hover:border-zinc-600"
            blank
          />
        )}
        {codeLink && (
          <IconLink
            href={codeLink}
            text="Repo"
            icon={<Folders className="w-4" />}
            className="translate-all w-full hover:border-zinc-600"
            blank
          />
        )}
      </div>
    </div>
  );
}
