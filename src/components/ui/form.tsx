import * as React from "react";
import { useFormContext } from "react-hook-form";

const Form = ({ ...props }) => {
  return <form {...props} />;
};

const FormItem = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={className} {...props} />;
};

const FormLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={className}
      {...props}
    />
  );
});
FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ ...props }, ref) => {
  return <div ref={ref} {...props} />;
});
FormControl.displayName = "FormControl";

const FormField = ({ name, ...props }: { name: string } & React.HTMLAttributes<HTMLDivElement>) => {
  const { register } = useFormContext();
  return <div {...register(name)} {...props} />;
};

const FormMessage = ({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => {
  return (
    <p
      className={className}
      {...props}
    >
      {children}
    </p>
  );
};

export {
    Form, FormControl,
    FormField, FormItem,
    FormLabel, FormMessage
};

