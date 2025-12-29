import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DocumentService } from '../../services/document.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload-document',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './upload-document.html',
  styleUrls: ['./upload-document.css']
})
export class UploadDocumentComponent {
  uploadForm: FormGroup;
  selectedFile: File | null = null;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private documentService: DocumentService,
    private router: Router
  ) {
    this.uploadForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: [''],
      tags: [''],
      file: [null, Validators.required]
    });
  }

  get f() { return this.uploadForm.controls; }

  onFileSelect(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.selectedFile = file;
      // Update form control value just for validation
      this.uploadForm.patchValue({
        file: file
      });
    }
  }

  onSubmit() {
    this.submitted = true;
    this.error = '';

    if (this.uploadForm.invalid) {
      return;
    }

    this.loading = true;
    const formData = new FormData();
    formData.append('file', this.selectedFile!);
    formData.append('title', this.uploadForm.get('title')?.value);
    formData.append('description', this.uploadForm.get('description')?.value);
    formData.append('tags', this.uploadForm.get('tags')?.value);

    this.documentService.uploadDocument(formData)
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.error = err.error?.message || 'Upload failed';
          this.loading = false;
        }
      });
  }
}
