import { HttpClient } from '@angular/common/http';
import { Report } from '../models/report';
import { Injectable } from '@angular/core';
import {ApiResponse} from "../models/apiresponse";

@Injectable({ providedIn: 'root' })
export class ReportService {
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<ApiResponse>(this.getBaseUrl());
  }

  getById(id: string) {
    return this.http.get<Report>(this.getBaseUrl() + `/resource:${id}`);
  }

  create(params: any) {
    let body = {
      template: params.template,
      select_queries: params.select_queries,
      construct_queries: params.construct_queries || [],
      report_generator_description: params.report_generator_description,
      report_generator_name: params.report_generator_name
    };

    return this.http.post(
      this.getBaseUrl(),
      body,
    );
  }

  update(id: string, params: any) {
    return this.http.put(this.getBaseUrl() + `/${id}`, params);
  }

  delete(id: string) {
    return this.http.delete(this.getBaseUrl() + `/resource:${id}`);
  }

  download(id: string) {
    let body = {
      id: id
    };

    return this.http.post(
      this.getBaseUrl(),
      body,
    );
  }

  import(settings: string) {
    let body = {
      report_generator_configuration_graph: settings,
    };

    return this.http.post(
      this.getBaseUrl() + '/import_report_generator',
      body,
    );
  }

  export(id: string) {
    let body = {
      resource_id: id,
    };

    return this.http.post<{report_generator_configuration_graph: string}>(
      this.getBaseUrl() + '/export_report_generator',
      body,
    );
  }

  execute(id: string) {
    let body = {
      resource_id: id,
    };

    return this.http.post<{report: string}>(
      this.getBaseUrl() + '/execute_report_generator',
      body,
    );
  }

  getBaseUrl() {
     return window.location.protocol + "//" + window.location.host + "/" + window.location.pathname.split('/')[1] + '/api/rest/1/report_generator';
  }
}
