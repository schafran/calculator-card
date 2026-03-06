export const configSchema = [
  {
    name: 'title',
    selector: { text: {} },
  },
  {
    name: 'color_numeral',
    selector: { ui_color: {} },
  },
  {
    name: 'color_function',
    selector: { ui_color: {} },
  },
  {
    name: 'color_operator',
    selector: { ui_color: {} },
  },
];

export const getConfigForm = () => ({
  schema: configSchema,
  assertConfig: (config: Record<string, unknown>) => {
    if (!config) {
      throw new Error('Invalid configuration');
    }
  },
});
