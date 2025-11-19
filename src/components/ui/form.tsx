"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/* -------------------------------
   FORM ROOT (FormProvider Wrapper)
---------------------------------- */
const Form = FormProvider;

/* -------------------------------
   CONTEXT: FormField
---------------------------------- */
type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = { name: TName };

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null);

/* -------------------------------
   FormField Component
---------------------------------- */
const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
  props: ControllerProps<TFieldValues, TName>
) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

/* -------------------------------
   CONTEXT: FormItem
---------------------------------- */
type FormItemContextValue = { id: string };

const FormItemContext = React.createContext<FormItemContextValue | null>(null);

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div data-slot="form-item" className={cn("grid gap-2", className)} {...props} />
    </FormItemContext.Provider>
  );
}

/* -------------------------------
   HOOK: useFormField
---------------------------------- */
function useFormField() {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);

  if (!fieldContext) {
    throw new Error("useFormField must be used inside <FormField>");
  }
  if (!itemContext) {
    throw new Error("useFormField must be used inside <FormItem>");
  }

  const { id } = itemContext;
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext.name });
  const state = getFieldState(fieldContext.name, formState);

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-description`,
    formMessageId: `${id}-form-message`,
    ...state,
  };
}

/* -------------------------------
   LABEL
---------------------------------- */
function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  const { error, formItemId } = useFormField();

  return (
    <Label
      data-slot="form-label"
      htmlFor={formItemId}
      data-error={!!error}
      className={cn("data-[error=true]:text-destructive", className)}
      {...props}
    />
  );
}

/* -------------------------------
   CONTROL WRAPPER
---------------------------------- */
function FormControl(props: React.ComponentProps<typeof Slot>) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

  return (
    <Slot
      id={formItemId}
      data-slot="form-control"
      aria-invalid={!!error}
      aria-describedby={
        error ? `${formDescriptionId} ${formMessageId}` : formDescriptionId
      }
      {...props}
    />
  );
}

/* -------------------------------
   DESCRIPTION
---------------------------------- */
function FormDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  const { formDescriptionId } = useFormField();

  return (
    <p
      id={formDescriptionId}
      data-slot="form-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

/* -------------------------------
   ERROR MESSAGE
---------------------------------- */
function FormMessage({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  const { error, formMessageId } = useFormField();

  const body = error?.message ? String(error.message) : children;

  if (!body) return null;

  return (
    <p
      id={formMessageId}
      data-slot="form-message"
      className={cn("text-sm text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  );
}

/* -------------------------------
   EXPORTS
---------------------------------- */
export {
  Form, FormControl,
  FormDescription, FormField,
  FormItem,
  FormLabel, FormMessage,
  useFormField
};

