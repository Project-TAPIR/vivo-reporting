import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {StepperDataService} from "../../../services/stepper-data.service";
import mime from "mime";
import {SUPPPORTED_CONTENT_TYPES} from "../../../models/SupportedContentTypes";

@Component({
  selector: 'report-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.css']
})
export class TemplateFormComponent {

  @Output() templateAdded = new EventEmitter<string>();
  @Input() fileSelected!: EventEmitter<File>;
  @Input() fileDropped!: EventEmitter<File>;

  constructor(private stepperDataService: StepperDataService) { }

  contentTypes: string = mime.getType(SUPPPORTED_CONTENT_TYPES.Docx) + ", " + mime.getType(SUPPPORTED_CONTENT_TYPES.Xlsx);

  handleFileAdded = (file:File) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const base64String = reader.result?.toString()
          .replace('data:', '')
          .replace(/^.+,/, '');
        this.templateAdded.emit(base64String);
        this.stepperDataService.setTemplateForm(base64String ?? '');
      };
  }

  handleFileRemoved() {
    this.stepperDataService.setTemplateForm("");
  }
}
