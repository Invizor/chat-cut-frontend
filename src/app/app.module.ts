import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { ChatGuard } from './app-routing/guards-activate/chat-guards';
import { AuthorizationGuard } from './app-routing/guards-activate/authorization-guards';
import { RegistrationGuard } from './app-routing/guards-activate/registration-guards';
import { UserSettingsGuard } from './app-routing/guards-activate/user-settings-guards';

import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';
import { MessageService } from './services/message.service';
import { ThreadService } from './services/thread.service';
import {ImageService} from './services/image.service';
import { ListCommaCurrentField } from './pipe/list-comma.pipe';
import { ListCommaEqualField } from './pipe/list-comma-equal.pipi';
import { DateTimeFormat } from './pipe/date-time-format.pipe';
import {PrepareTextMessage} from './pipe/prepare-text-message.pipe';
import {LastMessage} from './pipe/last-message.pipe';
import {SortThreadByLastMessage} from './pipe/sort-thread-by-last-message';

import { AppComponent } from './app.component';
import { ChatComponent } from './components/chat/chat.component';
import { AuthorizationComponent } from './components/authorization/authorization.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { CustomValidators } from './validators/validators';
import { SuccessIconComponent } from './components/common/success-icon/success-icon.component';
import { ModalNewThreadComponent } from './components/chat/modal-new-thread/modal-new-thread.component';
import { UserSettingsComponent } from './components/user-settings/user-settings';

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
    UserSettingsComponent,
    ListCommaCurrentField,
    ListCommaEqualField,
    DateTimeFormat,
    PrepareTextMessage,
    LastMessage,
    SortThreadByLastMessage
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    PickerModule,
    EmojiModule
  ],
  providers: [
    ChatGuard,
    AuthorizationGuard,
    RegistrationGuard,
    UserSettingsGuard,
    ApiService,
    AuthService,
    ThreadService,
    MessageService,
    ImageService,
    CustomValidators
  ],
  bootstrap: [AppComponent],
  entryComponents: [ModalNewThreadComponent]
})
export class AppModule { }
