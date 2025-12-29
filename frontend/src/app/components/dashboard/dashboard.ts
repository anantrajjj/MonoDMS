import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { DocumentService, Document } from '../../services/document.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  documents: Document[] = [];
  loading = false;
  searchQuery = '';
  tagFilter = '';
  ownerFilter = '';
  currentUser: any;

  constructor(
    private documentService: DocumentService,
    private authService: AuthService,
    private router: Router
  ) {
    // Decode token to get user ID would be better, but for now we rely on what's stored
    // Ideally we should call /me to get the full user object
    this.currentUser = this.authService.currentUserValue;
  }

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments() {
    this.loading = true;
    this.documentService.getDocuments(this.searchQuery, this.tagFilter, this.ownerFilter)
      .subscribe({
        next: (res) => {
          this.documents = res.data;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });
  }

  onSearch() {
    this.loadDocuments();
  }

  clearAllDocuments() {
    if (confirm('ARE YOU SURE YOU WANT TO DELETE ALL YOUR DOCUMENTS? THIS ACTION CANNOT BE UNDONE.')) {
      this.documentService.deleteAllDocuments().subscribe({
        next: () => {
          this.loadDocuments();
        },
        error: (err) => {
          console.error(err);
          alert('Failed to clear documents');
        }
      });
    }
  }

  clearFilters() {
    this.searchQuery = '';
    this.tagFilter = '';
    this.ownerFilter = '';
    this.loadDocuments();
  }

  deleteDocument(id: string) {
    if (confirm('Are you sure you want to delete this document?')) {
      this.documentService.deleteDocument(id).subscribe(() => {
        this.documents = this.documents.filter(d => d._id !== id);
      });
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
