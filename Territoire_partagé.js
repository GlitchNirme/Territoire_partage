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
var sky_material = new THREE.MeshPhongMaterial({color: 	0xe1e1e1,
                                                specular: 0xe1e1e1,
                                                shininess: 20,
                                              });
var sky = new THREE.Mesh(sky_geometry, sky_material);
sky.material.side = THREE.DoubleSide
scene.add(sky);


renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


//__________________Functions___________________//


//Render
function render() {
  renderer.render(scene, camera);
};

//Create points
function create_point() {
  var point_map = new THREE.TextureLoader().load( "Territoire partagé/sprite.png" );
  var point_material = new THREE.SpriteMaterial( { map: point_map, color: 0xffffff, fog: false} );
  var point = new THREE.Sprite( point_material );
  sprite.position.set( 0, 0, 0 );
	sprite.position.normalize();
	sprite.position.multiplyScalar( 100 );
  scene.add( sprite );
}

//Every frame animation
function every_frame() {
  requestAnimationFrame(every_frame)
  controls.update();
  render();
}

function INIT() {
  create_point();
  every_frame();
}

//__________________Script routine___________________//


INIT();
