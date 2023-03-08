import { Injectable } from '@angular/core';
import {
  AuthChangeEvent,
  AuthSession,
  createClient,
  Session,
  SupabaseClient,
  User,
} from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

export interface Profile {
  id?: string;
  username: string;
  website: string;
  avatar_url: string;
  countryName: string;
  contactNumber: string;
  title: string;
  firstName: string;
  lastName: string;
  gender: string;
  identityNumber: string;
  dateOfBirth: string;
  emailAddress: string;
  streetAddress: string;
  city: string;
  homeArea: string;
  postalCode: string;
  branchLocation: string;
  branch: string;
  membershipNumber: string;
  employment: string;
  companyName: string;
}

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;
  _session: AuthSession | null = null;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  get session() {
    this.supabase.auth.getSession().then(({ data }) => {
      this._session = data.session;
    });
    return this._session;
  }

  profile(user: User) {
    return this.supabase
      .from('profiles')
      .select(
        `username, website, avatar_url, countryName, contactNumber, title, firstName, lastName, gender, identityNumber, dateOfBirth, emailAddress, streetAddress, city, homeArea, postalCode, branchLocation, branch, membershipNumber, employment, companyName`
      )
      .eq('id', user.id)
      .single();
  }

  structures() {
    return this.supabase.from('structures').select(`id, structure`);
  }

  branches() {
    return this.supabase.from('branches').select(`branch, branch_structure`);
  }

  authChanges(
    callback: (event: AuthChangeEvent, session: Session | null) => void
  ) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  signIn(email: string) {
    return this.supabase.auth.signInWithOtp({ email });
  }

  signOut() {
    return this.supabase.auth.signOut();
  }

  updateProfile(profile: Profile) {
    const update = {
      ...profile,
      updated_at: new Date(),
    };

    return this.supabase.from('profiles').upsert(update);
  }

  downLoadImage(path: string) {
    return this.supabase.storage.from('avatars').download(path);
  }

  uploadAvatar(filePath: string, file: File) {
    return this.supabase.storage.from('avatars').upload(filePath, file);
  }
}
