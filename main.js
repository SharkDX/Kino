var ground;
var plane;
var camera;
var scene;
var renderer;
var controls;
var mesh;
var mainLight;
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

	setupCameraAndControls();
	setupLights();
	setupTerrain();
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

function setupCameraAndControls()
{
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 100 );
    camera.position.x = -2;
    camera.position.y = 3;
    camera.position.z = -3;
    camera.lookAt(scene.position);
    controls = new THREE.OrbitControls( camera );
}

function setupLights()
{
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    mainLight = new THREE.DirectionalLight(0xffffff, 0.7);
    mainLight.position.x = 1.0;
    mainLight.position.y = 5.0;
    mainLight.position.z = 3.0;
    mainLight.castShadow = true;
    var dLight = 5;
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
}

function setupTerrain()
{
    var noiseScale = 0.5;
    var terrainSize = 20;
    var terrainSegmentsPerUnit = 10;
    var segmentScale = 1.0 / terrainSegmentsPerUnit;
    plane = new THREE.PlaneGeometry(terrainSize, terrainSize, terrainSize * terrainSegmentsPerUnit, terrainSize * terrainSegmentsPerUnit);
    plane.rotateX(- Math.PI / 2);


    var vertices = plane.vertices;
    for (var i = 1; i < vertices.length; i++)
    {
        if ( i % 10000 == 0)
            console.log("%i%", (i / vertices.length) * 100);
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

    var groundMaterial = new THREE.MeshLambertMaterial( {color: 0xaaaaaa, side: THREE.DoubleSide} );
    ground = new THREE.Mesh(plane, groundMaterial);
    ground.receiveShadow = true;
    scene.add(ground);

    var geometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
    var material = new THREE.MeshPhongMaterial( { color: 0xffffff } );
    mesh = new THREE.Mesh( geometry, material );
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.position.y = 0.51;
    scene.add( mesh );
}