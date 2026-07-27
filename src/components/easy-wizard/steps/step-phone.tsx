import { useFormContext, useWatch } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { formatPhoneNumber } from "@/lib/phone-mask";
import type { EasyResumeFormData } from "@/lib/easy-resume-schema";

// O checkbox do @base-ui não é um <input> nativo (registrar direto não
// funciona), então é controlado via useWatch + onCheckedChange, igual ao
// padrão já usado pro Switch em step-experience.tsx.
export function StepPhone() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<EasyResumeFormData>();

  const hasNoPhone = useWatch({ control, name: "hasNoPhone" });

  const phoneField = register("phone");
  const alternatePhoneField = register("alternateContactPhone");
  const hasNoPhoneField = register("hasNoPhone");

  return (
    <div className="flex flex-col gap-4">
      {!hasNoPhone && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="phone" className="text-lg">
            Telefone
          </Label>
          <Input
            id="phone"
            type="tel"
            {...phoneField}
            className="h-12 text-lg"
            placeholder="(11)91234-5678"
            maxLength={14}
            onChange={(e) => {
              e.target.value = formatPhoneNumber(e.target.value);
              phoneField.onChange(e);
            }}
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          )}
        </div>
      )}

      <div className="flex items-center gap-2">
        <Checkbox
          id="hasNoPhone"
          checked={hasNoPhone}
          onCheckedChange={(checked) => {
            hasNoPhoneField.onChange({
              target: { name: "hasNoPhone", value: checked },
            });
          }}
        />
        <Label htmlFor="hasNoPhone" className="cursor-pointer">
          Não tenho um telefone para contato
        </Label>
      </div>

      {hasNoPhone && (
        <div className="flex flex-col gap-4 rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">
            Coloque o nome e o telefone de alguém de confiança que possa te
            avisar.
          </p>

          <div className="flex flex-col gap-2">
            <Label htmlFor="alternateContactName" className="text-lg">
              Nome dessa pessoa
            </Label>
            <Input
              id="alternateContactName"
              {...register("alternateContactName")}
              className="h-12 text-lg"
              placeholder="Nome completo"
            />
            {errors.alternateContactName && (
              <p className="text-sm text-destructive">
                {errors.alternateContactName.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="alternateContactPhone" className="text-lg">
              Telefone dessa pessoa
            </Label>
            <Input
              id="alternateContactPhone"
              type="tel"
              {...alternatePhoneField}
              className="h-12 text-lg"
              placeholder="(11)91234-5678"
              maxLength={14}
              onChange={(e) => {
                e.target.value = formatPhoneNumber(e.target.value);
                alternatePhoneField.onChange(e);
              }}
            />
            {errors.alternateContactPhone && (
              <p className="text-sm text-destructive">
                {errors.alternateContactPhone.message}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
