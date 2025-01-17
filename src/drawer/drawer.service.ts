import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType } from '@angular/cdk/portal';
import { ComponentRef, Injectable, TemplateRef } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { DrawerComponent } from './component/drawer.component';

import { DrawerSize } from '.';

export interface DrawerOptions<T = any, D = any> {
  title?: string | TemplateRef<unknown>;
  width?: number;
  content?: ComponentType<T> | TemplateRef<T>;
  contentParams?: D;
  footer?: string | TemplateRef<unknown>;
  offsetY?: string;
  divider?: boolean;
  drawerClass?: string;
  size?: DrawerSize;
  visible?: boolean;
  hideOnClickOutside?: boolean;
  showClose?: boolean;
  mask?: boolean;
  maskClosable?: boolean;
}
@Injectable()
export class DrawerService {
  private drawerRef: ComponentRef<DrawerComponent>;
  private overlayRef: OverlayRef;
  private readonly unsubscribe$ = new Subject<void>();

  constructor(private readonly overlay: Overlay) {}

  open<T = unknown>(options: DrawerOptions<T>) {
    this.drawerRef?.instance?.dispose();
    this.createDrawer();
    this.updateOptions(options);
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
