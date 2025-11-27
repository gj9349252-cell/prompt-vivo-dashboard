import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, 
  Globe, 
  Megaphone, 
  Settings, 
  TrendingUp,
  CheckSquare,
  Clock,
  Monitor
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const menuCards = [
    {
      title: "DATA / TIPO ATIVIDADE",
      description: "Visualize atividades por data e tipo de equipamento",
      icon: Calendar,
      route: "/data-atividade",
      color: "from-primary to-primary-light"
    },
    {
      title: "Atividade Front Office",
      description: "Consolidado de TASKs - Front Office",
      icon: CheckSquare,
      route: "/tasks-front-office",
      color: "from-primary to-primary-dark"
    },
    {
      title: "ATIVIDADES MARKETING",
      description: "Atividades da área de Marketing",
      icon: Megaphone,
      route: "/atividades-marketing",
      color: "from-primary to-primary-light"
    },
    {
      title: "ATIVIDADES ENGENHARIA",
      description: "Atividades da área de Engenharia",
      icon: Settings,
      route: "/atividades-engenharia",
      color: "from-primary to-primary-dark"
    },
    {
      title: "CONSOLIDADO HORÁRIO COMERCIAL",
      description: "Atividades executadas em horário comercial",
      icon: Clock,
      route: "/consolidado-horario-comercial",
      color: "from-primary to-primary-light"
    },
    {
      title: "ATIVIDADES PLATAFORMA",
      description: "Atividades de origem Plataforma de TV",
      icon: Monitor,
      route: "/atividades-plataforma",
      color: "from-primary to-primary-dark"
    },
    {
      title: "CONSOLIDADO ANUAL",
      description: "Análise consolidada do ano",
      icon: TrendingUp,
      route: "/consolidado-anual",
      color: "from-primary to-primary-light"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-header text-white py-8 px-6 shadow-elevated">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            PORTAL ATIVIDADES PROGRAMADAS
          </h1>
          <p className="text-lg text-white/90">
            PLATAFORMA DE TV
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Selecione a visão desejada
          </h2>
          <p className="text-muted-foreground">
            Escolha uma das opções abaixo para acessar os dados e análises
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card
                key={card.route}
                className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-elevated overflow-hidden border-2 hover:border-primary"
                onClick={() => navigate(card.route)}
              >
                <div className="p-6">
                  <div className={`bg-gradient-to-br ${card.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {card.description}
                  </p>
                </div>
                <div className={`h-1 bg-gradient-to-r ${card.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
              </Card>
            );
          })}
        </div>

        {/* Info Footer */}
        <div className="mt-12 p-6 bg-card rounded-xl shadow-card border">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Sobre o Portal
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Este painel permite acompanhar e analisar todas as atividades programadas da Plataforma de TV,
            incluindo métricas de execução, análise por área solicitante, identificação de falhas por equipamento
            e consolidação de resultados mensais e anuais.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
