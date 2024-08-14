import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { StepperDataService } from 'src/app/reporting/services/stepper-data.service';
import { Subscription } from 'rxjs';
import {Select} from "../../../models/select";
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponent} from "../../../common/confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'report-select-form',
  templateUrl: './select-form.component.html',
  styleUrls: ['./select-form.component.css']
})
export class SelectFormComponent implements OnInit {
  selectQueryForm!: FormGroup;
  array!: any[];
  toggleOn!: boolean;
  edited!: boolean;
  displayedColumns: string[] = ['name', 'description', 'graph','action'] ;
  selectedRowIndex = -1;
  dataSource = new MatTableDataSource<any>([]);
  private subscription!: Subscription;
  selects: Select[] = [];

  private tempSelect: any;

  @Input() showGraph = true;
  @Output() selectAdded = new EventEmitter<Select[]>();
  @Output() public toggleControler = new EventEmitter<boolean>();

  constructor(private formBuilder: FormBuilder,
              private stepperDataService: StepperDataService,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.selectQueryForm = this.formBuilder.group({
          name: [''],
          description: ['',Validators.pattern('[A-Za-z \-\_]+')],
          selectQuery: [''],
          graph: [''],
    },
    {updateOn: "blur"})

    if (!this.showGraph) {
      this.displayedColumns.splice(2, 1);
    }

    this.subscribe();
  }

  subscribe(): void {
    this.subscription = this.stepperDataService.getData().subscribe((data: any) => {
      this.array = this.stepperDataService.getConstructForm();
      this.dataSource.data = this.stepperDataService.getSelectForm();
    })
  }

  highlight(row: any) {
    this.selectedRowIndex = row.id;
  }

  remove(name: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete the select ${name}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selects = this.selects.filter((r) => r.name !== name);
        this.dataSource.data = this.dataSource.data.filter((r) => r.name !== name);
        this.stepperDataService.setSelectForm(this.selects);
      }
    })
  }

  edit(name: string) {
    this.toggleInstructions(this.toggleOn);
    let object = this.dataSource.data.find((r) => r.name === name);

    if (object) {
      this.tempSelect = { ...object };
      this.selectQueryForm.setValue(object);
      this.edited = true;
    }

  }

  onSubmit() {
    if (!this.selectQueryForm.valid) {
      return;
    }

    const newSelect = this.selectQueryForm.value;

    const existingIndex = this.tempSelect
      ? this.dataSource.data.findIndex((row) => row.name === this.tempSelect.name)
      : -1;

    if (existingIndex !== -1) {
      this.dataSource.data[existingIndex] = this.selectQueryForm.value;
      this.selects[existingIndex] = this.selectQueryForm.value;
    } else {
      this.dataSource.data = [...this.dataSource.data, newSelect];
      this.selects = [...this.selects, newSelect];
    }

    this.tempSelect = null;
    this.stepperDataService.setSelectForm(this.selects);
    this.toggleInstructions(this.toggleOn);
    this.selectQueryForm.reset();
  }

  toggleInstructions(event: any) {
    this.toggleOn = !this.toggleOn;
    this.toggleControler.emit(!this.toggleOn);

    if (!this.toggleOn && this.tempSelect) {
      const existingIndex = this.dataSource.data.findIndex(
        (row) => row.name === this.tempSelect.name
      );

      if (existingIndex === -1) {
        this.dataSource.data.push(this.tempSelect);
      }

      this.tempSelect = null;
    }

    this.selectQueryForm.reset({
      description: '',
      graph: 'https://vivoweb.org/ontology/vitro-dynamic-api/model/full_union'
    });
  }

}
