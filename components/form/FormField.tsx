import {
  useFormContext,
  type FieldValues,
  type FieldPath,
  type UseFormRegisterReturn,
} from "react-hook-form";
import { ReactNode } from "react";

interface FormFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
  label?: string;
  children: (field: UseFormRegisterReturn<FieldPath<T>>) => ReactNode;
}

export function FormField<T extends FieldValues>({ name, label, children }: FormFieldProps<T>) {
  const {
    register,
    formState: { errors },
  } = useFormContext<T>();

  const field = register(name);
  const error = errors[name]?.message as string | undefined;

  return (
    <div className="space-y-1">
      {label && <label className="text-sm font-medium">{label}</label>}

      {children(field)}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
