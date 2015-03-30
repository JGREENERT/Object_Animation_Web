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

    var ambientLight= new THREE.AmbientLight( 0xFFFFFF );
    ambientLight.position.set(-15, 16, -23);
    scene.add( ambientLight);

    var frontLight	= new THREE.DirectionalLight(0xffffff, 1);
    frontLight.position.set(10, 35, 0.0);
    scene.add( frontLight );
    scene.add ( new THREE.DirectionalLightHelper (frontLight, 1));
    var backLight	= new THREE.SpotLight('white', 1, 0, Math.PI / 6);
    backLight.castShadow = true;
    backLight.position.set(-4, 20, 10);
    scene.add( backLight );
    scene.add ( new THREE.SpotLightHelper (backLight, 0.2));

    //////////////////////////////////////////////////////////////////////////////////
    //		add an object and make it move					//
    //////////////////////////////////////////////////////////////////////////////////
    /*Raindrop*/
    var raindrop = new Raindrop();
    var raindrop_cf = new THREE.Matrix4();
    for(var i = 0; i < 50; i++){
        rainArray[i] = new Raindrop();
        rainArray[i].position.y = 10+i;
        rainArray[i].position.z = Math.random() * 30 - 10;
        rainArray[i].position.x = Math.random() * 30 - 10;
        scene.add(rainArray[i]);
    }

    var groundPlane = new THREE.PlaneBufferGeometry(40, 40, 10, 10);
    var groundMat = new THREE.MeshPhongMaterial({color:0x1d6438});
    var ground = new THREE.Mesh (groundPlane, groundMat);
    ground.rotateX(THREE.Math.degToRad(-90));
    scene.add (ground);

    camera.lookAt(new THREE.Vector3(0, 5, 0));

    onRenderFcts.push(function(delta, now){
        if (pauseAnim) return;
        var tran = new THREE.Vector3();
        var quat = new THREE.Quaternion();
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

    document.addEventListener('keypress', function(event){
        var key = String.fromCharCode(event.keyCode || event.charCode);
        if (key == 'p') {
            pauseAnim ^= true; /* toggle it */
        }
    }, false);

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

    window.addEventListener("keydown", moveSomething, false);

    function moveSomething(e) {
        switch(e.keyCode) {
            case 37:
                if(windX > -.4) {
                    windX -= .05;
                }
                break;
            case 38:
                if(windZ > -.4) {
                    windZ -= .05;
                }
                break;
            case 39:
                if(windX < .4) {
                    windX += .05;
                }
                break;
            case 40:
                if(windZ < .4) {
                    windZ += .05;
                }
                break;
        }
    }

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

        /*Animate Rain*/
        for(var i = 0; i < rainArray.length; i++) {
            if (rainArray[i].position.y > 0) {
                rainArray[i].position.y -= .1;
                rainArray[i].position.z += windZ;
                rainArray[i].position.x += windX;
            } else {
                rainArray[i].position.y = 10+i;
                rainArray[i].position.z = Math.random() * 30 - 15;
                rainArray[i].position.x = Math.random() * 30 - 15;
            }
        }

        // call each update function
        onRenderFcts.forEach(function(f){
            f(deltaMsec/1000, nowMsec/1000)
        })
    })
});
