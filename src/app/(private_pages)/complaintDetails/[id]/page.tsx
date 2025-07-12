import ComplaintDetailsServer from "@/app/components/complaint-details/server";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function ComplaintDetailsPage({ params }: Props) {
  return (
    <div className="p-8">
        <ComplaintDetailsServer id={params.id} />
    </div>
  );
}