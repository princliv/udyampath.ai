import { useLocation } from "react-router-dom";
import Assessment from "../../features/learn/Assessment";

export default function TestPage() {
  const title = useLocation().state?.courseTitle || "";
  return <Assessment kind="final" courseTitle={title} />;
}
