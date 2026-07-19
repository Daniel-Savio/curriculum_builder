import { z } from "zod";

// Cada schema representa os campos de UMA etapa.
// Isso permite validar só a etapa atual (não o form inteiro) ao clicar em "Próximo".

const currentYear = new Date().getFullYear();

function isFourDigitYear(value: string) {
  return /^\d{4}$/.test(value);
}

export const personalInfoSchema = z.object({
  fullName: z.string().min(3, "Qual o seu nome completo?"),
  city: z.string().min(3, "Qual a cidade em que você mora autalmente?"),
  birthDate: z.string().min(10, "Qual a data de nascimento?"),
  role: z.string().min(2, "Qual o cargo desejado ou seu objetivo?"),
});

export const contactSchema = z.object({
  email: z.string().email("E-mail inválido").optional(),
  phone: z
    .string()
    .regex(/^\(\d{2}\)9\d{4}-\d{4}$/, "Telefone inválido. Use o formato (11)91234-5678"),
});

// Uma entrada individual de experiência.
// O .refine garante: OU tem data de término, OU está marcada como emprego atual.
export const experienceEntrySchema = z
  .object({
    company: z.string().min(2, "Qual a empresa?"),
    company_city: z.string().optional(),
    position: z.string().min(2, "Qual o cargo?"),
    description: z.string().optional(),
    startDate: z
      .string()
      .min(1, "Qual a data de início dessa experiência?")
      .refine(isFourDigitYear, "Informe um ano válido (ex: 2022)")
      .refine((year) => Number(year) <= currentYear, {
        message: `O ano não pode ser maior que ${currentYear}`,
      }),
    endDate: z
      .string()
      .optional()
      .refine((year) => !year || isFourDigitYear(year), {
        message: "Informe um ano válido (ex: 2022)",
      })
      .refine((year) => !year || Number(year) <= currentYear, {
        message: `O ano não pode ser maior que ${currentYear}`,
      }),
    isCurrent: z.boolean(),
    isSelfJob: z.boolean(),
  })
  .refine((entry) => entry.isCurrent || !!entry.endDate, {
    message: "Qual a data que parou de atuar nessa experiência ou marque como sendo o emprego atual?",
    path: ["endDate"],
  });

export const experienceSchema = z.object({
  experiences: z
    .array(experienceEntrySchema)
    .min(1, "Adicione ao menos uma experiência"),
});

export type ExperienceEntry = z.infer<typeof experienceEntrySchema>;

// Modelo em branco usado ao clicar em "Adicionar experiência".
export function createEmptyExperience(): ExperienceEntry {
  return {
    company: "",
    company_city: "",
    position: "",
    description: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    isSelfJob: false,
  };
}

// Schema completo, usado pelo resolver do useForm.
export const resumeSchema = personalInfoSchema
  .merge(contactSchema)
  .merge(experienceSchema);

export type ResumeFormData = z.infer<typeof resumeSchema>;
