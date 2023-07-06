import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ThreedViewerHostDirective } from "./threed-viewer.host.directive";
import { ThreeDWrapperRoutingModule } from "./threed-wrapper-routing.module";
import { ThreedWrapperComponent } from "./threed-wrapper.component";

@NgModule({
    declarations: [
        ThreedWrapperComponent,
        ThreedViewerHostDirective
    ],
    imports: [
        CommonModule,
        ThreeDWrapperRoutingModule
    ],
    exports: [
    ]
})
export class ThreedWrapperModule { }
