

import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { ThreedViewerHostDirective } from './threed-viewer.host.directive';

@Component({
    selector: 'threed-wrapper-root',
    templateUrl: './threed-wrapper.component.html'
})
export class ThreedWrapperComponent {

    isBrowser: boolean = false;
    @ViewChild(ThreedViewerHostDirective, { static: true }) threedViewerHost!: ThreedViewerHostDirective;
    threedViewerComponentRef: any;

    constructor(
        @Inject(PLATFORM_ID) private platformId: any
    ) {
        this.isBrowser = isPlatformBrowser(this.platformId)
    }

    async ngAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
            await this.loadThreedViewerComponent();
        }
    }

    async loadThreedViewerComponent() {
        import("src/app/threed-component/threed.component").then(async module => {
            const viewContainerRef = this.threedViewerHost.viewContainerRef;
            viewContainerRef.clear();
            this.threedViewerComponentRef = viewContainerRef.createComponent(module.ThreeDComponent);
        });
    }
}



