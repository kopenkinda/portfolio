import { Clock2, Dots, X } from "tabler-icons-react";
import type { PostMetadata } from "../../utils/get-post-metadata";
import Keywords from "./keywords";

interface BlogpostPreviewProps {
  post: PostMetadata;
  className?: string;
}

export default function BlogpostPreview({
  post,
  className,
}: BlogpostPreviewProps) {
  return (
    <a href={"/blog/" + post.slug}>
      <div
        className={`inline-flex aspect-[16/6] w-72 snap-start flex-col rounded-md border border-zinc-300 p-4 transition-all hover:border-zinc-500 ${className}`}
      >
        <img
          src={`/thumbnails/${post.thumbnail}`}
          alt={post.title}
          className="w-full rounded-md"
        />
        <strong className="my-2">{post.title}</strong>
        <div className="flex items-center">
          <span className="flex items-center">
            <Clock2 className="mr-2 w-4" />
            <span>{post.readTime} min</span>
            <X className="mx-2 w-2" />
            <Keywords words={post.keywords.slice(0, 2)} />
            {post.keywords.length > 2 && <Dots className="ml-2 w-4" />}
          </span>
        </div>
      </div>
    </a>
  );
}
