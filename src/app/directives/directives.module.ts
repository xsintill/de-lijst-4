import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DebounceDirective } from './debounce.directive';

@NgModule({
  declarations: [DebounceDirective],
  exports: [DebounceDirective],
  imports: [
    CommonModule
  ]
})
export class DirectivesModule { }
