import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportFormComponent } from './report-form/report-form.component';

import { MaterialModule } from '../material.module';
import { ConstructFormComponent } from './report-form/add-report/construct-form/construct-form.component';
import { SelectFormComponent } from './report-form/add-report/select-form/select-form.component';
import { TemplateFormComponent } from './report-form/add-report/template-form/template-form.component';
import { ExportFormComponent } from './report-form/add-report/export-form/export-form.component';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SubsetsRoutingModule } from './reporting-routing.module';
import { HomeComponent } from './home/home.component';
import { ListComponent } from "./list";
import { MaterialFileUploaderComponent } from '../material-file-uploader/material-file-uploader.component';
import {DragAndDrop} from "../drag-and-drop/drag-and-drop";
import { ConfirmDialogComponent } from './common/confirm-dialog/confirm-dialog.component';
import { FaqComponent } from './common/faq/faq.component';
import { MenuComponent } from './common/menu/menu.component';
import {CodeEditor} from "@acrodata/code-editor";

import {SparqlEditorAreaComponent} from "./common/sparql-editor-area/sparql-editor-area.component";
import {MatTooltip} from "@angular/material/tooltip";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";

@NgModule({
  declarations: [
    ReportFormComponent,
    SelectFormComponent,
    ConstructFormComponent,
    TemplateFormComponent,
    ExportFormComponent,
    HomeComponent,
    ListComponent,
    MaterialFileUploaderComponent,
    DragAndDrop,
    ConfirmDialogComponent,
    FaqComponent,
    MenuComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    SubsetsRoutingModule,
    FormsModule,
    CodeEditor,
    SparqlEditorAreaComponent,
    MatTooltip,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger
  ],
})
export class ReportingModule {
}
