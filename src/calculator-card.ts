import * as packageJson from '../package.json';
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import { CalculatorCardConfig } from './types';
import { CARD_NAME } from './consts';
import { getConfigForm } from './editor';

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
    }
  }

  private handleClear(): void {
    this.display = '0';
    this.firstOperand = null;
    this.operator = null;
    this.waitingForOperand = false;
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

    return html`
      <ha-card .header=${this.config.title}>
        <div class="card-content">
          <div class="calculator">
            <div class="display">${this.display}</div>
            <div class="buttons">
              <button class="btn btn-clear" @click=${this.handleClear}>C</button>
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

              <button class="btn btn-zero" @click=${() => this.handleNumberClick('0')}>0</button>
              <button class="btn" @click=${this.handleDecimal}>.</button>
              <button class="btn btn-equals" @click=${this.handleEquals}>=</button>
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
      background-color: var(--card-background-color);
      color: var(--primary-text-color);
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
    .btn-operator {
      background-color: var(--primary-color);
      color: var(--text-primary-color);
    }
    .btn-clear {
      background-color: var(--error-color);
      color: var(--text-primary-color);
      grid-column: span 3;
    }
    .btn-equals {
      background-color: var(--success-color);
      color: var(--text-primary-color);
    }
    .btn-zero {
      grid-column: span 2;
    }
  `;
}
