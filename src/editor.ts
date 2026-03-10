export const getConfigForm = () => ({
  schema: [
    { name: 'title', selector: { text: {} } },
    { name: 'entity_id', selector: { entity: { domain: 'input_number' } } },
    {
      type: 'grid',
      name: '',
      schema: [
        { name: 'color_numeral', selector: { ui_color: {} } },
        { name: 'color_function', selector: { ui_color: {} } },
        { name: 'color_operator', selector: { ui_color: {} } },
      ],
    },
  ],
  computeLabel: (schema: { name: string }) => {
    switch (schema.name) {
      case 'title':
        return 'Card Title';
      case 'entity_id':
        return 'State Entity';
      case 'color_numeral':
        return 'Number Button Colour';
      case 'color_function':
        return 'Function Button Colour';
      case 'color_operator':
        return 'Operator Button Colour';
    }
    return undefined;
  },
  computeHelper: (schema: { name: string }) => {
    switch (schema.name) {
      case 'entity_id':
        return 'Optional input_number to persist result. Restores on load, saves on equals.';
      case 'color_numeral':
        return '0-9 and +/−';
      case 'color_function':
        return 'AC, %, ⌫';
      case 'color_operator':
        return '+, −, ×, ÷, =';
    }
    return undefined;
  },
  assertConfig: (config: Record<string, unknown>) => {
    if (!config) {
      throw new Error('Invalid configuration');
    }
  },
});
