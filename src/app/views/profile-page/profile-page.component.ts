import {Component, OnInit} from '@angular/core';
import {Button, ButtonDirective} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {AngularRemixIconComponent} from 'angular-remix-icon';
import {ActivatedRoute} from '@angular/router';
import {ProfileData} from '../../interfaces/ProfileData';
import {UserService} from '../../services/user/user.service';
import {Observable} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {FloatLabelModule} from 'primeng/floatlabel';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {DropdownModule} from 'primeng/dropdown';

type editProfileForm = FormGroup<{
  pronouns: FormControl<string>,
  about: FormControl<string>
}>

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    ButtonDirective,
    CardModule,
    AngularRemixIconComponent,
    AsyncPipe,
    FormsModule,
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    InputTextareaModule,
    Button,
    DropdownModule
  ],
  templateUrl: './profile-page.component.html',
})
export class ProfilePageComponent implements OnInit {
  protected userId!: string;
  protected profileData$!: Observable<ProfileData>;
  protected editMode: boolean = false;
  pronounOptions = [
    { label: 'Er/ihm', value: 'Er/ihm' },
    { label: 'sie/ihr', value: 'sie/ihr' },
    { label: 'die', value: 'die' },
    { label: 'xier', value: 'xier' },
    { label: 'sier', value: 'sier' },
  ];

  constructor(private route: ActivatedRoute, private userService: UserService) {
  }
  form:editProfileForm = new FormGroup({
    pronouns: new FormControl<string>('',{
      nonNullable: true,
      validators: [Validators.required],
    }),
    about: new FormControl<string>('',{
      nonNullable: true,
      validators: [Validators.required],
    }),
  })

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id') || '';
    this.fetchData();
    console.log(this.profileData$);
  }

  fetchData(): void {
    this.profileData$ = this.userService.getSpecificUserData(this.userId);

    // Log the data from the Observable
    this.profileData$.subscribe({
      next: (data) => {
        console.log('Fetched Profile Data:', data);
      },
      error: (error) => {
        console.error('Error fetching profile data:', error);
      },
    });
  }

  submitEdit() {

  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    console.log(this.editMode);
  }
}
