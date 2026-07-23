import { useState } from "react";
import { Header } from "@/components/header";
import { FormWizard } from "@/components/wizard/form-wizard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  RocketLaunch,
  ShieldCheck,
  MagicWand,
  ArrowRight,
} from "@phosphor-icons/react";

// A reusable component for the feature cards
const FeatureCard = ({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ y: -5 }}
    className="bg-card p-6 sm:p-8 rounded-2xl border border-border shadow-sm flex flex-col items-center text-center gap-4 cursor-default"
  >
    <div className="p-4 bg-primary/10 text-primary rounded-2xl mb-2">
      {icon}
    </div>
    <h3 className="font-bold text-xl text-zinc-800">{title}</h3>
    <p className="text-zinc-600 leading-relaxed">{description}</p>
  </motion.div>
);

export function App() {
  // State to toggle between the Landing Page and the Form Wizard
  const [isBuilding, setIsBuilding] = useState(false);

  return (
    <div className="bg-background min-h-svh flex flex-col font-sans overflow-hidden">
      <Header />
      <ScrollArea className="flex-1 flex flex-col">
        <main className="flex flex-col items-center w-full">
          <AnimatePresence mode="wait">
            {!isBuilding ? (
              <motion.div
                key="landing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="w-full flex flex-col items-center"
              >
                {/* --- Hero Section --- */}
                <section className="w-full max-w-5xl px-4 py-20 sm:py-32 flex flex-col items-center text-center gap-8 relative">
                  {/* Decorative Background Blob */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10" />

                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-2"
                  >
                    <MagicWand size={18} weight="bold" />
                    <span>Gerador Inteligente de CV</span>
                  </motion.div>

                  <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-5xl sm:text-7xl font-extrabold text-zinc-900 tracking-tight max-w-4xl leading-[1.1]"
                  >
                    Crie seu{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                      currículo profissional
                    </span>{" "}
                    em minutos.
                  </motion.h1>

                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-zinc-600 text-lg sm:text-xl leading-relaxed max-w-2xl"
                  >
                    Destaque-se no mercado de trabalho. Preencha seus dados de forma
                    simples, escolha o que deseja destacar e nós geramos um PDF
                    perfeito e pronto para enviar aos recrutadores.
                  </motion.p>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-4"
                  >
                    <Button
                      size="lg"
                      onClick={() => setIsBuilding(true)}
                      className="group gap-2 text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
                    >
                      Começar agora
                      <ArrowRight
                        size={20}
                        weight="bold"
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </Button>
                  </motion.div>
                </section>

                {/* --- Features Grid Section --- */}
                <section className="w-full max-w-6xl px-4 py-20 border-t border-border/50 bg-zinc-50/50">
                  <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-zinc-800 mb-4">
                      Por que usar nosso gerador?
                    </h2>
                    <p className="text-zinc-500">Tudo o que você precisa para dar o próximo passo na sua carreira.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
                    <FeatureCard
                      icon={<RocketLaunch size={32} weight="duotone" />}
                      title="Rápido e Prático"
                      description="Sem formatações complexas no Word. Responda ao nosso assistente e deixe o design por nossa conta."
                      delay={0.1}
                    />
                    <FeatureCard
                      icon={<FileText size={32} weight="duotone" />}
                      title="Layouts Otimizados"
                      description="Estruturas pensadas para leitura dinâmica, ajudando você a passar pelos sistemas de RH (ATS)."
                      delay={0.2}
                    />
                    <FeatureCard
                      icon={<ShieldCheck size={32} weight="duotone" />}
                      title="Seus Dados Seguros"
                      description="O documento é gerado diretamente no seu navegador. Não guardamos as informações do seu currículo."
                      delay={0.3}
                    />
                  </div>
                </section>
              </motion.div>
            ) : (
              <motion.div
                key="wizard"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full h-full flex flex-col items-center px-0 sm:px-4 py-0 sm:py-10 flex-1"
              >
                {/* We pass a full width/height container here so the Wizard can stretch */}
                <div className="w-full h-full max-w-3xl flex-1 flex flex-col">
                  <FormWizard />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </ScrollArea>
    </div>
  );
}

export default App;
