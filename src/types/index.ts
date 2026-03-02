import { LovelaceCardConfig } from "custom-card-helpers";

export interface CalculatorCardConfig extends LovelaceCardConfig {
  type: string;
  title?: string;
}

export interface CustomCardEntry {
  type: string;
  name: string;
  preview: boolean;
  description: string;
}

export interface CustomCardWindow extends Window {
  customCards?: CustomCardEntry[];
}
