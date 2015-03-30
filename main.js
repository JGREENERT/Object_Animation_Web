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
    //document.body.appendChild(gbox);
    gbox.appendChild( renderer.domElement );

    // setup a scene and camera
    var scene	= new THREE.Scene();
    var camera	= new THREE.PerspectiveCamera(60, CANVAS_WIDTH / CANVAS_HEIGHT, 0.01, 1000);
//    camera.up.set (0, 0, 1); /* use the Z axis as the upright direction */
//    camera.position.x = 3;
    camera.position.y = 25;
    camera.position.z = 30;

//    scene.add (new THREE.GridHelper(10, 1));
    // declare the rendering loop
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


    var ambientLight= new THREE.AmbientLight( 0xC0C0C0 );
    ambientLight.position.set(-15, 16, -23);
    scene.add( ambientLight);



    var frontLight	= new THREE.DirectionalLight(0xffffff, 1);
    frontLight.position.set(10, 35, 0.0);
    //frontLight.position.set(-15, 16, -23)
   // scene.add( frontLight )
   // scene.add ( new THREE.DirectionalLightHelper (frontLight, 1));
    var backLight	= new THREE.SpotLight('white', 1, 0, Math.PI / 6);
    backLight.castShadow = true;
    backLight.position.set(8.8, 9.5, 0);
    scene.add( backLight );
    scene.add ( new THREE.SpotLightHelper (backLight, 0.2));

    var last_lightning = 0;

    //////////////////////////////////////////////////////////////////////////////////
    //		add an object and make it move					//
    //////////////////////////////////////////////////////////////////////////////////
    /*Raindrop*/
    var raindrop = new Raindrop();
    var raindrop_cf = new THREE.Matrix4();
    raindrop.position.y = 10;
    raindrop.position.z = 20;
    scene.add(raindrop);

    /*Merry Go Round*/
    var mgr = new MerryGoRound();
    var mgr_cf = new THREE.Matrix4();
    scene.add(mgr);

    /*Lamp*/
    var lamp = new Lamp();
    var lamp_cf = new THREE.Matrix4();
    lamp.position.x = 10;
    scene.add(lamp);

    //scene.add (new THREE.AxisHelper(4));

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
        // call each update function
        onRenderFcts.forEach(function(f){
            f(deltaMsec/1000, nowMsec/1000)
        });


        /*Lightning*/
        if((Math.random %  100) < 2){
            scene.add(frontLight);
            last_lightning = nowMsec;
        } else{
            if(nowMsec - last_lightning < 10){
                scene.remove(frontLight);
            }
        }


    })
});
