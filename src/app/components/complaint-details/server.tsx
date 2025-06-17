import { notFound } from "next/navigation";
import { getComplaintById } from "./action";
import { ComplaintDetails } from "./index";

export default async function ComplaintDetailsServer({ id }: { id: string }) {
  const complaint = await getComplaintById(id);

  if (!complaint) {
    notFound();
  }

  return <ComplaintDetails complaint={complaint} />;
}