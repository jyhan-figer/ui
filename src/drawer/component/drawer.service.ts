import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType } from '@angular/cdk/portal';
import { ComponentRef, Injectable, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DrawerComponent } from './drawer.component';

interface DrawerOptions<T = any> {
  title?: string | TemplateRef<unknown>;
  content?: ComponentType<T> | TemplateRef<T>;
  contentParams?: {
    [key: string]: string;
  };
  footer?: string | TemplateRef<unknown>;
  offsetY?: number;
}
@Injectable({
  providedIn: 'root',
})
export class DrawerService {
  private drawerRef: ComponentRef<DrawerComponent>;
  private overlayRef: OverlayRef;
  private readonly unsubscribe$ = new Subject<void>();

  constructor(private readonly overlay: Overlay) {}

  open<T = any>(options: DrawerOptions<T>) {
    if (!this.drawerRef) {
      this.createDrawer();
      this.updateOptions(options);
    }
    return this.drawerRef?.instance;
  }

  updateOptions(options: DrawerOptions): void {
    Object.assign(this.drawerRef.instance, options);
  }

  private createDrawer(): void {
    this.overlayRef = this.overlay.create();
    this.drawerRef = this.overlayRef.attach(
      new ComponentPortal(DrawerComponent),
    );
    this.drawerRef.instance.drawerViewInit
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.drawerRef.instance.open();
      });

    this.drawerRef.instance.afterClosed
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.overlayRef.dispose();
        this.drawerRef = null;
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
      });
  }
}