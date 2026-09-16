import { Link } from "react-router-dom";

type LogoProps = {
  compact?: boolean;
  to?: string;
};

export function Logo({ compact = false, to = "/" }: LogoProps) {
  const mark = (
    <span className="inline-flex items-center gap-2.5">
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
      >
        <rect width="32" height="32" rx="8" fill="#0F766E" />
        <path
          d="M10 8.5h8.2c.4 0 .8.16 1.1.44l3.26 3.1c.3.28.44.67.44 1.08V23c0 .83-.67 1.5-1.5 1.5H10c-.83 0-1.5-.67-1.5-1.5V10c0-.83.67-1.5 1.5-1.5z"
          fill="white"
          fillOpacity=".95"
        />
        <path d="M18 8.6v3.2c0 .5.4.9.9.9h3" stroke="#0F766E" strokeWidth="1.4" />
        <circle cx="16" cy="17.5" r="3.4" stroke="#0F766E" strokeWidth="1.6" />
        <path
          d="M18.4 20 20.6 22.2"
          stroke="#0F766E"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
      {!compact && (
        <span className="text-[1.05rem] font-extrabold tracking-tight text-ink">
          ResumeLens
        </span>
      )}
    </span>
  );

  return (
    <Link to={to} className="inline-flex items-center rounded-lg" aria-label="ResumeLens home">
      {mark}
    </Link>
  );
}
