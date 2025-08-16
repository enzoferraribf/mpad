import * as React from 'react';

interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLSpanElement> {}

const VisuallyHidden = React.forwardRef<HTMLSpanElement, VisuallyHiddenProps>(({ ...props }, ref) => <span ref={ref} className="absolute h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)]" {...props} />);
VisuallyHidden.displayName = 'VisuallyHidden';

export { VisuallyHidden };
