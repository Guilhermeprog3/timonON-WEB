"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, ExternalLink, School, Star, Laptop, Smartphone, Database, UserCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


type Developer = {
  name: string;
  role: string;
  avatarUrl: string;
  isLeader?: boolean;
  portfolioUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
};

const projectCoordinator: Developer = {
    name: "Abílio Soares Coelho",
    role: "Coordenador do Projeto",
    avatarUrl: "https://github.com/abilioscoelho.png",
    githubUrl: "https://github.com/abilioscoelho",
    linkedinUrl: "https://linkedin.com/in/abilio-coelho-0542a2132",
};


const webDevelopers: Developer[] = [
  {
    name: "Guilherme Silva Rios",
    role: "Líder Web / Dev. Full-Stack",
    isLeader: true,
    avatarUrl: "https://github.com/Guilhermeprog3.png",
    portfolioUrl: "https://guilhermeriosdev.vercel.app/",
    githubUrl: "https://github.com/Guilhermeprog3",
    linkedinUrl: "https://www.linkedin.com/in/guilherme-rios-dev",
  },
  {
    name: "José Vítor Leal Sousa",
    role: "Desenvolvedor Full-Stack",
    avatarUrl: "https://github.com/ezezz7.png",
    githubUrl: "https://github.com/ezezz7",
    linkedinUrl: "https://www.linkedin.com/in/jv-270492312",
  },
  {
    name: "Hipólito Ramos Franklin Neto",
    role: "Desenvolvedor Full-Stack",
    avatarUrl: "https://github.com/Hipolitoneto.png",
    githubUrl: "https://github.com/Hipolitoneto",
    linkedinUrl: "https://www.linkedin.com/in/hip%C3%B3lito-ramos-franklin-neto-1171a5274?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_apphttps://www.linkedin.com/in/jv-270492312",
  },
];

const mobileDevelopers: Developer[] = [
  {
    name: "Lucas de Moura Galvão",
    role: "Líder Mobile / Dev. Full-Stack",
    isLeader: true,
    avatarUrl: "https://github.com/lmoura00.png",
    githubUrl: "https://github.com/lmoura00",
    linkedinUrl: "http://www.linkedin.com/in/lmouradev",
  },
  {
    name: "Kalline Ferreira Silva",
    role: "Desenvolvedora Full-Stack",
    avatarUrl: "https://github.com/KaahSilva.png",
    githubUrl: "https://github.com/KaahSilva",
    linkedinUrl: "https://www.linkedin.com/in/kalline-ferreira-front-end/",
  },
  {
    name: "Isaac Costa Silva",
    role: "Desenvolvedor Full-Stack",
    avatarUrl: "https://github.com/isaac-const.png",
    portfolioUrl: "https://portifolio-kappa-nine-11.vercel.app/",
    githubUrl: "https://github.com/isaac-const",
  },
  {
    name: "Miquéias Veloso Chaves Bezerra",
    role: "Desenvolvedor Full-Stack",
    avatarUrl: "https://github.com/MiqueiasVCB.png",
    githubUrl: "https://github.com/MiqueiasVCB",
  },
  {
    name: "Ian Thalles Lima Rocha",
    role: "Desenvolvedor Full-Stack",
    avatarUrl: "https://github.com/ThallSZ.png",
    githubUrl: "https://github.com/ThallSZ",
  },
];

const backendDevelopers: Developer[] = [
  {
    name: "Jhoão Pedro Nascimento Santos",
    role: "Líder Backend / Dev. Full-Stack",
    isLeader: true,
    avatarUrl: "https://github.com/jhopn.png",
    portfolioUrl: "https://jhopnportfolio.vercel.app/",
    githubUrl: "https://github.com/jhopn",
    linkedinUrl: "https://www.linkedin.com/in/jhoaosantos/",
  },
  {
    name: "Pedro Gabriel do Nascimento Matos",
    role: "Desenvolvedor Full-Stack",
    avatarUrl: "https://github.com/LPeter-nm.png",
    portfolioUrl: "https://portfoliopedrogabriel.netlify.app/",
    githubUrl: "https://github.com/LPeter-nm",
    linkedinUrl: "https://www.linkedin.com/in/pedro-gabriel-488a05284",
  },
  {
    name: "Victor Daniel Santos Cardoso",
    role: "Desenvolvedor Full-Stack",
    avatarUrl: "https://github.com/keodanic.png",
    portfolioUrl: "https://victordev-port.vercel.app/",
    githubUrl: "https://github.com/keodanic",
    linkedinUrl: "https://www.linkedin.com/in/victor-daniel-santos-cardoso-ab0787344/",
  },
  {
    name: "Leandro Barbosa Vieira Silva",
    role: "Desenvolvedor Full-Stack",
    avatarUrl: "https://github.com/LeandroBarbosa753.png",
    portfolioUrl: "https://dev-portfolio-ten-coral.vercel.app/",
    githubUrl: "https://github.com/LeandroBarbosa753",
    linkedinUrl: "https://www.linkedin.com/in/leandrobarbosav",
  },
];

function DeveloperCard({ developer }: { developer: Developer }): JSX.Element {
  return (
    <div className="p-1 h-full">
      <Card
        className={`relative flex h-full flex-col items-center overflow-hidden
                    text-center p-6 transition-all duration-300 ease-in-out
                    hover:scale-105 hover:shadow-xl dark:hover:shadow-primary/20
                    ${ developer.isLeader ? "border-amber-400 border-2" : "border-secondary" }`}
      >
        {developer.isLeader && (
            <div className="absolute top-2 right-2 bg-amber-400 text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                LÍDER
            </div>
        )}
        <Avatar className="w-28 h-28 mb-4 border-4 border-primary/20 ring-4 ring-primary/10">
          <AvatarImage src={developer.avatarUrl} alt={developer.name} />
          <AvatarFallback>{developer.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <h3 className="text-xl font-bold text-primary">{developer.name}</h3>
        <p className="text-sm text-muted-foreground flex-grow mb-4">{developer.role}</p>
        <div className="flex gap-4 mt-auto">
          <TooltipProvider delayDuration={100}>
            {developer.portfolioUrl && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={developer.portfolioUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="icon" className="hover:bg-primary/10 transition-colors">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent><p>Portfólio</p></TooltipContent>
              </Tooltip>
            )}
            {developer.githubUrl && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={developer.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="icon" className="hover:bg-primary/10 transition-colors">
                      <Github className="h-4 w-4" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent><p>GitHub</p></TooltipContent>
              </Tooltip>
            )}
            {developer.linkedinUrl && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={developer.linkedinUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="icon" className="hover:bg-primary/10 transition-colors">
                      <Linkedin className="h-4 w-4" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent><p>LinkedIn</p></TooltipContent>
              </Tooltip>
            )}
          </TooltipProvider>
        </div>
      </Card>
    </div>
  );
}

function DeveloperCarousel({ developers }: { developers: Developer[] }): JSX.Element {
  if (!developers || developers.length === 0) {
    return <p className="text-muted-foreground text-center py-8">Nenhum desenvolvedor listado.</p>;
  }
  return (
    <Carousel opts={{ align: "start", loop: developers.length > 2 }} className="w-full">
      <CarouselContent className="-ml-4">
        {developers.map((dev, index) => (
          <CarouselItem key={index} className="sm:basis-1/2 lg:basis-1/3 pl-4">
            <DeveloperCard developer={dev} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="ml-12" />
      <CarouselNext className="mr-12" />
    </Carousel>
  );
}

export default function AboutPage(): JSX.Element {
  return (
    <div className="space-y-6">
      <div className="bg-primary text-primary-foreground p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-1">Sobre</h1>
        <p className="text-sm text-primary-foreground/80">Conheça o sistema Zelus e seus desenvolvedores.</p>
      </div>

        <Card className="shadow-sm">
            <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-3 text-2xl font-bold">
                    <UserCheck className="h-7 w-7 text-primary" />
                    Coordenação do Projeto
                </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center p-8">
                <div className="w-full max-w-sm">
                    <DeveloperCard developer={projectCoordinator} />
                </div>
            </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold">
              <Laptop className="h-7 w-7 text-primary" />
              Equipe de Desenvolvimento Web
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center px-4 sm:px-12 py-8">
            <DeveloperCarousel developers={webDevelopers} />
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold">
              <Smartphone className="h-7 w-7 text-primary" />
              Equipe de Desenvolvimento Mobile
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center px-4 sm:px-12 py-8">
            <DeveloperCarousel developers={mobileDevelopers} />
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold">
              <Database className="h-7 w-7 text-primary" />
              Equipe de Backend
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center px-4 sm:px-12 py-8">
            <DeveloperCarousel developers={backendDevelopers} />
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: 'var(--ifma-green)' }} className="text-white shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-black/20 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-3xl font-bold">
                <School className="h-8 w-8" />
                Realização e Parceria
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row items-center gap-8 p-8">
              <div className="flex-shrink-0">
                <Image
                  src="/assets/logo-ifma.png"
                  alt="Logo do IFMA"
                  width={150}
                  height={85}
                  className="object-contain rounded-lg"
                />
              </div>
              <div className="space-y-4 text-white/90">
                <p className="font-bold text-xl">Um Projeto de Extensão do IFMA - Campus Timon</p>
                <p>
                  O Zelus é fruto de um projeto de extensão idealizado e desenvolvido por estudantes do curso de Sistemas Para Internet. Esta iniciativa reflete o compromisso do Instituto Federal do Maranhão com a inovação e a aplicação prática do conhecimento em benefício da comunidade.
                </p>
                <p>
                  Agradecemos à Prefeitura de Timon pela valiosa parceria, que foi fundamental para transformar este projeto acadêmico em uma ferramenta real para a cidadania.
                </p>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
  );
}