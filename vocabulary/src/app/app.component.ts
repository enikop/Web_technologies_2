import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from './services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgbCollapseModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'vocabulary';
  authService = inject(AuthService);
  isMenuCollapsed = true;

  private router = inject(Router);
  private toastr = inject(ToastrService);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  //Check if given route is active for highlighting menu item
  isActiveRoute(route: string): boolean {
    if (this.activatedRoute.snapshot.firstChild?.url.length == 0) {
      if (route == '') return true;
      else return false;
    }
    if (this.activatedRoute.snapshot.firstChild &&
      this.activatedRoute.snapshot.firstChild.url[0].toString() == route) {
      return true;
    }
    return false;
  }

  logout() {
    this.authService.removeToken();
    this.toastr.success('User logged out successfully.', 'Logged out');
    this.router.navigateByUrl('/login');
  }
}
