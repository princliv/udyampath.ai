import { useQuery } from "@tanstack/react-query";
import { auth } from "../firebase/firebase";
import { readProfile } from "./firebase";

export function useProfile() {
  const uid = auth.currentUser?.uid || null;
  return useQuery({
    queryKey: ["profile", uid],
    queryFn: () => readProfile(uid),
    enabled: Boolean(uid),
  });
}
