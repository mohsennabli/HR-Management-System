import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DatePipe } from '@angular/common';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MenubarModule } from 'primeng/menubar';
import { ChartModule } from 'primeng/chart';
import { ProgressBarModule } from 'primeng/progressbar';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { TooltipModule } from 'primeng/tooltip';
import { BreadcrumbModule } from 'primeng/breadcrumb';

// Auth & Guards
import { LoginModule } from 'src/app/core/features/components/login/login.module';
import { AuthInterceptor } from 'src/app/interceptors/auth.interceptor';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { MessageService } from 'primeng/api';
import { SumPipe } from './pipes/sum.pipe';

@NgModule({
  declarations: [
    AppComponent,
    SumPipe,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    // PrimeNG Modules
    ButtonModule,
    RippleModule,
    InputTextModule,
    ToastModule,
    MenubarModule,
    ChartModule,
    ProgressBarModule,
    MessageModule,
    PasswordModule,
    TooltipModule,
    BreadcrumbModule,
    // Feature Modules
    LoginModule
  ],
  providers: [
    DatePipe,
    AuthGuard,
    MessageService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
