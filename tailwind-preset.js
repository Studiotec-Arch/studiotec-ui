/**
 * Preset do Tailwind da suíte Portal Studiotec.
 *
 * Existe para que `text-sm`, `rounded-md` e `bg-primary` signifiquem a mesma
 * coisa em todos os apps. Antes deste preset, cada projeto mantinha sua própria
 * cópia do `tailwind.config.ts` e elas divergiram em silêncio: `rounded-md`
 * valia 4px no Portal RC e 6px no Knowledge; `text-sm` valia 14px num e 13px no
 * outro. Ninguém percebeu porque a classe era a mesma.
 *
 * Uso:
 *
 *   import studiotec from '@studiotec/ui/tailwind-preset';
 *
 *   export default {
 *     presets: [studiotec],
 *     content: [
 *       './index.html',
 *       './src/**\/*.{ts,tsx}',
 *       './node_modules/@studiotec/ui/dist/**\/*.js',
 *     ],
 *   };
 *
 * A última linha do `content` não é opcional: sem ela o Tailwind não vê as
 * classes usadas dentro dos componentes do pacote e elas somem do CSS final.
 */

import plugin from 'tailwindcss/plugin';

/**
 * Estilos base da suíte.
 *
 * Ficam aqui, e não no tokens.css, por uma razão mecânica: `@import` é içado
 * para o topo do arquivo, acima do `@tailwind base`. Uma regra `* {
 * border-color }` escrita no tokens.css é emitida ANTES do preflight, e o
 * preflight — que também declara `border-color` no seletor universal — vence.
 * O sintoma é discreto e fácil de não notar: as bordas caem para o cinza
 * padrão do Tailwind, inclusive no tema escuro.
 *
 * `addBase` entra na camada base DEPOIS do preflight, que é o que resolve.
 */
const base = plugin(({ addBase }) => {
  addBase({
    '*, ::before, ::after': {
      borderColor: 'hsl(var(--border))',
    },
    body: {
      fontFamily: "'Geist', 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      fontSize: '0.875rem', // 14px — o corpo da suíte
      backgroundColor: 'hsl(var(--background))',
      color: 'hsl(var(--foreground))',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
    },
    'h1, h2, h3, h4, h5, h6': {
      fontWeight: '500',
      letterSpacing: '-0.02em',
    },
    // O Safari do iOS dá zoom automático ao focar um campo com fonte abaixo de
    // 16px, e o layout inteiro desloca. Rede de segurança: os componentes já
    // sobem para 16px no celular por conta própria. NÃO reduzir.
    '@media (max-width: 767px)': {
      "input:not([type='checkbox']):not([type='radio']):not([type='file']), textarea, select": {
        fontSize: '16px !important',
      },
    },
  });
});

/** @type {import('tailwindcss').Config} */
const preset = {
  darkMode: ['class'],
  plugins: [base],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        info: {
          DEFAULT: 'hsl(var(--info))',
          foreground: 'hsl(var(--info-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
        // Cor de identidade do app. Ver styles/tokens.css.
        'app-line': {
          DEFAULT: 'hsl(var(--app-line))',
          foreground: 'hsl(var(--app-line-foreground))',
        },
        severity: {
          critical: 'hsl(var(--severity-critical))',
          high: 'hsl(var(--severity-high))',
          medium: 'hsl(var(--severity-medium))',
          low: 'hsl(var(--severity-low))',
        },
      },

      // sm 4 · md 6 · lg 8 · xl 12. O mapeamento tem de ser exatamente este:
      // houve um período em que `md` resolvia para --radius menos 2px em dois
      // dos apps, deslocando a escala inteira em um degrau.
      borderRadius: {
        sm: 'calc(var(--radius) - 2px)',
        md: 'var(--radius)',
        lg: 'calc(var(--radius) + 2px)',
        xl: 'calc(var(--radius) + 6px)',
      },

      fontFamily: {
        // Geist primeiro. Com Inter à frente, elementos com `font-sans`
        // trocavam de fonte no meio da tela, já que o body declara Geist.
        sans: ['Geist', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },

      // Só o degrau extra de 11px; xs/sm/base ficam no padrão do Tailwind
      // (12 / 14 / 16). O corpo do produto é `text-sm`.
      //
      // `text-base` (16px) é o tamanho do campo de formulário no celular e
      // trava o zoom automático do iOS ao focar. Não reduzir para 14px.
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
      },

      // Alturas conferidas contra o uso real: `h-8` e `h-7` somam quase 200
      // chamadas no Portal RC, enquanto o `default` de 40px do shadcn não
      // aparece nenhuma vez.
      height: {
        control: 'var(--control-sm)',
        bar: 'var(--bar-height)',
        field: 'var(--field-height)',
      },
      width: {
        sidebar: 'var(--sidebar-width)',
        drawer: 'var(--drawer-width)',
      },
    },
  },
};

export default preset;
