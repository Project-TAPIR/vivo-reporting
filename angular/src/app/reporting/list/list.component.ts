import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { first } from 'rxjs';
import { Report } from '../models/report';
import { ReportService } from '../services/report.service';
import { UpdReport } from '../models/updReport';
import { ConfirmDialogComponent } from '../common/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as JSZip from 'jszip';
import mime from 'mime';
import { SUPPPORTED_CONTENT_TYPES } from '../models/SupportedContentTypes';
import { Router } from '@angular/router';
import { FileUtils } from '../utils/FileUtils';
import { EditReportComponent } from '../edit-report/edit-report.component';

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

  constructor(
    private reportService: ReportService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.reportService.getAll().subscribe((response: ApiResponse) => {
      this.dataSource.data = response.reports;
      console.log(this.dataSource.data);
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  startReport() {
    this.router.navigate(['/add'], { queryParams: { includeConstruct: true } });
  }

  startReportWithoutConstruct() {
    this.router.navigate(['/add'], {
      queryParams: { includeConstruct: false },
    });
  }

  deleteReport(resourceId: string) {
    this.reportService
      .delete(btoa(resourceId))
      .pipe(first())
      .subscribe(() => {
        this.dataSource.data = this.dataSource.data.filter(
          (r) => r.resource_id.value !== resourceId,
        );
      });
  }

  confirmDelete(resourceId: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete report?`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
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
      };
    }
  }

  importReport(configurationGraph: string): void {
    this.reportService
      .import(configurationGraph)
      .pipe(first())
      .subscribe({
        next: () => {
          this.getData();
          this.showSnackBar(
            'Success: Report configuration imported successfully!',
            'success',
          );
        },
        error: () => {
          this.showSnackBar('Error: Config file is not correct.', 'error');
        },
      });
  }

  public showSnackBar(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Close', {
      verticalPosition: 'top',
    });
  }

  editReport(resourceId: string) {
    const dialogRef = this.dialog.open(EditReportComponent, {
      height: '70vh',
      width: '50vh',
      data: {
        uri: resourceId,
      },
    });
  }

  async downloadReport(resourceId: string) {
    this.reportService.execute(resourceId).subscribe({
      next: async (response) => {
        const base64Data = response.report;
        const blob = FileUtils.base64ToBlob(base64Data);
        const contentType = await FileUtils.getContentTypeFromZip(blob);
        this.triggerDownload(blob, `report.${contentType}`);
        this.showSnackBar(
          'Success: Report downloaded successfully!',
          'success',
        );
      },
      error: () => {
        this.showSnackBar('Error: Failed to download the report.', 'error');
      },
    });
  }

  downloadConfig(resourceId: string) {
    this.reportService.export(resourceId).subscribe({
      next: (response) => {
        const configGraph = response.report_generator_configuration_graph;
        const contentType = mime.getType(SUPPPORTED_CONTENT_TYPES.N3) as string;
        const blob = new Blob([configGraph], { type: contentType });
        this.triggerDownload(blob, `config.${SUPPPORTED_CONTENT_TYPES.N3}`);
        this.showSnackBar(
          'Success: Config downloaded successfully!',
          'success',
        );
      },
      error: () => {
        this.showSnackBar('Error: Failed to download the config.', 'error');
      },
    });
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
