import { Component, OnInit } from '@angular/core';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { ImageModule } from 'primeng/image';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { Button } from 'primeng/button';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgOptimizedImage, ImageModule, AngularRemixIconComponent, Button, NgClass, TranslocoPipe],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  currentUrl: string | undefined;
  constructor(private router: Router) {}
  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentUrl = event.url;
      });
  }
  backToHome() {
    let path = '/';
    this.router.navigate([path]);
  }
}
