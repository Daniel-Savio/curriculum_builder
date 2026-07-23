import { useState } from "react";
import {
  useFieldArray,
  useFormContext,
  useWatch,
  type Control,
} from "react-hook-form";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import {
  PlusIcon,
  TrashIcon,
  CopyIcon,
  CaretLeftIcon,
  CaretRightIcon,
} from "@phosphor-icons/react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ensureDate } from "@/lib/date-checker";
import { createEmptyExperience, type ResumeFormData } from "@/lib/resume-schema";

export function StepExperience() {
  const {
    control,
    register,
    getValues,
    formState: { errors },
  } = useFormContext<ResumeFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "experiences",
  });

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

  function handleAddExperience() {
    append(createEmptyExperience());
    // total ainda é o tamanho ANTES do append neste render — que é
    // exatamente o índice do novo item (arrays são 0-based).
    setCarouselIndex(total);
  }

  function handleCopyLastExperience() {
    const experiences = getValues("experiences");
    const lastExperience = experiences[experiences.length - 1];
    if (!lastExperience) return;

    append({
      ...lastExperience,
      startDate: "",
      endDate: "",
      isCurrent: false,
    });
    setCarouselIndex(total);
  }

  function handleRemove(index: number) {
    remove(index);
    // Se removeu algo antes (ou igual) do card atual, o índice atual
    // precisa recuar — senão o carrossel aponta pra um item que não existe mais.
    setCarouselIndex((i) => {
      if (index < i) return i - 1;
      if (index === i) return Math.max(0, i - 1);
      return i;
    });
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
          <ExperienceEntryFields
            index={carouselIndex}
            control={control}
            register={register}
            errors={errors}
            onRemove={() => handleRemove(carouselIndex)}
            canRemove={total > 1}
          />
        </motion.div>
      </AnimatePresence>

      {errors.experiences?.root && (
        <p className="text-sm text-destructive">
          {errors.experiences.root.message}
        </p>
      )}

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

      <div className="flex gap-2 self-start">
        <Button
          type="button"
          variant="outline"
          className="gap-2"
          onClick={handleAddExperience}
        >
          <PlusIcon size={18} weight="bold" />
          Adicionar experiência
        </Button>

        <Button
          type="button"
          variant="outline"
          className="gap-2"
          onClick={handleCopyLastExperience}
        >
          <CopyIcon size={18} weight="bold" />
          Copiar
        </Button>
      </div>
    </div>
  );
}

type ExperienceEntryFieldsProps = {
  index: number;
  control: Control<ResumeFormData>;
  register: ReturnType<typeof useFormContext<ResumeFormData>>["register"];
  errors: ReturnType<typeof useFormContext<ResumeFormData>>["formState"]["errors"];
  onRemove: () => void;
  canRemove: boolean;
};

function ExperienceEntryFields({
  index,
  control,
  register,
  errors,
  onRemove,
  canRemove,
}: ExperienceEntryFieldsProps) {
  const { setValue } = useFormContext<ResumeFormData>();

  const isCurrent = useWatch({
    control,
    name: `experiences.${index}.isCurrent`,
  });

  const company = useWatch({
    control,
    name: `experiences.${index}.company`,
  });

  const isSelfJob = useWatch({
    control,
    name: `experiences.${index}.isSelfJob`,
  });

  const entryErrors = errors.experiences?.[index];

  const startDateField = register(`experiences.${index}.startDate`);
  const endDateField = register(`experiences.${index}.endDate`);

  // Evita que um toque que começa em cima de um input/switch/botão seja interpretado como início de swipe.
  const stopSwipe = (e: React.PointerEvent) => e.stopPropagation();

  return (
    <div className="rounded-xl relative border border-border bg-muted/40 p-4 flex flex-col gap-4">
      <span className="absolute flex p-2 size-6 text-center items-center rounded-full -right-1 bg-primary  text-zinc-50">
        {index + 1}
      </span>
      <div className="flex items-start justify-between gap-2">
        <div className="flex justify-between w-full font-bold items-center text-lg text-zinc-500">
          <h3 className="bg-primary-gradient bg-clip-text text-transparent ">
            {company ? company : "Experiência"}
          </h3>
          {canRemove && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="size-8 text-zinc-500 hover:text-destructive"
              onClick={onRemove}
              onPointerDownCapture={stopSwipe}
              aria-label="Remover experiência"
            >
              <TrashIcon size={18} />
            </Button>
          )}
        </div>
      </div>

      <div className="flex w-full justify-between">
        <div className="flex items-center gap-2" onPointerDownCapture={stopSwipe}>
          <Label htmlFor={`experiences.${index}.isCurrent`} className="cursor-pointer">
            É meu trabalho atual
          </Label>
          <Switch
            id={`experiences.${index}.isCurrent`}
            checked={isCurrent}
            onCheckedChange={(checked) => {
              register(`experiences.${index}.isCurrent`).onChange({
                target: { name: `experiences.${index}.isCurrent`, value: checked },
              });
              if (checked) {
                register(`experiences.${index}.endDate`).onChange({
                  target: { name: `experiences.${index}.endDate`, value: "" },
                });
              }
            }}
          />
        </div>
        <div className="flex items-center gap-2" onPointerDownCapture={stopSwipe}>
          <Label htmlFor={`experiences.${index}.isSelfJob`} className="cursor-pointer">
            Autônomo
          </Label>
          <Switch
            id={`experiences.${index}.isSelfJob`}
            checked={isSelfJob}
            onCheckedChange={(checked) => {
              register(`experiences.${index}.isSelfJob`).onChange({
                target: { name: `experiences.${index}.isSelfJob`, value: checked },
              });
              if (checked) {
                setValue(`experiences.${index}.company`, "Autônomo", {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              } else {
                setValue(`experiences.${index}.company`, "", {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`experiences.${index}.company`}>Empresa</Label>
          <Input
            id={`experiences.${index}.company`}
            disabled={isSelfJob}
            onPointerDownCapture={stopSwipe}
            {...register(`experiences.${index}.company`)}
            placeholder="Nome da empresa ou trabalho autônomo"
          />
          {entryErrors?.company && (
            <p className="text-sm text-destructive">{entryErrors.company.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`experiences.${index}.company_city`}>Cidade ou região de atuação</Label>
          <Input
            id={`experiences.${index}.company_city`}
            disabled={isSelfJob}
            onPointerDownCapture={stopSwipe}
            {...register(`experiences.${index}.company_city`)}
            placeholder="Cidade ou região de atuação"
          />
          {entryErrors?.company_city && (
            <p className="text-sm text-destructive">{entryErrors.company_city.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`experiences.${index}.position`}>Cargo ocupado</Label>
        <Input
          id={`experiences.${index}.position`}
          onPointerDownCapture={stopSwipe}
          {...register(`experiences.${index}.position`)}
          placeholder="Ex: Vendedor"
        />
        {entryErrors?.position && (
          <p className="text-sm text-destructive">{entryErrors.position.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`experiences.${index}.startDate`}>Ano de Início</Label>
          <Input
            id={`experiences.${index}.startDate`}
            type="text"
            inputMode="numeric"
            maxLength={4}
            placeholder="2022"
            onPointerDownCapture={stopSwipe}
            {...startDateField}
            onChange={(e) => {
              e.target.value = ensureDate(e.target.value);
              startDateField.onChange(e);
            }}
          />
          {entryErrors?.startDate && (
            <p className="text-sm text-destructive">
              {entryErrors.startDate.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`experiences.${index}.endDate`}>Ano de Término</Label>
          <Input
            id={`experiences.${index}.endDate`}
            type="text"
            inputMode="numeric"
            maxLength={4}
            placeholder="2024"
            disabled={isCurrent}
            onPointerDownCapture={stopSwipe}
            {...endDateField}
            onChange={(e) => {
              e.target.value = ensureDate(e.target.value);
              endDateField.onChange(e);
            }}
          />
          {entryErrors?.endDate && (
            <p className="text-sm text-destructive">{entryErrors.endDate.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
