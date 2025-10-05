import type { Preview } from "@storybook/react";
import '../styles/storybook.scss';
import '../../src/index.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: '#000000',
        },
        {
          name: 'matrix',
          value: '#001100',
        },
        {
          name: 'light',
          value: '#ffffff',
        },
      ],
    },
    actions: { argTypesRegex: "^on[A-Z].*" },
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'dark',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;