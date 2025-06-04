import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import { cn } from '../utils';
import { buttonVariants } from './button';
import { forwardRef } from 'react';

const AlertDialog = AlertDialogPrimitive.Root;
const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
const AlertDialogPortal = AlertDialogPrimitive.Portal;

const AlertDialogOverlay = forwardRef(({ className, ...props }, ref) => (
    <AlertDialogPrimitive.Overlay
        ref={ref}
        className={cn(
            'fixed inset-0 z-50 bg-black/80 backdrop-blur-sm',
            'data-[state=open]:animate-fadeIn data-[state=closed]:animate-fadeOut',
            className
        )}
        {...props}
    />
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;

const AlertDialogContent = forwardRef(
    ({ className, setOpenAlert, ...props }, ref) => (
        <AlertDialogPortal>
            <AlertDialogOverlay onClick={() => setOpenAlert(false)} />
            <AlertDialogPrimitive.Content
                ref={ref}
                className={cn(
                    'fixed top-1/2 left-1/2 z-50 max-w-lg w-full rounded-lg bg-white p-6 shadow-lg',
                    'transform -translate-x-1/2 -translate-y-1/2',
                    'grid gap-4',
                    'data-[state=open]:animate-scaleIn data-[state=closed]:animate-scaleOut',
                    className
                )}
                {...props}
            />
        </AlertDialogPortal>
    )
);
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;

const AlertDialogHeader = ({ className, ...props }) => (
    <div
        className={cn(
            'flex flex-col space-y-1.5 text-center sm:text-left',
            className
        )}
        {...props}
    />
);
AlertDialogHeader.displayName = 'AlertDialogHeader';

const AlertDialogFooter = ({ className, ...props }) => (
    <div
        className={cn(
            'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
            'mt-4',
            className
        )}
        {...props}
    />
);
AlertDialogFooter.displayName = 'AlertDialogFooter';

const AlertDialogTitle = forwardRef(({ className, ...props }, ref) => (
    <AlertDialogPrimitive.Title
        ref={ref}
        className={cn('text-lg font-semibold text-gray-900', className)}
        {...props}
    />
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;

const AlertDialogDescription = forwardRef(({ className, ...props }, ref) => (
    <AlertDialogPrimitive.Description
        ref={ref}
        className={cn('text-sm text-gray-600', className)}
        {...props}
    />
));
AlertDialogDescription.displayName =
    AlertDialogPrimitive.Description.displayName;

const AlertDialogAction = forwardRef(({ className, ...props }, ref) => (
    <AlertDialogPrimitive.Action
        ref={ref}
        className={cn(buttonVariants(), className)}
        {...props}
    />
));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;

const AlertDialogCancel = forwardRef(({ className, ...props }, ref) => (
    <AlertDialogPrimitive.Cancel
        ref={ref}
        className={cn(
            buttonVariants({ variant: 'outline' }),
            'mt-3 sm:mt-0',
            className
        )}
        {...props}
    />
));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;

export {
    AlertDialog,
    AlertDialogPortal,
    AlertDialogOverlay,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogAction,
    AlertDialogCancel,
};
