import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthSession } from '@supabase/supabase-js';
import { CountryServiceService } from '../services/country-service.service';
import { Profile, SupabaseService } from '../services/supabase.service';

export interface Country {
  name: string;
}

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  loading = false;
  profile!: Profile;
  countries: any;
  branches: any;
  selectedStructure: any;
  structures: any;
  dialingCode: any;
  countryExtension: any;
  newMember: any;

  // @Input()
  // session!: AuthSession;
  session: any;

  updateProfileForm = this.formBuilder.group({
    membershipNumber: '',
    username: '',
    website: '',
    avatar_url: '',
    countryName: ['', [Validators.required]],
    contactNumber: ['', [Validators.required]],
    title: ['', [Validators.required]],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    gender: ['', [Validators.required]],
    identityNumber: ['', [Validators.required]],
    dateOfBirth: ['', [Validators.required]],
    emailAddress: ['', [Validators.required, Validators.email]],
    streetAddress: ['', [Validators.required]],
    city: ['', [Validators.required]],
    homeArea: ['', [Validators.required]],
    postalCode: [''],
    branchLocation: ['', [Validators.required]],
    branch: ['', [Validators.required]],
    employment: ['', [Validators.required]],
    companyName: '',
  });

  constructor(
    private readonly supabase: SupabaseService,
    private formBuilder: FormBuilder,
    private _countryService: CountryServiceService,
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
    await this.getCountries();
    await this.getBranches();
    await this.getStructures();
    await this.getDialingCode();
    await this.createMembershipNumber();

    const {
      username,
      website,
      avatar_url,
      countryName,
      contactNumber,
      title,
      firstName,
      lastName,
      gender,
      identityNumber,
      dateOfBirth,
      emailAddress,
      streetAddress,
      city,
      homeArea,
      postalCode,
      branchLocation,
      branch,
      membershipNumber,
      employment,
      companyName,
    } = this.profile;
    this.updateProfileForm.patchValue({
      username,
      website,
      avatar_url,
      countryName,
      contactNumber,
      title,
      firstName,
      lastName,
      gender,
      identityNumber,
      dateOfBirth,
      emailAddress,
      streetAddress,
      city,
      homeArea,
      postalCode,
      branchLocation,
      branch,
      membershipNumber,
      employment,
      companyName,
    });
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

  async updateProfile(): Promise<void> {
    try {
      this.loading = true;
      const { user } = this.session;

      const username = this.updateProfileForm.value.username as string;
      const website = this.updateProfileForm.value.website as string;
      const avatar_url = this.updateProfileForm.value.avatar_url as string;
      const countryName = this.updateProfileForm.value.countryName as string;
      const contactNumber = this.updateProfileForm.value
        .contactNumber as string;
      const title = this.updateProfileForm.value.title as string;
      const firstName = this.updateProfileForm.value.firstName as string;
      const lastName = this.updateProfileForm.value.lastName as string;
      const gender = this.updateProfileForm.value.gender as string;
      const identityNumber = this.updateProfileForm.value
        .identityNumber as string;
      const dateOfBirth = this.updateProfileForm.value.dateOfBirth as string;
      const emailAddress = this.updateProfileForm.value.emailAddress as string;
      const streetAddress = this.updateProfileForm.value
        .streetAddress as string;
      const city = this.updateProfileForm.value.city as string;
      const homeArea = this.updateProfileForm.value.homeArea as string;
      const postalCode = this.updateProfileForm.value.postalCode as string;
      const branchLocation = this.updateProfileForm.value
        .branchLocation as string;
      const branch = this.updateProfileForm.value.branch as string;
      const membershipNumber = this.updateProfileForm.value
        .membershipNumber as string;
      const employment = this.updateProfileForm.value.employment as string;
      const companyName = this.updateProfileForm.value.companyName as string;

      const { error } = await this.supabase.updateProfile({
        id: user.id,
        username,
        website,
        avatar_url,
        countryName,
        contactNumber,
        title,
        firstName,
        lastName,
        gender,
        identityNumber,
        dateOfBirth,
        emailAddress,
        streetAddress,
        city,
        homeArea,
        postalCode,
        branchLocation,
        branch,
        membershipNumber,
        employment,
        companyName,
      });
      if (error) throw error;
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      this.loading = false;
      this.router.navigate(['/profile']);
    }
  }

  async getCountries() {
    this._countryService.getCountries().subscribe((data) => {
      this.countries = data;
    });
  }

  async getDialingCode() {
    this._countryService.getJSON().subscribe((data) => {
      this.dialingCode = data;
    });
  }

  async getBranches() {
    await this.supabase.branches().then((data) => {
      console.log(data);
      this.branches = data;
    });
  }

  async getStructures() {
    await this.supabase.structures().then((data) => {
      console.log(data);
      this.structures = data;
    });
  }

  changeCountry(e: any) {
    this.countryName?.setValue(e.target.value, {
      onlySelf: true,
    });
  }

  get countryName() {
    return this.updateProfileForm.get('countryName');
  }

  changeBranch(e: any) {
    this.branch?.setValue(e.target.value, {
      onlySelf: true,
    });
  }

  get branch() {
    return this.updateProfileForm.get('branch');
  }

  changeEmployment(e: any) {
    this.employment?.setValue(e.target.value, {
      onlySelf: true,
    });
  }

  get employment() {
    return this.updateProfileForm.get('employment');
  }

  onDialingCodeChange(e: any) {
    this.contactNumber?.setValue(e.target.value, {
      onlySelf: true,
    });
    let countryCode = this.contactNumber?.value;
    this.getCountryDialingCode(countryCode);
  }

  get contactNumber() {
    return this.updateProfileForm.get('contactNumber');
  }

  getCountryDialingCode(countryCode: any) {
    this.dialingCode.forEach((country: any) => {
      if (country.code === countryCode) {
        this.countryExtension = country.dial_code;
      }
    });
  }

  get avatarUrl() {
    return this.updateProfileForm.value.avatar_url as string;
  }

  async updateAvatar(event: string): Promise<void> {
    this.updateProfileForm.patchValue({
      avatar_url: event,
    });
    await this.updateProfile();
  }

  async createMembershipNumber() {
    // Get today's date
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Add leading zero if necessary
    const day = String(today.getDate()).padStart(2, '0'); // Add leading zero if necessary

    // Combine the date components into a string in the format of YYYYMMDD
    const date_string = `${year}${month}${day}`;

    // Generate a random number between 1000 and 9999
    const random_number = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);

    // Combine the date string and random number to create the membership number
    this.newMember = `${date_string}-${random_number}`;

    console.log(this.newMember);

    if (this.updateProfileForm.get('membershipNumber')?.value == '') {
      this.updateProfileForm.get('membershipNumber')?.setValue(this.newMember);
    }
  }

  public signOut(): void {
    this.supabase.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
