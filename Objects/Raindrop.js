/**
 * Created by Jesse Greenert on 3/28/2015.
 */

Raindrop = function(){
    var dropMat = new THREE.MeshPhongMaterial({color:0x0000FF})
    var baseGeo = new THREE.SphereGeometry(1, 10, 10);
    var topGeo = new THREE.CylinderGeometry(0, 0.5, 1);
    var base = new THREE.Mesh(baseGeo, dropMat);
    var top = new THREE.Mesh(topGeo, dropMat);

    var dropGroup = new THREE.Group();
    top.translateZ(1);
    dropGroup.add(top);
    dropGroup.add(base);
    return dropGroup;
}

Raindrop.prototype = Object.create (THREE.Object3D.prototype);
Raindrop.prototype.constructor = Raindrop;