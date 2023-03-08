import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  session: any;
  constructor(
    private readonly supabase: SupabaseService,
    private router: Router
  ) {
    this.session = this.supabase.session;
  }

  async ngOnInit(): Promise<void> {
    this.supabase.authChanges((_, session) => (this.session = session));
    if (this.session.user) {
      this.router.navigate(['/profile']);
    }
  }
}
