import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {StepperDataService} from "../../../services/stepper-data.service";
import {Report} from "../../../models/report";
import {Select} from "../../../models/select";
import {Construct} from "../../../models/construct";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import * as XLSX from 'xlsx';

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

  loadTemplateData(templateBase64: string) {
    const binaryString = atob(templateBase64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const arrayBuffer = bytes.buffer;

    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonSheet = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    this.tableHeaders = jsonSheet[0];
    this.tableData = jsonSheet.slice(1);
  }
}
