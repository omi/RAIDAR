import { Directive, Input } from "@angular/core";

import { NgControl } from "@angular/forms";

@Directive({
  selector: "[disableControl]",
})
export class DisableControlDirective {
  appDisable: string;
  @Input("disableControl") set disableControl(condition: boolean) {
    const action = condition ? "disable" : "enable";
    setTimeout(() => {
      this.ngControl.control[action]();
    });
  }
  constructor(private ngControl: NgControl) {}
}
