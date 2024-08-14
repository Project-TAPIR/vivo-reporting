import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {first} from 'rxjs';
import {Report} from '../models/report';
import {ReportService} from '../services/report.service';
import {UpdReport} from "../models/updReport";
import {ConfirmDialogComponent} from "../common/confirm-dialog/confirm-dialog.component";
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from "@angular/material/snack-bar";
import * as JSZip from "jszip";
import mime from 'mime';
import {SUPPPORTED_CONTENT_TYPES} from "../models/SupportedContentTypes";

interface ApiResponse {
  reports: UpdReport[];
}

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['name', 'description', 'action'];
  report!: Report[];
  selectedRowIndex = -1;

  dataSource = new MatTableDataSource<UpdReport>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private reportService: ReportService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.reportService.getAll().subscribe((response: ApiResponse) => {
      this.dataSource.data = response.reports;
      console.log(this.dataSource.data);
    })
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  deleteReport(resourceId: string) {
    this.reportService
      .delete(btoa(resourceId))
      .pipe(first())
      .subscribe(() => {
        this.dataSource.data = this.dataSource.data.filter(
          (r) => r.resource_id.value !== resourceId
        );
      });
  }

  confirmDelete(resourceId: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete report?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteReport(resourceId);
      }
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onloadend = () => {
        if (reader.result) {
          this.importReport(reader.result.toString());
        } else {
          console.error('File reading failed. reader.result is null.');
        }
      }
    }
  }

  importReport(configurationGraph: string): void {
    this.reportService.import(configurationGraph)
      .pipe(first())
      .subscribe({
        next: () => {
          this.getData();
          this.showSnackBar('Success: Report configuration imported successfully!', 'success');
        },
        error: () => {
          this.showSnackBar('Error: Config file is not correct.', 'error');
        }
      });
  }

  public showSnackBar(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Close', {
      verticalPosition: 'top',
    });
  }

  async downloadReport(resourceId: string) {
    this.reportService.execute(resourceId).subscribe(async (response) => {
      const base64Data = response.report;
      const blob = this.base64ToBlob(base64Data);
      const contentType = await this.getContentTypeFromZip(blob);
      this.triggerDownload(blob, `report.${contentType}`)
    });
  }

  downloadConfig(resourceId: string) {
    this.reportService.export(resourceId).subscribe((response) => {
      const configGraph = response.report_generator_configuration_graph;
      const contentType = mime.getType(SUPPPORTED_CONTENT_TYPES.N3) as string;
      const blob = new Blob([configGraph], {type: contentType});
      this.triggerDownload(blob, `config.${SUPPPORTED_CONTENT_TYPES.N3}`)
    })
  }

  async getContentTypeFromZip(file: Blob) {
    const zip = new JSZip();
    const content = await zip.loadAsync(file);
    const contentTypesFile = content.files['[Content_Types].xml'];
    const xmlText = await contentTypesFile.async('text');
    if (xmlText.includes(mime.getType(SUPPPORTED_CONTENT_TYPES.Docx) as string)) {
      return SUPPPORTED_CONTENT_TYPES.Docx;
    }
    if (xmlText.includes(mime.getType(SUPPPORTED_CONTENT_TYPES.Xlsx) as string)) {
      return SUPPPORTED_CONTENT_TYPES.Xlsx;
    }
    else return SUPPPORTED_CONTENT_TYPES.Zip;
  }

  base64ToBlob(base64: string) {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays);
  }

  triggerDownload(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  highlight(row: any) {
    this.selectedRowIndex = row.id;
  }
}
