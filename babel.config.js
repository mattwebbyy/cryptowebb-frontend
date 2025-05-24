// babel.config.js
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

export default {
  presets: [
    ['@babel/preset-env', {
      targets: {
        node: 'current',
      },
      modules: false, // Important for ESM
    }],
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
};