/**
 * Created by Jesse Greenert on 3/28/2015.
 */
MerryGoRound = function () {
    /*Material*/
    var baseMat = new THREE.MeshPhongMaterial({color: 0xD3D3D3});
    var platMat = new THREE.MeshPhongMaterial({color: 0xFF0000});
    var handleMat = new THREE.MeshPhongMaterial({color: 0x0000FF});

    /*Geometry*/
    var baseGeo = new THREE.CylinderGeometry(1, 1, 2, 100, 100);
    var platformGeo = new THREE.CylinderGeometry(7, 7, 0.5, 100, 100);
    var barGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.5, 100, 100);
    var handleGeo = new THREE.TorusGeometry(2, 0.25, 100, 100, 3.14); //rad, diam, seg, seg, arc

    /*Objects*/
    var base = new THREE.Mesh(baseGeo, baseMat);
    var platform = new THREE.Mesh(platformGeo, platMat);
    var bar = [];
    for (var i = 0; i < 8; i++) {
        bar[i] = new THREE.Mesh(barGeo, handleMat);
    }
    var handle = [];
    for (var i = 0; i < 4; i++) {
        handle[i] = new THREE.Mesh(handleGeo, handleMat);
    }

    var mgrGroup = new THREE.Group();
    var handleGroups = [];
    for (var i = 0; i < 4; i++) {
        handleGroups[i] = new THREE.Group();
    }

    /*Part Placement*/
    base.position.y = 1;
    platform.position.y = 2;

    var rotation = 0;
    for (var i = 0; i < 4; i++) {
        handleGroups[i].rotateY(rotation);
        /*Close Bar*/
        bar[i*2].position.y = 2.5;
        bar[i*2].position.z = 2;
        handleGroups[i].add(bar[i*2]);
        /*Back Bar*/
        bar[i*2+1].position.y = 2.5;
        bar[i*2+1].position.z = 6;
        handleGroups[i].add(bar[i*2+1]);
        /*Handle*/
        handle[i].rotateY(1.57);
        handle[i].position.y = 2.25;
        handle[i].position.z = 4;
        handleGroups[i].add(handle[i]);
        rotation += 1.57;
    }

    /*Glue Object Together*/
    mgrGroup.add(base);
    mgrGroup.add(platform);
    for (var i = 0; i < 4; i++)
        mgrGroup.add(handleGroups[i]);
    return mgrGroup;
};

MerryGoRound.prototype = Object.create(THREE.Object3D.prototype);
MerryGoRound.prototype.constructor = MerryGoRound;