export function Card({ className = "", children, ...props }) {
  return (
    <div className={`rounded-lg border border-n-200 bg-n-0 p-6 shadow-xs ${className}`} {...props}>
      {children}
    </div>
  );
}
