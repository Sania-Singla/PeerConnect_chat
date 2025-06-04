import { forwardRef } from 'react';
import { cn } from '../utils';

const Textarea = forwardRef(({ className, ...props }, ref) => {
    return (
        <textarea
            ref={ref}
            className={cn(
                'flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 placeholder:italic placeholder-gray-400 ' +
                    'focus:outline-none focus:ring-1 focus:ring-[#4977ec] focus:border-[#4977ec] disabled:cursor-not-allowed disabled:opacity-50',
                className
            )}
            {...props}
        />
    );
});

Textarea.displayName = 'Textarea';

export { Textarea };
