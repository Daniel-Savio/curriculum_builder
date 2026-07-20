import { useState } from "react";
import {
  useFieldArray,
  useFormContext,
  useWatch,
  type Control,
} from "react-hook-form";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { ResumeFormData } from "@/lib/resume-schema";
import { InfoIcon } from "@phosphor-icons/react/dist/ssr";
import { Kbd } from "@/components/ui/kbd";

export function StepEducationDescriptions() {
  const { control, register } = useFormContext<ResumeFormData>();

  //Os dois: `fields` do useFieldArray servem pra ter uma key estável
  const { fields } = useFieldArray({ control, name: "educations" });
  const educations = useWatch({ control, name: "educations" }) ?? [];

  // Só "Curso" tem campo de descrição
  const courseIndexes = educations
    .map((education, i) => (education!.courseType === "Curso" ? i : null))
    .filter((i): i is number => i !== null);

  const [carouselIndex, setCarouselIndex] = useState(0);
  const total = courseIndexes.length;
  const isFirst = carouselIndex === 0;
  const isLast = carouselIndex === total - 1;
  const currentEducationIndex = courseIndexes[carouselIndex];

  function goPrev() {
    setCarouselIndex((i) => Math.max(0, i - 1));
  }

  function goNext() {
    setCarouselIndex((i) => Math.min(total - 1, i + 1));
  }

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
      <div className="bg-zinc-200 p-2 rounded-md flex gap-2 items-center">
        <InfoIcon className="text-primary size-8"></InfoIcon>
        <p className="text-zinc-600">Se não há nenhum item do tipo <Kbd className="text-md text-p-cyan-500">Curso</Kbd> adicionado, você pode seguir pra próxima etapa.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={fields[currentEducationIndex]?.id ?? currentEducationIndex}
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
          <EducationDescriptionCard
            index={currentEducationIndex}
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

        <div className="flex items-center gap-1.5">
          {courseIndexes.map((educationIndex, i) => (
            <button
              key={fields[educationIndex]?.id ?? educationIndex}
              type="button"
              onClick={() => setCarouselIndex(i)}
              aria-label={`Ir para o curso ${i + 1}`}
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

type EducationDescriptionCardProps = {
  index: number;
  control: Control<ResumeFormData>;
  register: ReturnType<typeof useFormContext<ResumeFormData>>["register"];
};

function EducationDescriptionCard({
  index,
  control,
  register,
}: EducationDescriptionCardProps) {
  // Chegando aqui, a entrada já é garantidamente do tipo "Curso" (é o
  // próprio filtro do componente pai que decide o que entra no carrossel),
  // então o card não precisa mais lidar com os outros formatos de período.
  const institution = useWatch({ control, name: `educations.${index}.institution` });
  const area = useWatch({ control, name: `educations.${index}.area` });
  const courseHours = useWatch({ control, name: `educations.${index}.courseHours` });

  const title = area || "Curso";
  const subtitle = [institution || "Instituição não informada", `${courseHours || "?"}h`]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="rounded-xl border border-border bg-muted/40 p-4 sm:p-6 flex flex-col gap-4">
      <div>
        <h3 className="text-lg font-bold text-zinc-800">{title}</h3>
        <p className="text-sm text-zinc-500">{subtitle}</p>
      </div>

      <div className="flex flex-col gap-1.5">

        <Label htmlFor={`educations.${index}.description`}>
          Descreva o que você aprendeu ou desenvolveu
        </Label>
        <Textarea
          id={`educations.${index}.description`}
          {...register(`educations.${index}.description`)}
          placeholder="Conte sobre projetos, disciplinas relevantes ou o foco desse curso..."
          rows={10}
          onPointerDownCapture={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
}
