import { NextPage } from 'next';
import ComplaintDetailsServer from '@/app/components/complaint-details/server';

// Definindo o tipo para os parâmetros da rota
interface PageParams {
  id: string;
}

// Usando o tipo NextPage para garantir a compatibilidade
const ComplaintDetailsPage: NextPage<{ params: PageParams }> = async ({ params }) => {
  return (
    <div className="p-8">
      <ComplaintDetailsServer id={params.id} />
    </div>
  );
};

export default ComplaintDetailsPage;