import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  session: any;

  constructor(
    private router: Router,
    private supabaseService: SupabaseService
  ) {
    this.session = this.supabaseService.session;
  }

  public ngOnInit(): void {
    this.supabaseService.authChanges((_, session) => (this.session = session));
  }

  public isAuthenticated(): boolean {
    if (this.session) {
      return true;
    }
    return false;
  }

  public signOut(): void {
    this.supabaseService.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
