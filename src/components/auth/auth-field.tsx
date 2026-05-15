import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type AuthFieldProps = React.ComponentProps<typeof Input> & {
  label: string;
  error?: string;
};

const fieldClassName =
  'h-12 rounded-xl border-gray-200 bg-gray-50/50 text-base font-medium focus-visible:ring-primary/30';

export function AuthField({ id, label, error, className, type, ...props }: AuthFieldProps) {
  const inputClassName = cn(fieldClassName, error && 'border-red-500 focus-visible:ring-red-500/30', className);

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-black text-foreground">
        {label}
      </Label>
      {type === 'password' ? (
        <PasswordInput id={id} className={inputClassName} {...props} />
      ) : (
        <Input id={id} type={type} className={inputClassName} {...props} />
      )}
      {error && <p className="text-sm font-medium text-red-500">{error}</p>}
    </div>
  );
}
