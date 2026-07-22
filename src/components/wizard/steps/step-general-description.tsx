import {
  useFormContext,
} from "react-hook-form";
import { motion } from "framer-motion";

import type { ResumeFormData } from "@/lib/resume-schema";
import { Textarea } from "@/components/ui/textarea";

export function StepGeneralDescription() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ResumeFormData>();

  return (
    <div className="flex flex-col gap-8">
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -24 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="flex flex-col py-4 gap-4 max-h-80 max-w-135 overflow-y-auto"
      >
        <Textarea
          {...register("generalDescription")}
          className="w-full"
          rows={20}
          placeholder="Descreva sua experiência num geral"
        />
        {errors.generalDescription && <p className="text-red-500">{errors.generalDescription.message}</p>}

      </motion.div>


    </div>
  );
}
