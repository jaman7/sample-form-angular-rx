import { InjectionToken } from '@angular/core';
import { RxState } from '@rx-angular/state';

export interface IPeriodicElements {
  id?: number;
  name: string;
  position: number;
  symbol: string;
  weight: number;
}

export interface GlobalState {
  periodicElements: IPeriodicElements[];
}

export const GLOBAL_RX_STATE = new InjectionToken<RxState<GlobalState>>('GLOBAL_RX_STATE');
