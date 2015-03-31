require([], function(){
    // detect WebGL
    if( !Detector.webgl ){
        Detector.addGetWebGLMessage();
        throw 'WebGL Not Available'
    }
    // setup webgl renderer full page
    var renderer	= new THREE.WebGLRenderer();
    var CANVAS_WIDTH = 600, CANVAS_HEIGHT = 400;
    renderer.setSize( CANVAS_WIDTH, CANVAS_HEIGHT );
    var gbox = document.getElementById('graphicsbox');
    var pauseAnim = false;
    var rainArray = [];
    var windX = 0;
    var windZ = 0;
    document.body.appendChild(gbox);
    gbox.appendChild( renderer.domElement );

    // setup a scene and camera
    var scene	= new THREE.Scene();
    var camera	= new THREE.PerspectiveCamera(60, CANVAS_WIDTH / CANVAS_HEIGHT, 0.01, 1000);
    camera.position.y = 25;
    camera.position.z = 30;

    var onRenderFcts= [];

    // handle window resize events
    var winResize	= new THREEx.WindowResize(renderer, camera);

    //////////////////////////////////////////////////////////////////////////////////
    //		default 3 points lightning					//
    //////////////////////////////////////////////////////////////////////////////////

    /*Moon Geo*/
    var moonMat = new THREE.MeshPhongMaterial({color:0xFFFFFF});
    var moonGeo = new THREE.SphereGeometry(1, 10, 10);
    var moon = new THREE.Mesh(moonGeo, moonMat);
    moon.translateY(16);
    moon.translateZ(-23);
    moon.translateX(-15);
    scene.add(moon);

    /*Moon Light*/
    var ambientLight= new THREE.AmbientLight(0xFFFFFF);
    ambientLight.position.set(16, -23, -15);
    scene.add( ambientLight);

    /*Lightning*/
    var frontLight	= new THREE.DirectionalLight(0xffffff, 1);
    frontLight.position.set(10, 35, 0.0);
    scene.add( frontLight );
    //scene.add ( new THREE.DirectionalLightHelper (frontLight, 1));

    /*Lamp Light*/
    var backLight	= new THREE.SpotLight('white', 1, 0, Math.PI / 6);
    backLight.castShadow = true;
    backLight.position.set(8.8, 9.5, 0);
    backLight.intensity = 5;
    scene.add( backLight );
    //scene.add ( new THREE.SpotLightHelper (backLight, 0.2));

    //////////////////////////////////////////////////////////////////////////////////
    //		add an object and make it move					//
    //////////////////////////////////////////////////////////////////////////////////
    /*Raindrop*/
    var raindrop = new Raindrop();

    for(var i = 0; i < 50; i++){
        rainArray[i] = new Raindrop();
        rainArray[i].position.y = 10+i;
        rainArray[i].position.z = Math.random() * 30 - 10;
        rainArray[i].position.x = Math.random() * 30 - 10;
        scene.add(rainArray[i]);
    }

    /*Merry Go Round*/
    var mgr = new MerryGoRound();
    scene.add(mgr);

    /*Lamp*/
    var lamp = new Lamp();
    lamp.position.x = 10;
    scene.add(lamp);

    //scene.add (new THREE.AxisHelper(4));

    /*ground*/
    var groundPlane = new THREE.PlaneBufferGeometry(40, 40, 10, 10);
    var groundMat = new THREE.MeshPhongMaterial({color:0x1d6438});
    var ground = new THREE.Mesh (groundPlane, groundMat);
    ground.rotateX(THREE.Math.degToRad(-90));
    scene.add (ground);

    camera.lookAt(new THREE.Vector3(0, 5, 0));

    /*Not Used*/
    onRenderFcts.push(function(delta, now){
        if (pauseAnim) return;
        var tran = new THREE.Vector3();
        var rot = new THREE.Quaternion();
        var vscale = new THREE.Vector3();
    });

    //////////////////////////////////////////////////////////////////////////////////
    //		Camera Controls							//
    //////////////////////////////////////////////////////////////////////////////////
    var mouse	= {x : 0, y : 0};
    document.addEventListener('mousemove', function(event){
        mouse.x	= ((event.clientX - renderer.domElement.offsetLeft) / renderer.domElement.width ) * 2 - 1;
        mouse.y	= 1 - ((event.clientY - renderer.domElement.offsetTop) / renderer.domElement.height);
    }, false);

    window.addEventListener("keydown", moveSomething, false);
    window.addEventListener("keyup", moveSomethingelse, false);

    var keys = [];
    var spinDegree = 0;
    var resetMGR = false;
    var dropSpeed = 0.5;

    function moveSomething(e) {
        switch (e.keyCode) {
            case 48:
                if(backLight.intensity != 0)
                    backLight.intensity = 0;
                else
                    backLight.intensity = 5;
                break;
            case 70:
                dropSpeed -= 0.1;
                break;
            case 71:
                dropSpeed += 0.1;
                break;
            case 80:
                pauseAnim ^= true;
                console.log("P was pushed");
                break;
            case 37:
                spinDegree += 0.05;
                if (windX > -.4) {
                    windX -= .05;
                }
                break;
            case 38:
                spinDegree += 0.05;
                if (windZ > -.4) {
                    windZ -= .05;
                }
                break;
            case 39:
                spinDegree += 0.05;
                if (windX < .4) {
                    windX += .05;
                }
                break;
            case 40:
                spinDegree += 0.05;
                if (windZ < .4) {
                    windZ += .05;
                }
                break;
        }
    }

    function moveSomethingelse(e) {
        keys[e.keyCode] = false;
        resetMGR = true;
        if(windX != 0){
            windX = 0;
        }
        if(windZ != 0){
            windZ = 0;
        }
    }

    onRenderFcts.push(function(delta, now){
        camera.position.x += (mouse.x*30 - camera.position.x) * (delta*3);
        camera.position.y += (mouse.y*30 - camera.position.y) * (delta*3);
        camera.lookAt( scene.position )
    });

    //////////////////////////////////////////////////////////////////////////////////
    //		render the scene						//
    //////////////////////////////////////////////////////////////////////////////////
    onRenderFcts.push(function(){
        renderer.render( scene, camera );
    });

    //////////////////////////////////////////////////////////////////////////////////
    //		Rendering Loop runner						//
    //////////////////////////////////////////////////////////////////////////////////
    var lastTimeMsec= null;
    requestAnimationFrame(function animate(nowMsec){
        // keep looping
        requestAnimationFrame( animate );
        // measure time
        lastTimeMsec	= lastTimeMsec || nowMsec-1000/60;
        var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec);
        lastTimeMsec	= nowMsec;

        if(!pauseAnim) {
            /*Animate Rain*/
            for (var i = 0; i < rainArray.length; i++) {
                if (rainArray[i].position.y > 0) {
                    rainArray[i].position.y -= dropSpeed;
                    rainArray[i].position.z += windZ;
                    rainArray[i].position.x += windX;
                    rainArray[i].rotateX(windZ * 30);
                    rainArray[i].rotateY(windX * 30);
                } else {
                    rainArray[i].position.y = 10 + i;
                    rainArray[i].position.z = Math.random() * 30 - 15;
                    rainArray[i].position.x = Math.random() * 30 - 15;
                }
            }

            /*Animate Merry Go Round*/
            if (spinDegree > 0)
                if (spinDegree > 1)
                    mgr.rotateY(1);
                else
                    mgr.rotateY(spinDegree);

            else
                resetMGR = false;

            if (resetMGR)
                spinDegree -= 0.01;

            /*Lightning*/
            if (Math.random() * 50 < 2)
                frontLight.intensity = 10;
            else
                frontLight.intensity = 0;
        }
        // call each update function
        onRenderFcts.forEach(function(f){
            f(deltaMsec/1000, nowMsec/1000)
        });
    })
});
