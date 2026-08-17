import * as React from 'react';

import { cn } from '../lib/cn';

/**
 * Rótulo de campo. Use sempre com `htmlFor` apontando ao `id` do controle —
 * é o que faz o clique focar o campo e o que o leitor de tela anuncia.
 */
const Label = React.forwardRef<HTMLLabelElement, React.ComponentProps<'label'>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        'text-[13px] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className,
      )}
      {...props}
    />
  ),
);
Label.displayName = 'Label';

export { Label };
