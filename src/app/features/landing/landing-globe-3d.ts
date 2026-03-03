import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-landing-globe-3d',
  standalone: true,
  templateUrl: './landing-globe-3d.html',
  styleUrl: './landing-globe-3d.scss',
})
export class LandingGlobe3d implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) private canvasRef!: ElementRef<
    HTMLCanvasElement
  >;

  @Input() interacting = false;

  private host = inject(ElementRef<HTMLElement>);

  private renderer?: THREE.WebGLRenderer;
  private scene?: THREE.Scene;
  private camera?: THREE.PerspectiveCamera;
  private globeMesh?: THREE.Mesh;
  private frameId?: number;
  private textureLoader = new THREE.TextureLoader();

  ngAfterViewInit(): void {
    this.initScene();
    this.animate();
    window.addEventListener('resize', this.handleResize);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.handleResize);
    if (this.frameId !== undefined) {
      cancelAnimationFrame(this.frameId);
    }
    this.renderer?.dispose();
    this.globeMesh?.geometry.dispose();
    if (Array.isArray(this.globeMesh?.material)) {
      this.globeMesh?.material.forEach((m) => m.dispose());
    } else {
      this.globeMesh?.material.dispose();
    }
  }

  private initScene(): void {
    const canvas = this.canvasRef.nativeElement;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio || 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, 3.2);

    const ambient = new THREE.AmbientLight(0x6ee7b7, 0.8);
    const rimLight = new THREE.DirectionalLight(0x22c55e, 1.1);
    rimLight.position.set(-2, 1.5, 3);
    const backLight = new THREE.DirectionalLight(0x0ea5e9, 0.7);
    backLight.position.set(2, -1.5, -2);

    scene.add(ambient);
    scene.add(rimLight);
    scene.add(backLight);

    const geometry = new THREE.SphereGeometry(1, 64, 64);

    const earthTexture = this.textureLoader.load('assets/textures/earth.jpg');

    const material = new THREE.MeshStandardMaterial({
      map: earthTexture,
      emissive: 0x22c55e,
      emissiveIntensity: 0.08,
      metalness: 0.15,
      roughness: 0.85,
    });

    const globe = new THREE.Mesh(geometry, material);
    scene.add(globe);

    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.globeMesh = globe;

    this.handleResize();
  }

  private animate = () => {
    if (!this.scene || !this.camera || !this.renderer || !this.globeMesh) {
      return;
    }

    const baseSpeed = 0.0025;
    const speed = this.interacting ? baseSpeed * 0.2 : baseSpeed;

    this.globeMesh.rotation.y += speed;
    this.globeMesh.rotation.x = 0.15;

    this.renderer.render(this.scene, this.camera);
    this.frameId = requestAnimationFrame(this.animate);
  };

  private handleResize = () => {
    if (!this.renderer || !this.camera) {
      return;
    }

    const hostElement = this.host.nativeElement;
    const rect = hostElement.getBoundingClientRect();
    const size = Math.min(rect.width, rect.height || rect.width);

    this.renderer.setSize(size, size, false);
    this.camera.aspect = 1;
    this.camera.updateProjectionMatrix();
  };
}

