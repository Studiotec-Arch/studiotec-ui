import * as React from 'react';

import { cn } from '../lib/cn';

/**
 * Duas coisas aqui vieram do uso em produção e não devem ser "simplificadas":
 *
 * 1. O campo tem PREENCHIMENTO (`bg-muted/45`), não fundo transparente. O
 *    desenho original era transparente com hairline de 1px, e no celular
 *    sobre grafite a borda a 26% de luminância não se via — o usuário não
 *    achava o campo. É o preenchimento que delimita.
 *
 * 2. `text-base` no celular = 16px. Abaixo disso o Safari do iOS dá zoom ao
 *    focar e desloca o layout inteiro. No desktop cai para 13px. NÃO trocar
 *    `text-base` por `text-sm` aqui.
 *
 * A altura acompanha: 40px no celular (alvo de toque), 36px no desktop
 * (alinha com os botões da mesma linha).
 */
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        'flex h-[var(--field-h)] w-full rounded-md border border-input bg-muted/45 px-3 py-2 text-[length:var(--field-text)] ring-offset-background file:border-0 file:bg-background file:text-[13px] file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Input.displayName = 'Input';

export { Input };
