import type { ComponentProps } from 'react';
import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { contactCallClass } from '@/components/contact-actions';
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
 className={cn(contactCallClass, 'font-semibold', className)}
 {...props}
 >
 <a href={href}>
 <Phone className="size-4 shrink-0" aria-hidden />
 <span>{label}</span>
 {showNumber && display ? (
 <span className="text-xs font-medium text-white/85" dir="ltr">
 {display}
 </span>
 ) : null}
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
