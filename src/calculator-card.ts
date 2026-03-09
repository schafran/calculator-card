import * as packageJson from '../package.json';
import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import { CalculatorCardConfig } from './types';
import { CARD_NAME } from './consts';
import { getConfigForm } from './editor';

const THEME_COLORS = new Set([
  'primary',
  'accent',
  'red',
  'pink',
  'purple',
  'deep-purple',
  'indigo',
  'blue',
  'light-blue',
  'cyan',
  'teal',
  'green',
  'light-green',
  'lime',
  'yellow',
  'amber',
  'orange',
  'deep-orange',
  'brown',
  'light-grey',
  'grey',
  'dark-grey',
  'blue-grey',
  'black',
  'white',
]);

// Theme colours that need white/light text (dark backgrounds)
const DARK_BG_COLORS = new Set([
  'primary',
  'accent',
  'red',
  'pink',
  'purple',
  'deep-purple',
  'indigo',
  'blue',
  'teal',
  'green',
  'brown',
  'blue-grey',
  'dark-grey',
  'black',
]);

function computeCssColor(color: string): string {
  if (THEME_COLORS.has(color)) {
    return `var(--${color}-color)`;
  }
  return color;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

function getContrastTextColor(bgColor: string): string {
  if (DARK_BG_COLORS.has(bgColor)) {
    return 'var(--text-primary-color)';
  }
  if (THEME_COLORS.has(bgColor)) {
    // Light theme colours get dark text
    return 'var(--primary-text-color)';
  }
  if (bgColor.startsWith('#')) {
    const rgb = hexToRgb(bgColor);
    if (rgb) {
      // Calculate relative luminance
      const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
      return luminance > 0.5 ? 'var(--primary-text-color)' : 'var(--text-primary-color)';
    }
  }
  return 'inherit';
}

console.info(
  `%c ${CARD_NAME.toUpperCase()} %c ${packageJson.version}`,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);

/* eslint-disable @typescript-eslint/no-explicit-any */
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'calculator-card',
  name: 'Calculator Card',
  preview: false,
  description: 'A custom calculator card for Home Assistant',
});
/* eslint-enable @typescript-eslint/no-explicit-any */

@customElement(CARD_NAME)
export class CalculatorCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private config!: CalculatorCardConfig;
  @state() private display: string = '0';
  @state() private firstOperand: number | null = null;
  @state() private operator: string | null = null;
  @state() private waitingForOperand: boolean = false;
  @state() private stateRestored: boolean = false;

  static getStubConfig(): Partial<CalculatorCardConfig> {
    return {};
  }

  public setConfig(config: CalculatorCardConfig): void {
    if (!config) {
      throw new Error('Invalid configuration');
    }
    this.config = config;
  }

  static getConfigForm() {
    return getConfigForm();
  }

  public getCardSize(): number {
    return 3;
  }

  protected updated(changedProps: PropertyValues): void {
    super.updated(changedProps);
    if (!this.stateRestored && this.config?.entity_id && this.hass) {
      const entity = this.hass.states[this.config.entity_id];
      if (entity) {
        const value = parseFloat(entity.state);
        if (!isNaN(value)) {
          this.display = String(value);
        }
      }
      this.stateRestored = true;
    }
  }

  private handleNumberClick(num: string): void {
    if (this.waitingForOperand) {
      this.display = num;
      this.waitingForOperand = false;
    } else {
      this.display = this.display === '0' ? num : this.display + num;
    }
  }

  private formatResult(result: number): string {
    if (!Number.isFinite(result)) return 'Error';
    return String(parseFloat(result.toPrecision(12)));
  }

  private handleOperatorClick(nextOperator: string): void {
    const inputValue = parseFloat(this.display);

    if (this.firstOperand === null) {
      this.firstOperand = inputValue;
    } else if (this.operator) {
      const result = this.calculate(this.firstOperand, inputValue, this.operator);
      this.display = this.formatResult(result);
      this.firstOperand = result;
    }

    this.waitingForOperand = true;
    this.operator = nextOperator;
  }

  private calculate(firstOperand: number, secondOperand: number, operator: string): number {
    switch (operator) {
      case '+':
        return firstOperand + secondOperand;
      case '-':
        return firstOperand - secondOperand;
      case '×':
        return firstOperand * secondOperand;
      case '÷':
        return firstOperand / secondOperand;
      default:
        return secondOperand;
    }
  }

  private handleEquals(): void {
    if (this.operator && this.firstOperand !== null) {
      const inputValue = parseFloat(this.display);
      const result = this.calculate(this.firstOperand, inputValue, this.operator);
      this.display = this.formatResult(result);
      this.firstOperand = null;
      this.operator = null;
      this.waitingForOperand = true;
      this.saveToEntity();
    }
  }

  private saveToEntity(): void {
    if (!this.config.entity_id || !this.hass) return;
    const value = parseFloat(this.display);
    if (!isNaN(value)) {
      this.hass.callService('input_number', 'set_value', {
        entity_id: this.config.entity_id,
        value: value,
      });
    }
  }

  private handleClear(): void {
    this.display = '0';
    this.firstOperand = null;
    this.operator = null;
    this.waitingForOperand = false;
  }

  private handleBackspace(): void {
    if (this.display === '0' || this.display === 'Error' || this.waitingForOperand) {
      return;
    }
    if (this.display.length === 1 || (this.display.length === 2 && this.display.startsWith('-'))) {
      this.display = '0';
    } else {
      this.display = this.display.slice(0, -1);
    }
  }

  private handlePercentage(): void {
    const value = parseFloat(this.display);
    if (!Number.isFinite(value)) return;
    this.display = this.formatResult(value / 100);
  }

  private handleSignToggle(): void {
    if (this.display === '0' || this.display === 'Error') return;
    if (this.display.startsWith('-')) {
      this.display = this.display.slice(1);
    } else {
      this.display = '-' + this.display;
    }
  }

  private handleDecimal(): void {
    if (this.waitingForOperand) {
      this.display = '0.';
      this.waitingForOperand = false;
    } else if (this.display.indexOf('.') === -1) {
      this.display = this.display + '.';
    }
  }

  protected render() {
    if (!this.config || !this.hass) {
      return html``;
    }

    const styles = [
      this.config.color_numeral ? `--calc-color-numeral: ${computeCssColor(this.config.color_numeral)}` : '',
      this.config.color_numeral ? `--calc-text-numeral: ${getContrastTextColor(this.config.color_numeral)}` : '',
      this.config.color_function ? `--calc-color-function: ${computeCssColor(this.config.color_function)}` : '',
      this.config.color_function ? `--calc-text-function: ${getContrastTextColor(this.config.color_function)}` : '',
      this.config.color_operator ? `--calc-color-operator: ${computeCssColor(this.config.color_operator)}` : '',
      this.config.color_operator ? `--calc-text-operator: ${getContrastTextColor(this.config.color_operator)}` : '',
    ]
      .filter(Boolean)
      .join('; ');

    return html`
      <ha-card .header=${this.config.title} style=${styles ? styles + ';' : ''}>
        <div class="card-content">
          <div class="calculator">
            <div class="display">${this.display}</div>
            <div class="buttons">
              <button class="btn btn-function" @click=${this.handleBackspace}>⌫</button>
              <button class="btn btn-function" @click=${this.handleClear}>AC</button>
              <button class="btn btn-function" @click=${this.handlePercentage}>%</button>
              <button class="btn btn-operator" @click=${() => this.handleOperatorClick('÷')}>÷</button>

              <button class="btn" @click=${() => this.handleNumberClick('7')}>7</button>
              <button class="btn" @click=${() => this.handleNumberClick('8')}>8</button>
              <button class="btn" @click=${() => this.handleNumberClick('9')}>9</button>
              <button class="btn btn-operator" @click=${() => this.handleOperatorClick('×')}>×</button>

              <button class="btn" @click=${() => this.handleNumberClick('4')}>4</button>
              <button class="btn" @click=${() => this.handleNumberClick('5')}>5</button>
              <button class="btn" @click=${() => this.handleNumberClick('6')}>6</button>
              <button class="btn btn-operator" @click=${() => this.handleOperatorClick('-')}>−</button>

              <button class="btn" @click=${() => this.handleNumberClick('1')}>1</button>
              <button class="btn" @click=${() => this.handleNumberClick('2')}>2</button>
              <button class="btn" @click=${() => this.handleNumberClick('3')}>3</button>
              <button class="btn btn-operator" @click=${() => this.handleOperatorClick('+')}>+</button>

              <button class="btn" @click=${this.handleSignToggle}>+/−</button>
              <button class="btn" @click=${() => this.handleNumberClick('0')}>0</button>
              <button class="btn" @click=${this.handleDecimal}>.</button>
              <button class="btn btn-operator" @click=${this.handleEquals}>=</button>
            </div>
          </div>
        </div>
      </ha-card>
    `;
  }

  static styles = css`
    :host {
      --calc-btn-radius: var(--ha-card-border-radius, 8px);
      --calc-spacing: 8px;
      --calc-btn-padding: 20px;
      display: block;
    }
    .card-content {
      padding: var(--calc-spacing) calc(var(--calc-spacing) * 2);
    }
    .calculator {
      max-width: 300px;
      margin: 0 auto;
    }
    .display {
      background-color: var(--primary-background-color);
      color: var(--primary-text-color);
      font-size: 2rem;
      font-weight: bold;
      text-align: right;
      padding: var(--calc-btn-padding);
      margin-bottom: var(--calc-spacing);
      border-radius: var(--calc-btn-radius);
      border: 1px solid var(--divider-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .buttons {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--calc-spacing);
    }
    .btn {
      background-color: var(--calc-color-numeral, var(--card-background-color));
      color: var(--calc-text-numeral, var(--primary-text-color));
      border: 1px solid var(--divider-color);
      border-radius: var(--calc-btn-radius);
      font-size: 1.25rem;
      padding: var(--calc-btn-padding);
      cursor: pointer;
      transition:
        filter 0.15s ease,
        transform 0.1s ease;
    }
    .btn:hover {
      filter: brightness(0.9);
      transform: scale(1.05);
    }
    .btn:active {
      transform: scale(0.95);
    }
    .btn-function {
      background-color: var(--calc-color-function, var(--secondary-background-color));
      color: var(--calc-text-function, var(--primary-text-color));
    }
    .btn-operator {
      background-color: var(--calc-color-operator, var(--primary-color));
      color: var(--calc-text-operator, var(--text-primary-color));
    }
  `;
}
