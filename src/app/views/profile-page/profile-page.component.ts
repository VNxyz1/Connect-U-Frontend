import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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
import {DialogModule} from 'primeng/dialog';
import {FileUploadModule} from 'primeng/fileupload';

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
    DialogModule,
    FileUploadModule,
  ],
  providers: [UserService, MessageService, TranslocoService, TagService],
  templateUrl: './profile-page.component.html',
})
export class ProfilePageComponent implements OnInit {
  protected userId!: string;
  protected profileData$!: Observable<ProfileData>;
  protected editMode: boolean = false;
  protected isUser!: boolean | undefined;
  max = 50;
  results: string[] = [];
  @ViewChild('fileInput') fileInput!: ElementRef;
  uploadedFile: File | null = null;
  uploadedImagePreview: string | null = null;

  constructor(
    private readonly messageService: MessageService,
    private readonly route: ActivatedRoute,
    private readonly userService: UserService,
    private readonly tagService: TagService,
  ) {}

  form: editProfileForm = new FormGroup({
    pronouns: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    tags: new FormControl<string[]>([], { nonNullable: true }),
    profileText: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id') ?? '';
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

    updateData.tags = this.form.controls.tags.value;

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
    const input = event.target as HTMLInputElement;
    const triggerKeys = ['Enter', ' ', ','];

    event.preventDefault();

    if (triggerKeys.includes(event.key)) {
      const tagValue = input.value.trim().replace(/,$/, '');

      if (tagValue) {
        const tagsToAdd = tagValue
          .split(' ')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0);

        const currentTags = this.form.controls.tags.value;

        const updatedTags = [...new Set([...currentTags, ...tagsToAdd])];

        this.form.controls.tags.setValue(updatedTags);

        input.value = '';
      }
    }
  }
  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }
  closeUploadDialog(): void {
    this.uploadDialogVisible = false;
    this.uploadedFile = null;
    this.uploadedImagePreview = null;
  }
  onUploadImage(): void {
    if (this.uploadedFile) {
      const formData = new FormData();
      formData.append('file', this.uploadedFile);

      this.userService.updateProfilePicture(formData).subscribe({
        next: (data) => {
          console.log(data.ok, data.message);
          this.messageService.add({
            severity: 'success',
            summary: 'Erfolg',
            detail: 'Profilbild erfolgreich hochgeladen!',
          });
          this.closeUploadDialog();
        },
        error: (err) => {
          console.error('Fehler beim Upload:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Fehler',
            detail: 'Fehler beim Hochladen des Profilbildes.',
          });
        },
      });
    }
  }


  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      if (file.size > 5242880) {
        alert('Dateigröße darf 5 MB nicht überschreiten.');
        return;
      }

      this.uploadedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.uploadedImagePreview = e.target.result;
        this.uploadDialogVisible = true;
      };
      reader.readAsDataURL(file);
    } else {
      alert('Nur Bildformate (.jpg, .png) sind erlaubt.');
    }
  }

  uploadDialogVisible:boolean=false;

}
