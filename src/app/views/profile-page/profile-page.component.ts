import { Component, OnInit } from '@angular/core';
import { Button } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { ActivatedRoute } from '@angular/router';
import { ProfileData } from '../../interfaces/ProfileData';
import {
  UpdateProfileBody,
  UserService,
} from '../../services/user/user.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { map } from 'rxjs/operators';
import { TagModule } from 'primeng/tag';
import { ChipsModule } from 'primeng/chips';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TagService } from '../../services/tags/tag.service';

type editProfileForm = FormGroup<{
  pronouns: FormControl<string>;
  profileText: FormControl<string>;
  tags: FormControl<string[]>;
}>;

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    CardModule,
    AngularRemixIconComponent,
    AsyncPipe,
    FormsModule,
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    InputTextareaModule,
    Button,
    DropdownModule,
    TranslocoPipe,
    TagModule,
    ChipsModule,
    AutoCompleteModule,
  ],
  providers: [UserService, MessageService, TranslocoService, TagService],
  templateUrl: './profile-page.component.html',
})
export class ProfilePageComponent implements OnInit {
  protected userId!: string;
  protected tags: string[] = [];
  protected profileData$!: Observable<ProfileData>;
  protected editMode: boolean = false;
  protected isUser!: boolean | undefined;
  max = 50;
  results: string[] = [];

  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute,
    private userService: UserService,
    private tagService: TagService
  ) {}

  form: editProfileForm = new FormGroup({
    pronouns: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    tags: new FormControl<string[]>(this.tags, { nonNullable: true }),
    profileText: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id') || '';
    this.fetchData();
  }

  fetchData(): void {
    this.profileData$ = this.userService.getSpecificUserData(this.userId).pipe(
      map(data => {
        this.isUser = data.isUser;
        this.form.patchValue({
          pronouns: data.pronouns || '',
          profileText: data.profileText || '',
          tags: data.tags || [],
        });
        return data;
      }),
    );
  }

  submitEdit() {
    const updateData: Partial<UpdateProfileBody> = {};

    if (this.form.controls.pronouns.value !== undefined) {
      updateData.pronouns =
        this.form.controls.pronouns.value.trim() || undefined;
    }

    if (this.form.controls.profileText.value !== undefined) {
      updateData.profileText =
        this.form.controls.profileText.value.trim() || undefined;
    }

    updateData.tags = this.tags;

    this.userService.updateProfileInformation(updateData).subscribe({
      next: () => {
        this.fetchData();
        this.toggleEditMode();
        this.form.reset();
      },
      error: (err: Error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Update Fehler',
          detail: err.message || 'Ein Fehler ist aufgetreten.',
        });
        console.error('Update Fehler:', err);
      },
    });
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }

  search(event: any): void {
    const query = event.query;
    this.tagService.getAllTags(query).subscribe({
      next: tags => {
        this.results = tags;
      },
      error: err => {
        console.error('Error fetching tags:', err);
        this.results = [];
      },
    });
  }

  onKeyUp(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();

      let tokenInput = event.target as HTMLInputElement;
      if (tokenInput.value) {
        this.tags.push(tokenInput.value);
        tokenInput.value = '';
        this.form.controls.tags.setValue(this.tags);
      }
    }
  }
}
