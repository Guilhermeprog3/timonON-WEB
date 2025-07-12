import ComplaintDetailsServer from "@/app/components/complaint-details/server";


export default async function ComplaintDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-8">
        <ComplaintDetailsServer id={params.id} />
    </div>
  );
}