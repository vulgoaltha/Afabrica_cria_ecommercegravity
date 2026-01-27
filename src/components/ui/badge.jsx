import React from 'react';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';

const badgeVariants = cva(
    'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-300',
    {
        variants: {
            variant: {
                default: 'border-[var(--color-gold)]/50 bg-[var(--color-gold)]/10 text-[var(--color-gold)] hover:bg-[var(--color-gold)]/20',
                secondary: 'border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-800',
                outline: 'border-gray-700 text-gray-300 hover:bg-gray-800/50',
                success: 'border-green-500/50 bg-green-500/10 text-green-400 hover:bg-green-500/20',
                warning: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

function Badge({ className, variant, ...props }) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}

export { Badge, badgeVariants };
