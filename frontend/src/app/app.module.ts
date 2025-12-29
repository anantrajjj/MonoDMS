import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { Dashboard } from './components/dashboard/dashboard';
import { UploadDocumentComponent } from './components/upload-document/upload-document';
import { DocumentDetailComponent } from './components/document-detail/document-detail';
import { AuthInterceptor } from './auth.interceptor';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard] },
  { path: 'upload', component: UploadDocumentComponent, canActivate: [AuthGuard] },
  { path: 'documents/:id', component: DocumentDetailComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    LoginComponent,
    RegisterComponent,
    Dashboard,
    UploadDocumentComponent,
    DocumentDetailComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
