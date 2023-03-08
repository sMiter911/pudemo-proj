import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, ElementRef, ViewChild, VERSION } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('openClose', [
      // ...
      state(
        'open',
        style({
          opacity: 1,
          transform: 'scale(1, 1)',
        })
      ),
      state(
        'closed',
        style({
          opacity: 0,
          transform: 'scale(0.95, 0.95)',
        })
      ),
      transition('open => closed', [animate('100ms ease-in')]),
      transition('closed => open', [animate('200ms ease-out')]),
    ]),
  ],
})
export class HeaderComponent {
  @ViewChild('navToggle') navToggle!: ElementRef;
  @ViewChild('navContent') navContent!: ElementRef;

  session: any;
  mobileMenuOpen: any;

  constructor(
    private router: Router,
    private supabaseService: SupabaseService
  ) {
    this.session = this.supabaseService.session;
  }

  public ngOnInit(): void {
    this.supabaseService.authChanges((_, session) => (this.session = session));
  }

  get openCloseTrigger() {
    return this.mobileMenuOpen ? 'open' : 'closed';
  }
  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
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

  public signIn(): void {
    this.router.navigate(['/login']);
  }

  toggleNav() {
    this.navContent.nativeElement.classList.toggle('hidden');
  }

  ngAfterViewInit() {
    this.navToggle.nativeElement.addEventListener(
      'click',
      this.toggleNav.bind(this)
    );
  }
}
