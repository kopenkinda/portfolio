import type { BlogPageMetadata } from "../../utils/get-page-frontmatter";
import Keywords from "./keywords";

interface BlogpostPreviewProps {
  post: BlogPageMetadata;
  className?: string;
}

export default function BlogpostPreview({
  post,
  className,
}: BlogpostPreviewProps) {
  return (
    <a href={post.slug}>
      <div
        className={`inline-flex w-72 snap-start flex-col rounded-md border border-zinc-300 p-4 transition-all hover:border-zinc-500 ${className}`}
      >
        <img
          src={`/thumbnails/${post.thumbnail}`}
          alt={post.title}
          className="w-full rounded-md object-contain"
        />
        <strong className="my-2">{post.title}</strong>
        <Keywords words={post.keywords} />
      </div>
    </a>
  );
}
