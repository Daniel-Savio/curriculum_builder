import { useState, type ComponentType } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { StepIndicator } from "./step-indicator";
import {
  createEmptyResume,
  //createEmptyExperience,
  //createEmptyEducation,
  resumeSchema,
  type ResumeFormData,
} from "@/lib/resume-schema";
import { StepPersonalInfo } from "./steps/step-personal-info";
import { StepContact } from "./steps/step-contact";
import { StepExperience } from "./steps/step-experience";
import { StepEducation } from "./steps/step-education";
import { StepEducationDescriptions } from "./steps/step-education-description";
import { ArrowLeftIcon, ArticleMediumIcon, GraduationCapIcon, ToolboxIcon, UserIcon } from "@phosphor-icons/react";
import { SuitcaseIcon } from "@phosphor-icons/react/dist/ssr";
import { StepExperienceDescriptions } from "./steps/step-experience-description";
import { StepIntro } from "./steps/step-intro";
import { StepSkills } from "./steps/step-skills";
import { StepGeneralDescription } from "./steps/step-general-description";
import { pdf } from "@react-pdf/renderer";
import { ResumePDF } from "@/pdf/pdf-resume";


type Step = {
  id: string;
  title: string;
  description: string;
  fields: (keyof ResumeFormData)[];
  // Remove "| Element" and add "<any>"
  Component: ComponentType<unknown>;
  showInIndicator?: boolean;
};


export function FormWizard() {
  const [stepIndex, setStepIndex] = useState(0);

  const steps: Step[] = [
    {
      id: "intro-personal",
      title: "Informações individuais",
      description:
        "Coloque algumas informações sobre vocês para que os empregadores possam entrar em contato diretamente contigo!",
      fields: [],
      showInIndicator: true,
      Component: () => (
        <StepIntro
          icon={<UserIcon size={28} weight="bold" />}
          points={["Seu nome", "Objetivo ou cargo que deseja", "INformações para contato"]}

        />
      ),
    },
    {
      id: "personal",
      title: "Sobre você",
      description: "Vamos começar com o básico.",
      fields: ["fullName", "role"],
      Component: StepPersonalInfo,
      showInIndicator: false,
    },
    {
      id: "contact",
      title: "Como te encontrar",
      description: "Assim os empregadores conseguem entrar em contato.",
      fields: ["email", "phone"],
      Component: StepContact,
      showInIndicator: false,
    },
    // Experience Steps
    {
      id: "intro-experience",
      title: "Informações profissionais",
      description:
        "Conta para gente no que já trabalhou, seja por conta ou em alguma empresa.Sua experiência de trabalho é sempre bem vinda",
      fields: [],
      showInIndicator: true,
      Component: () => (
        <StepIntro
          icon={<SuitcaseIcon size={28} weight="bold" />}
          points={["Empresas que trabalhou", "Projetos que participou", "Conhecimentos adquiridos"]}

        />
      ),
    },
    {
      id: "experience",
      title: "Sua experiência",
      description: "Uma DICA, comece do mais recente para o mais antigo.",
      fields: ["experiences"],
      Component: StepExperience,
      showInIndicator: false,
    },
    {
      id: "experience-details",
      title: "Detalhe um pouco  cada experiência que colocou",
      description: "Passe por cada uma e descreva o que você fazia.",
      fields: ["experiences"],
      Component: StepExperienceDescriptions,
      showInIndicator: false,
    },
    // Education Steps
    {
      id: "intro-education",
      title: "Formação acadêmica",
      description: "Agora, conta pra gente sobre sua formação escolar e acadêmica ou até mesmo um curso que tenha feito. Se não tiver, fica tranquilo, não precisa preencher.",
      fields: [],
      showInIndicator: true,
      Component: () => (
        <StepIntro
          icon={<GraduationCapIcon size={28} weight="bold" />}
          points={[]}
          cta={{ label: "Pular esta etapa", onClick: () => setStepIndex(8) }}
        />
      ),
    },
    {
      id: "education",
      title: "Sua formação",
      description: "Conte sobre escolas, cursos e faculdades.",
      fields: ["educations"],
      Component: StepEducation,
      showInIndicator: false,
    },
    {
      id: "education-details",
      title: "Detalhe cada formação",
      description: "Passe por cada uma e descreva o que você aprendeu.",
      fields: ["educations"],
      Component: StepEducationDescriptions,
      showInIndicator: false,
    },
    // Skills Steps
    {
      id: "skills-intro",
      title: "Habilidades",
      description: "Use essa área para enumerar suas habilidades, competências, experiências com tarefas e projetos que você se considera bom! Caso não queira preencher, fica tranquilo, pode pular esta etapa!",
      fields: [],
      showInIndicator: true,
      Component: () => (
        <StepIntro
          icon={<ToolboxIcon size={28} weight="bold" />}
          points={["Idiomas", "Ferramentas que sabe usar", "Experiências", "Softwares que sabe usar"]}
          cta={{ label: "Pular esta etapa", onClick: () => setStepIndex(10) }}
        />
      ),
    },
    {
      id: "skills",
      title: "Habilidades",
      description: "Aqui pode colocar desde máquinas que sabe operar, serviços que consegue prestar, idiomas que sabe falar e softwares que sabe usar, etc",
      fields: ["skills"],
      Component: StepSkills,
      showInIndicator: false,
    },
    // General Description Step
    {
      id: "general-description",
      title: "Descrição Geral",
      description: "Agora que você já passou pela sua trajetória, escreva aqui uma descrição geral sobre você e sua experiência profissional, acadêmica e no que você se encaixa para .",
      fields: ["generalDescription"],
      Component: StepGeneralDescription,
      showInIndicator: false,
    },
    {
      id: "end",
      title: "Concluir",
      description: "Parabén, agora já temos o suficiente para gerar seu currículo!!!.",
      fields: [],
      showInIndicator: true,
      Component: () => (
        <StepIntro
        icon={<ArticleMediumIcon size={32} weight="bold"/>}
          points={[]}
          cta={{ label: "Gerar currículo", onClick: () => handleNext() }}
        />
      ),
    },
  ];

  const methods = useForm<ResumeFormData>({
    resolver: zodResolver(resumeSchema),
    mode: "onBlur",
    defaultValues: createEmptyResume(),
  });

  const currentStep = steps[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === steps.length - 1;
  const StepComponent = currentStep.Component;

  // Agrupa o array COMPLETO de steps em seções: cada step com
  // showInIndicator !== false abre uma seção nova (vira um círculo
  // numerado); todo step depois dele, até a próxima seção, entra como
  // sub-etapa (vira um traço no trilho tracejado dessa seção).
  const sections = steps.reduce<
    { introIndex: number; subStepIndices: number[] }[]
  >((acc, step, i) => {
    if (step.showInIndicator !== false) {
      acc.push({ introIndex: i, subStepIndices: [] });
    } else if (acc.length > 0) {
      acc[acc.length - 1].subStepIndices.push(i);
    }
    return acc;
  }, []);

  async function handleNext() {
    // valida só os campos da etapa atual, não o form inteiro
    const isStepValid = await methods.trigger(currentStep.fields);
    if (!isStepValid) return;

    if (isLastStep) {
      methods.handleSubmit(onSubmit)();
      return;
    }
    setStepIndex((i) => i + 1);
  }

  function handleBack() {
    setStepIndex((i) => Math.max(0, i - 1));
  }

  async function handleStepByIndex(targetIndex: number) {


    // Voltar é sempre livre — não tem risco de pular validação.
    if (targetIndex < stepIndex) {
      setStepIndex(targetIndex);
      return;
    }

    // Avançar clicando no indicador precisa da mesma validação do botão
    // "Próximo", senão dá pra pular uma etapa com campo obrigatório vazio.
    // const isStepValid = await methods.trigger(currentStep.fields);
    // if (!isStepValid) return;

    setStepIndex(targetIndex);
  }

  async function onSubmit(data: ResumeFormData) {
    // aqui entra a montagem do PDF a partir dos dados já validados
    try {
      // 1. Generate the PDF Blob
      const blob = await pdf(<ResumePDF data={data} />).toBlob();

      // 2. Create an object URL for the Blob
      const url = URL.createObjectURL(blob);

      // 3. Create a temporary anchor element to trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.download = `${data.fullName.replace(/\s+/g, '_')}_Resume.pdf`;

      // 4. Append to body, click, and clean up
      document.body.appendChild(link);
      link.click();

      // Small delay to ensure the browser registers the click before cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);

      console.log("PDF generated successfully!");
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    }
  }

  return (
    <FormProvider {...methods}>
      <section
        id="questions-form"
        className="relative w-full max-w-2xl rounded-2xl border border-border bg-card shadow-md p-6 sm:p-8"
      >
        <StepIndicator
          sections={sections}
          currentStepIndex={stepIndex}
          onNavigate={handleStepByIndex}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <h2 className="text-2xl font-bold text-zinc-800 mb-1">
              {currentStep.title}
            </h2>
            <p className="text-zinc-600 mb-6">{currentStep.description}</p>
            { }
            <StepComponent />
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-8">
          <Button
            type="button"
            variant="ghost"
            onClick={handleBack}
            disabled={isFirstStep}
          >
            <ArrowLeftIcon size={18} weight="bold" />
            Voltar
          </Button>
          <Button hidden={isLastStep} type="button" onClick={handleNext}>
            {isLastStep ? "Gerar currículo" : "Próximo"}
          </Button>
        </div>
      </section>
    </FormProvider>
  );
}
