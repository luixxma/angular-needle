import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ThreedWrapperComponent } from "./threed-wrapper.component";

const routes: Routes = [
    { path: "", component: ThreedWrapperComponent, data: { revalidate: 240000 } }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ThreeDWrapperRoutingModule { }
