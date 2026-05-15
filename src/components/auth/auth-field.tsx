import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type AuthFieldProps = React.ComponentProps<typeof Input> & {
  label: string;
  error?: string;
};

export function AuthField({ id, label, error, className, ...props }: AuthFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-black text-foreground">
        {label}
      </Label>
      <Input
        id={id}
        className={cn(
          'h-12 rounded-xl border-gray-200 bg-gray-50/50 text-base font-medium focus-visible:ring-primary/30',
          error && 'border-red-500 focus-visible:ring-red-500/30',
          className
        )}
        {...props}
      />
      {error && <p className="text-sm font-medium text-red-500">{error}</p>}
    </div>
  );
}
