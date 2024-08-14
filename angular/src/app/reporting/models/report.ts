import {Construct} from "./construct";
import {Select} from "./select";
import {Uri} from "./uri";

export class Report {
    uri!: Uri;
    report_generator_name!: string;
    report_generator_description!: string;
    template!: string;
    construct_queries: Construct[] = [];
    select_queries!: Select[];
}
