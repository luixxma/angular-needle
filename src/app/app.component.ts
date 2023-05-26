import { AfterViewInit, Component, HostListener } from '@angular/core';
import * as THREE from 'three';
import { RenderService } from './render.service';
import * as NEEDLE from '@needle-tools/engine';
import '@needle-tools/engine';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

    constructor(private renderService: RenderService) {
    }

    ngAfterViewInit() {
        const needleEngine = document.querySelector("needle-engine");
        needleEngine.addEventListener("loadfinished", async (ev: any) => {
            console.log(ev.detail.context)
            const context: NEEDLE.Context = ev.detail.context;
            console.log("ALO PRESIDENTE", context);

            this.renderService.renderer = ev.detail.context.renderer;
            this.renderService.scene = ev.detail.context.scene;
            this.renderService.camera = ev.detail.context.camera;
            this.renderService.controls = ev.detail.context.mainCamera.userData.components[2].controls;
            this.renderService.controls.target = new THREE.Vector3(0, 0, 0);

            const vrm = await this.renderService.loadAvatar();
            this.renderService.controls.target = vrm.position;
        });
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: Event) {
        this.renderService.onResize();
    }

}
