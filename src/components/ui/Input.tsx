// Form primitives — single source of input styling for the design system.
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const fieldClasses =
  'w-full rounded-lg bg-surface-2 border border-border text-sm text-text ' +
  'placeholder:text-text-secondary/50 transition-colors ' +
  'hover:border-primary/30 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 ' +
  'disabled:opacity-50 disabled:cursor-not-allowed';

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(fieldClasses, 'h-10 px-3', className)} {...props} />
  )
);
Input.displayName = 'Input';

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cn(fieldClasses, 'px-3 py-2.5 resize-none', className)} {...props} />
));
Textarea.displayName = 'Textarea';

export const Label = ({
  className,
  children,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label className={cn('block mb-1.5 text-sm font-medium text-text', className)} {...props}>
    {children}
  </label>
);

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select ref={ref} className={cn(fieldClasses, 'h-10 px-3 cursor-pointer', className)} {...props}>
      {children}
    </select>
  )
);
Select.displayName = 'Select';
