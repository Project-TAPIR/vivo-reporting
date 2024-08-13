import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Report } from '../models/report';
import {Construct} from "../models/construct";
import {Select} from "../models/select";

@Injectable({
  providedIn: 'root',
})
export class StepperDataService {
  private report: Report = {} as Report;
  private dataChange = new BehaviorSubject<Report>({} as any);

  public setConstructForm(constructs: Construct[]) {
    this.report = { ...this.report, construct_queries: constructs };
    this.dataChange.next(this.report);
  }

  public getConstructForm(): Construct[] {
    return this.report.construct_queries || [];
  }

  public removeSelectsByConstruct(constructName: string) {
    const updatedSelects = this.getSelectForm().filter(select => select.graph !== constructName);
    this.setSelectForm(updatedSelects);
  }

  public setSelectForm(selects: Select[]) {
    this.report = { ...this.report, select_queries: selects };
    this.dataChange.next(this.report);
  }

  public getSelectForm(): Select[] {
    return this.report.select_queries || [];
  }

  public setTemplateForm(template: string) {
    this.report = { ...this.report, template };
    this.dataChange.next(this.report);
  }

  public getTemplateForm(): string {
    return this.report.template || '';
  }

  public setReportName(name: string) {
    this.report = { ...this.report, report_generator_name: name};
  }

  public getReportName(): string {
    return this.report.report_generator_name || '';
  }

  public setReportDescription(description: string) {
    this.report = { ...this.report, report_generator_description: description};
  }

  public getReportDescription(): string {
    return this.report.report_generator_description || '';
  }

  public setData(data: any) {
    this.report = { ...this.report, ...data };
    this.dataChange.next(this.report);
  }

  public getData(): Observable<Report> {
    return this.dataChange.asObservable();
  }
}
