import {
  useFieldArray,
  useFormContext,
  type Control,
} from "react-hook-form";
import {
  PlusIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

import type { ResumeFormData } from "@/lib/resume-schema";
import { AnimatePresence, motion } from "framer-motion";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { TrashIcon } from "@phosphor-icons/react/dist/ssr";

export function StepSkills() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<ResumeFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "skills",
  });
  function handleAddSkill() {
    append({ name: "", description: "" });
  }
  function handleRemoveSkill(index: number) {
    remove(index);
  }

  return (
    <div className="flex flex-col gap-8">

      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -24 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="flex flex-col py-4 gap-4 max-h-80 max-w-135 overflow-y-auto"
      >
        <div className="flex gap-2 self-start">
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            onClick={handleAddSkill}
          >
            <PlusIcon size={18} weight="bold" />
            Adicionar habilidade
          </Button>

        </div>
        {/* AnimatePresence must wrap the mapped array so it can detect when a key is removed */}
        {fields.length === 0 && (
          <div className="">
            <SkillExemple />
          </div>
        )}
        <AnimatePresence initial={false}>
          {fields.map((field, index) => (
            <SkillEntry
              key={field.id}
              index={index}
              control={control}
              register={register}
              errors={errors}
              onRemove={handleRemoveSkill}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {errors.experiences?.root && (
        <p className="text-sm text-destructive">
          {errors.experiences.root.message}
        </p>
      )}


    </div>
  );
}

type SkillEntryProps = {
  index: number;
  control: Control<ResumeFormData>;
  register: ReturnType<typeof useFormContext<ResumeFormData>>["register"];
  errors: ReturnType<typeof useFormContext<ResumeFormData>>["formState"]["errors"];
  onRemove: (index: number) => void;
};

function SkillEntry({
  index,
  register,
  errors,
  onRemove,
}: SkillEntryProps) {
  // Extract specific errors for this index to keep the JSX clean
  const nameError = errors.skills?.[index]?.name;
  const descriptionError = errors.skills?.[index]?.description;

  return (
    <motion.div
      initial={{  y: -20 }}
      animate={{ y: 0 }}
      exit={{
        opacity: 0,
        x: -40,
        transition: { duration: 0.2, ease: "linear" }
      }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex flex-1 flex-col mb-4"
    >
      <div className="flex w-full">
        <div className="flex w-full flex-col">
          <InputGroup className="border-b-0 rounded-b-none rounded-tr-none">
            <InputGroupAddon className="bg-gray-100 px-2 w-25" align={"inline-start"}>
              Título/Nome
            </InputGroupAddon>
            <InputGroupInput
              {...register(`skills.${index}.name`)}
              placeholder="Serraria"
            />
          </InputGroup>

          <InputGroup className="border-t-0 rounded-t-none rounded-br-none">
            <InputGroupAddon className="bg-gray-100 px-2 w-25" align={"inline-start"}>
              Descrição
            </InputGroupAddon>
            <InputGroupInput
              {...register(`skills.${index}.description`)}
              placeholder="Montar moveis, armários e afins"
            />
          </InputGroup>
        </div>

        <div
          onClick={() => onRemove(index)}
          className="bg-red-400 cursor-pointer flex px-2 items-center justify-center rounded-br rounded-tr"
        >
          <TrashIcon size={18} />
        </div>
      </div>

      {/* Error Message Display Container */}
      <div className="flex flex-col mt-1 px-2">
        {nameError && (
          <span className="text-sm text-red-500">
            {nameError.message}
          </span>
        )}
        {descriptionError && (
          <span className="text-sm text-red-500">
            {descriptionError.message}
          </span>
        )}
      </div>
    </motion.div>
  );
}

function SkillExemple() {
  return (
    <div className="space-y-2">
      <h1 className=" px-2 text-muted-foreground/50 w-25">Exemplo</h1>
      <motion.div
        initial={{  y: -20 }}
        animate={{ y: 0 }}
        exit={{
          opacity: 0,
          x: -40,
          // This transition overrides the default one just for the exit animation
          transition: { duration: 0.2, ease: "linear" }
        }}

        transition={{ duration: 0.35, ease: "easeOut" }}
        className="flex flex-1 "
      >
        <div className="flex w-full flex-col">

          <InputGroup className="border-b-0 rounded-b-none rounded-tr-none ">
            <InputGroupAddon className="bg-gray-100 px-2 text-muted-foreground/50 w-25" align={"inline-start"} > Título/Nome </InputGroupAddon>
            <InputGroupInput disabled={true}  placeholder="Idiomas" />
          </InputGroup>
          <InputGroup className="border-t-0 rounded-t-none rounded-br-none">
            <InputGroupAddon className="bg-gray-100 px-2 text-muted-foreground/50 w-25" align={"inline-start"} > Descrição</InputGroupAddon>
            <InputGroupInput disabled={true} placeholder="Português: Nativo - Inglês: C2 - Espanhol: Iniciante" />
            </InputGroup>
        </div>
        <div className="bg-red-200 flex px-2 items-center justify-center rounded-br rounded-tr"><TrashIcon size={18} className="text-muted-foreground" /></div>
      </motion.div>
      <hr />

      <motion.div
        initial={{  y: -20 }}
        animate={{ y: 0 }}
        exit={{
          opacity: 0,
          x: -40,
          // This transition overrides the default one just for the exit animation
          transition: { duration: 0.2, ease: "linear" }
        }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="flex flex-1 "
      >
        <div className="flex w-full flex-col">

          <InputGroup className="border-b-0 rounded-b-none rounded-tr-none ">
            <InputGroupAddon className="bg-gray-100 px-2 text-muted-foreground/50 w-25" align={"inline-start"} > Título/Nome </InputGroupAddon>
            <InputGroupInput disabled={true}  placeholder="Comunicação" />
          </InputGroup>
          <InputGroup className="border-t-0 rounded-t-none rounded-br-none">
            <InputGroupAddon className="bg-gray-100 px-2 text-muted-foreground/50 w-25" align={"inline-start"} > Descrição</InputGroupAddon>
            <InputGroupInput disabled={true} placeholder="Boa comunicação e extroversão para conversar com clientes" />
            </InputGroup>
        </div>
        <div className="bg-red-200 flex px-2 items-center justify-center rounded-br rounded-tr"><TrashIcon size={18} className="text-muted-foreground" /></div>
      </motion.div>
    </div>
  );
}
