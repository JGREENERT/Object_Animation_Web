/**
 * Created by Jesse Greenert on 3/28/2015.
 */
Lamp = function(){
    var lampAmb = new THREE.Color(0.191250, 0.073500, 0.022500);
    var lampSpec = new THREE.Color(0.256777, 0.137622, 0.086014);
    var lampMat = new THREE.MeshPhongMaterial({color:0x808080, diffuse: 0x808080, ambient: lampAmb.getHex(), specular: lampSpec.getHex(), shininess: 12.800000});
    var topGeo = new THREE.TorusGeometry(1, 0.4, 80, 100, 2.5);
    var postGeo = new THREE.CylinderGeometry(0.4, 0.4, 8, 50);
    var baseGeo = new THREE.CylinderGeometry(2, 2, 0.4, 50);
    var shadeGeo = new THREE.CylinderGeometry(0.8, 1.6, 1.5, 50);

    var top = new THREE.Mesh(topGeo, lampMat);
    var base = new THREE.Mesh(baseGeo, lampMat);
    var post = new THREE.Mesh(postGeo, lampMat);
    var shade = new THREE.Mesh(shadeGeo, lampMat);


    var lampGroup = new THREE.Group();
    top.translateX(-1);
    top.translateY(8.5);

    base.translateY(0.2);

    post.translateY(4.5);

    shade.translateY(8.6);
    shade.translateX(-1.9);
    shade.rotateZ(-0.7);

    lampGroup.add(top);
    lampGroup.add(base);
    lampGroup.add(post);
    lampGroup.add(shade);
    return lampGroup;
}

Lamp.prototype = Object.create (THREE.Object3D.prototype);
Lamp.prototype.constructor = Lamp;