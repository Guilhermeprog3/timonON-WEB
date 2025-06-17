import ComplaintDetailsServer from "@/app/components/complaint-details/server";

type ComplaintDetailsPageProps = {
  params: {
    id: string;
  };
};

export default async function ComplaintDetailsPage({ params }: ComplaintDetailsPageProps) {
  return (
    <div className="p-6">
        <ComplaintDetailsServer id={params.id} />
    </div>
  );
}