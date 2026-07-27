import { useFieldArray, useFormContext } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { PlusIcon, TrashIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createEmptyEasySkill,
  type EasyResumeFormData,
} from "@/lib/easy-resume-schema";

// Lista simples de habilidades em texto livre, sem nível de proficiência —
// menos uma decisão pra quem está preenchendo.
export function StepEasySkills() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<EasyResumeFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "skills",
  });

  return (
    <div className="flex flex-col gap-4">
      {fields.length === 0 && (
        <p className="text-muted-foreground">
          Nenhuma habilidade ainda. Pode ser um idioma, uma máquina que sabe
          operar, um software que sabe usar...
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
            className="flex items-start gap-2"
          >
            <div className="flex flex-1 flex-col gap-1.5">
              <Input
                {...register(`skills.${index}.value`)}
                placeholder="Ex: Espanhol, Costura, Excel"
                className="h-11"
              />
              {errors.skills?.[index]?.value && (
                <p className="text-sm text-destructive">
                  {errors.skills[index]?.value?.message}
                </p>
              )}
            </div>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => remove(index)}
            >
              <TrashIcon size={18} />
            </Button>
          </motion.div>
        ))}
      </AnimatePresence>

      <Button
        type="button"
        variant="outline"
        size="lg"
        className="gap-2 self-start"
        onClick={() => append(createEmptyEasySkill())}
      >
        <PlusIcon size={18} weight="bold" />
        Adicionar habilidade
      </Button>
    </div>
  );
}
