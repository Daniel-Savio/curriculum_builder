import {
  useFieldArray,
  useFormContext,
  Controller,
  type Control,
} from "react-hook-form";
import { PlusIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "@phosphor-icons/react/dist/ssr";
import { AnimatePresence, motion } from "framer-motion";

import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Ensure this matches your Shadcn UI path

import type { ResumeFormData } from "@/lib/resume-schema";

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
    append({ name: "", level: "" });
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
              control={control} // Passed control here
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
  control: Control<ResumeFormData>; // Added control to the types
  register: ReturnType<typeof useFormContext<ResumeFormData>>["register"];
  errors: ReturnType<typeof useFormContext<ResumeFormData>>["formState"]["errors"];
  onRemove: (index: number) => void;
};

function SkillEntry({
  index,
  control,
  register,
  errors,
  onRemove,
}: SkillEntryProps) {
  const nameError = errors.skills?.[index]?.name;
  const levelError = errors.skills?.[index]?.level;

  return (
    <motion.div
      initial={{ y: -20 }}
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
              placeholder="Ex: Espanhol"
            />
          </InputGroup>

          <InputGroup className="border-t-0 rounded-t-none rounded-br-none">
            <InputGroupAddon className="bg-gray-100 px-2 w-30" align={"inline-start"}>
              Nível
            </InputGroupAddon>
            {/* Replaced standard input with Controller + Select */}
            <Controller
              control={control}
              name={`skills.${index}.level`}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-full border-0 focus:ring-0 focus:ring-offset-0 rounded-none shadow-none bg-transparent">
                    <SelectValue placeholder="Selecione o nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Geral</SelectLabel>
                      <SelectItem value="Básico">Básico</SelectItem>
                      <SelectItem value="Intermediário">Intermediário</SelectItem>
                      <SelectItem value="Experiente">Experiente</SelectItem>
                      <SelectItem value="Avançado">Avançado</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Idiomas</SelectLabel>
                      <SelectItem value="Nativo">Nativo</SelectItem>
                      <SelectItem value="C1">C1</SelectItem>
                      <SelectItem value="C2">C2</SelectItem>
                      <SelectItem value="B1">B1</SelectItem>
                      <SelectItem value="B2">B2</SelectItem>
                      <SelectItem value="A1">A1</SelectItem>
                      <SelectItem value="A2">A2</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
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

      <div className="flex flex-col mt-1 px-2">
        {nameError && (
          <span className="text-sm text-red-500">
            {nameError.message}
          </span>
        )}
        {levelError && (
          <span className="text-sm text-red-500">
            {levelError.message}
          </span>
        )}
      </div>
    </motion.div>
  );
}

function SkillExemple() {
  return (
    <div className="space-y-2">
      <h1 className="px-2 text-muted-foreground/50 w-25">Exemplo</h1>
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        exit={{
          opacity: 0,
          x: -40,
          transition: { duration: 0.2, ease: "linear" }
        }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="flex flex-1 "
      >
        <div className="flex w-full flex-col">
          <InputGroup className="border-b-0 rounded-b-none rounded-tr-none ">
            <InputGroupAddon className="bg-gray-100 px-2 text-muted-foreground/50 w-25" align={"inline-start"}>
              Título/Nome
            </InputGroupAddon>
            <InputGroupInput disabled={true} placeholder="Espanhol" />
          </InputGroup>
          <InputGroup className="border-t-0 rounded-t-none rounded-br-none">
            <InputGroupAddon className="bg-gray-100 px-2 text-muted-foreground/50 w-30" align={"inline-start"}>
              Nível
            </InputGroupAddon>
            {/* Mocking the disabled select appearance for the example */}
            <Select disabled>
              <SelectTrigger className="w-full border-0 rounded-none shadow-none bg-transparent opacity-50">
                <SelectValue placeholder="Nativo" />
              </SelectTrigger>
            </Select>
          </InputGroup>
        </div>
        <div className="bg-red-200 flex px-2 items-center justify-center rounded-br rounded-tr">
          <TrashIcon size={18} className="text-muted-foreground" />
        </div>
      </motion.div>
      <hr />
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        exit={{
          opacity: 0,
          x: -40,
          transition: { duration: 0.2, ease: "linear" }
        }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="flex flex-1 "
      >
        <div className="flex w-full flex-col">
          <InputGroup className="border-b-0 rounded-b-none rounded-tr-none ">
            <InputGroupAddon className="bg-gray-100 px-2 text-muted-foreground/50 w-25" align={"inline-start"}>
              Título/Nome
            </InputGroupAddon>
            <InputGroupInput disabled={true} placeholder="Ca" />
          </InputGroup>
          <InputGroup className="border-t-0 rounded-t-none rounded-br-none">
            <InputGroupAddon className="bg-gray-100 px-2 text-muted-foreground/50 w-30" align={"inline-start"}>
              Nível
            </InputGroupAddon>
            {/* Mocking the disabled select appearance for the example */}
            <Select disabled>
              <SelectTrigger className="w-full border-0 rounded-none shadow-none bg-transparent opacity-50">
                <SelectValue placeholder="Nativo" />
              </SelectTrigger>
            </Select>
          </InputGroup>
        </div>
        <div className="bg-red-200 flex px-2 items-center justify-center rounded-br rounded-tr">
          <TrashIcon size={18} className="text-muted-foreground" />
        </div>
      </motion.div>
    </div>
  );
}
