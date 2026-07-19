import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { formatPhoneNumber } from "@/lib/phone-mask";
import type { ResumeFormData } from "@/lib/resume-schema";

export function StepContact() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ResumeFormData>();

  // Guardamos a referência do register uma vez só, pra poder
  // encadear nosso onChange customizado com o onChange do RHF.
  const phoneField = register("phone");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          placeholder="voce@email.com"
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="phone">Telefone</Label>
        <Input
          id="phone"
          {...phoneField}
          onChange={(e) => {
            e.target.value = formatPhoneNumber(e.target.value);
            phoneField.onChange(e);
          }}
          placeholder="(11)91234-5678"
          maxLength={14}
        />
        {errors.phone && (
          <p className="text-sm text-destructive">{errors.phone.message}</p>
        )}
      </div>
    </div>
  );
}
