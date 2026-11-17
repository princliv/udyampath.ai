import { Button, EmptyState } from "../components/ui";

export default function NotFound() {
  return (
    <div className="not-found">
      <EmptyState
        title="This page is not on UdyamPath"
        action={
          <Button href="/homepage" variant="primary">
            Back to home
          </Button>
        }
      >
        The link may be old, or the page may have moved. Home, courses, jobs, and tools are still where you left them.
      </EmptyState>
    </div>
  );
}
