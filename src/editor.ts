export const configSchema = [
  {
    name: 'title',
    label: 'Card Title',
    selector: { text: {} },
  },
  {
    name: 'entity_id',
    label: 'State Entity',
    helper: 'Optional input_number to persist result. Restores on load, saves on equals.',
    selector: { entity: { domain: 'input_number' } },
  },
  {
    name: 'color_numeral',
    label: 'Number Button Colour',
    selector: { ui_color: {} },
  },
  {
    name: 'color_function',
    label: 'Function Button Colour (AC, %, ⌫)',
    selector: { ui_color: {} },
  },
  {
    name: 'color_operator',
    label: 'Operator Button Colour (+, −, ×, ÷, =)',
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
