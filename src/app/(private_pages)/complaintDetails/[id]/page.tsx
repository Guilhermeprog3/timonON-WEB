import ComplaintDetailsServer from "@/app/components/complaint-details/server";

// Tipo simples e direto para as props da página
type PageProps = {
  params: { id: string };
};

export default async function ComplaintDetailsPage({ params }: PageProps) {
  return (
    <div className="p-8">
      <ComplaintDetailsServer id={params.id} />
    </div>
  );
}