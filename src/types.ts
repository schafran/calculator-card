import { LovelaceCardConfig } from 'custom-card-helpers';

export interface CalculatorCardConfig extends LovelaceCardConfig {
  title?: string;
  color_numeral?: string;
  color_function?: string;
  color_operator?: string;
}
