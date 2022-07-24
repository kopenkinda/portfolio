export interface BreadcrumbsProps {
  breadcrumbs: string[];
}

export default function Breadcrumbs({
  breadcrumbs,
}: BreadcrumbsProps): JSX.Element {
  const elements: JSX.Element[] = [];
  breadcrumbs.forEach((breadcrumb, index) => {
    elements.push(
      <a
        key={index}
        href={`/${breadcrumbs.slice(0, index + 1).join("/")}`}
        className="text-zinc-500 hover:text-zinc-600"
      >
        {breadcrumb}
      </a>
    );
    if (index !== breadcrumbs.length - 1) {
      elements.push(
        <span key={index + "-separator"} className="mx-2">
          /
        </span>
      );
    }
  });
  return <>{elements}</>;
}
