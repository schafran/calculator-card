export const configSchema = [
  {
    name: 'title',
    selector: { text: {} },
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
