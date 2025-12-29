import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Permission {
  user: {
    _id: string;
    name: string;
    email: string;
  };
  access: 'read' | 'write' | 'admin';
  _id: string;
}

export interface Document {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  owner: {
    _id: string;
    name: string;
    email: string;
  };
  versions: any[];
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = `${environment.apiUrl}/documents`;

  constructor(private http: HttpClient) { }

  getDocuments(search?: string, tags?: string, owner?: string): Observable<any> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    if (tags) params = params.set('tags', tags);
    if (owner) params = params.set('owner', owner);

    return this.http.get(this.apiUrl, { params });
  }

  getDocument(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  uploadDocument(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }

  uploadNewVersion(id: string, formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/versions`, formData);
  }

  shareDocument(id: string, email: string, access: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/share`, { email, access });
  }

  downloadVersion(docId: string, versionId: string): string {
    return `${this.apiUrl}/${docId}/versions/${versionId}/download`;
  }

  updateDocument(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteDocument(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  deleteAllDocuments(): Observable<any> {
    return this.http.delete(this.apiUrl);
  }
}
