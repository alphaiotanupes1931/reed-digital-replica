import { Link } from "react-router-dom";

type Props = {
  to?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
};

const cls =
  "inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors";

/** Consistent back navigation used across every Home Office page. */
const BackLink = ({ to = "/home-office", onClick, label = "Home Office", className = "" }: Props) => {
  const content = (
    <>
      <span aria-hidden>←</span>
      {label}
    </>
  );
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`${cls} ${className}`}>
        {content}
      </button>
    );
  }
  return (
    <Link to={to} className={`${cls} ${className}`}>
      {content}
    </Link>
  );
};

export default BackLink;