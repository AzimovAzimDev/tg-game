// Three.js Game Initialization
import * as THREE from 'three';

// Define icon types
const IconType = {
    FOLDER: 'folder',
    DOCUMENT: 'document',
    TERMINAL: 'terminal',
    IDE: 'ide'
};

// Icon colors
const IconColors = {
    [IconType.FOLDER]: 0x4a6bff,    // Blue
    [IconType.DOCUMENT]: 0xffffff,   // White
    [IconType.TERMINAL]: 0x2d2d2d,   // Dark gray
    [IconType.IDE]: 0x7c43bd        // Purple
};

// Bug class to handle bug entity behavior
class Bug {
    constructor(game, position) {
        this.game = game;
        this.speed = 0.03 + Math.random() * 0.02; // Random speed between 0.03 and 0.05
        this.target = null;
        this.mesh = this.createBugMesh();

        // Set initial position
        if (position) {
            this.mesh.position.copy(position);
        }

        // Add some height to hover above the desktop
        this.mesh.position.y = 0.2;

        // Add to scene
        this.game.scene.add(this.mesh);
    }

    createBugMesh() {
        // Create a simple plane geometry for the bug
        const geometry = new THREE.PlaneGeometry(0.4, 0.4);

        // Default material (red color for bugs)
        const material = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            roughness: 0.5,
            metalness: 0.2,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.9
        });

        // Create the mesh
        const mesh = new THREE.Mesh(geometry, material);

        // Try to load bug texture
        this.game.textureLoader.load(
            'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/sprites/spark1.png', // Placeholder texture
            (texture) => {
                // Create a new material with the loaded texture
                const texturedMaterial = new THREE.MeshStandardMaterial({
                    map: texture,
                    color: 0xff5555, // Reddish tint
                    roughness: 0.5,
                    metalness: 0.2,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.9
                });

                // Apply the textured material
                mesh.material = texturedMaterial;
            },
            undefined,
            (error) => {
                console.error('Error loading bug texture:', error);
                // Keep using the default red material
            }
        );

        // Add shadow casting
        mesh.castShadow = true;
        mesh.receiveShadow = false;

        // Slightly rotate to face the camera better
        mesh.rotation.x = -Math.PI / 4;

        return mesh;
    }

    findNearestUndamagedIcon() {
        let nearestIcon = null;
        let minDistance = Infinity;

        this.game.fileIcons.forEach(icon => {
            // Skip damaged icons
            if (icon.userData.damaged) return;

            const distance = this.mesh.position.distanceTo(icon.position);
            if (distance < minDistance) {
                minDistance = distance;
                nearestIcon = icon;
            }
        });

        return nearestIcon;
    }

    update() {
        // Find a target if we don't have one or if current target is damaged
        if (!this.target || this.target.userData.damaged) {
            this.target = this.findNearestUndamagedIcon();

            // If no undamaged icons left, just wander randomly
            if (!this.target) {
                // Random movement if no target
                this.mesh.position.x += (Math.random() - 0.5) * 0.1;
                this.mesh.position.z += (Math.random() - 0.5) * 0.1;
                return;
            }
        }

        // Move toward target
        const direction = new THREE.Vector3();
        direction.subVectors(this.target.position, this.mesh.position);
        direction.normalize();

        // Add random jitter for unpredictability
        direction.x += (Math.random() - 0.5) * 0.2;
        direction.z += (Math.random() - 0.5) * 0.2;
        direction.normalize();

        // Move bug
        this.mesh.position.x += direction.x * this.speed;
        this.mesh.position.z += direction.z * this.speed;

        // Rotate bug to face movement direction
        this.mesh.rotation.z = Math.atan2(direction.z, direction.x);

        // Check if reached target
        const distanceToTarget = this.mesh.position.distanceTo(this.target.position);
        if (distanceToTarget < 0.3) {
            // Damage the icon
            this.target.userData.damaged = true;

            // Visual indication of damage (turn icon red)
            if (this.target.material) {
                this.target.material.color.set(0xff0000);
                this.target.material.opacity = 0.7;
                this.target.material.transparent = true;
            }

            // Find a new target
            this.target = null;
        }

        // Check if bug is outside world bounds
        const { minX, maxX, minZ, maxZ } = this.game.worldBounds;
        if (
            this.mesh.position.x < minX || 
            this.mesh.position.x > maxX || 
            this.mesh.position.z < minZ || 
            this.mesh.position.z > maxZ
        ) {
            this.remove();
        }
    }

    remove() {
        // Remove from scene
        this.game.scene.remove(this.mesh);

        // Remove from bugs array
        const index = this.game.bugs.indexOf(this);
        if (index !== -1) {
            this.game.bugs.splice(index, 1);
        }
    }
}

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

        // Store world bounds for icon placement
        this.worldBounds = {
            minX: -8,
            maxX: 8,
            minZ: -8,
            maxZ: 8
        };

        // Array to store all file icons
        this.fileIcons = [];

        // Number of icons to spawn
        this.iconCount = 30;

        // Array to store all bugs
        this.bugs = [];

        // Bug spawn settings
        this.bugSpawnInterval = 1500; // 1.5 seconds
        this.bugSpawnTimer = 0;
        this.maxBugs = 20; // Maximum number of bugs allowed at once
        this.gameStarted = false; // Flag to control when bugs start spawning

        // Texture loader for textures
        this.textureLoader = new THREE.TextureLoader();

        // Raycaster for mouse interaction
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

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

        // Initialize file icons
        this.initializeFileIcons();

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

        // Add mouse click event listener for bug squashing
        this.canvas.addEventListener('click', this.onMouseClick.bind(this));

        // Listen for game start event from UI
        window.addEventListener('gameStart', this.startGame.bind(this));
        window.addEventListener('gameEnd', this.endGame.bind(this));

        // Start animation loop
        this.animate();
    }

    // Start the game - begin spawning bugs
    startGame() {
        this.gameStarted = true;
        this.bugSpawnTimer = 0;

        // Clear any existing bugs
        this.clearAllBugs();

        // Reset damaged icons
        this.resetIcons();

        // Dispatch event to notify UI that game is ready
        const gameReadyEvent = new CustomEvent('gameReady', { detail: { game: this } });
        window.dispatchEvent(gameReadyEvent);
    }

    // End the game - stop spawning bugs
    endGame() {
        this.gameStarted = false;

        // Clear all bugs
        this.clearAllBugs();
    }

    // Clear all bugs from the scene
    clearAllBugs() {
        // Remove all bugs from scene
        this.bugs.forEach(bug => {
            this.scene.remove(bug.mesh);
        });

        // Clear bugs array
        this.bugs = [];
    }

    // Reset all icons to undamaged state
    resetIcons() {
        this.fileIcons.forEach(icon => {
            // Reset damaged flag
            icon.userData.damaged = false;

            // Reset color/opacity if it was changed
            if (icon.material) {
                // Get original color based on icon type
                const originalColor = IconColors[icon.userData.type];
                if (originalColor) {
                    icon.material.color.set(originalColor);
                } else {
                    icon.material.color.set(0xffffff);
                }

                icon.material.opacity = 1.0;
            }
        });
    }

    // Spawn a new bug at a random icon position
    spawnBug() {
        // Don't spawn if we've reached the maximum number of bugs
        if (this.bugs.length >= this.maxBugs) return;

        // Find a random icon to spawn the bug at
        const randomIconIndex = Math.floor(Math.random() * this.fileIcons.length);
        const spawnIcon = this.fileIcons[randomIconIndex];

        if (spawnIcon) {
            // Create a new bug at the icon's position
            const bugPosition = spawnIcon.position.clone();
            const bug = new Bug(this, bugPosition);

            // Add to bugs array
            this.bugs.push(bug);

            // Dispatch bug spawn event for sound effects or other feedback
            const bugSpawnEvent = new CustomEvent('bugSpawn', { detail: { position: bugPosition } });
            window.dispatchEvent(bugSpawnEvent);
        }
    }

    // Handle mouse clicks for bug squashing
    onMouseClick(event) {
        // Calculate mouse position in normalized device coordinates (-1 to +1)
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / this.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / this.height) * 2 + 1;

        // Update the picking ray with the camera and mouse position
        this.raycaster.setFromCamera(this.mouse, this.camera);

        // Calculate objects intersecting the picking ray
        const intersects = this.raycaster.intersectObjects(this.bugs.map(bug => bug.mesh));

        // If we clicked on a bug
        if (intersects.length > 0) {
            // Find the bug that was clicked
            const clickedMesh = intersects[0].object;
            const clickedBug = this.bugs.find(bug => bug.mesh === clickedMesh);

            if (clickedBug) {
                // Remove the bug
                clickedBug.remove();

                // Dispatch bug squash event for score update and sound effects
                const bugSquashEvent = new CustomEvent('bugSquash', { 
                    detail: { position: clickedMesh.position.clone() } 
                });
                window.dispatchEvent(bugSquashEvent);
            }
        }
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

    // Get texture URL for the specified icon type
    getIconTextureUrl(type) {
        // In a real implementation, these would be paths to actual texture files
        // For now, we'll use placeholder URLs from a CDN
        switch (type) {
            case IconType.FOLDER:
                return 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/sprites/disc.png';
            case IconType.DOCUMENT:
                return 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/earth_atmos_2048.jpg';
            case IconType.TERMINAL:
                return 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/floors/FloorsCheckerboard_S_Diffuse.jpg';
            case IconType.IDE:
                return 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/lava/lavatile.jpg';
            default:
                return 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/sprites/disc.png';
        }
    }

    // Create a file icon of the specified type
    createFileIcon(type) {
        // Create a plane geometry for the icon
        const geometry = new THREE.PlaneGeometry(0.8, 0.8);

        // Default material with color based on icon type (used as fallback)
        const material = new THREE.MeshStandardMaterial({
            color: IconColors[type],
            roughness: 0.5,
            metalness: 0.2,
            side: THREE.DoubleSide
        });

        // Create the mesh with default material
        const icon = new THREE.Mesh(geometry, material);

        // Try to load texture
        const textureUrl = this.getIconTextureUrl(type);
        this.textureLoader.load(
            textureUrl,
            (texture) => {
                // Create a new material with the loaded texture
                const texturedMaterial = new THREE.MeshStandardMaterial({
                    map: texture,
                    color: 0xffffff, // White to not affect texture color
                    roughness: 0.5,
                    metalness: 0.2,
                    side: THREE.DoubleSide
                });

                // Apply the textured material
                icon.material = texturedMaterial;
            },
            undefined, // onProgress callback not needed
            (error) => {
                console.error(`Error loading texture for ${type} icon:`, error);
                // Keep using the default colored material
            }
        );

        // Add shadow casting
        icon.castShadow = true;
        icon.receiveShadow = false;

        // Store the icon type
        icon.userData.type = type;

        // Slightly rotate the icon to face the camera better
        icon.rotation.x = -Math.PI / 6; // Tilt slightly

        // Add a small random rotation for variety
        icon.rotation.z = (Math.random() - 0.5) * 0.2;

        return icon;
    }

    // Initialize all file icons
    initializeFileIcons() {
        // Clear any existing icons
        this.fileIcons.forEach(icon => {
            this.scene.remove(icon);
        });
        this.fileIcons = [];

        // Create a pool of icons with random types and positions
        for (let i = 0; i < this.iconCount; i++) {
            // Randomly select an icon type
            const types = Object.values(IconType);
            const randomType = types[Math.floor(Math.random() * types.length)];

            // Create the icon
            const icon = this.createFileIcon(randomType);

            // Position the icon randomly within world bounds
            this.positionIconRandomly(icon);

            // Add to scene and tracking array
            this.scene.add(icon);
            this.fileIcons.push(icon);
        }
    }

    // Position an icon randomly within world bounds
    positionIconRandomly(icon) {
        const { minX, maxX, minZ, maxZ } = this.worldBounds;

        // Random position within bounds
        const x = minX + Math.random() * (maxX - minX);
        const z = minZ + Math.random() * (maxZ - minZ);

        // Set position (y is fixed to be on the "desktop")
        icon.position.set(x, 0.1, z); // Slightly above the desktop

        // Store original position for reference
        icon.userData.originalPosition = { x, z };
    }

    // Check if an icon is outside the visible area
    isIconOutOfView(icon) {
        // Convert world position to screen position
        const iconPosition = icon.position.clone();
        iconPosition.project(this.camera);

        // Check if the icon is outside the screen bounds with some margin
        const margin = 0.1; // 10% margin
        return (
            iconPosition.x < -1 - margin ||
            iconPosition.x > 1 + margin ||
            iconPosition.y < -1 - margin ||
            iconPosition.y > 1 + margin
        );
    }

    // Recycle icons that are out of view
    recycleOutOfViewIcons() {
        this.fileIcons.forEach(icon => {
            if (this.isIconOutOfView(icon)) {
                // Move the icon to the opposite side of the screen
                const { x, z } = icon.position;

                // Determine new position based on camera direction
                // This is a simplified approach - we just move it to a new random position
                this.positionIconRandomly(icon);
            }
        });
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        // Get delta time for consistent animation speed
        const now = Date.now();
        const delta = now - (this.lastTime || now);
        this.lastTime = now;

        // Spawn bugs if game has started
        if (this.gameStarted) {
            // Update bug spawn timer
            this.bugSpawnTimer += delta;

            // Spawn a new bug if it's time
            if (this.bugSpawnTimer >= this.bugSpawnInterval) {
                this.spawnBug();
                this.bugSpawnTimer = 0;
            }

            // Update all bugs
            this.bugs.forEach(bug => bug.update());
        }

        // Recycle icons that are out of view
        this.recycleOutOfViewIcons();

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
