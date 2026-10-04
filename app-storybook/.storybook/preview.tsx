import type { Preview } from '@storybook/react-vite';
import { ThemeProvider } from '@gm/lib-client-theme';
import './preview.css';

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const mode = context.globals.colorMode === 'dark' ? 'dark' : 'light';
      return (
        <ThemeProvider mode={mode}>
          <div className="gm-storybook-theme" data-gm-theme={mode}>
            <Story />
          </div>
        </ThemeProvider>
      );
    },
  ],
  globalTypes: {
    colorMode: {
      description: 'Color theme for web and native components',
      toolbar: {
        dynamicTitle: true,
        icon: 'circlehollow',
        items: [
          { title: 'Light', value: 'light' },
          { title: 'Dark', value: 'dark' },
        ],
        title: 'Color mode',
      },
    },
  },
  initialGlobals: { colorMode: 'light' },
  parameters: {
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'error',
    },

    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
