/**
* Website created by Emile COUTURE
* In the matter of being used as a map of my master thesis about virtual spaces
* in space design during my studies at the ENSA Dijon.
*
*
* All the code is free for you to use in any way you want, help yourself :)
*
* Coded with the help of the THREE.js lib : www.threejs.org
**/


//__________________Variables and scene construction___________________//


//Scene creation
var scene = new THREE.Scene();

//Rendering
var renderer = new THREE.WebGLRenderer();

//Camera
var camera = new THREE.PerspectiveCamera(
  45, //field of view
  window.innerWidth / window.innerHeight, //Aspect ratio
  0.1, //Near plan
  2000000 //Far plan
);
scene.add(camera);
camera.position.x = -100;
camera.position.y = 150;
camera.position.z = -100;

//Camera controls
var controls = new THREE.OrbitControls( camera );
controls.addEventListener( 'change', render );

//light
var hemisphere_light = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6 );
hemisphere_light.color.setHex(0xffffff);
hemisphere_light.position.set(0, 500, 0);
scene.add(hemisphere_light);

var directional_light = new THREE.DirectionalLight( 0xffffff, 0.1 );
directional_light.color.setHex(0xffffff);
directional_light.position.set( -1, 200, 1 );
directional_light.position.multiplyScalar( 50 );
directional_light.castShadow = true;
scene.add( directional_light );


//Skydome
var sky_geometry = new THREE.SphereBufferGeometry(200000, 80, 80);
var sky_material = new THREE.MeshPhongMaterial({color: 	0xffffff,
                                                specular: 0xffffff,
                                                shininess: 20,
                                              });
var sky = new THREE.Mesh(sky_geometry, sky_material);
sky.material.side = THREE.DoubleSide
scene.add(sky);


renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );



//__________________Toolbox functions___________________//



//Find index of child
function find_index(node) {
    var i = 1;
    while ((node = node.previousSibling) != null) {
        if (node.nodeType === 1) i++;
    }
    return i;
}
//Random number generator
function rand_between(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
//soustract arrays (used for vectors soustraction)
function soustract_array(array1, array2) {
  var result = {};
  var A = [array1["x"], array1["y"], array1["z"]]
  var B = [array2["x"], array2["y"], array2["z"]]
  result["x"] = A[0] - B[0];
  result["y"] = A[1] - B[1];
  result["z"] = A[2] - B[2];
  return result;
}



//__________________Functions___________________//


//Create the points for the triangulation
var points = {};
var point_nb = 1
var points_in_raw = 10
function points_coord(){
  for (var z = 0; z < points_in_raw; z++) {
    for (var x = 0; x < points_in_raw; x++) {
      var this_point_name = eval('"point" + point_nb')
      point_nb++
      points[this_point_name] = [x * 10, rand_between(0, 5), z * 10]
    }
  }
  //console.log(points)
}


//Triangulation
var triangles = {};
function triangulation() {
  var count = 0
  for (var loop = 0; loop < 2; loop ++) {
    if (loop == 0) {
      for (var z = 0; z < (points_in_raw * points_in_raw - points_in_raw); z = z + points_in_raw) {
        for (var x = 0; x < points_in_raw - 1; x++) {
          //points
          var triangle_geometry = new THREE.Geometry();
          var point1 = new THREE.Vector3(points[eval("'point' + eval(z + x + 1)")][0],
                                        points[eval("'point' + eval(z + x + 1)")][1],
                                        points[eval("'point' + eval(z + x  + 1)")][2]);
          var point2 = new THREE.Vector3(points[eval("'point' + eval(z + x + points_in_raw + 2)")][0],
                                        points[eval("'point' + eval(z + x + points_in_raw + 2)")][1],
                                        points[eval("'point' + eval(z + x + points_in_raw + 2)")][2]);
          var point3 = new THREE.Vector3(points[eval("'point' + eval(z + x + 2)")][0],
                                        points[eval("'point' + eval(z + x + 2)")][1],
                                        points[eval("'point' + eval(z + x + 2)")][2]);

          //normal vector calculation
          var vector1_substract = soustract_array(point2, point1);
          var vector1 = new THREE.Vector3(vector1_substract["x"],
                                          vector1_substract["y"],
                                          vector1_substract["z"]);
          var vector2_substract = soustract_array(point3, point1);
          var vector2 = new THREE.Vector3(vector2_substract["x"],
                                          vector2_substract["y"],
                                          vector2_substract["z"]);
          var this_triangle_normal = new THREE.Vector3();
          this_triangle_normal.multiplyVectors(vector1, vector2);

          //Face generation
          var triangle_face = new THREE.Face3(0, 1, 2, this_triangle_normal, 0xffa51e);
          triangle_geometry.vertices.push(point1, point2, point3);
          triangle_geometry.faces.push(triangle_face);

          //mesh creation
          var triangle_material = new THREE.MeshPhongMaterial({
                                  color: 	0x000000,
                                  specular: 0xffffff,
                                  shininess: 10,
                                  morphTargets: true,
                                  vertexColors: THREE.FaceColors,
                                  shading: THREE.FlatShading
                                  });
          triangle_material.side = THREE.DoubleSide
          var this_triangle = new THREE.Mesh(triangle_geometry, triangle_material);
          var this_triangle_name = eval('"triangle_firsts" + eval(x + z + 1)');
          triangles[this_triangle_name] = this_triangle;
          //scene.add(triangles[this_triangle_name]);
        }
      }
    }
    if (loop == 1) {
      var count = points_in_raw * points_in_raw - points_in_raw
      for (var z = points_in_raw; z < (points_in_raw * points_in_raw); z = z + points_in_raw) {
        for (var x = 0; x < points_in_raw - 1; x++) {
          //points
          var triangle_geometry = new THREE.Geometry();
          var point1 = new THREE.Vector3(points[eval("'point' + eval(z + x + 1)")][0],
                                        points[eval("'point' + eval(z + x + 1)")][1],
                                        points[eval("'point' + eval(z + x  + 1)")][2]);
          var point2 = new THREE.Vector3(points[eval("'point' + eval(z + x - points_in_raw + 1)")][0],
                                        points[eval("'point' + eval(z + x - points_in_raw + 1)")][1],
                                        points[eval("'point' + eval(z + x - points_in_raw + 1)")][2]);
          var point3 = new THREE.Vector3(points[eval("'point' + eval(z + x + 2)")][0],
                                        points[eval("'point' + eval(z + x + 2)")][1],
                                        points[eval("'point' + eval(z + x + 2)")][2]);

          //normal vector calculation
          var vector1_substract = soustract_array(point2, point1);
          var vector1 = new THREE.Vector3(vector1_substract["x"],
                                                      vector1_substract["y"],
                                                      vector1_substract["z"]);
          var vector2_substract = soustract_array(point3, point1);
          var vector2 = new THREE.Vector3(vector2_substract["x"],
                                          vector2_substract["y"],
                                          vector2_substract["z"]);
          var this_triangle_normal = new THREE.Vector3();
          this_triangle_normal.multiplyVectors(vector1, vector2);

          //Face generation
          var triangle_face = new THREE.Face3(0, 1, 2, this_triangle_normal, 0xffa51e);
          triangle_geometry.vertices.push(point1, point2, point3);
          triangle_geometry.faces.push(triangle_face);

          //mesh creation
          var this_triangle = new THREE.Mesh(triangle_geometry);
          var this_triangle_name = eval('"triangle_return" + count');
          count = count + 1
          triangles[this_triangle_name] = this_triangle;
        }
      }
    }
  }
}


//merge the triangles into one mesh
function merge() {
  var map_geometry = new THREE.Geometry();
  for (i in triangles) {
    triangles[i].updateMatrix();
    map_geometry.merge(triangles[i].geometry, triangles[i].matix);
  }
  var map_material = new THREE.MeshPhongMaterial({
                          color: 	0x000000,
                          specular: 0xffffff,
                          shininess: 10,
                          morphTargets: true,
                          vertexColors: THREE.FaceColors,
                          shading: THREE.FlatShading
                          });
  var map = new THREE.Mesh(map_geometry, map_material);
  map.castShadow = true;
	map.receiveShadow = true;
  map.material.side = THREE.DoubleSide
  scene.add(map);
}


//Creation of the spheres
var material_sphere = {};
var spheres_map = new THREE.Object3D();
var sphere_map_small = new THREE.Object3D();
var spheres = {};
function spheres_creation() {
  var settings = new THREE.SphereBufferGeometry(
    4, //radius
    10, //horizontal segments
    10 //vertical rings
  );
  for (var i = 0; i < point_nb - 1; i++) {
    var this_sphere = eval('"sphere" + eval(i + 1)');
    var this_material = eval('"material_sphere" + eval(i + 1)');
    material_sphere[this_material] = new THREE.MeshBasicMaterial(
      {color: 0xffffff}
    );
    spheres[this_sphere] = new THREE.Mesh( settings, material_sphere[this_material] );
    spheres[this_sphere].position.setX(points[eval('"point" + eval(i + 1)')][0]);
    spheres[this_sphere].position.setY(points[eval('"point" + eval(i + 1)')][1]);
    spheres[this_sphere].position.setZ(points[eval('"point" + eval(i + 1)')][2]);
    spheres_map.add(spheres[this_sphere]);
  }
  scene.add(spheres_map);
  for (var i = 0; i < point_nb - 1; i++) {
    var material = material_sphere[eval('"material_sphere" + eval(i + 1)')]
    spheres[eval('"sphere" + eval(i + 1)')].material.visible = false;
  }
  sphere_map_small = spheres_map.clone();
  sphere_map_small.traverse(function (child) {
                              child.material = new THREE.MeshBasicMaterial(
                                {color: 0xffffff}
                              );
                              child.material.visible = false;
                              child.geometry = new THREE.SphereBufferGeometry(1, 10, 10);
                            });
  scene.add(sphere_map_small);
}



//Creates the click condition for the sphere visibility check
var click_condition = false;
var sphere_click_condition = {}
function create_click_condition() {
  var count = 0
  if (click_condition == false) {
    spheres_map.traverse(function(child) {
      count++
      var this_sphere = eval('"sphere" + count')
      sphere_click_condition[this_sphere] = false;
    });
  }
  click_condition = true;
}


//Raycaster for the spheres
var raycaster = new THREE.Raycaster();
var mouseVector = new THREE.Vector3(1, 1);
var sphere_intersect
var intersect
function raycasting() {
  raycaster.setFromCamera(mouseVector, camera);
  intersect = raycaster.intersectObjects( spheres_map.children );
  for (var i = 0; i < intersect.length; i++) {
    intersection = intersect[i]
    sphere_intersect = intersection.object;
  }
}

//Sphere visible/unvisible
var loop_condition = true; //Condition to avoid several visible sphere at the same time
var visible_sphere = new THREE.Object3D();
function onMouseSphere() {
  if (intersect != 0 && loop_condition == true) {
    loop_condition = false;
    spheres_map.traverse(function (child) {
                          if (sphere_click_condition[eval("'sphere' + pointed_sphere_index")] == true) {
                            sphere_map_small.children[pointed_sphere_index - 1].material.color.setHex(0x6f6f6f);
                          } else if (sphere_click_condition[eval("'sphere' + pointed_sphere_index")] == false) {
                            sphere_map_small.children[pointed_sphere_index - 1].material.color.setHex(0xFFFFFF);
                          }
                          if (child == sphere_intersect) {
                            sphere_map_small.children[pointed_sphere_index - 1].material.visible = true;
                            visible_sphere = child;
                          }
                        });
  } else if ((sphere_intersect != visible_sphere || intersect == 0) && loop_condition == false) {
      loop_condition = true;
      var count = -1
      sphere_map_small.traverse(function (child) {
                            count++
                            this_sphere = eval("'sphere' + count")
                            if (sphere_click_condition[this_sphere] == true) {
                              sphere_map_small.children[pointed_sphere_index - 1].material.color.setHex(0xFFFFFF);
                            }
                            if (child.material.visible == true) {
                              if (sphere_click_condition[this_sphere] == false) {
                                child.material.visible = false;
                              }
                            }
                          });
  }
}


//Get the curent pointed sphere index
var count_sphere
var pointed_sphere_index
function count_sphere_index() {
  if (intersect != 0) {
    count_sphere = -1
    spheres_map.traverse(function (child) {
                          count_sphere++
                          if (child == sphere_intersect) {
                            pointed_sphere_index = count_sphere;
                          }
                        });
  }
}


//Sphere rising and falling
var stop_event = false; //to stop everything during the animations
var rise_max = 20;
var falling_condition = false;
var rising_condition = false;
var this_anim_sphere
var velocity_anim = 1
function anim_sphere(arg) {
  var rise = 0
  velocity_anim = 0.5;
  //Rising sphere animation
  if (arg == "rising") {
    this_anim_sphere = pointed_sphere_index - 1
    var count = 0
    function rising() {
      if (rising_condition) return;
      if (rise < rise_max) {
        count += 0.4
        velocity_anim = 1 / count
        rise += 0.5 //Change this value for the velocity of the anim the bigger the quicker
        spheres_map.children[this_anim_sphere].position.y += 1.5 * velocity_anim
        sphere_map_small.children[this_anim_sphere].position.y += 1.5 * velocity_anim
      } else if (rise = rise_max) {
        rising_condition = true;
        stop_event = false;
        rise = 0
      }
      requestAnimationFrame(rising)
    }
    rising();

  //falling sphere animation
  } else if (arg == "falling") {
    this_anim_sphere = pointed_sphere_index - 1
    var count = 0
    function falling() {
      if (falling_condition) return;
      if (rise < rise_max) {
        count += 0.4
        velocity_anim = 1 / count
        rise += 0.5 //Change this value for the velocity of the anim the bigger the quicker
        spheres_map.children[this_anim_sphere].position.y -= 1.5 * velocity_anim
        sphere_map_small.children[this_anim_sphere].position.y -= 1.5 * velocity_anim
      } else if (rise = rise_max) {
        spheres_map.children[this_anim_sphere].position.y = points[eval('"point" + (this_anim_sphere + 1)')][1]
        sphere_map_small.children[this_anim_sphere].position.y = points[eval('"point" + (this_anim_sphere + 1)')][1]
        falling_condition = true;
        stop_event = false;
        rise = 0
        sphere_click_condition[eval('"sphere" + (this_anim_sphere + 1)')] = false;
        loop_condition = false;
      }
      requestAnimationFrame(falling)
    }
    falling();
  }
}


//Oscillation
var amplitude = 0.01;
var period = 5000; //in millisecond
var stop_oscill = true;
var oscillation_condition = false;
var time
var sphere_height_oscillation
function oscillation() {
  var this_oscill_sphere = -1
  for (i in sphere_click_condition) {
    this_oscill_sphere++
    if (sphere_click_condition[i] == true) {
      stop_oscill = false;
      time = (new Date()).getTime();
      sphere_height_oscillation = amplitude * Math.sin(time * 2 * Math.PI / period)
      sphere_map_small.children[this_oscill_sphere].position.y += amplitude * Math.sin(time * 2 * Math.PI / period);
      sphere_height_oscillation = sphere_map_small.children[this_oscill_sphere].position.y
    } else {
      stop_oscill = true;
    }
  }
  if (stop_oscill) return;
  requestAnimationFrame(oscillation);
}


//Center the scene for the camera angle
function center_scene() {
  for (var i = 0; i < scene.children.length; i++){
    if (scene.children[i] != X_axis && scene.children[i] != Y_axis && scene.children[i] != Z_axis){
     var obj = scene.children[i];
     obj.position.x -= points_in_raw * 10 / 2
     obj.position.z -= points_in_raw * 10 / 2
    }
  }
}


//Every frame animation
function every_frame() {
  requestAnimationFrame(every_frame)
  controls.update();
  oscillation();
  onMouseSphere();
  render();
}


//Render
function render() {
  renderer.render(scene, camera);
};


//Debug functiond
var X_axis
var Y_axis
var Z_axis
function check_sphere() {
  if (intersect != 0) {
    console.log(pointed_sphere_index, "  ", sphere_click_condition[eval('"sphere" + pointed_sphere_index')]);
  }
}

function check_axis() {
  var start = new THREE.Vector3(0, 0, 0);
  var X_axis_geom = new THREE.Geometry();
  X_axis_geom.vertices.push(
    start,
    new THREE.Vector3(20, 0, 0)
  );
  var Y_axis_geom = new THREE.Geometry();
  Y_axis_geom.vertices.push(
    start,
    new THREE.Vector3(0, 20, 0)
  );
  var Z_axis_geom = new THREE.Geometry();
  Z_axis_geom.vertices.push(
    start,
    new THREE.Vector3(0, 0, 20)
  );
  var X_axis_material = new THREE.LineBasicMaterial( {color : 0xff0000} )
  var Y_axis_material = new THREE.LineBasicMaterial( {color : 0x00ff00} )
  var Z_axis_material = new THREE.LineBasicMaterial( {color : 0x0000ff} )
  X_axis = new THREE.Line(X_axis_geom, X_axis_material)
  Y_axis = new THREE.Line(Y_axis_geom, Y_axis_material)
  Z_axis = new THREE.Line(Z_axis_geom, Z_axis_material)
  scene.add(X_axis, Y_axis, Z_axis);
}


//Function to initiate the scene
function INIT() {
  //check_axis();
  points_coord();
  spheres_creation();
  triangulation();
  merge();
  create_click_condition();
  center_scene();
  every_frame();
}

function fadetext() {
  var textbox = document.getElementById("testtext");
  textbox.style.opacity = (textbox.style.opacity == 1) ? 0 : 1;
}


//__________________Script routine___________________//

INIT();

//Fullscreen enabler
document.body.addEventListener("keydown", onKeyDown , false);
function onKeyDown(e) {
  if (e.key == "f") {
    THREEx.FullScreen.request();
  }
  //testtext
  if (e.key == "t") {
    fadetext();
  }
}


//fadetext();


//Auto update resize
window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

//Mouse Listening
window.addEventListener("mousemove", onMouseMove, false);
function onMouseMove(e) {
  mouseVector.x = 2 * (e.clientX / window.innerWidth) - 1;
  mouseVector.y = 1 - 2 * ( e.clientY / window.innerHeight );
  raycasting();
  count_sphere_index();
  //check_sphere();
}

//Mouse Listening
window.addEventListener("mousedown", onMouseDown, false);
function onMouseDown(e) {
  if (e.which === 1) {
    if (stop_event == false) {
      if (intersect != 0) {
        if (sphere_click_condition[eval('"sphere" + pointed_sphere_index')] == false) {
          rising_condition = false;
          stop_event = true;
          anim_sphere("rising");
          sphere_click_condition[eval('"sphere" + pointed_sphere_index')] = true;
        } else if (sphere_click_condition[eval('"sphere" + pointed_sphere_index')] == true) {
          falling_condition = false;
          stop_event = true;
          anim_sphere("falling");
        }
      }
    }
  }
}
