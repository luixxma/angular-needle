import { Directive, ViewContainerRef } from "@angular/core";

@Directive({
    selector: "[appThreedViewerHost]"
})
export class ThreedViewerHostDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
}