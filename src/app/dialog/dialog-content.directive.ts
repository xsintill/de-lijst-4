import { ComponentFactoryResolver, ComponentRef, Directive, Input, OnInit, Type, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { FormComponent } from './form-component.type';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[dialogContent]',
  exportAs: 'dialogContent',
})
export class DialogContentDirective implements OnInit {
  @Input() content: Type<FormComponent>;

  get form(): FormGroup {
    return this.componentRef.instance.form;
  }

  private componentRef: ComponentRef<FormComponent>;

  constructor(private resolver: ComponentFactoryResolver, private container: ViewContainerRef) { }

  ngOnInit(): void {
    const cf = this.resolver.resolveComponentFactory<FormComponent>(this.content);
    this.componentRef = this.container.createComponent(cf);
  }
}
