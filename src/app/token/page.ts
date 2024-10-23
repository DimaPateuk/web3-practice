import { redirect } from "next/navigation";

export default function token() {
  return redirect("/token/lock");
}
