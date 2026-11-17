import * as TabsPrimitive from "@radix-ui/react-tabs";

export function Tabs({ value, defaultValue, onValueChange, children, className = "" }) {
  return (
    <TabsPrimitive.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      className={className}
    >
      {children}
    </TabsPrimitive.Root>
  );
}

export function TabList({ children, label = "Sections" }) {
  return (
    <TabsPrimitive.List className="flex gap-4 border-b border-n-200" aria-label={label}>
      {children}
    </TabsPrimitive.List>
  );
}

export function Tab({ value, children }) {
  return (
    <TabsPrimitive.Trigger
      value={value}
      className="h-11 border-b-2 border-transparent px-1 font-semibold text-n-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400 data-[state=active]:border-accent-ink data-[state=active]:text-accent-ink"
    >
      {children}
    </TabsPrimitive.Trigger>
  );
}

export function TabPanel({ value, children }) {
  return (
    <TabsPrimitive.Content value={value} className="pt-4 focus-visible:outline-none">
      {children}
    </TabsPrimitive.Content>
  );
}
