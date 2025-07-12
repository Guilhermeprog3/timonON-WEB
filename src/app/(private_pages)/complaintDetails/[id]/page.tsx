import ComplaintDetailsServer from "@/app/components/complaint-details/server";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function ComplaintDetailsPage({ params }: PageProps) {
  return (
    <div className="p-8">
      <ComplaintDetailsServer id={params.id} />
    </div>
  );
}
