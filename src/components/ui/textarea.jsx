import React from 'react';
import { cn } from '@/lib/utils';

const Textarea = React.forwardRef(({ className, error, ...props }, ref) => {
    return (
        <textarea
            className={cn(
                'flex min-h-[120px] w-full rounded-lg border border-gray-700 bg-gray-900/50 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-dourado focus:outline-none focus:ring-2 focus:ring-dourado/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 resize-none',
                error && 'border-red-500 focus:border-red-500 focus:ring-red-500/50',
                className
            )}
            ref={ref}
            {...props}
        />
    );
});
Textarea.displayName = 'Textarea';

export { Textarea };
