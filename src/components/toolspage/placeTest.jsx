import { useLocation } from "react-router-dom";
import Assessment from "../../features/learn/Assessment";

export default function PlaceTest() {
  const title = useLocation().state?.title || "Placement test";
  return <Assessment kind="placement" courseTitle={title} courseId="placement" />;
}
