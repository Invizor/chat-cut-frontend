import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { ChatGuard } from './app-routing/guards-activate/chat-guards';
import { AuthorizationGuard } from './app-routing/guards-activate/authorization-guards';
import { RegistrationGuard } from './app-routing/guards-activate/registration-guards';

import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';
import { MessageService } from './services/message.service';
import { ThreadService } from './services/thread.service';
import { ListCommaCurrentField } from './pipe/list-comma.pipe';
import { ListCommaEqualField } from './pipe/list-comma-equal.pipi';
import { DateTimeFormat } from './pipe/date-time-format.pipe';

import { AppComponent } from './app.component';
import { ChatComponent } from './components/chat/chat.component';
import { AuthorizationComponent } from './components/authorization/authorization.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { CustomValidators } from './validators/validators';
import { SuccessIconComponent } from './components/common/success-icon/success-icon.component';
import { ModalNewThreadComponent } from './components/chat/modal-new-thread/modal-new-thread.component';

import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
} from '@angular/material';

@NgModule({
  exports: [
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
  ]
})
export class MaterialModule {}


@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    AuthorizationComponent,
    RegistrationComponent,
    SuccessIconComponent,
    ModalNewThreadComponent,
    ListCommaCurrentField,
    ListCommaEqualField,
    DateTimeFormat
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [
    ChatGuard,
    AuthorizationGuard,
    RegistrationGuard,
    ApiService,
    AuthService,
    ThreadService,
    MessageService,
    CustomValidators
  ],
  bootstrap: [AppComponent],
  entryComponents: [ModalNewThreadComponent]
})
export class AppModule { }
