import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { StepperDataService } from 'src/app/reporting/services/stepper-data.service';
import {Construct} from "../../../models/construct";
import {ConfirmDialogComponent} from "../../../common/confirm-dialog/confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'report-construct-form',
  templateUrl: './construct-form.component.html',
  styleUrls: ['./construct-form.component.css'],
})
export class ConstructFormComponent implements OnInit {
  modelForm!: FormGroup;
  displayedColumns: string[] = ['name', 'description','action'];
  toggleOn!: boolean;
  dataSource = new MatTableDataSource<any>([]);
  selectedRowIndex = -1;
  edited!: boolean;
  constructs: Construct[] = [];

  private tempConstruct: any;

  @Input() showStep = true;
  @Output() constructAdded = new EventEmitter<Construct[]>();
  @Output() public toggleControler = new EventEmitter<boolean>();

  constructor(
    private formBuilder: FormBuilder,
    private stepperDataService: StepperDataService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.modelForm = this.formBuilder.group({
      name: ['',Validators.required],
      description: [''],
      constructQuery: ['', Validators.required],
    },
      {updateOn: "blur"})

  }

  highlight(row: any) {
    this.selectedRowIndex = row.id;
  }

  deleteGraph(name: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete the construct "${name}"? All associated selects will also be removed.`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.constructs = this.constructs.filter((r) => r.name !== name);
        this.dataSource.data = this.dataSource.data.filter((r) => r.name !== name);
        this.stepperDataService.setConstructForm(this.constructs);
        this.stepperDataService.removeSelectsByConstruct(name);
      }
    });
  }

  editGraph(name: string) {
    this.toggleInstructions(this.toggleOn);
    let object = this.dataSource.data.find((r) => r.name === name);

    if (object) {
      this.tempConstruct = { ...object };
      this.modelForm.setValue(object);
      this.edited = true;
    }
  }

  onSubmit() {
    if (!this.modelForm.valid)
      return;

    const newConstruct = this.modelForm.value;

    const existingIndex = this.tempConstruct
      ? this.dataSource.data.findIndex((row) => row.name === this.tempConstruct.name)
      : -1;

    if (existingIndex !== -1) {
      this.dataSource.data[existingIndex] = this.modelForm.value;
      this.constructs[existingIndex] = this.modelForm.value;
    } else {
      this.dataSource.data = [...this.dataSource.data, newConstruct];
      this.constructs = [...this.constructs, newConstruct];
    }

    this.tempConstruct = null;
    this.stepperDataService.setConstructForm(this.constructs);
    this.toggleInstructions(this.toggleOn);
    this.modelForm.reset({
      description: ''
    });
  }

  toggleInstructions(event: any) {
    this.toggleOn = !this.toggleOn;
    this.toggleControler.emit(!this.toggleOn);

    if (!this.toggleOn && this.tempConstruct) {
      const existingIndex = this.dataSource.data.findIndex(
        (row) => row.name === this.tempConstruct.name
      );

      if (existingIndex === -1) {
        this.dataSource.data.push(this.tempConstruct);
      }

      this.tempConstruct = null;
    }

    this.modelForm.reset({
      description: ''
    });
  }

  getErrorMessage(formControl: string): string {
    const control = this.modelForm.controls[formControl];
    return `${formControl.charAt(0).toUpperCase() + formControl.slice(1)} is required`;
  }

}
