import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: "",
        loadChildren: () => import("./threed-wrapper/threed-wrapper.module").then(m => m.ThreedWrapperModule),
        data: { revalidate: 240000 },
    },
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {

}