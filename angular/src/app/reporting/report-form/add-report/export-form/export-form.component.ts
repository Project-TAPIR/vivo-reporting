import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {StepperDataService} from "../../../services/stepper-data.service";
import {Report} from "../../../models/report";
import {Select} from "../../../models/select";
import {Construct} from "../../../models/construct";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import * as XLSX from 'xlsx';
import {FileUtils} from "../../../utils/FileUtils";
import {SUPPPORTED_CONTENT_TYPES} from "../../../models/SupportedContentTypes";
import * as JSZip from "jszip";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";

@Component({
  selector: 'report-export-form',
  templateUrl: './export-form.component.html',
  styleUrls: ['./export-form.component.css']
})
export class ExportFormComponent implements OnInit {
  exportForm!: FormGroup;
  private name: string = '';
  private description: string = '';
  public constructQueries: Construct[] = [];
  public selectQueries: Select[] = [];
  public template: string = '';
  tableHeaders: any = [];
  tableData: any[] = [];
  templateContent: any = '';

  public constructColumns: string[] = ['name', 'description', 'constructQuery'];
  public selectColumns: string[] = ['name', 'description', 'selectQuery', 'construct'];

  @Input() showGraph = true;
  @Output() reportNameChange = new EventEmitter<string>();
  @Output() reportDescriptionChange = new EventEmitter<string>();

  constructor(private stepperDataService: StepperDataService,
              private formBuilder: FormBuilder,) {
    this.exportForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.stepperDataService.getData().subscribe((report: Report) => {
      this.exportForm.patchValue({
        name: report.report_generator_name,
        description: report.report_generator_description
      });

      this.selectColumns.splice(3, 1);
      this.constructQueries = this.showGraph ? report.construct_queries : [];
      this.selectQueries = report.select_queries || [];
      this.template = report.template || '';
      this.loadTemplateData(report.template);
    });

    this.exportForm.get('name')?.valueChanges.subscribe(value => {
      this.reportNameChange.emit(value);
    });

    this.exportForm.get('description')?.valueChanges.subscribe(value => {
      this.reportDescriptionChange.emit(value);
    });
  }

  async loadTemplateData(templateBase64: string) {
    const blob = FileUtils.base64ToBlob(templateBase64);
    const contentType = await FileUtils.getContentTypeFromZip(blob);
    console.log(contentType);
    if (contentType === SUPPPORTED_CONTENT_TYPES.Xlsx) {
      this.templateContent = this.loadXlsxTemplate(templateBase64);
      return;
    }
    if (contentType === SUPPPORTED_CONTENT_TYPES.Docx) {
      this.templateContent = await this.loadDocxTemplate(templateBase64);
      return;
    }
    else {
      this.templateContent = "Unknown template format found";
      return;
    }
  }

  loadXlsxTemplate(xlsxTemplate: string): any[] {
    const arrayBuffer = FileUtils.base64ToArrayBuffer(xlsxTemplate);

    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonSheet = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    this.tableHeaders = jsonSheet[0];
    return this.tableHeaders.join(", ");
  }

  async loadDocxTemplate(docxTemplate: string) {
    const arrayBuffer = FileUtils.base64ToArrayBuffer(docxTemplate);
    const zip = new PizZip(arrayBuffer);

    const doc = new Docxtemplater(zip);

    return doc.getFullText();
  }

}
