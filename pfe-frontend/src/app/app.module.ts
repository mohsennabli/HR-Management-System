import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SumPipe } from './pipes/sum.pipe';
import { DatePipe } from '@angular/common';

// 🔥 Auth
import { LoginComponent } from 'src/app/core/features/components/login/login.component';

// ✅ Interceptor & Guard
import { AuthInterceptor } from 'src/app/interceptors/auth.interceptor';
import { AuthGuard } from 'src/app/guards/auth.guard';


// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { MenubarModule } from 'primeng/menubar';
import { ChartModule } from 'primeng/chart';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputTextModule } from 'primeng/inputtext';
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
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
     ButtonModule,
    RippleModule,
    MenubarModule,
     ChartModule,
    ProgressBarModule,
    InputTextModule,
    MessageModule,
    PasswordModule,
  ],
  providers: [
    DatePipe,
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
