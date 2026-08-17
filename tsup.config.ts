import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  // React e Radix ficam de fora: são peerDependencies, e embutir uma segunda
  // cópia do React no bundle quebra os hooks no app consumidor.
  external: ['react', 'react-dom', '@radix-ui/react-select', '@radix-ui/react-slot', 'lucide-react'],
});
