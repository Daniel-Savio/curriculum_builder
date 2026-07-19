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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ensureDate } from "@/lib/date-checker";
import {
  COURSE_TYPES,
  COURSE_TYPES_WITHOUT_AREA,
  createEmptyEducation,
  type ResumeFormData,
} from "@/lib/resume-schema";

export function StepEducation() {
  const {
    control,
    register,
    getValues,
    formState: { errors },
  } = useFormContext<ResumeFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "educations",
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

  function handleAddEducation() {
    append(createEmptyEducation());
    setCarouselIndex(total);
  }

  function handleCopyLastEducation() {
    const educations = getValues("educations");
    const lastEducation = educations[educations.length - 1];
    if (!lastEducation) return;

    append({
      ...lastEducation,
      startDate: "",
      endDate: "",
      isCurrent: false,
      courseHours: "",
    });
    setCarouselIndex(total);
  }

  function handleRemove(index: number) {
    remove(index);
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
          <EducationEntryFields
            index={carouselIndex}
            control={control}
            register={register}
            errors={errors}
            onRemove={() => handleRemove(carouselIndex)}
            canRemove={total > 1}
          />
        </motion.div>
      </AnimatePresence>

      {errors.educations?.root && (
        <p className="text-sm text-destructive">
          {errors.educations.root.message}
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
              aria-label={`Ir para a formação ${i + 1}`}
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
          onClick={handleAddEducation}
        >
          <PlusIcon size={18} weight="bold" />
          Adicionar formação
        </Button>

        <Button
          type="button"
          variant="outline"
          className="gap-2"
          onClick={handleCopyLastEducation}
        >
          <CopyIcon size={18} weight="bold" />
          Copiar
        </Button>
      </div>
    </div>
  );
}

type EducationEntryFieldsProps = {
  index: number;
  control: Control<ResumeFormData>;
  register: ReturnType<typeof useFormContext<ResumeFormData>>["register"];
  errors: ReturnType<typeof useFormContext<ResumeFormData>>["formState"]["errors"];
  onRemove: () => void;
  canRemove: boolean;
};

function EducationEntryFields({
  index,
  control,
  register,
  errors,
  onRemove,
  canRemove,
}: EducationEntryFieldsProps) {
  const { setValue } = useFormContext<ResumeFormData>();

  const institution = useWatch({ control, name: `educations.${index}.institution` });
  const courseType = useWatch({ control, name: `educations.${index}.courseType` });
  const isCurrent = useWatch({ control, name: `educations.${index}.isCurrent` });

  const isCourse = courseType === "Curso";
  const hasNoAreaField = (COURSE_TYPES_WITHOUT_AREA as readonly string[]).includes(
    courseType,
  );
  const entryErrors = errors.educations?.[index];

  const startDateField = register(`educations.${index}.startDate`);
  const endDateField = register(`educations.${index}.endDate`);
  const courseHoursField = register(`educations.${index}.courseHours`);

  // Mesma proteção usada no card de experiência: um toque que começa em
  // cima de um campo interativo não pode ser interpretado como swipe.
  const stopSwipe = (e: React.PointerEvent) => e.stopPropagation();

  function handleCourseTypeChange(value: string | null) {
    if (!value) return;

    setValue(`educations.${index}.courseType`, value, {
      shouldValidate: true,
      shouldDirty: true,
    });

    // Os dois formatos (período x carga horária) são mutuamente exclusivos —
    // trocar de tipo limpa o que não se aplica mais, pra não sobrar lixo
    // de um formato antigo escondido no valor do form.
    if (value === "Curso") {
      setValue(`educations.${index}.startDate`, "", { shouldDirty: true });
      setValue(`educations.${index}.endDate`, "", { shouldDirty: true });
      setValue(`educations.${index}.isCurrent`, false, { shouldDirty: true });
    } else {
      setValue(`educations.${index}.courseHours`, "", { shouldDirty: true });
    }

    if ((COURSE_TYPES_WITHOUT_AREA as readonly string[]).includes(value)) {
      setValue(`educations.${index}.area`, "", {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }

  return (
    <div className="rounded-xl border border-border bg-muted/40 p-4 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex justify-between w-full font-bold items-center text-md text-zinc-500">
          <h3 className="bg-primary-gradient bg-clip-text text-transparent">
            {institution ? institution : "Formação"} - {index + 1}
          </h3>
          {canRemove && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="size-8 text-zinc-500 hover:text-destructive"
              onClick={onRemove}
              onPointerDownCapture={stopSwipe}
              aria-label="Remover formação"
            >
              <TrashIcon size={18} />
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`educations.${index}.courseType`}>Tipo de formação</Label>
        <Select value={courseType} onValueChange={handleCourseTypeChange}>
          <SelectTrigger
            id={`educations.${index}.courseType`}
            onPointerDownCapture={stopSwipe}
          >
            <SelectValue placeholder="Selecione o tipo de formação" />
          </SelectTrigger>
          <SelectContent>
            {COURSE_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {entryErrors?.courseType && (
          <p className="text-sm text-destructive">{entryErrors.courseType.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`educations.${index}.institution`}>Instituição de ensino</Label>
          <Input
            id={`educations.${index}.institution`}
            onPointerDownCapture={stopSwipe}
            {...register(`educations.${index}.institution`)}
            placeholder="Nome da instituição"
          />
          {entryErrors?.institution && (
            <p className="text-sm text-destructive">{entryErrors.institution.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`educations.${index}.institution_city`}>Cidade</Label>
          <Input
            id={`educations.${index}.institution_city`}
            onPointerDownCapture={stopSwipe}
            {...register(`educations.${index}.institution_city`)}
            placeholder="Cidade da instituição"
          />
          {entryErrors?.institution_city && (
            <p className="text-sm text-destructive">
              {entryErrors.institution_city.message}
            </p>
          )}
        </div>
      </div>

      {!hasNoAreaField && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`educations.${index}.area`}>Área ou curso</Label>
          <Input
            id={`educations.${index}.area`}
            onPointerDownCapture={stopSwipe}
            {...register(`educations.${index}.area`)}
            placeholder="Ex: Administração, Técnico em Logística..."
          />
          {entryErrors?.area && (
            <p className="text-sm text-destructive">{entryErrors.area.message}</p>
          )}
        </div>
      )}

      {isCourse ? (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`educations.${index}.courseHours`}>Carga horária (horas)</Label>
          <Input
            id={`educations.${index}.courseHours`}
            type="text"
            inputMode="numeric"
            placeholder="Ex: 40"
            onPointerDownCapture={stopSwipe}
            {...courseHoursField}
            onChange={(e) => {
              e.target.value = e.target.value.replace(/\D/g, "").slice(0, 5);
              courseHoursField.onChange(e);
            }}
          />
          {entryErrors?.courseHours && (
            <p className="text-sm text-destructive">{entryErrors.courseHours.message}</p>
          )}
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2" onPointerDownCapture={stopSwipe}>
            <Label htmlFor={`educations.${index}.isCurrent`} className="cursor-pointer">
              Em andamento
            </Label>
            <Switch
              id={`educations.${index}.isCurrent`}
              checked={isCurrent}
              onCheckedChange={(checked) => {
                register(`educations.${index}.isCurrent`).onChange({
                  target: { name: `educations.${index}.isCurrent`, value: checked },
                });
                if (checked) {
                  register(`educations.${index}.endDate`).onChange({
                    target: { name: `educations.${index}.endDate`, value: "" },
                  });
                }
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`educations.${index}.startDate`}>Ano de Início</Label>
              <Input
                id={`educations.${index}.startDate`}
                type="text"
                inputMode="numeric"
                maxLength={4}
                placeholder="2020"
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
              <Label htmlFor={`educations.${index}.endDate`}>Ano de Término</Label>
              <Input
                id={`educations.${index}.endDate`}
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
        </>
      )}
    </div>
  );
}
