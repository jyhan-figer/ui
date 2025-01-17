import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';

@Component({
  templateUrl: './template.html',
  styleUrls: ['./style.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaletteComponent implements AfterViewInit {
  @ViewChild('ref')
  private readonly ref: ElementRef<HTMLDivElement>;

  ngAfterViewInit() {
    Array.from(this.ref.nativeElement.querySelectorAll('.indicator'))
      .map(el => {
        const bgColor = getComputedStyle(el).backgroundColor;
        if (bgColor === 'rgba(0, 0, 0, 0)') {
          return () => {
            // do nothing
          };
        }
        const color =
          bgColor +
          ', #' +
          bgColor
            .slice(4, -1)
            .split(',')
            .map(v => parseInt(v.trim()).toString(16).padStart(2, '0'))
            .join('');
        const slot = el.querySelector('.value');
        return () => {
          slot.innerHTML = color;
        };
      })
      .forEach(fn => fn());
  }
}
