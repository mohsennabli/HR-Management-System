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
    AppRoutingModule
  ],
  providers: [
    DatePipe,
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
