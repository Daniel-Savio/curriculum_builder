import { useState } from "react";
import {
  useFieldArray,
  useFormContext,
  useWatch,
  type Control,
} from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { ResumeFormData } from "@/lib/resume-schema";

export function StepExperienceDescriptions() {
  const { control, register } = useFormContext<ResumeFormData>();

  // Mesmo name ("experiences") do step anterior — é o MESMO array do form,
  // só que aqui a gente navega item a item em vez de listar tudo empilhado.
  const { fields } = useFieldArray({ control, name: "experiences" });

  const [carouselIndex, setCarouselIndex] = useState(0);
  const total = fields.length;
  const isFirst = carouselIndex === 0;
  const isLast = carouselIndex === total - 1;

  function goPrev() {
    setCarouselIndex((i) => Math.max(0, i - 1));
  }

  function goNext() {
    setCarouselIndex((i) => Math.min(total - 1, i + 1));
  }

  if (total === 0) {
    return (
      <p className="text-zinc-600">
        Nenhuma experiência foi adicionada na etapa anterior.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={fields[carouselIndex]?.id ?? carouselIndex}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <ExperienceDescriptionCard
            index={carouselIndex}
            control={control}
            register={register}
          />
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          onClick={goPrev}
          disabled={isFirst}
          className="gap-1"
        >
          <CaretLeftIcon size={18} />
          Anterior
        </Button>

        {/* Indicadores tipo carrossel — clicáveis, pra pular direto */}
        <div className="flex items-center gap-1.5">
          {fields.map((field, i) => (
            <button
              key={field.id}
              type="button"
              onClick={() => setCarouselIndex(i)}
              aria-label={`Ir para a experiência ${i + 1}`}
              aria-current={i === carouselIndex}
              className={[
                "h-2 rounded-full transition-all",
                i === carouselIndex ? "w-6 bg-primary" : "w-2 bg-muted",
              ].join(" ")}
            />
          ))}
        </div>

        <Button
          type="button"
          variant="ghost"
          onClick={goNext}
          disabled={isLast}
          className="gap-1"
        >
          Próxima
          <CaretRightIcon size={18} />
        </Button>
      </div>
    </div>
  );
}

type ExperienceDescriptionCardProps = {
  index: number;
  control: Control<ResumeFormData>;
  register: ReturnType<typeof useFormContext<ResumeFormData>>["register"];
};

function ExperienceDescriptionCard({
  index,
  control,
  register,
}: ExperienceDescriptionCardProps) {
  // Título e período são só leitura aqui — os dados de verdade já foram
  // preenchidos no step anterior, a gente só observa pra montar o cabeçalho.
  const company = useWatch({ control, name: `experiences.${index}.company` });
  const position = useWatch({ control, name: `experiences.${index}.position` });
  const startDate = useWatch({ control, name: `experiences.${index}.startDate` });
  const endDate = useWatch({ control, name: `experiences.${index}.endDate` });
  const isCurrent = useWatch({ control, name: `experiences.${index}.isCurrent` });

  const period = isCurrent
    ? `${startDate || "?"} — atual`
    : `${startDate || "?"} — ${endDate || "?"}`;

  return (
    <div className="rounded-xl border border-border bg-muted/40 p-4 sm:p-6 flex flex-col gap-4">
      <div>
        <h3 className="text-lg font-bold text-zinc-800">
          {position || "Cargo não informado"}
        </h3>
        <p className="text-sm text-zinc-500">
          {company || "Empresa não informada"} · {period}
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`experiences.${index}.description`}>
          Descreva suas principais atividades
        </Label>
        <Textarea
          id={`experiences.${index}.description`}
          {...register(`experiences.${index}.description`)}
          placeholder="Conte o que você fazia no dia a dia, responsabilidades e resultados alcançados..."
          rows={10}
        />
      </div>
    </div>
  );
}
