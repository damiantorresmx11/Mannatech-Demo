import { cn } from "@/lib/utils";

type AvatarStatus = "online" | "offline" | "away";
type AvatarSize = "sm" | "md" | "lg";

interface AvatarWithStatusProps {
  src?: string;
  name: string;
  status?: AvatarStatus;
  size?: AvatarSize;
}

const SIZE_MAP: Record<AvatarSize, { container: string; dot: string; text: string }> = {
  sm: { container: "size-8", dot: "size-2.5 -bottom-0.5 -right-0.5 ring-[1.5px]", text: "text-xs" },
  md: { container: "size-10", dot: "size-3 -bottom-0.5 -right-0.5 ring-2", text: "text-sm" },
  lg: { container: "size-14", dot: "size-3.5 bottom-0 right-0 ring-2", text: "text-base" },
};

const STATUS_COLOR: Record<AvatarStatus, string> = {
  online: "bg-emerald-500",
  offline: "bg-zinc-400",
  away: "bg-amber-400",
};

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function AvatarWithStatus({
  src,
  name,
  status,
  size = "md",
}: AvatarWithStatusProps) {
  const s = SIZE_MAP[size];

  return (
    <div className={cn("relative shrink-0", s.container)}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={cn(
            "rounded-full object-cover",
            s.container
          )}
        />
      ) : (
        <div
          className={cn(
            "flex items-center justify-center rounded-full bg-[#00A88F]/10 text-[#00A88F] font-semibold dark:bg-[#00C9A7]/15 dark:text-[#00C9A7]",
            s.container,
            s.text
          )}
        >
          {getInitials(name)}
        </div>
      )}
      {status && (
        <span
          className={cn(
            "absolute rounded-full ring-white dark:ring-zinc-950",
            s.dot,
            STATUS_COLOR[status]
          )}
        />
      )}
    </div>
  );
}
