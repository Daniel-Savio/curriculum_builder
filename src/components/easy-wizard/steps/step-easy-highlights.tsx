import { useFieldArray, useFormContext } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { PlusIcon, TrashIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  createEmptyHighlight,
  type EasyResumeFormData,
} from "@/lib/easy-resume-schema";

// Lista simples e sempre visível (sem carrossel/arrastar) — junta o que hoje
// são "experiência" e "formação" num único conceito aberto: um título, uma
// data opcional em texto livre e uma descrição opcional.
export function StepEasyHighlights() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<EasyResumeFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "highlights",
  });

  return (
    <div className="flex flex-col gap-4">
      {fields.length === 0 && (
        <p className="text-muted-foreground">
          Nenhum item ainda. Clique em "Adicionar" para contar um trabalho, curso
          ou escola.
        </p>
      )}

      <AnimatePresence initial={false}>
        {fields.map((field, index) => (
          <motion.div
            key={field.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex flex-col gap-3 rounded-xl border border-border p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-1 flex-col gap-1.5">
                <Label htmlFor={`highlights.${index}.title`}>
                  O que você fez?
                </Label>
                <Input
                  id={`highlights.${index}.title`}
                  {...register(`highlights.${index}.title`)}
                  placeholder="Ex: Ajudante de padaria, Curso de eletricista, Ensino médio"
                  className="h-11"
                />
                {errors.highlights?.[index]?.title && (
                  <p className="text-sm text-destructive">
                    {errors.highlights[index]?.title?.message}
                  </p>
                )}
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="mt-6 shrink-0"
                onClick={() => remove(index)}
              >
                <TrashIcon size={18} />
              </Button>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`highlights.${index}.date`}>
                Quando foi? (opcional)
              </Label>
              <Input
                id={`highlights.${index}.date`}
                {...register(`highlights.${index}.date`)}
                placeholder="Ex: 2022, ano passado, faz uns 3 anos"
                className="h-11"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`highlights.${index}.description`}>
                Quer contar mais um pouco? (opcional)
              </Label>
              <Textarea
                id={`highlights.${index}.description`}
                {...register(`highlights.${index}.description`)}
                rows={3}
                placeholder="O que você fazia, o que aprendeu..."
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <Button
        type="button"
        variant="outline"
        size="lg"
        className="gap-2 self-start"
        onClick={() => append(createEmptyHighlight())}
      >
        <PlusIcon size={18} weight="bold" />
        Adicionar
      </Button>
    </div>
  );
}
