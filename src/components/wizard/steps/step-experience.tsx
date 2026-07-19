import { useFieldArray, useFormContext, useWatch, type Control } from "react-hook-form";
import { PlusIcon, TrashIcon, CopyIcon } from "@phosphor-icons/react";
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
  }

  return (
    <div className="flex flex-col gap-4">
      {fields.map((field, index) => (
        <ExperienceEntryFields
          key={field.id}
          index={index}
          control={control}
          register={register}
          errors={errors}
          onRemove={() => remove(index)}
          canRemove={fields.length > 1}
        />
      ))}

      {errors.experiences?.root && (
        <p className="text-sm text-destructive">
          {errors.experiences.root.message}
        </p>
      )}

      <div className="flex gap-2 self-start">
        <Button
          type="button"
          variant="outline"
          className="gap-2"
          onClick={() => append(createEmptyExperience())}
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
  // setValue é o jeito certo de escrever num campo "de fora" (fora de um
  // evento de input) e ainda assim atualizar o estado real do RHF.
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

  return (
    <div className="rounded-xl border border-border bg-muted/40 p-4 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex justify-between w-full font-bold items-center text-md text-zinc-500">
          <h3 className="bg-primary-gradient bg-clip-text text-transparent">
            {company ? company : "Experiência"} - {index + 1}
          </h3>
          {canRemove && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="size-8 text-zinc-500 hover:text-destructive"
              onClick={onRemove}
              aria-label="Remover experiência"
            >
              <TrashIcon size={18} />
            </Button>
          )}
        </div>
      </div>

      <div className="flex w-full justify-between">
        <div className="flex items-center gap-2">
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
              // atualiza o valor de company no RHF
              if (checked) {
                register(`experiences.${index}.endDate`).onChange({
                  target: { name: `experiences.${index}.endDate`, value: "" },
                });
              }
            }}
          />
        </div>
        <div className="flex items-center gap-2">
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
              // atualiza o valor de company no RHF
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

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`experiences.${index}.company`}>Empresa</Label>
        <Input
          id={`experiences.${index}.company`}
          disabled={isSelfJob}
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
          {...register(`experiences.${index}.company_city`)}
          placeholder="Cidade ou região de atuação"
        />
        {entryErrors?.company_city && (
          <p className="text-sm text-destructive">{entryErrors.company_city.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`experiences.${index}.position`}>Cargo ocupado</Label>
        <Input
          id={`experiences.${index}.position`}
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
