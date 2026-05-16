'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type PasswordInputProps = Omit<React.ComponentProps<typeof Input>, 'type'>;

export function PasswordInput({ className, ...props }: PasswordInputProps) {
 const [visible, setVisible] = useState(false);

 return (
 <div className="relative">
 <Input
 type={visible ? 'text' : 'password'}
 className={cn('pe-11', className)}
 {...props}
 />
 <button
 type="button"
 onClick={() => setVisible((v) => !v)}
 className="absolute end-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
 aria-label={visible ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
 tabIndex={-1}
 >
 {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
 </button>
 </div>
 );
}
