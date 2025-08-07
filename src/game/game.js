// Three.js Game Initialization
import * as THREE from 'three';

class BugHuntGame {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.scene = new THREE.Scene();

        // Get the Telegram Web App window size if available, otherwise use browser window
        this.width = window.Telegram?.WebApp?.viewportStableHeight || window.innerWidth;
        this.height = window.Telegram?.WebApp?.viewportStableHeight || window.innerHeight;

        // Use orthographic camera for 2D/2.5D effect
        const aspectRatio = this.width / this.height;
        const frustumSize = 10;
        this.camera = new THREE.OrthographicCamera(
            frustumSize * aspectRatio / -2,
            frustumSize * aspectRatio / 2,
            frustumSize / 2,
            frustumSize / -2,
            0.1,
            1000
        );

        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.canvas, 
            antialias: true,
            alpha: true // Allow transparency
        });

        this.init();
    }

    init() {
        // Set up renderer
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor(0x000000, 0); // Transparent background
        this.renderer.setPixelRatio(window.devicePixelRatio);

        // Set up camera position - low angle for 2.5D effect
        this.camera.position.set(0, 2, 5);
        this.camera.lookAt(0, 0, 0);

        // Load desktop background texture
        this.loadDesktopBackground();

        // Add a simple cube for testing (will be replaced with bugs later)
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0x00ff00,
            roughness: 0.7,
            metalness: 0.2
        });
        this.cube = new THREE.Mesh(geometry, material);
        this.cube.position.y = 0.5; // Place on top of the "desktop"
        this.scene.add(this.cube);

        // Add ambient light - soft overall illumination
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        // Add directional light - soft shadows
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 7);
        directionalLight.castShadow = true;

        // Configure shadow properties for better quality
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;

        this.scene.add(directionalLight);

        // Enable shadows in the renderer
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Handle window resize and Telegram Web App viewport changes
        window.addEventListener('resize', this.onWindowResize.bind(this));
        if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.onEvent('viewportChanged', this.onWindowResize.bind(this));
        }

        // Start animation loop
        this.animate();
    }

    loadDesktopBackground() {
        // Create a large plane for the desktop background
        const planeGeometry = new THREE.PlaneGeometry(20, 20);

        // Load texture from a CDN (placeholder texture)
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(
            'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/floors/FloorsCheckerboard_S_Diffuse.jpg',
            (texture) => {
                // Repeat the texture to create a tiled effect
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(4, 4);

                const planeMaterial = new THREE.MeshStandardMaterial({
                    map: texture,
                    side: THREE.DoubleSide,
                    roughness: 0.8,
                    metalness: 0.2
                });

                const plane = new THREE.Mesh(planeGeometry, planeMaterial);
                plane.rotation.x = -Math.PI / 2; // Rotate to be horizontal
                plane.position.y = -0.5; // Position slightly below the origin
                plane.receiveShadow = true; // Allow the plane to receive shadows

                this.scene.add(plane);
            },
            undefined,
            (error) => {
                console.error('Error loading texture:', error);

                // Fallback to a colored plane if texture fails to load
                const planeMaterial = new THREE.MeshStandardMaterial({
                    color: 0x444444,
                    side: THREE.DoubleSide,
                    roughness: 0.8,
                    metalness: 0.2
                });

                const plane = new THREE.Mesh(planeGeometry, planeMaterial);
                plane.rotation.x = -Math.PI / 2;
                plane.position.y = -0.5;
                plane.receiveShadow = true;

                this.scene.add(plane);
            }
        );
    }

    onWindowResize() {
        // Update sizes based on Telegram Web App or window
        this.width = window.Telegram?.WebApp?.viewportStableWidth || window.innerWidth;
        this.height = window.Telegram?.WebApp?.viewportStableHeight || window.innerHeight;

        // Update orthographic camera
        const aspectRatio = this.width / this.height;
        const frustumSize = 10;

        this.camera.left = frustumSize * aspectRatio / -2;
        this.camera.right = frustumSize * aspectRatio / 2;
        this.camera.top = frustumSize / 2;
        this.camera.bottom = frustumSize / -2;
        this.camera.updateProjectionMatrix();

        // Update renderer
        this.renderer.setSize(this.width, this.height);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        // Rotate the cube
        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new BugHuntGame();

    // Make the game instance available globally for debugging
    window.game = game;

    // Notify UI that game is ready
    const gameReadyEvent = new CustomEvent('gameReady', { detail: { game } });
    window.dispatchEvent(gameReadyEvent);
});
