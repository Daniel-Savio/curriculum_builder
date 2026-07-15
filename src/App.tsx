import { Header } from "@/components/header";
import { motion } from "framer-motion";

export function App() {
  return (
    <div className="min-h-svh bg-no-repeat bg-cover bg-card">
      <Header />
      <section className="px-2 flex flex-col justify-center items-center">
        <div className="flex flex-col mt-8 mb-8 bg-cover bg- bg-[url('/public/random-bg-2.png')] p-2 rounded-md ">
          <h1 className="text-4xl font-bold text-zinc-800 mb-2">
            Crie seu{" "}
            <strong className="bg-primary-gradient bg-clip-text text-transparent">
              currículo
            </strong>{" "}
            profissional
          </h1>
          <p className="text-zinc-600">
            Seu perfil profissional começa aqui. <br /> Monte seu currículo para
            poder compartilhar e enviar para outros empregadores. Basta
            responder algumas perguntas que montamos seu primeiro currículo!
          </p>
        </div>

        <div
          id="questions-form"
          className="mt-4 relative flex flex-col bg-card rounded-md px-2 max-w-190 z-10 shadow-md bg-fixed bg-[url('/public/random-bg-2.png')]"
        >
          <motion.div
            initial={{ rotate: 0, y: 0 }}
            animate={{ rotate: 360, y: 0,  }}
            transition={{ duration: 6.0, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
            className="size-11 bg-p-warning shadow-md rounded-md absolute -top-4 left-3 -z-5"
          />
          <motion.div
            initial={{ rotate: 0, y: 0 }}
            animate={{ rotate: 360, y: 0,  }}
            transition={{ duration: 4.0, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
            className="size-11 bg-p-cyan-500 rounded-md absolute -top-11 left-0 -z-10"
            />
          <h1 className="text-2xl font-bold text-zinc-800 mb-2 text-right">
            Vamos montar o seu <strong className="bg-primary-gradient bg-clip-text text-transparent">
              currículo
            </strong>
            !
          </h1>
          <p className="text-right">Seu currículo será montado com base nas suas respostas. E lembre-se, um bom currículo é direto e objetivo. E agente te acompanha nesse processo.</p>
        </div>
      </section>
    </div>
  );
}

export default App;
