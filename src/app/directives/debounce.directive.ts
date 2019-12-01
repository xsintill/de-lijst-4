import { Directive, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[ngModel][debouncetime]',
})
export class DebounceDirective implements OnInit {
    @Output()
    public debounce = new EventEmitter<any>();

    // tslint:disable-next-line:no-input-rename
    @Input('debouncetime')
    public debouncetime = 500;

    private isFirstChange = true;

    constructor(public model: NgControl) {
    }

    public ngOnInit() {
        if (this.model !== null) {

            this.model
                .valueChanges.pipe(
                    debounceTime(this.debouncetime),
                    distinctUntilChanged()
                ).subscribe((modelValue: any) => {
                    if (this.isFirstChange) {
                        this.isFirstChange = false;
                    } else {
                        this.debounce.emit(modelValue);
                    }
                });
        }
        }
}
