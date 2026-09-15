import { useRepoStars } from "../lib/useGitHubStars";

interface GitHubStarProps {
  repoUrl: string;
  className?: string;
}

export function GitHubStarButton({ repoUrl, className = "" }: GitHubStarProps) {
  const stars = useRepoStars(repoUrl);

  return (
    <a
      href={repoUrl}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center gap-1.5 rounded-lg border border-rule bg-white px-3.5 py-2 text-sm font-medium text-ink transition hover:border-ink cursor-pointer ${className}`}
      title="Star on GitHub"
    >
      <svg
        className="h-4 w-4 text-accent fill-current"
        viewBox="0 0 16 16"
        aria-hidden="true"
      >
        <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
      </svg>
      <span>Star</span>
      {stars !== null ? (
        <span className="ml-1 rounded-full border border-rule bg-soft px-2 py-0.5 text-xs font-semibold text-ink">
          {stars}
        </span>
      ) : null}
    </a>
  );
}

export function GitHubStarBadge({ repoUrl, className = "" }: GitHubStarProps) {
  const stars = useRepoStars(repoUrl);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        window.open(repoUrl, "_blank", "noopener,noreferrer");
      }}
      className={`inline-flex items-center gap-1 rounded-md border border-rule bg-soft/60 px-2 py-0.5 text-xs text-muted transition hover:border-ink hover:text-ink cursor-pointer ${className}`}
      title="Star this repository on GitHub"
    >
      <svg
        className="h-3 w-3 text-accent fill-current"
        viewBox="0 0 16 16"
        aria-hidden="true"
      >
        <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
      </svg>
      <span className="font-medium">
        {stars !== null ? stars : "Star"}
      </span>
    </button>
  );
}
