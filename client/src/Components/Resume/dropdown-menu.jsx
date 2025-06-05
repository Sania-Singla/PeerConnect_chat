import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { Check, ChevronRight, Circle } from 'lucide-react';
import { cn } from '../utils';
import { forwardRef } from 'react';

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuGroup = DropdownMenuPrimitive.Group;
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
const DropdownMenuSub = DropdownMenuPrimitive.Sub;
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const DropdownMenuSubTrigger = forwardRef(
    ({ className, inset, children, ...props }, ref) => (
        <DropdownMenuPrimitive.SubTrigger
            ref={ref}
            className={cn(
                'flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium cursor-default select-none',
                'transition-colors outline-none focus:bg-blue-100 focus:text-blue-700',
                inset && 'pl-8',
                className
            )}
            {...props}
        >
            {children}
            <ChevronRight className="w-4 h-4 ml-2 text-gray-400" />
        </DropdownMenuPrimitive.SubTrigger>
    )
);
DropdownMenuSubTrigger.displayName =
    DropdownMenuPrimitive.SubTrigger.displayName;

const DropdownMenuSubContent = forwardRef(({ className, ...props }, ref) => (
    <DropdownMenuPrimitive.SubContent
        ref={ref}
        className={cn(
            'z-50 min-w-[12rem] rounded-md border border-gray-200 bg-white p-2 shadow-lg',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
            className
        )}
        {...props}
    />
));
DropdownMenuSubContent.displayName =
    DropdownMenuPrimitive.SubContent.displayName;

const DropdownMenuContent = forwardRef(
    ({ className, sideOffset = 6, ...props }, ref) => (
        <DropdownMenuPrimitive.Portal>
            <DropdownMenuPrimitive.Content
                ref={ref}
                sideOffset={sideOffset}
                className={cn(
                    'z-50 min-w-[12rem] rounded-md border border-gray-200 bg-white p-2 shadow-md',
                    'data-[state=open]:animate-in data-[state=closed]:animate-out',
                    'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
                    'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
                    'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
                    className
                )}
                {...props}
            />
        </DropdownMenuPrimitive.Portal>
    )
);
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem = forwardRef(({ className, inset, ...props }, ref) => (
    <DropdownMenuPrimitive.Item
        ref={ref}
        className={cn(
            'relative flex items-center rounded-md px-3 py-2 text-sm cursor-pointer select-none',
            'outline-none transition-colors',
            'hover:bg-blue-50 focus:bg-blue-100 focus:text-blue-700',
            'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
            inset && 'pl-8',
            className
        )}
        {...props}
    />
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuCheckboxItem = forwardRef(
    ({ className, children, ...props }, ref) => (
        <DropdownMenuPrimitive.CheckboxItem
            ref={ref}
            className={cn(
                'relative flex items-center rounded-md py-2 pl-8 pr-3 text-sm cursor-pointer select-none',
                'outline-none transition-colors',
                'hover:bg-blue-50 focus:bg-blue-100 focus:text-blue-700',
                'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                className
            )}
            {...props}
        >
            <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
                <DropdownMenuPrimitive.ItemIndicator>
                    <Check className="w-4 h-4 text-blue-600" />
                </DropdownMenuPrimitive.ItemIndicator>
            </span>
            {children}
        </DropdownMenuPrimitive.CheckboxItem>
    )
);
DropdownMenuCheckboxItem.displayName =
    DropdownMenuPrimitive.CheckboxItem.displayName;

const DropdownMenuRadioItem = forwardRef(
    ({ className, children, ...props }, ref) => (
        <DropdownMenuPrimitive.RadioItem
            ref={ref}
            className={cn(
                'relative flex items-center rounded-md py-2 pl-8 pr-3 text-sm cursor-pointer select-none',
                'outline-none transition-colors',
                'hover:bg-blue-50 focus:bg-blue-100 focus:text-blue-700',
                'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                className
            )}
            {...props}
        >
            <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                <DropdownMenuPrimitive.ItemIndicator>
                    <Circle className="w-3 h-3 fill-blue-600" />
                </DropdownMenuPrimitive.ItemIndicator>
            </span>
            {children}
        </DropdownMenuPrimitive.RadioItem>
    )
);
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

const DropdownMenuLabel = forwardRef(({ className, inset, ...props }, ref) => (
    <DropdownMenuPrimitive.Label
        ref={ref}
        className={cn(
            'px-3 py-1.5 text-xs font-semibold uppercase text-gray-500 select-none',
            inset && 'pl-8',
            className
        )}
        {...props}
    />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = forwardRef(({ className, ...props }, ref) => (
    <DropdownMenuPrimitive.Separator
        ref={ref}
        className={cn('my-1 h-px bg-gray-200', className)}
        {...props}
    />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const DropdownMenuShortcut = ({ className, ...props }) => (
    <span
        className={cn(
            'ml-auto text-xs tracking-widest text-gray-400 select-none',
            className
        )}
        {...props}
    />
);
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut';

export {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuRadioItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuGroup,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuRadioGroup,
};
