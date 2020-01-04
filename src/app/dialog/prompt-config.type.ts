import { Type } from '@angular/core';

import { FormComponent } from './form-component.type';

export interface PromptConfig {
  formComponent: Type<FormComponent>;
  title?: string;
  content?: string;
  ok?: string;
  close: string;
}