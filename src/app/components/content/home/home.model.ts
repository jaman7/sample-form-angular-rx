import { UntypedFormControl } from '@angular/forms';

export interface IPeriodicElements {
  id?: number;
  name: string;
  position: number;
  symbol: string;
  weight: number;
}

export interface IPeriodicElementsForm {
  id: UntypedFormControl;
  name?: UntypedFormControl;
  position?: UntypedFormControl;
  symbol?: UntypedFormControl;
  weight?: UntypedFormControl;
}
