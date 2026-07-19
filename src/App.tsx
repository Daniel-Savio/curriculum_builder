import { Header } from "@/components/header";
import { FormWizard } from "@/components/wizard/form-wizard";
import { ScrollArea } from "./components/ui/scroll-area";

export function App() {
  return (
    <div className="bg-background bg-cover bg-no-repeat bg-[url('/random-bg-2.png')]">
      <Header />
      <ScrollArea>
        <main className="px-4 py-6 flex flex-col h-svh items-center gap-10 ">
          <section className="w-full max-w-3xl text-center flex flex-col gap-2">
            <h1 className="text-4xl sm:text-5xl font-bold text-zinc-800 leading-tight">
              Crie seu{" "}
              <span className="bg-primary-gradient bg-clip-text text-transparent">
                currículo
              </span>{" "}
              profissional
            </h1>
            <p className="text-zinc-600 text-lg leading-relaxed max-w-xl mx-auto">
              Seu perfil profissional começa aqui. Monte seu currículo para
              compartilhar e enviar para outros empregadores. Basta responder
              algumas perguntas que montamos seu primeiro currículo.
            </p>
          </section>

          <FormWizard />
        </main>
      </ScrollArea>
    </div>
  );
}

export default App;
