var ground;
var plane;
var camera, scene, renderer;
var mesh;
var clock = new THREE.Clock();

init();
animate();

//////////////////////////////////////////////////////////
//														//
// 														//
//														//
//														//
//    Check: https://github.com/jmcneese/libnoise.js  	//
//														//
//														//
//														//
//														//
//////////////////////////////////////////////////////////

function init()
{
	// Setup basic mangers
    noise.seed(Math.random());
	scene = new THREE.Scene();
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth - 20, window.innerHeight - 20 );
    renderer.shadowMap.enabled = true;
	document.body.appendChild( renderer.domElement );
	window.addEventListener( 'resize', onWindowResize, false );

	// Setup camera & controls
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 100 );
	camera.position.x = -2;
    camera.position.y = 3;
    camera.position.z = -3;
	camera.lookAt(scene.position);
    controls = new THREE.OrbitControls( camera );

	// Setup lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
	var mainLight = new THREE.DirectionalLight(0xffffff, 0.7);
	mainLight.position.x = 1.0;
    mainLight.position.y = 5.0;
    mainLight.position.z = 3.0;
    mainLight.castShadow = true;
    var dLight = 10;
    var sLight = dLight * 0.25;
    mainLight.shadow.camera.left = -sLight;
    mainLight.shadow.camera.right = sLight;
    mainLight.shadow.camera.top = sLight;
    mainLight.shadow.camera.bottom = -sLight;
    mainLight.shadow.camera.near = dLight / 30;
    mainLight.shadow.camera.far = dLight;
    mainLight.shadow.mapSize.x = 2048;
    mainLight.shadow.mapSize.y = 2048;
    scene.add(mainLight);

	// Setup mesh[es]
	var noiseScale = 0.5;
	var terrainSize = 10;
	var terrainSegments = 100;
	var segmentScale = terrainSize / terrainSegments;
	plane = new THREE.PlaneGeometry(terrainSize, terrainSize, terrainSegments, terrainSegments);
	plane.rotateX(- Math.PI / 2);
    var vertices = plane.vertices;
    for (var i = 1; i < vertices.length; i++)
	{
    	vertices[i].x += (Math.random() - 0.5) * segmentScale * 0.5;
        vertices[i].z += (Math.random() - 0.5) * segmentScale * 0.5;

        var height = 0;
        height += 0.2 * noise.perlin2(vertices[i].x * noiseScale, vertices[i].z * noiseScale);
        height += 0.8 * noise.perlin2(vertices[i].x * noiseScale * 0.01, vertices[i].z * noiseScale * 0.01);

        height *= 10.0;


        vertices[i].y = height;
    }
    plane.computeFlatVertexNormals();
    plane.computeFaceNormals();
    plane.dynamic = true;
    plane.castShadow = true;
    plane.receiveShadow = true;

	var groundMaterial = new THREE.MeshLambertMaterial( {color: 0xaaaaaa, side: THREE.DoubleSide} );
	ground = new THREE.Mesh(plane, groundMaterial);
    ground.receiveShadow = true;
    ground.castShadow = true;
	scene.add(ground);

	var geometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
	var material = new THREE.MeshPhongMaterial( { color: 0xffffff } );
	mesh = new THREE.Mesh( geometry, material );
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	mesh.position.y = 0.51;
	scene.add( mesh );

}

function onWindowResize()
{
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate()
{
    var deltaTime = clock.getDelta();

	requestAnimationFrame( animate );

    controls.update(deltaTime);
    renderer.render(scene, camera);
}