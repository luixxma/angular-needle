import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { AnimationClip, AnimationMixer, Object3D } from 'three';
// import { VRM, VRMLoader } from 'three-vrm';
import { VRM, VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export class Anim {
    name: string;
    url: string;
    animClip: AnimationClip;
    constructor(name: string, url: string) {
        this.name = name;
        this.url = url;
    }
}

@Injectable()
export class RenderService {

    scene = new THREE.Scene();
    camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
    renderer: THREE.WebGLRenderer;

    controls: OrbitControls;

    vrm: VRM;
    vrmModel: Object3D;
    mixerVrm: AnimationMixer;

    clock = new THREE.Clock();

    init() {
        this.repaint();
    }

    async loadAvatar(): Promise<Object3D> {

        const gltfLoader: GLTFLoader = new GLTFLoader();
        gltfLoader.register((parser) => new VRMLoaderPlugin(parser));

        const vrm: GLTF = await gltfLoader.loadAsync('../assets/masc_vroid.vrm');
        this.vrm = vrm.userData.vrm;

        // Improve performance
        VRMUtils.removeUnnecessaryVertices(this.vrm.scene);
        VRMUtils.removeUnnecessaryJoints(this.vrm.scene);

        // rotate if the VRM is VRM0.0
        VRMUtils.rotateVRM0(this.vrm);

        this.vrmModel = this.vrm.scene;
        this.vrmModel.position.y += 0.10;
        this.mixerVrm = new AnimationMixer(this.vrmModel);

        this.scene.add(this.vrmModel);

        return this.vrmModel;
    }

    repaint = () => {
        requestAnimationFrame(this.repaint);

        var delta = this.clock.getDelta();

        if (this.mixerVrm)
            this.mixerVrm.update(delta);

        // this.renderer.render(this.scene, this.camera);
    }

    onResize() {

        if (this.camera) {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
        }
        if (this.renderer) {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }

    }
}
