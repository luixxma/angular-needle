import { AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, ViewChild } from '@angular/core';
import '@needle-tools/engine';
import { VRM, VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';
import * as THREE from 'three';
import { AnimationMixer, Object3D } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

@Component({
    standalone: true,
    selector: 'app-threed',
    templateUrl: './threed.component.html',
    styleUrls: ['./threed.component.scss'],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ThreeDComponent implements AfterViewInit {

    @ViewChild("needleEngineCanvas") needleEngineCanvas: ElementRef<HTMLElement>;

    scene = new THREE.Scene();
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;

    controls: OrbitControls;

    vrm: VRM;
    vrmModel: Object3D;
    mixerVrm: AnimationMixer;

    clock = new THREE.Clock();

    constructor(
    ) {
    }

    ngAfterViewInit() {
        this.needleEngineCanvas.nativeElement.addEventListener("loadfinished", async (ev: any) => {
            console.log(ev.detail.context)

            this.renderer = ev.detail.context.renderer;
            this.scene = ev.detail.context.scene;
            this.camera = ev.detail.context.camera;
            this.controls = ev.detail.context.mainCamera.userData.components[2].controls;

            this.loadAvatar();
        });
    }

    async loadAvatar(): Promise<Object3D> {

        const gltfLoader: GLTFLoader = new GLTFLoader();
        gltfLoader.register((parser) => new VRMLoaderPlugin(parser));

        const vrm: GLTF = await gltfLoader.loadAsync('../assets/masc_vroid.vrm');
        this.vrm = vrm.userData.vrm;

        // Improve performance
        VRMUtils.removeUnnecessaryVertices(this.vrm.scene);
        VRMUtils.removeUnnecessaryJoints(this.vrm.scene);

        // // rotate if the VRM is VRM0.0
        // VRMUtils.rotateVRM0(this.vrm);

        this.vrmModel = this.vrm.scene;
        this.vrmModel.position.copy(new THREE.Vector3(0, 0, 0));
        this.mixerVrm = new AnimationMixer(this.vrmModel);

        this.scene.add(this.vrmModel);

        this.controls.target = new THREE.Vector3(0, 0, 0);

        return this.vrmModel;
    }

}
