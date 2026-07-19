import { ArrowUUpLeftIcon } from "@phosphor-icons/react"
import Logo from "/logo.png"
import { Button } from "@/components/ui/button"



export function Header() {
  return (
    <header className="w-full h-fit bg-zinc-50 px-4 py-2 shadow-zinc-200 shadow-md flex items-center justify-center md:justify-between">

      <a className="cursor-pointer " href="https://piracaia.sp.gov.br/"><img src={Logo} alt="Logo" className=" w-36 h-16" /></a>

      <div className="hidden md:flex items-center justify-center">
        <Button onClick={() => { window.location.href = "https://piracaia.sp.gov.br/" }} className={"flex gap-2 bg-p-success text-zinc-900"}>
          <ArrowUUpLeftIcon size={32} weight="bold" />
          <p>Voltar para o site da prefeitura</p> </Button>
      </div>
    </header>
  )
}
