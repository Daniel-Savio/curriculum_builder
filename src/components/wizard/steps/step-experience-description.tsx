import { useState } from "react";
import {
  useFieldArray,
  useFormContext,
  useWatch,
  type Control,
} from "react-hook-form";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { ResumeFormData } from "@/lib/resume-schema";

export function StepExperienceDescriptions() {
  const { control, register } = useFormContext<ResumeFormData>();
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

  // Distância ou velocidade mínima pro gesto fazer valer o swipe, em vez de um toque acidental que arrastou um pouco.
  const SWIPE_DISTANCE_THRESHOLD = 60;
  const SWIPE_VELOCITY_THRESHOLD = 400;

  function handleDragEnd(_: unknown, info: PanInfo) {
    const swipedLeft =
      info.offset.x < -SWIPE_DISTANCE_THRESHOLD ||
      info.velocity.x < -SWIPE_VELOCITY_THRESHOLD;
    const swipedRight =
      info.offset.x > SWIPE_DISTANCE_THRESHOLD ||
      info.velocity.x > SWIPE_VELOCITY_THRESHOLD;

    if (swipedLeft) goNext();
    else if (swipedRight) goPrev();
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
          drag={total > 1 ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.7}
          onDragEnd={handleDragEnd}
          style={{ touchAction: "pan-y" }}
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
  // Título de cada atividade
  const company = useWatch({ control, name: `experiences.${index}.company` });
  const position = useWatch({ control, name: `experiences.${index}.position` });
  const startDate = useWatch({ control, name: `experiences.${index}.startDate` });
  const endDate = useWatch({ control, name: `experiences.${index}.endDate` });
  const isCurrent = useWatch({ control, name: `experiences.${index}.isCurrent` });

  const period = isCurrent
    ? `${startDate || "?"} — atualmente`
    : `${startDate || "?"} — ${endDate || "?"}`;

  return (
    <div className="rounded-xl border border-border bg-muted/40 p-4 sm:p-6 flex flex-col gap-4">
      <div>
        <h3 className="text-lg font-bold text-zinc-800">
          {company || "Empresa não informada"} em {period}
        </h3>
        <p className="text-sm text-zinc-500">
          {position || ""}
        </p>
      </div>

      <div className="flex flex-col gap-1.5">

        <Textarea

          id={`experiences.${index}.description`}
          {...register(`experiences.${index}.description`)}
          placeholder="Conte aqui o que você fazia no dia a dia, tarefas, projetos, trabalhos, responsabilidades e resultados alcançados..."
          onPointerDownCapture={(e) => e.stopPropagation()}
          rows={10}
        />
      </div>
    </div>
  );
}
