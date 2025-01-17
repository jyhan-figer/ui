import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Input,
  QueryList,
  ViewEncapsulation,
  forwardRef,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { CommonFormControl } from '../../form';
import { TrackFn } from '../../select';
import { CheckboxComponent } from '../checkbox.component';

@Component({
  selector: 'aui-checkbox-group',
  templateUrl: './checkbox-group.component.html',
  styleUrls: ['./checkbox-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxGroupComponent),
      multi: true,
    },
  ],
})
export class CheckboxGroupComponent<T> extends CommonFormControl<T[]> {
  private _trackFn: TrackFn<T>;

  @Input()
  direction: 'row' | 'column' = 'row';

  @Input()
  get trackFn() {
    return this._trackFn;
  }

  set trackFn(val) {
    if (val !== this._trackFn) {
      this._trackFn = val;
    }
  }

  @ContentChildren(forwardRef(() => CheckboxComponent), {
    descendants: true,
  })
  checkboxes: QueryList<CheckboxComponent<T>>;

  onCheckboxChange(checkbox: CheckboxComponent<T>) {
    if (this.onTouched) {
      this.onTouched();
    }
    const values = this.checkboxes
      .filter(item => (item === checkbox ? !item.model : item.model))
      .map(item => item.label);
    this.emitValue(values);
  }

  onCheckboxBlur() {
    if (this.onTouched) {
      this.onTouched();
    }
  }
}
