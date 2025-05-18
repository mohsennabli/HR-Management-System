import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthInterceptor } from 'src/app/interceptors/auth.interceptor';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { SumPipe } from './pipes/sum.pipe';
import { DatePipe } from '@angular/common';

// 🔥 Auth
import { LoginComponent } from 'src/app/core/features/components/login/login.component';

// ✅ Interceptor & Guard
import { AuthInterceptor as OldAuthInterceptor } from 'src/app/interceptors/auth.interceptor';
import { AuthGuard as OldAuthGuard } from 'src/app/guards/auth.guard';

// PrimeNG Modules
import { MenubarModule } from 'primeng/menubar';
import { ChartModule } from 'primeng/chart';
import { ProgressBarModule } from 'primeng/progressbar';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';

@NgModule({
  declarations: [
    AppComponent,
    SumPipe,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    ButtonModule,
    RippleModule,
    InputTextModule,
    ToastModule,
    MenubarModule,
    ChartModule,
    ProgressBarModule,
    MessageModule,
    PasswordModule,
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
