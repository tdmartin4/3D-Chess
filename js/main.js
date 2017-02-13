/*jslint white: true */
/*global THREE, window */

(function () {
    "use strict";
    var scene, camera, renderer, cube, mesh, onDocumentKeyDown, onMouseDown;

    var WIDTH  = window.innerWidth;
    var HEIGHT = window.innerHeight;
    var SPEED = 0.01;

    function init() {
      scene = new THREE.Scene();
      initCamera();
      initRenderer();

      document.body.appendChild(renderer.domElement);

      initCube();
      //initMesh();
      initLights();
      document.addEventListener("keydown", onDocumentKeyDown, false);
      document.addEventListener("mousedown", onMouseDown, false);
    }

    function initCamera() {
        camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT, 1, 10);
        camera.position.set(0, 3.5, 5);
        camera.lookAt(scene.position);
    }

    function initRenderer() {
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(WIDTH, HEIGHT);
    }

    function initCube() {
        cube = new THREE.Mesh(new THREE.CubeGeometry(5, 5, 0.2), new THREE.MeshNormalMaterial());
        scene.add(cube);
    }

    function initMesh() {
        var loader = new THREE.JSONLoader();
        loader.load('./lessComplexFidoColor.json', function(geometry, materials) {
        //loader.load('./marmelab.json', function(geometry, materials) {
        //loader.load('./BMW27.json', function(geometry, materials) {
        //loader.load('./lessComplexFido.json', function(geometry) {
            mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
            mesh.scale.x = mesh.scale.y = mesh.scale.z = 0.25;
            scene.add(mesh);
        });
    }

    function initLights() {
        var light = new THREE.AmbientLight(0xffffff);

        var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(0.0, 100.0, 0.0);

        scene.add(directionalLight);
        scene.add(light);
    }

    function rotateCube() {
        cube.rotation.x -= SPEED * 2;
        cube.rotation.y -= SPEED;
        cube.rotation.z -= SPEED * 3;
    }

    onMouseDown = function (event) {
        //console.log(event.button);
        if (event.button === 0) {
            console.log(event.clientX);
            console.log(event.clientY);
        }
    };

     onDocumentKeyDown = function (event){

        console.log(event.keyCode);
        if (event.keyCode === 37) {
           //console.log("Help me");
            cube.rotation.y -= 0.1;
        } else if (event.keyCode === 39) {
            cube.rotation.y += 0.1;
        } else if (event.keyCode === 40) {
            cube.rotation.x += 0.1;
        } else if (event.keyCode === 38) {
            cube.rotation.x -= 0.1;
        } else if (event.keyCode === 107) {
            cube.scale.x += 0.02;
            cube.scale.y += 0.02;
            cube.scale.z += 0.02;
        } else if (event.keyCode === 109) {
            cube.scale.x -= 0.02;
            cube.scale.y -= 0.02;
            cube.scale.z -= 0.02;
        }
    }

    function rotateMesh() {
    if (!mesh) {
        return;
    }

    mesh.rotation.x -= SPEED * 2;
    mesh.rotation.y -= SPEED;
    mesh.rotation.z -= SPEED * 3;
  }

    function render() {
        requestAnimationFrame(render);
        //rotateCube();
        //rotateMesh();
        renderer.render(scene, camera);
    }

    document.onmousedown = function (e) {
        //isRotating = true;
         //var origLocX = e.pageX, origLocY = e.pageY;
        //while
    }

    init();
    render();


})();
