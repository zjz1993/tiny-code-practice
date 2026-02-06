import {
  FormProvider,
  useForm,
  type FieldError,
  type FieldErrors,
  type FieldValues,
  type UseFormProps,
  type UseFormReturn,
} from "react-hook-form";
import { z, type ZodTypeAny } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode } from "react";

type InferSchema<T extends ZodTypeAny | undefined> = T extends ZodTypeAny
  ? z.infer<T>
  : FieldValues;

export interface FormInstance<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
> extends UseFormReturn<TFieldValues, TContext> {
  validate: () => Promise<TFieldValues>;
}

interface UseZodFormOptions<TSchema extends ZodTypeAny | undefined, TContext = any> extends Omit<
  UseFormProps<InferSchema<TSchema>, TContext>,
  "resolver"
> {
  schema?: TSchema;
}

interface FormProps<TSchema extends ZodTypeAny | undefined, TContext = any> extends Omit<
  UseFormProps<InferSchema<TSchema>, TContext>,
  "resolver" | "defaultValues"
> {
  schema?: TSchema;
  defaultValues?: InferSchema<TSchema>;
  form?: FormInstance<InferSchema<TSchema>, TContext>;
  className?: string;
  onSubmit: (values: InferSchema<TSchema>) => void | Promise<void>;
  children: ReactNode;
}

const FormComponent = <TSchema extends ZodTypeAny | undefined, TContext = any>({
  schema,
  defaultValues,
  onSubmit,
  children,
  form,
  className,
  ...formOptions
}: FormProps<TSchema, TContext>): JSX.Element => {
  const internalMethods = useForm<InferSchema<TSchema>, TContext>({
    ...(formOptions as UseFormProps<InferSchema<TSchema>, TContext>),
    defaultValues,
    resolver: schema ? zodResolver(schema) : undefined,
  });

  const methods = enhanceFormInstance(form ?? internalMethods);
  const formClassName = ["space-y-4", className].filter(Boolean).join(" ");

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className={formClassName}>
        {children}
      </form>
    </FormProvider>
  );
};

function useZodForm<TSchema extends ZodTypeAny | undefined, TContext = any>(
  options?: UseZodFormOptions<TSchema, TContext>,
): [FormInstance<InferSchema<TSchema>, TContext>] {
  const { schema, ...rest } = options ?? {};
  const methods = useForm<InferSchema<TSchema>, TContext>({
    ...(rest as UseFormProps<InferSchema<TSchema>, TContext>),
    resolver: schema ? zodResolver(schema) : undefined,
  });
  return [enhanceFormInstance(methods)];
}

type FormComponentType = {
  <TSchema extends ZodTypeAny | undefined, TContext = any>(
    props: FormProps<TSchema, TContext>,
  ): JSX.Element;
  useForm: typeof useZodForm;
};

export const Form: FormComponentType = Object.assign(FormComponent, { useForm: useZodForm });

function enhanceFormInstance<TFieldValues extends FieldValues, TContext>(
  methods: UseFormReturn<TFieldValues, TContext>,
): FormInstance<TFieldValues, TContext> {
  const enhanced = methods as FormInstance<TFieldValues, TContext>;
  if (typeof enhanced.validate !== "function") {
    enhanced.validate = async () => {
      const ok = await enhanced.trigger(undefined, { shouldFocus: true });
      if (!ok) {
        const message = formatValidationErrors(enhanced.formState.errors) ?? "表单校验失败";
        throw new Error(message);
      }
      return enhanced.getValues();
    };
  }
  return enhanced;
}

function formatValidationErrors<TFieldValues extends FieldValues>(
  errors: FieldErrors<TFieldValues>,
): string | null {
  const messages: string[] = [];
  const visit = (err: FieldErrors<TFieldValues>, path: string) => {
    for (const key in err) {
      const value = err[key];
      if (!value) continue;
      const nextPath = path ? `${path}.${key}` : key;
      if (isFieldError(value) && value.message) {
        messages.push(`${nextPath}: ${value.message}`);
      } else if (typeof value === "object") {
        visit(value as FieldErrors<TFieldValues>, nextPath);
      }
    }
  };
  visit(errors, "");
  return messages.length > 0 ? messages.join("\n") : null;
}

function isFieldError(candidate: unknown): candidate is FieldError {
  return typeof candidate === "object" && candidate !== null && "message" in candidate;
}
