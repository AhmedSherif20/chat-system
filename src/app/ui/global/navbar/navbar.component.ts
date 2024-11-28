import { Component, inject, OnInit } from '@angular/core';
import { UserStateService } from '../../../services/user state/user-state.service';
import { User } from '../../../interfaces/User';
import { Router } from '@angular/router';
import { SweetAlertService } from '../../../services/sweet alert/sweet-alert.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  private userStateService: UserStateService = inject(UserStateService);
  private sweetAlertService: SweetAlertService = inject(SweetAlertService);
  private router: Router = inject(Router);

  userInfo$: Observable<User | null> = this.userStateService.userData$;

  ngOnInit(): void {}

  userLogout(): void {
    this.userStateService.logout();
    this.sweetAlertService.showToast({
      icon: 'success',
      title: 'Logged out successfully',
    });
    this.router.navigate(['/auth/login']);
  }
}
