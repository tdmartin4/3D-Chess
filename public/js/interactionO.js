/*jslint white: true, plusplus: true */
/*global THREE, window, document */

(function () {
    "use strict";
    var cube, cube2, scene, initCamera, initRenderer, initCube, initLights,
        onMouseDown, init, onMouseMove, render, projector, onDocumentKeyDown,
        // raycaster = new THREE.Raycaster(),
        WIDTH  = window.innerWidth,
        HEIGHT = window.innerHeight,
        camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT, 1, 10),
        //camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, - 500, 1000 ),
        renderer = new THREE.WebGLRenderer({ antialias: true }),
        mouse_vector = new THREE.Vector2(),
        mouse = { x: 0, y: 0, z: 1 },
        raycaster = new THREE.Raycaster( new THREE.Vector3(0,0,0),
                                   new THREE.Vector3(0,0,0));

    init = function () {
        scene = new THREE.Scene();
        //raycaster.ray.direction.set(0, -1, 0);
        //projector = new THREE.Projector();
        //scene.background.setHex( 0xffffff ); //= new THREE.Color("rgb(255, 0, 0)");
        //console.log(scene);
        initCamera();
        initRenderer();

        document.body.appendChild(renderer.domElement);

        initCube();
        initLights();
        //document.addEventListener( 'mousemove', onMouseMove, false );
        document.addEventListener("keydown", onDocumentKeyDown, false);
        document.addEventListener( 'mousedown', onMouseDown, false );
    };

    initCamera = function () {
        camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT, 1, 100);
        camera.position.set(0, 3.5, 5);
        camera.lookAt(scene.position);
    };

    initRenderer = function () {
        renderer = new THREE.WebGLRenderer({ alpha: true });//antialias: true });
        renderer.setSize(WIDTH, HEIGHT);
        //renderer.autoClearColor = false;
        //renderer.setClearColor( 0xff0000, 0);

        //console.log(renderer);
       renderer.setClearColor( 0x000000, 0);
       //console.log(renderer);
    };

    initCube = function () {
        var i, j, addFactor;

        for (j = 0; j < 8; j++) {
            for (i = 0; i < 8; i++) {
                if (i % 2 === 0) {
                    if (j % 2 === 0) {
                        cube = new THREE.Mesh(new THREE.CubeGeometry(1.0, 0.2, 1.0), new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: false }));
                    } else {
                        cube = new THREE.Mesh(new THREE.CubeGeometry(1.0, 0.2, 1.0), new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: false }));
                    }
                } else {
                    if (j % 2 === 0) {
                        cube = new THREE.Mesh(new THREE.CubeGeometry(1.0, 0.2, 1.0), new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: false }));
                    } else {
                        cube = new THREE.Mesh(new THREE.CubeGeometry(1.0, 0.2, 1.0), new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: false }));
                    }
                }
                cube.translateX(-3.5);
                addFactor = i * 1;
                cube.translateX(addFactor);
                cube.translateZ(3.5);
                cube.translateZ(-j * 1);
                scene.add(cube);
            }
        }
    };

    initLights = function () {
        var light = new THREE.AmbientLight(0xffffff);

        var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(0.0, 100.0, 0.0);

        scene.add(directionalLight);
        scene.add(light);
    };

    onMouseMove = function ( event ) {
    	// calculate mouse position in normalized device coordinates
    	// (-1 to +1) for both components

    	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
      //console.log("Helllooooo");

    };

    onMouseDown = function ( event ) {
        var i;
        event.preventDefault();
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        mouse_vector.set( mouse.x, mouse.y);
        //projector.unprojectVector( mouse_vector, camera );
        //var direction = mouse_vector.sub( camera.position ).normalize();
        //ray = ray.set( camera.position, direction );
        raycaster.setFromCamera( mouse_vector, camera );
        var intersects = raycaster.intersectObjects( scene.children );

        //scene.rotateY(0.2);
        console.log("Here, bro");
        // update the picking ray with the camera and mouse position

        // calculate objects intersecting the picking ray

        intersects[0].object.visible = false;



        console.log(intersects[0].object);

    };

    onDocumentKeyDown = function (event){

       console.log(event.keyCode);
       if (event.keyCode === 37) {
          //console.log("Help me");
           scene.rotation.y -= 0.1;
       } else if (event.keyCode === 39) {
           scene.rotation.y += 0.1;
       } else if (event.keyCode === 40) {
           scene.rotation.x += 0.1;
       } else if (event.keyCode === 38) {
           scene.rotation.x -= 0.1;
       } else if (event.keyCode === 107) {
           scene.scale.x += 0.02;
           scene.scale.y += 0.02;
           scene.scale.z += 0.02;
       } else if (event.keyCode === 109) {
           scene.scale.x -= 0.02;
           scene.scale.y -= 0.02;
           scene.scale.z -= 0.02;
       }
   };

    render = function () {
      renderer.render( scene, camera );
      requestAnimationFrame(render);
    };

    init();
    render();
})();
