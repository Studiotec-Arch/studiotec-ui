# @studiotec/ui

Primitivos de UI, preset do Tailwind e tokens da suíte **Portal Studiotec** — Portal RC, Portal RDO e os apps que vierem.

Este pacote existe porque cada app mantinha sua própria cópia dos mesmos arquivos, e as cópias divergiram em silêncio: `rounded-md` valia 4px num projeto e 6px em outro, `text-sm` valia 14px num e 13px no outro, e o mesmo `Button` tinha um tamanho a mais só num dos repos. A classe era a mesma, o resultado não.

## Instalação

```bash
npm install git+https://github.com/Studiotec-Arch/studiotec-ui.git#v1.0.3
```

Sempre com tag, nunca `#main` — é o que torna o build reprodutível.

Peer dependencies (os apps da suíte já têm todas): `react`, `react-dom`, `tailwindcss`, `@radix-ui/react-select`, `@radix-ui/react-slot`, `lucide-react`.

> **Docker:** o estágio de build precisa da imagem `node:22` completa, não `node:22-slim` — o npm usa `git` para resolver a tag. E é preciso reescrever a URL, porque o npm normaliza GitHub para `git+ssh` no lockfile e não há chave SSH dentro do container:
>
> ```dockerfile
> RUN git config --global url."https://github.com/".insteadOf ssh://git@github.com/ \
>  && npm install
> ```
>
> É o mesmo tratamento que `@studiotec-arch/image-compress` já recebe.

## Uso

**1. Preset do Tailwind**

```ts
// tailwind.config.ts
import studiotec from '@studiotec/ui/tailwind-preset';

export default {
  presets: [studiotec],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    './node_modules/@studiotec/ui/dist/**/*.js',
  ],
};
```

A última linha do `content` **não é opcional**: sem ela o Tailwind não enxerga as classes usadas dentro dos componentes do pacote e elas somem do CSS final — os componentes chegam sem estilo e o erro não aparece em lugar nenhum.

**2. Tokens**

```css
/* src/index.css */
@import '@studiotec/ui/tokens.css';

@tailwind base;
@tailwind components;
@tailwind utilities;
```

**3. Cor de identidade do app**

Cada app declara a sua, depois do import:

```css
:root { --app-line: 42 74% 45%; }   /* Portal RDO = ouro */
.dark { --app-line: 42 78% 52%; }
```

Ela pinta as duas linhas de moldura, o título do app no sidebar e o accent (`primary`, `ring`, `sidebar-primary`). Os shells são propositalmente parecidos: é a cor das linhas, mais o título, que diz ao usuário em qual app ele está.

Em uso hoje: **Portal RC** verde da marca · **Portal RDO** ouro `42 74% 45%` · **Knowledge** azul aço `211 62% 55%`.

`--app-line-foreground` já vem resolvido e é sempre quase-preto — não sobrescreva. Branco sobre o verde `#78BE20` dá 2,2:1 e reprova em AA.

**4. Componentes**

```tsx
import { Button, Input, Label, Card, Badge } from '@studiotec/ui';
```

## O que vem no pacote

| | |
|---|---|
| `Button` | `default` (tinta) · `primary` (accent) · `destructive` · `outline` · `secondary` · `ghost` · `link`. Tamanhos `xs` 28 · **`sm` 32 (padrão)** · `md` 36 · `lg` 40 · `icon` · `icon-xs` |
| `Input` `Textarea` `Select` | Campo com preenchimento, 40px no celular e 36px no desktop |
| `Label` | Rótulo de campo — use sempre com `htmlFor` |
| `Card` | + `CardHeader` `CardTitle` `CardDescription` `CardContent` `CardFooter` |
| `Badge` | `default` · `primary` · `outline` · `success` · `warning` · `info` · `destructive` · `muted` |
| `cn` | Junta classes resolvendo conflitos do Tailwind |

## Regras que parecem detalhe e não são

Três coisas aqui vieram de problemas reais em produção. Se alguém "limpar" qualquer uma delas, o bug volta.

**O campo tem preenchimento, não fundo transparente.** O desenho original era transparente com hairline de 1px. No celular, sobre grafite, uma borda a 26% de luminância simplesmente não se vê — o usuário não achava o campo. É o `bg-muted/45` que delimita, não a borda.

**`text-base` nos campos é 16px e trava o zoom do iOS.** Abaixo de 16px o Safari dá zoom automático ao focar e desloca o layout inteiro. Por isso os campos são `text-base md:text-[13px]`: `text-base` ali é mecanismo, não escolha tipográfica. O corpo do produto é `text-sm` (14px). O preset ainda injeta uma media query com `!important` como rede de segurança.

**Os estilos base vivem no preset, não no `tokens.css`.** `@import` é içado para o topo do arquivo do app, acima do `@tailwind base` — uma regra `* { border-color }` escrita no `tokens.css` sai antes do preflight do Tailwind, que também declara `border-color` no seletor universal, e o preflight vence. O sintoma é discreto: as bordas caem para o cinza padrão, inclusive no tema escuro. Por isso o preset injeta `border-color`, `body`, headings e a regra dos 16px com `addBase`, que entra depois do preflight. **Aplicar o preset não é opcional** — sem ele o `tokens.css` sozinho não veste o app.

**O bloco que amarra o accent ao `--app-line` fica no fim do `tokens.css`.** Depois de `:root` **e** de `.dark`. Entre regras de mesma especificidade a última vence — colocá-lo antes do `.dark` faz o accent seguir a cor do app só no tema claro, e no escuro ele volta ao verde sem erro nenhum.

## Versionamento

Tags semver. Mudança que altera pixel em tela consumida por app em produção é **minor** no mínimo; mudança de nome ou remoção de variante é **major**.

Ao subir a versão, lembre que RC e RDO estão em produção — a atualização é por app, no ritmo de cada um, e é isso que a tag garante.
