import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthSession } from '@supabase/supabase-js';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss'],
})
export class AccountDetailsComponent implements OnInit {
  // @Input()
  // session!: AuthSession;
  session: any;
  loading: boolean = false;
  profile: any;
  memberInitiationDate: any;

  constructor(
    private readonly supabase: SupabaseService,
    private router: Router
  ) {
    this.session = this.supabase.session;
  }

  async ngOnInit(): Promise<void> {
    this.supabase.authChanges((_, session) => (this.session = session));
    if (!this.session.user) {
      this.router.navigate(['/login']);
    }
    await this.getProfile();
    this.getDate();
  }

  async getProfile() {
    try {
      this.loading = true;
      const { user } = this.session;

      let { data: profile, error, status } = await this.supabase.profile(user);

      if (error && status !== 406) {
        throw error;
      }

      if (profile) {
        this.profile = profile;
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      this.loading = false;
    }
  }

  getDate() {
    let memberDate = this.profile.membershipNumber;
    const pattern = /[^-]*-[^-]*-(\d{8})-.*/;
    const match = memberDate.match(pattern);
    if (match) {
      const dateStr = match[1];
      const year = dateStr.slice(0, 4);
      const month = dateStr.slice(4, 6);
      const day = dateStr.slice(6, 8);
      this.memberInitiationDate = new Date(year, month - 1, day);
    }
  }

  public signOut(): void {
    this.supabase.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
