import { useState, type ComponentType } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { StepIndicator } from "./step-indicator";
import {
  createEmptyExperience,
  createEmptyEducation,
  resumeSchema,
  type ResumeFormData,
} from "@/lib/resume-schema";
import { StepPersonalInfo } from "./steps/step-personal-info";
import { StepContact } from "./steps/step-contact";
import { StepExperience } from "./steps/step-experience";
import { StepEducation } from "./steps/step-education";
import { StepEducationDescriptions } from "./steps/step-education-description";
import { GraduationCapIcon, ToolboxIcon } from "@phosphor-icons/react";
import { SuitcaseIcon } from "@phosphor-icons/react/dist/ssr";
import { StepExperienceDescriptions } from "./steps/step-experience-description";
import { StepIntro } from "./steps/step-intro";
import { StepSkills } from "./steps/step-skills";

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
      id: "personal",
      title: "Sobre você",
      description: "Vamos começar com o básico.",
      fields: ["fullName", "role"],
      Component: StepPersonalInfo,
    },
    {
      id: "contact",
      title: "Como te encontrar",
      description: "Assim os empregadores conseguem entrar em contato.",
      fields: ["email", "phone"],
      Component: StepContact,
    },
    // Experience Steps
    {
      id: "intro-experience",
      title: "Informações profissionais",
      description:
        "Conta para gente no que já trabalhou, seja por conta ou em alguma empresa.Sua experiência de trabalho é sempre bem vinda",
      fields: [],
      showInIndicator: false,
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
    },
    {
      id: "experience-details",
      title: "Detalhe um pouco  cada experiência que colocou",
      description: "Passe por cada uma e descreva o que você fazia.",
      fields: ["experiences"],
      Component: StepExperienceDescriptions,
    },
    // Education Steps
    {
      id: "intro-education",
      title: "Formação acadêmica",
      description: "Agora, conta pra gente sobre sua formação escolar e acadêmica ou até mesmo um curso que tenha feito. Se não tiver, fica tranquilo, não precisa preencher.",
      fields: [],
      showInIndicator: false,
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
    },
    {
      id: "education-details",
      title: "Detalhe cada formação",
      description: "Passe por cada uma e descreva o que você aprendeu.",
      fields: ["educations"],
      Component: StepEducationDescriptions,
    },
    // Skills Steps
    {
      id: "skills-intro",
      title: "Habilidades",
      description: "Use essa área para enumerar suas habilidades, competências, experiências com tarefas e projetos que você se considera bom! Caso não queira preencher, fica tranquilo, pode pular esta etapa!",
      fields: [],
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
    }
  ];

  const methods = useForm<ResumeFormData>({
    resolver: zodResolver(resumeSchema),
    mode: "onBlur",
    defaultValues: {
      fullName: "",
      role: "",
      city: "",
      birthDate: "",
      email: "",
      phone: "",
      experiences: [createEmptyExperience()],
      educations: [createEmptyEducation()],
    },
  });

  const currentStep = steps[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === steps.length - 1;
  const StepComponent = currentStep.Component;

  // Posições, dentro do array COMPLETO de steps, de tudo que conta no indicador.
  const indicatorStepIndices = steps
    .map((step, i) => (step.showInIndicator === false ? null : i))
    .filter((i): i is number => i !== null);

  // Enquanto estiver numa etapa de introdução, o indicador mostra o dot da
  // PRÓXIMA etapa "de verdade" — a introdução é tratada como parte dela.
  const nearestCountedIndex =
    indicatorStepIndices.find((i) => i >= stepIndex) ??
    indicatorStepIndices[indicatorStepIndices.length - 1];
  const indicatorCurrent = indicatorStepIndices.indexOf(nearestCountedIndex);
  const indicatorTotal = indicatorStepIndices.length;

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

  function onSubmit(data: ResumeFormData) {
    // aqui entra a montagem do PDF a partir dos dados já validados
    console.log("Dados do currículo:", data);
  }

  return (
    <FormProvider {...methods}>
      <section
        id="questions-form"
        className="relative w-full max-w-2xl rounded-2xl border border-border bg-card shadow-md p-6 sm:p-8"
      >
        <StepIndicator
          current={indicatorCurrent}
          total={indicatorTotal}
          setStepByIndex={(dotIndex) =>
            handleStepByIndex(indicatorStepIndices[dotIndex])
          }
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
            Voltar
          </Button>
          <Button type="button" onClick={handleNext}>
            {isLastStep ? "Gerar currículo" : "Próximo"}
          </Button>
        </div>
      </section>
    </FormProvider>
  );
}
