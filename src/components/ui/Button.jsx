const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-base",
  lg: "h-[52px] px-5 text-base",
};

const variants = {
  primary: "bg-accent-ink text-n-0 hover:brightness-95",
  secondary: "bg-n-0 text-n-900 border border-n-300 hover:bg-n-50",
  ghost: "bg-transparent text-accent-ink hover:bg-n-100",
  danger: "bg-danger text-n-0 hover:brightness-95",
  link: "h-auto px-0 text-accent-ink underline-offset-4 hover:underline",
};

export function Button({
  variant = "primary",
  size = "md",
  href,
  type = "button",
  loading = false,
  disabled = false,
  className = "",
  children,
  ...props
}) {
  const classNames = [
    "relative inline-flex items-center justify-center gap-2 rounded-md font-semibold",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400",
    "disabled:cursor-not-allowed disabled:opacity-60",
    sizes[size],
    variants[variant],
    className,
  ].join(" ");

  const content = (
    <>
      <span className={loading ? "invisible" : ""}>{children}</span>
      {loading ? (
        <span
          className="absolute size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      ) : null}
    </>
  );

  if (href) {
    return (
      <a href={href} className={classNames} aria-busy={loading || undefined} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={classNames}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {content}
    </button>
  );
}
