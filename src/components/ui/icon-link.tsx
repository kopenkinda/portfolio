import { Link } from "tabler-icons-react";

export interface IconLinkProps {
  href: string;
  icon?: JSX.Element;
  text: string;
  className?: string;
  blank?: boolean;
}

export default function IconLink({
  href,
  icon,
  text,
  className,
  blank = false,
}: IconLinkProps) {
  const _icon = icon || <Link className="w-4" />;
  return (
    <a
      href={href}
      className={`inline-flex items-center rounded-md border border-zinc-300 p-0.5 px-2  transition-colors ${className}`}
      target={blank ? "_blank" : undefined}
      rel={blank ? "noopener" : undefined}
    >
      {_icon}
      <span className="ml-2">{text}</span>
    </a>
  );
}
