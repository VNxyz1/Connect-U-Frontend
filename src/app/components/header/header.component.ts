import { Component, OnInit } from '@angular/core';
import { ImageModule } from 'primeng/image';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ImageModule, AngularRemixIconComponent, Button],
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
