import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { ResumeFormData } from "@/lib/resume-schema";

export function StepPersonalInfo() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ResumeFormData>();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="fullName">Qual o seu nome completo?</Label>
        <Input id="fullName" {...register("fullName")} placeholder="Seu nome" />
        {errors.fullName && (
          <p className="text-sm text-destructive">{errors.fullName.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="role">Cargo desejado</Label>
        <Input
          id="role"
          {...register("role")}
          placeholder="Ex: Assistente administrativo"
        />
        {errors.role && (
          <p className="text-sm text-destructive">{errors.role.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="city">Onde você mora atualmente?</Label>
        <Input
          id="city"
          {...register("city")}
          placeholder="Ex: São Paulo"
          value={"Piracaia"}
        />
        {errors.city && (
          <p className="text-sm text-destructive">{errors.city.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="birthDate">Data de nascimento</Label>
        <Input
          id="birthDate"
          type="date"
          {...register("birthDate")}
          placeholder="Ex: 01/01/1990"
        />
        {errors.birthDate && (
          <p className="text-sm text-destructive">{errors.birthDate.message}</p>
        )}
      </div>
    </div>
  );
}
