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
import { StepExperienceDescriptions } from "./steps/step-experience-description";
import { StepEducation } from "./steps/step-education";
import { StepEducationDescriptions } from "./steps/step-education-description";

type Step = {
  id: string;
  title: string;
  description: string;
  fields: (keyof ResumeFormData)[];
  Component: ComponentType;
};

// Cada etapa nova = uma entrada aqui + o componente em ./steps.
// A ordem do array é a ordem do wizard.
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
  {
    id: "experience",
    title: "Sua experiência",
    description: "Conte um pouco sobre onde você já trabalhou.",
    fields: ["experiences"],
    Component: StepExperience,
  },
  {
    id: "experience-details",
    title: "Detalhe cada experiência",
    description: "Passe por cada uma e descreva o que você fazia.",
    fields: ["experiences"],
    Component: StepExperienceDescriptions,
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
];

export function FormWizard() {
  const [stepIndex, setStepIndex] = useState(0);

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
    if (targetIndex === stepIndex) return;

    // Voltar é sempre livre — não tem risco de pular validação.
    if (targetIndex < stepIndex) {
      setStepIndex(targetIndex);
      return;
    }

    // Avançar clicando no indicador precisa da mesma validação do botão
    // "Próximo", senão dá pra pular uma etapa com campo obrigatório vazio.
    const isStepValid = await methods.trigger(currentStep.fields);
    if (!isStepValid) return;

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
          current={stepIndex}
          total={steps.length}
          setStepByIndex={handleStepByIndex}
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
