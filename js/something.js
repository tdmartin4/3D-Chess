/*jslint white: true, plusplus: true, sub: true */
/*global THREE, window, document, console, requestAnimationFrame,
        setTimeout */

(function () {
    "use strict";
    var cube, scene, initPieces, initCamera, initRenderer, initCube, initLights, changeTurn, turn, rotateBoard, doSetTimeout, otherTurn, track, sign,
        onMouseDown, init, zoom, rotationLimit, render, onDocumentKeyDown, onMouseUp, distance,
        initBackground,
        count1 = 16, count2 = 16,
        WIDTH  = window.innerWidth,
        HEIGHT = window.innerHeight,
        SPOTSELECT, OTHER,
        camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT, 1, 10),
        renderer = new THREE.WebGLRenderer({ antialias: true }),
        mouse_vector = new THREE.Vector2(),
        mouse = { x: 0, y: 0, z: 1 },
        raycaster = new THREE.Raycaster( new THREE.Vector3(0,0,0),
                                   new THREE.Vector3(0,0,0)),
        pieces = {},
        pieceArray = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"];

    init = function () {
        scene = new THREE.Scene();
        initCamera();
        initRenderer();

        document.body.appendChild(renderer.domElement);

        initCube();
        initLights();
        document.addEventListener("keydown", onDocumentKeyDown, false);
        document.addEventListener( 'mousedown', onMouseDown, false );
        document.addEventListener( 'mouseup', onMouseUp, false );
        scene.scale.x -= 0.15;
        scene.scale.y -= 0.15;
        scene.scale.z -= 0.15;

        turn = "white";
        zoom = 0;
        rotationLimit = 3;
        initBackground();

    };

    initCamera = function () {
        camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT, 0.1, 500);
        camera.position.set(0, 3.5, 5);
        camera.lookAt(scene.position);
    };



    initRenderer = function () {
        renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(WIDTH, HEIGHT);
        renderer.setClearColor( 0x000000, 0);
    };

    initCube = function () {
        var i, j, addFactor;

        for (j = 0; j < 8; j++) {
            for (i = 0; i < 8; i++) {
                if (i % 2 === 0) {
                    if (j % 2 === 0) {
                        cube = new THREE.Mesh(new THREE.CubeGeometry(1.0, 0.2, 1.0), new THREE.MeshBasicMaterial({ color: 0xeeeeee, wireframe: false }));
                    } else {
                        cube = new THREE.Mesh(new THREE.CubeGeometry(1.0, 0.2, 1.0), new THREE.MeshBasicMaterial({ color: 0x222222, wireframe: false }));
                    }
                } else {
                    if (j % 2 === 0) {
                        cube = new THREE.Mesh(new THREE.CubeGeometry(1.0, 0.2, 1.0), new THREE.MeshBasicMaterial({ color: 0x222222, wireframe: false }));
                    } else {
                        cube = new THREE.Mesh(new THREE.CubeGeometry(1.0, 0.2, 1.0), new THREE.MeshBasicMaterial({ color: 0xeeeeee, wireframe: false }));
                    }
                }

                cube.userData.x = i;
                cube.userData.y = j;
                if (j === 0) {
                    cube.userData.color = "white";
                    cube.userData.name = pieceArray[i];
                    cube.userData.obj = pieces[pieceArray[i] + "_white"].clone();
                    cube.userData.obj.translateX(-3.5 + i);
                    cube.userData.obj.translateZ(3.5);

                    scene.add(cube.userData.obj);

                } else if (j === 1) {
                    cube.userData.color = "white";
                    cube.userData.name = "pawn";
                    cube.userData.obj = pieces["pawn_white"].clone();
                    cube.userData.obj.translateX(-3.5 + i);
                    cube.userData.obj.translateZ(2.5);

                    scene.add(cube.userData.obj);

                } else if (j === 6) {
                    cube.userData.color = "black";
                    cube.userData.name = "pawn";
                    cube.userData.obj = pieces["pawn_black"].clone();
                    cube.userData.obj.translateX(-3.5 + i);
                    cube.userData.obj.translateZ(-2.5);

                    scene.add(cube.userData.obj);

                } else if (j === 7) {
                    cube.userData.color = "black";
                    cube.userData.name = pieceArray[i];
                    cube.userData.obj = pieces[pieceArray[i] + "_black"].clone();
                    cube.userData.obj.translateX(-3.5 + i);
                    cube.userData.obj.translateZ(-3.5);

                    scene.add(cube.userData.obj);

                } else {
                    cube.userData.color = null;
                    cube.userData.obj = null;
                }

                cube.translateX(-3.5);
                addFactor = i;
                cube.translateX(addFactor);
                cube.translateZ(3.5);
                cube.translateZ(-j);
                scene.add(cube);
            }
        }
    };

    initLights = function () {
        var light = new THREE.AmbientLight(0xffffff),
        directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(0.0, 100.0, 0.0);

        scene.add(directionalLight);
        scene.add(light);
    };

    /* Code for this function is modified from this tutorial:
    * http://www.ianww.com/blog/2014/02/17/making-a-skydome-in-three-dot-js/
    */
    initBackground = function () {
      var geometry, uniforms, material, skyBox;

      geometry = new THREE.SphereGeometry(100, 100, 100);
      uniforms = {
        texture: { type: 't', value: THREE.ImageUtils.loadTexture("sky.png") }
      };

      material = new THREE.ShaderMaterial( {
        uniforms:       uniforms,
        vertexShader:   document.getElementById('sky-vertex').textContent,
        fragmentShader: document.getElementById('sky-fragment').textContent
      });

      skyBox = new THREE.Mesh(geometry, material);
      skyBox.scale.set(-1, 1, 1);
      skyBox.rotation.order = 'XZY';
      skyBox.renderOrder = 1000.0;
      scene.add(skyBox);
      render();
    };

    changeTurn = function () {
        var element = document.getElementById("player");
        otherTurn = turn;

        if (turn === "white") {
            turn = "black";
            element.style.color = "black";
            element.textContent = "BLACK";
        } else {
            turn = "white";
            element.style.color = "white";
            element.textContent = "WHITE";
        }

        while (scene.rotation.y < 0) {
            scene.rotation.y += 6.28;
        }

        scene.rotation.y = (scene.rotation.y % 6.28);
        distance = scene.rotation.y;

        if (otherTurn === "white") {
            if (distance > 3.14) {
                sign = -1;
                track = (distance - 3.14) / 0.02;
            } else {
                sign = 1;
                track = (3.14 - distance) / 0.02;
            }
        } else {
            if (distance > 3.14) {
                sign = 1;
                track = (6.28 - distance) / 0.02;
            } else {
                sign = -1;
                track = distance / 0.02;
            }
        }
        console.log("Distance: " + distance);
        doSetTimeout();
    };

    rotateBoard = function () {
        var temp;
        distance -= 0.02;
        if (sign === -1) {
            temp = -0.02;
        } else {
            temp = 0.02;
        }

        scene.rotation.y = scene.rotation.y + temp;

        console.log("Distance: " + distance);
    };

    doSetTimeout = function () {

        console.log("track: "  + track);

        if (otherTurn === "white") {
            if (track > 0) {
                track--;
                rotateBoard();
                renderer.render( scene, camera );
                requestAnimationFrame(doSetTimeout);
            } else {
                scene.rotation.y = 3.14;
            }

            console.log("otherTurn white");
        } else {
            // scene.rotation.y = 0;
            console.log("otherTurn black");

            if (track > 0) {
                track--;
                rotateBoard();
                renderer.render( scene, camera );
                requestAnimationFrame(doSetTimeout);
            } else {
                scene.rotation.y = 0;
            }
        }

        // setTimeout(rotateBoard, 10);
        // white is on top position: it is black's turn
        // if (otherTurn === "white") {
        //
        //     if ((Math.abs(distance) % 3.14) > 0.00000005) {
        //         rotateBoard();
        //         renderer.render( scene, camera );
        //         requestAnimationFrame(doSetTimeout);
        //     } else {
        //         console.log("Rotated 1");
        //         scene.rotation.y = 3.14;
        //     }
        // } else {
        //     if ((Math.abs(distance) > 0.1 && ((distance % 6.28) !== 0)) ) {
        //         rotateBoard();
        //         renderer.render( scene, camera );
        //         requestAnimationFrame(doSetTimeout);
        //     } else {
        //         console.log("Rotated 2");
        //         scene.rotation.y = 0;
        //     }
        // }
    };

    onMouseDown = function ( event ) {
        event.preventDefault();
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        mouse_vector.set( mouse.x, mouse.y);
        raycaster.setFromCamera( mouse_vector, camera );
        var intersects = raycaster.intersectObjects( scene.children );

        // update the picking ray with the camera and mouse position
        if ( (intersects[0].object.userData.color === turn) ) {
            // calculate objects intersecting the picking ray
            if ((intersects.length > 0)) {
                SPOTSELECT = intersects[0].object.userData.obj;
                OTHER = intersects[0].object;
           }
       }
    };

    onMouseUp = function ( event ) {
        var sameColor = false, intersects, piece, element;
        event.preventDefault();
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        mouse_vector.set( mouse.x, mouse.y);
        raycaster.setFromCamera( mouse_vector, camera );
        intersects = raycaster.intersectObjects( scene.children );

        if (intersects.length > 0) {
          if (SPOTSELECT !== null && SPOTSELECT !== undefined) {
              if (intersects[0].object.userData.obj !== null ) {
                  if (OTHER.userData.color !== intersects[0].object.userData.color) {

                      if (intersects[0].object.userData.color === "white") {
                          count1--;
                          element = document.getElementById("piecesLeft_1");
                          element.textContent = "White Pieces Left: " + count1;
                      } else {
                          count2--;
                          element = document.getElementById("piecesLeft_2");
                          element.textContent = "Black Pieces Left: " + count2;
                      }

                      scene.remove(intersects[0].object.userData.obj);
                      piece = intersects[0].object.userData.name;
                      intersects[0].object.userData.obj = null;
                  } else {
                      sameColor = true;
                  }
              }

              if (sameColor === false) {
                  if (piece === "king") {
                      element = document.getElementById("move");
                      element.style.color = OTHER.userData.color;
                      element.style.fontWeight = "bold";
                      element.style.textAlign = "center";
                      element.style.fontSize = "24pt";
                      element.textContent = OTHER.userData.color.toUpperCase();

                      element = document.getElementById("player");
                      element.style.color = "white";
                      element.style.fontWeight = "bold";
                      element.style.textAlign = "center";
                      element.style.fontSize = "24pt";
                      element.textContent = "WINS!";

                  } else {
                      changeTurn();
                  }

                  SPOTSELECT.translateZ(OTHER.userData.y - intersects[0].object.userData.y);
                  SPOTSELECT.translateX(intersects[0].object.userData.x - OTHER.userData.x);

                  intersects[0].object.userData.obj =  SPOTSELECT;
                  intersects[0].object.userData.color = OTHER.userData.color;
                  intersects[0].object.userData.name = OTHER.userData.name;
                  SPOTSELECT = null;
                  OTHER.userData.obj = null;
                  OTHER.userData.color = null;
                  OTHER.userData.name = null;
              }
          }
        }
    };

    onDocumentKeyDown = function (event){

       console.log(event.keyCode);
       if (event.keyCode === 37) {          // left
           scene.rotation.y -= 0.1;

       } else if (event.keyCode === 39) {   // right
           scene.rotation.y += 0.1;

       } else if (event.keyCode === 40) {   // down
           if (rotationLimit < 10) {
             scene.rotation.x += 0.1;
             rotationLimit++;
           }

       } else if (event.keyCode === 38) {   // up
           if (rotationLimit > 0) {
             scene.rotation.x -= 0.1;
             rotationLimit--;
           }

       } else if (event.keyCode === 107) {  // +
           if (zoom > 0) {
             scene.scale.x += 0.02;
             scene.scale.y += 0.02;
             scene.scale.z += 0.02;

             zoom--;
           }

       } else if (event.keyCode === 109) {  // -
           if (zoom < 10) {
             scene.scale.x -= 0.02;
             scene.scale.y -= 0.02;
             scene.scale.z -= 0.02;

             zoom++;
           }
       }
   };

    render = function () {
      renderer.render( scene, camera );
      requestAnimationFrame(render);
    };

    initPieces = function () {
        var loader = new THREE.OBJMTLLoader();
        pieces.count = 0;

        ////// white pieces

        loader.load("obj/rook_white.obj", "obj/rook_white.mtl", function(object){
            object.position.y = 0.2;
            object.scale.x = 0.25;
            object.scale.y = 0.25;
            object.scale.z = 0.25;
            pieces.rook_white = object.clone();
            pieces.count++;

            if(pieces.count === 12) {
                init();
                render();
            }
         });

        loader.load("obj/knight_white.obj", "obj/knight_white.mtl", function(object){
            object.position.y = 0.2;
            object.scale.x = 0.25;
            object.scale.y = 0.25;
            object.scale.z = 0.25;
            pieces.knight_white = object.clone();
            pieces.count++;

            if(pieces.count === 12) {
                init();
                render();
            }
        });

        loader.load("obj/bishop_white.obj", "obj/bishop_white.mtl", function(object){
            object.position.y = 0.2;
            object.scale.x = 0.35;
            object.scale.y = 0.35;
            object.scale.z = 0.35;
            pieces.bishop_white = object.clone();
            pieces.count++;

            if(pieces.count === 12) {
                init();
                render();
            }
        });

        loader.load("obj/king_white.obj", "obj/king_white.mtl", function(object){
            object.position.y = 0.2;
            object.scale.x = 0.25;
            object.scale.y = 0.25;
            object.scale.z = 0.25;
            pieces.king_white = object.clone();
            pieces.count++;

            if(pieces.count === 12) {
                init();
                render();
            }
        });

        loader.load("obj/queen_white.obj", "obj/queen_white.mtl", function(object){
            object.position.y = 0.2;
            object.scale.x = 0.25;
            object.scale.y = 0.25;
            object.scale.z = 0.25;
            pieces.queen_white = object.clone();
            pieces.count++;

            if(pieces.count === 12) {
                init();
                render();
            }
        });

        loader.load("obj/pawn_white.obj", "obj/pawn_white.mtl", function(object){
            object.position.y = 0.2;
            object.scale.x = 0.25;
            object.scale.y = 0.25;
            object.scale.z = 0.25;
            pieces.pawn_white = object.clone();
            pieces.count++;

            if(pieces.count === 12) {
                init();
                render();
            }
        });

        //////////// black pieces

        loader.load("obj/rook_black.obj", "obj/rook_black.mtl", function(object){
            object.position.y = 0.2;
            object.scale.x = 0.25;
            object.scale.y = 0.25;
            object.scale.z = 0.25;
            pieces.rook_black = object.clone();
            pieces.count++;

            if(pieces.count === 12) {
                init();
                render();
            }
         });

        loader.load("obj/knight_black.obj", "obj/knight_black.mtl", function(object){
            object.position.y = 0.2;
            object.scale.x = 0.25;
            object.scale.y = 0.25;
            object.scale.z = 0.25;
            pieces.knight_black = object.clone();
            pieces.count++;

            if(pieces.count === 12) {
                init();
                render();
            }
        });

        loader.load("obj/bishop_black.obj", "obj/bishop_black.mtl", function(object){
            object.position.y = 0.2;
            object.scale.x = 0.35;
            object.scale.y = 0.35;
            object.scale.z = 0.35;
            pieces.bishop_black = object.clone();
            pieces.count++;

            if(pieces.count === 12) {
                init();
                render();
            }

        });

        loader.load("obj/king_black.obj", "obj/king_black.mtl", function(object){
            object.position.y = 0.2;
            object.scale.x = 0.25;
            object.scale.y = 0.25;
            object.scale.z = 0.25;
            pieces.king_black = object.clone();
            pieces.count++;

            if(pieces.count === 12) {
                init();
                render();
            }
        });

        loader.load("obj/queen_black.obj", "obj/queen_black.mtl", function(object){
            object.position.y = 0.2;
            object.scale.x = 0.25;
            object.scale.y = 0.25;
            object.scale.z = 0.25;
            pieces.queen_black = object.clone();
            pieces.count++;

            if(pieces.count === 12) {
                init();
                render();
            }
        });

        loader.load("obj/pawn_black.obj", "obj/pawn_black.mtl", function(object){
            object.position.y = 0.2;
            object.scale.x = 0.25;
            object.scale.y = 0.25;
            object.scale.z = 0.25;
            pieces.pawn_black = object.clone();
            pieces.count++;

            if(pieces.count === 12) {
                init();
                render();
            }
        });
    };

    initPieces();
}());
