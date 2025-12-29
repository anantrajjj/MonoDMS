import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DocumentService, Document } from '../../services/document.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-document-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './document-detail.html',
  styleUrls: ['./document-detail.css']
})
export class DocumentDetailComponent implements OnInit {
  document: Document | null = null;
  loading = true;
  error = '';
  showUploadVersion = false;
  versionForm: FormGroup;
  shareForm: FormGroup;
  selectedFile: File | null = null;
  uploading = false;
  
  currentUser: any;
  canShare = false;
  canEdit = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private documentService: DocumentService,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    this.currentUser = this.authService.currentUserValue;
    
    this.versionForm = this.formBuilder.group({
      file: [null, Validators.required]
    });

    this.shareForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      access: ['read', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadDocument(id);
    } else {
      this.error = 'Document ID not found';
      this.loading = false;
    }
  }

  loadDocument(id: string) {
    this.loading = true;
    this.documentService.getDocument(id).subscribe({
      next: (res) => {
        this.document = res.data;
        this.checkPermissions();
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load document';
        this.loading = false;
      }
    });
  }

  checkPermissions() {
    if (!this.document || !this.currentUser) return;
    
    const isOwner = this.document.owner._id === this.currentUser._id;
    
    const userPerm = this.document.permissions.find((p: any) => p.user._id === this.currentUser._id);
    const access = userPerm ? userPerm.access : null;

    this.canShare = isOwner || access === 'admin';
    this.canEdit = isOwner || access === 'write' || access === 'admin';
  }

  onFileSelect(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.selectedFile = file;
      this.versionForm.patchValue({ file: file });
    }
  }

  toggleUploadVersion() {
    this.showUploadVersion = !this.showUploadVersion;
  }

  deleteDocument() {
    if (!this.document) return;
    
    if (confirm('ARE YOU SURE YOU WANT TO DELETE THIS DOCUMENT? THIS ACTION CANNOT BE UNDONE.')) {
      this.documentService.deleteDocument(this.document._id).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to delete document';
        }
      });
    }
  }

  onUploadVersion() {
    if (this.versionForm.invalid || !this.document) return;

    this.uploading = true;
    const formData = new FormData();
    formData.append('file', this.selectedFile!);

    this.documentService.uploadNewVersion(this.document._id, formData).subscribe({
      next: (res) => {
        this.document = res.data;
        this.uploading = false;
        this.showUploadVersion = false;
        this.versionForm.reset();
        this.selectedFile = null;
        this.checkPermissions();
      },
      error: (err) => {
        alert(err.error?.message || 'Failed to upload version');
        this.uploading = false;
      }
    });
  }

  onShare() {
    if (this.shareForm.invalid || !this.document) return;
    
    const { email, access } = this.shareForm.value;
    this.documentService.shareDocument(this.document._id, email, access).subscribe({
      next: (res) => {
        this.document = res.data;
        this.shareForm.reset({ access: 'read' });
        this.checkPermissions();
        alert('Document shared successfully');
      },
      error: (err) => alert(err.error?.message || 'Failed to share document')
    });
  }

  downloadVersion(versionId: string) {
    if (!this.document) return;
    const url = this.documentService.downloadVersion(this.document._id, versionId);
    window.open(url, '_blank');
  }
}
