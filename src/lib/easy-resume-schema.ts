import { z } from "zod";

// Versão simplificada do resume-schema.ts, pensada para quem tem menos
// prática com formulários. Menos campos obrigatórios, sem formatos rígidos
// (datas livres, sem regex de telefone exato) e sem separar "experiência" de
// "formação" — tudo vira um único "destaque" (highlight).

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function isValidPhoneDigits(value: string | undefined) {
  const digits = digitsOnly(value ?? "");
  return digits.length === 10 || digits.length === 11;
}

// PESSOAL
// phone é opcional aqui porque quem marca "não tenho telefone" preenche o
// contato alternativo no lugar — a obrigatoriedade real é decidida no
// superRefine do easyResumeSchema, que olha os dois campos juntos.
export const easyPersonalInfoSchema = z.object({
  fullName: z.string().min(3, "Qual o seu nome completo?"),
  phone: z.string().optional(),
  hasNoPhone: z.boolean(),
  alternateContactName: z.string().optional(),
  alternateContactPhone: z.string().optional(),
  city: z.string().min(2, "Em qual cidade você mora?"),
  role: z.string().optional(),
});

// DESTAQUES (experiência + formação, tudo junto)
export const highlightEntrySchema = z.object({
  title: z.string().min(2, "O que você fez?"),
  date: z.string().optional(),
  description: z.string().optional(),
});

export const highlightsSchema = z.object({
  highlights: z.array(highlightEntrySchema).optional(),
});

export type HighlightEntry = z.infer<typeof highlightEntrySchema>;

export function createEmptyHighlight(): HighlightEntry {
  return {
    title: "",
    date: "",
    description: "",
  };
}

// HABILIDADES
// Guardado como { value } em vez de string pura porque useFieldArray do
// react-hook-form precisa de um array de objetos para gerar as keys.
export const easySkillEntrySchema = z.object({
  value: z.string().min(1, "Escreva uma habilidade"),
});

export const easySkillsSchema = z.object({
  skills: z.array(easySkillEntrySchema).optional(),
});

export type EasySkillEntry = z.infer<typeof easySkillEntrySchema>;

export function createEmptyEasySkill(): EasySkillEntry {
  return { value: "" };
}

// DESCRIÇÃO GERAL
export const easyGeneralInfoSchema = z.object({
  generalDescription: z.string().optional(),
});

// Schema completo, usado pelo resolver do useForm. Quem marcou "não tenho
// telefone" precisa preencher nome + telefone de um contato alternativo;
// quem não marcou precisa do próprio telefone — nunca os dois ao mesmo tempo.
export const easyResumeSchema = easyPersonalInfoSchema
  .merge(highlightsSchema)
  .merge(easySkillsSchema)
  .merge(easyGeneralInfoSchema)
  .superRefine((data, ctx) => {
    if (data.hasNoPhone) {
      if (!data.alternateContactName || data.alternateContactName.trim().length < 3) {
        ctx.addIssue({
          code: "custom",
          path: ["alternateContactName"],
          message: "Qual o nome dessa pessoa?",
        });
      }
      if (!isValidPhoneDigits(data.alternateContactPhone)) {
        ctx.addIssue({
          code: "custom",
          path: ["alternateContactPhone"],
          message: "Esse telefone parece incompleto. Confira o número.",
        });
      }
    } else if (!isValidPhoneDigits(data.phone)) {
      ctx.addIssue({
        code: "custom",
        path: ["phone"],
        message: "Esse telefone parece incompleto. Confira o número.",
      });
    }
  });

export type EasyResumeFormData = z.infer<typeof easyResumeSchema>;

export function createEmptyEasyResume(): EasyResumeFormData {
  return {
    fullName: "",
    phone: "",
    hasNoPhone: false,
    alternateContactName: "",
    alternateContactPhone: "",
    city: "",
    role: "",
    highlights: [],
    skills: [],
    generalDescription: "",
  };
}

// Dados de exemplo pra testar o formulário sem preencher tudo na mão.
export function createFilledEasyResume(): EasyResumeFormData {
  return {
    fullName: "Maria da Silva",
    phone: "(11)91234-5678",
    hasNoPhone: false,
    alternateContactName: "",
    alternateContactPhone: "",
    city: "Piracaia",
    role: "Faxineira",
    highlights: [
      {
        title: "Ajudante de cozinha no Restaurante Bom Sabor",
        date: "2022 até 2023",
        description: "Ajudava no preparo das refeições e na organização da cozinha.",
      },
      {
        title: "Curso de culinária básica no SENAC",
        date: "2021",
        description: "Curso de 40 horas sobre higiene e preparo de alimentos.",
      },
    ],
    skills: [{ value: "Culinária" }, { value: "Organização" }],
    generalDescription:
      "Sou dedicada e gosto de trabalhar em equipe. Tenho experiência em cozinha e limpeza.",
  };
}
