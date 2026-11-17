export function EmptyState({ title, children, action }) {
  return (
    <div className="rounded-lg border border-dashed border-n-300 bg-n-0 px-6 py-10 text-center">
      <h2 className="text-lg font-semibold text-n-900">{title}</h2>
      {children ? <p className="mx-auto mt-2 max-w-prose text-n-600">{children}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
