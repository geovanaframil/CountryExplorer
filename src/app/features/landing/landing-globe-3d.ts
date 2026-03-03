import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
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
  @ViewChild('canvas', { static: true }) private canvasRef!: ElementRef<HTMLCanvasElement>;

  @Input() interacting = false;
  @Output() globeInteract = new EventEmitter<void>();

  private host = inject(ElementRef<HTMLElement>);

  private renderer?: THREE.WebGLRenderer;
  private scene?: THREE.Scene;
  private camera?: THREE.PerspectiveCamera;
  private globeMesh?: THREE.Mesh;
  private frameId?: number;
  private textureLoader = new THREE.TextureLoader();

  private isDragging = false;
  private lastPointerX = 0;
  private lastPointerY = 0;

  ngAfterViewInit(): void {
    this.initScene();
    this.bindPointerEvents();
    this.animate();
    window.addEventListener('resize', this.handleResize);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.handleResize);
    this.unbindPointerEvents();
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

    // Iluminação em tons de azul/branco para combinar com o fundo e deixar a textura da Terra natural
    const ambient = new THREE.AmbientLight(0x94a3b8, 0.65);
    const rimLight = new THREE.DirectionalLight(0x64748b, 0.9);
    rimLight.position.set(-2, 1.5, 3);
    const backLight = new THREE.DirectionalLight(0x38bdf8, 0.5);
    backLight.position.set(2, -1.5, -2);

    scene.add(ambient);
    scene.add(rimLight);
    scene.add(backLight);

    const geometry = new THREE.SphereGeometry(1, 64, 64);

    // Textura em public/assets/textures/ (Angular serve a partir de public/)
    const earthTexture = this.textureLoader.load('/assets/textures/earth.jpg');

    earthTexture.colorSpace = THREE.SRGBColorSpace;

    const material = new THREE.MeshStandardMaterial({
      map: earthTexture,
      emissive: 0x0f172a,
      emissiveIntensity: 0.03,
      metalness: 0.08,
      roughness: 0.92,
    });

    const globe = new THREE.Mesh(geometry, material);
    globe.rotation.x = 0.15;
    scene.add(globe);

    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.globeMesh = globe;

    this.handleResize();
  }

  private bindPointerEvents(): void {
    const canvas = this.canvasRef.nativeElement;
    canvas.addEventListener('pointerdown', this.onPointerDown, { passive: false });
    canvas.addEventListener('pointermove', this.onPointerMove, { passive: false });
    canvas.addEventListener('pointerup', this.onPointerUp);
    canvas.addEventListener('pointerleave', this.onPointerUp);
    canvas.addEventListener('pointercancel', this.onPointerUp);
    canvas.style.cursor = 'grab';
  }

  private unbindPointerEvents(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;
    canvas.removeEventListener('pointerdown', this.onPointerDown);
    canvas.removeEventListener('pointermove', this.onPointerMove);
    canvas.removeEventListener('pointerup', this.onPointerUp);
    canvas.removeEventListener('pointerleave', this.onPointerUp);
    canvas.removeEventListener('pointercancel', this.onPointerUp);
  }

  private onPointerDown = (e: PointerEvent): void => {
    e.preventDefault();
    this.isDragging = true;
    this.lastPointerX = e.clientX;
    this.lastPointerY = e.clientY;
    this.canvasRef.nativeElement.style.cursor = 'grabbing';
    this.globeInteract.emit();
    window.addEventListener('pointerup', this.onPointerUp);
  };

  private onPointerMove = (e: PointerEvent): void => {
    if (!this.isDragging || !this.globeMesh) return;
    e.preventDefault();
    const dx = e.clientX - this.lastPointerX;
    const dy = e.clientY - this.lastPointerY;
    this.globeMesh.rotation.y += dx * 0.005;
    const newX = this.globeMesh.rotation.x + dy * 0.005;
    this.globeMesh.rotation.x = Math.max(-Math.PI / 2 + 0.2, Math.min(Math.PI / 2 - 0.2, newX));
    this.lastPointerX = e.clientX;
    this.lastPointerY = e.clientY;
  };

  private onPointerUp = (): void => {
    this.isDragging = false;
    window.removeEventListener('pointerup', this.onPointerUp);
    if (this.canvasRef?.nativeElement) {
      this.canvasRef.nativeElement.style.cursor = 'grab';
    }
  };

  private animate = () => {
    if (!this.scene || !this.camera || !this.renderer || !this.globeMesh) {
      return;
    }

    // Auto-rotação só quando não estiver arrastando
    if (!this.isDragging) {
      const baseSpeed = 0.0025;
      const speed = this.interacting ? baseSpeed * 0.2 : baseSpeed;
      this.globeMesh.rotation.y += speed;
    }

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
