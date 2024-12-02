import {Component, OnInit} from '@angular/core';
import {Button, ButtonDirective} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {AngularRemixIconComponent} from 'angular-remix-icon';
import {ActivatedRoute} from '@angular/router';
import {ProfileData} from '../../interfaces/ProfileData';
import {UpdateProfileBody, UserService} from '../../services/user/user.service';
import {Observable} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {FloatLabelModule} from 'primeng/floatlabel';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {DropdownModule} from 'primeng/dropdown';
import {MessageService} from 'primeng/api';
import {TranslocoService} from '@jsverse/transloco';

type editProfileForm = FormGroup<{
  pronouns: FormControl<string>,
  profileText: FormControl<string>
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
  providers:[UserService,MessageService, TranslocoService],
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

  constructor(private messageService:MessageService, private route: ActivatedRoute, private userService: UserService) {
  }
  form:editProfileForm = new FormGroup({
    pronouns: new FormControl<string>('',{
      nonNullable: true,
      validators: [Validators.required],
    }),
    profileText: new FormControl<string>('',{
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
    if(this.form.valid){
      const updateData: UpdateProfileBody  = {
        pronouns: this.form.controls.pronouns.value !== undefined ? this.form.controls.pronouns.value : '',
        profileText: this.form.controls.profileText.value !== undefined ? this.form.controls.profileText.value : '',
      }
      console.log(updateData);
      this.userService.updateProfileInformation(updateData).subscribe({
        next: () => {
          this.fetchData();
          this.toggleEditMode();
          console.log('update ging durch')
        },
        error: (err: Error)=>{
          this.messageService.add({
            severity: 'error',
            detail: err.message,
          })
          console.error(err);
        }
      })
    }

  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }
}
