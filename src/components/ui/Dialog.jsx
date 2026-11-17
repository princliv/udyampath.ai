import * as DialogPrimitive from "@radix-ui/react-dialog";

export function Dialog({ open, onOpenChange, title, description, trigger, children }) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {trigger ? <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger> : null}
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-n-900/40" />
        <DialogPrimitive.Content
          aria-describedby={description ? undefined : undefined}
          className="fixed z-50 w-[min(100%,32rem)] rounded-xl border border-n-200 bg-n-0 p-6 shadow-lg max-md:inset-x-0 max-md:bottom-0 max-md:rounded-b-none md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2"
        >
          <DialogPrimitive.Title className="text-xl font-semibold text-n-900">
            {title}
          </DialogPrimitive.Title>
          {description ? (
            <DialogPrimitive.Description className="mt-2 text-n-600">
              {description}
            </DialogPrimitive.Description>
          ) : (
            <DialogPrimitive.Description className="sr-only">{title}</DialogPrimitive.Description>
          )}
          <div className="mt-4">{children}</div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export function DialogClose({ children, className = "" }) {
  return <DialogPrimitive.Close className={className}>{children}</DialogPrimitive.Close>;
}
