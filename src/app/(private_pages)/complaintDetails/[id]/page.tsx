import ComplaintDetailsServer from "@/app/components/complaint-details/server";

interface ComplaintDetailsPageProps {
  params: {
    id: string;
  };
}

export default async function ComplaintDetailsPage({ params }: ComplaintDetailsPageProps) {
  return (
    <div className="p-8">
        <ComplaintDetailsServer id={params.id} />
    </div>
  );
}