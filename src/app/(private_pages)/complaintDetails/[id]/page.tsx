import { notFound } from "next/navigation";
import { getComplaintById } from "@/app/components/complaint-details/action";
import { ComplaintDetails } from "@/app/components/complaint-details/index";

type PageProps = {
  params: { id: string };
};

export default async function ComplaintDetailsPage({ params }: PageProps) {
  const complaint = await getComplaintById(params.id);

  if (!complaint) {
    notFound();
  }

  return (
    <div className="p-8">
      <ComplaintDetails complaint={complaint} />
    </div>
  );
}