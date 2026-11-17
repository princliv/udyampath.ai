import { Check, Circle, CircleDashed } from "lucide-react";

const icons = {
  done: Check,
  current: CircleDashed,
  upcoming: Circle,
};

export function Stepper({ steps }) {
  return (
    <ol className="flex flex-col gap-4 md:flex-row md:gap-6">
      {steps.map((step, index) => {
        const state = step.state || "upcoming";
        const Icon = icons[state] || Circle;
        return (
          <li key={step.title} className="flex min-w-0 flex-1 gap-3">
            <Icon
              size={20}
              strokeWidth={1.75}
              aria-hidden="true"
              className={state === "upcoming" ? "text-n-500" : "text-accent-ink"}
            />
            <div>
              <p className="text-sm font-semibold text-n-900">
                {index + 1}. {step.title}
              </p>
              {step.detail ? <p className="text-sm text-n-600">{step.detail}</p> : null}
              <p className="sr-only">{state}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
