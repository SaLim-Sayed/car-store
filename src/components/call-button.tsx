import type { ComponentProps } from 'react';
import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatPhoneDisplay, getTelHref } from '@/lib/phone';

type CallButtonProps = Omit<ComponentProps<typeof Button>, 'asChild'> & {
  phone?: string | null;
  label?: string;
  showNumber?: boolean;
};

export function CallButton({
  phone,
  label = 'اتصل الآن',
  showNumber = true,
  className,
  size = 'lg',
  variant,
  ...props
}: CallButtonProps) {
  const href = getTelHref(phone);
  const display = formatPhoneDisplay(phone);

  return (
    <Button
      asChild
      size={size}
      variant={variant}
      className={cn('font-black', className)}
      {...props}
    >
      <a href={href}>
        <Phone className="h-6 w-6 ml-3 shrink-0" />
        <span>{label}</span>
        {showNumber && (
          <span className="mr-2 text-sm opacity-90 font-bold" dir="ltr">
            {display}
          </span>
        )}
      </a>
    </Button>
  );
}

export function CallPhoneLink({
  phone,
  className,
  children,
}: {
  phone?: string | null;
  className?: string;
  children?: React.ReactNode;
}) {
  const href = getTelHref(phone);
  const display = formatPhoneDisplay(phone);

  return (
    <a href={href} className={className}>
      {children ?? display}
    </a>
  );
}
