import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { HomeAssistant, LovelaceCardConfig } from "custom-card-helpers";

interface CalculatorCardConfig extends LovelaceCardConfig {
  type: string;
  title?: string;
}

@customElement("calculator-card")
export class CalculatorCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private config!: CalculatorCardConfig;

  static getStubConfig(): CalculatorCardConfig {
    return {
      type: "custom:calculator-card",
    };
  }

  public setConfig(config: CalculatorCardConfig): void {
    if (!config) {
      throw new Error("Invalid configuration");
    }
    this.config = config;
  }

  protected render() {
    if (!this.config || !this.hass) {
      return html``;
    }

    return html`
      <ha-card .header=${this.config.title}>
        <div class="card-content">
          <div class="hello-world">Hello World</div>
        </div>
      </ha-card>
    `;
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      .card-content {
        padding: 16px;
      }
      .hello-world {
        font-size: 24px;
        font-weight: bold;
        text-align: center;
        color: var(--primary-text-color);
      }
    `;
  }

  public getCardSize(): number {
    return 1;
  }
}

// Register the card
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: "calculator-card",
  name: "Calculator Card",
  description: "A custom calculator card for Home Assistant",
});

// Add to console for debugging
console.info(
  `%c  CALCULATOR-CARD  \n%c  Version 1.0.0    `,
  "color: orange; font-weight: bold; background: black",
  "color: white; font-weight: bold; background: dimgray",
);
