import { FormProvider, useForm, type FieldValues } from "react-hook-form";
import { z, type ZodTypeAny } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode } from "react";

type InferSchema<T extends ZodTypeAny | undefined> = T extends ZodTypeAny
  ? z.infer<T>
  : FieldValues;

interface FormProps<TSchema extends ZodTypeAny | undefined> {
  schema?: TSchema;
  defaultValues?: InferSchema<TSchema>;
  onSubmit: (values: InferSchema<TSchema>) => void | Promise<void>;
  children: ReactNode;
}

export function Form<TSchema extends ZodTypeAny | undefined>({
  schema,
  defaultValues,
  onSubmit,
  children,
}: FormProps<TSchema>) {
  const methods = useForm<InferSchema<TSchema>>({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues,
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        {children}
      </form>
    </FormProvider>
  );
}
