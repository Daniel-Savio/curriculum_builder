import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { EasyResumeFormData } from "@/lib/easy-resume-schema";

// Um único componente genérico pra todas as etapas "uma pergunta por tela"
// (nome, telefone, cidade, cargo, descrição geral), em vez de repetir o
// mesmo miolo de Label + Input + erro em vários arquivos quase idênticos.
type FieldName = "fullName" | "phone" | "city" | "role" | "generalDescription";

type StepSingleFieldProps = {
  name: FieldName;
  label: string;
  placeholder?: string;
  type?: "text" | "tel";
  as?: "input" | "textarea";
  mask?: (value: string) => string;
  maxLength?: number;
};

export function StepSingleField({
  name,
  label,
  placeholder,
  type = "text",
  as = "input",
  mask,
  maxLength,
}: StepSingleFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<EasyResumeFormData>();

  const field = register(name);
  const error = errors[name];

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name} className="text-lg">
        {label}
      </Label>

      {as === "textarea" ? (
        <Textarea
          id={name}
          {...field}
          rows={8}
          className="text-lg"
          placeholder={placeholder}
        />
      ) : (
        <Input
          id={name}
          type={type}
          {...field}
          className="h-12 text-lg"
          placeholder={placeholder}
          maxLength={maxLength}
          onChange={
            mask
              ? (e) => {
                  e.target.value = mask(e.target.value);
                  field.onChange(e);
                }
              : field.onChange
          }
        />
      )}

      {error && (
        <p className="text-sm text-destructive">{error.message as string}</p>
      )}
    </div>
  );
}
