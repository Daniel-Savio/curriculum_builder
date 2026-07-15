import { Header } from "@/components/header"

export function App() {
  return (
    <div className="min-h-svh bg-no-repeat bg-cover bg-[url('/public/random-bg-2.png')]">
      <Header />
      <section className="px-2">

        <div className="flex flex-col mt-8 bg-card p-2 rounded-md">
          <h1 className="text-4xl font-bold text-zinc-800 mb-2">Crie seu <strong className="bg-primary-gradient bg-clip-text text-transparent">
            currículo
          </strong>  profissional</h1>
          <p className="text-zinc-600">Seu perfil profissional começa aqui. <br/> Monte seu currículo para poder compartilhar e enviar para outros empregadores. Basta responder algumas perguntas que montamos seu primeiro currículo!</p>

        </div>
      </section>
    </div>
  )
}

export default App
