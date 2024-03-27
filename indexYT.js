import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import Stats from 'three/addons/libs/stats.module.js';


//1 - CLASS

	class Box extends THREE.Mesh { // je cherche a cree une class afin de calculer facilement la taille de mon cube
		constructor({ width , height , depth, colors, velocity = { //par default zero
			x: 0,
			y: 0,
			z: 0
		},
		position = {
			x: 0,
			y: 0,
			z: 0
		},
		zAcceleration = false
	}) {
			super( 
				new THREE.BoxGeometry( width, height, depth ), // de base (1,1,1) nous fesons en sorte que les parametre du contructeur soit = au parametre de BoxGeometry
				new THREE.MeshStandardMaterial( { color: colors } )
				) // appelle les constructeur de THREE.MESH, permet donc d'utiliser leur info sans les modifiers
				this.width = width // permet de recupere les info avec le this.
				this.height = height //OBJECTIF
				this.depth = depth
				this.colors = colors
				this.velocity = velocity
				this.gravity = 0.005
				this.position.set(position.x, position.y, position.z)
				this.zAcceleration = zAcceleration
			
				
				// ici je detecte les cotes de mon cube
				
				this.bottom = this.position.y-(this.height)/2 // this permet de generaliser
				this.top = this.position.y+(this.height)/2
				this.right = this.position.x+(this.width)/2
				this.left = this.position.x-(this.width)/2
				this.front = this.position.z+(this.depth)/2
				this.back = this.position.z-(this.depth)/2
		}
		update(group, falltestx) {
			// actualise les positions
			this.bottom = this.position.y-(this.height)/2 
			this.top = this.position.y+(this.height)/2
			this.right = this.position.x+(this.width)/2
			this.left = this.position.x-(this.width)/2
			this.front = this.position.z+(this.depth)/2
			this.back = this.position.z-(this.depth)/2
			// this.position.y -= 0.01
			if (this.zAcceleration) {
				if (this.velocity.x > 0 ) {
					this.velocity.x += 0.0001
				} else if (this.velocity.x < 0) {
					this.velocity.x -= 0.0001
				} else if (this.velocity.z > 0) {
					this.velocity.z -= 0.0001
				} else if (this.velocity.z < 0) {
					this.velocity.z += 0.0001
				}
			}
			
			this.position.x += this.velocity.x // gère les deplacement x
			this.position.z += this.velocity.z // gère les deplacements "y"
			this.applyGravity(group)
			// this.velocity.z *= 0.98 autre methode que les keypress pour ralentir
			// this.velocity.x *= 0.98
			// gère les colision avec le sol et tombe si sort de la plateforme
			if (this.right <= sol.left || this.bottom < sol.bottom || this.left >= sol.right || this.front <= sol.back || this.back>= sol.front) { // gère le cas ou on straf dans les airs
			this.position.y -= 0.12		
			}
			// test si il y a colision sur x
			if (this.right >= sol.left && this.left <= sol.right ){
			
			}
			// test si il y a colision sur z
			if (this.front>= sol.back && this.back <= sol.front ){
			
			}
			
		}
		colisionDetector(box1, box2) {
			if (box1.right >= box2.left && box1.left <= box2.right &&
				box1.top >= box2.bottom && box1.bottom <= box2.top &&
				box1.front >= box2.back && box1.back <= box2.front) {
			  return true;
			}
		}
		applyGravity(group) {
			
			this.velocity.y -= this.gravity //ici gravite 
			// if (this.bottom <= group.top ) 
			// this.velocity.y = 0 // si colision vitesse a zero // pas bounce
			if (this.bottom + this.velocity.y <= group.top ) {//permet de cree une colision entre le sol et le cube 
				this.velocity.y *= 0.1 // reduit la vitesse a chaque bounce
				this.velocity.y = -this.velocity.y //bounce
			} else { // avant la colision
				this.position.y += this.velocity.y
			}
		}
	}
	//fps

	var stats = new Stats();
    stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild( stats.dom );


	//Scene
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000 );
		camera.position.y = 25,
		camera.position.x = 0,
		camera.position.z = 15;


	//renderer
		const renderer = new THREE.WebGLRenderer({
			alpha: true,
			antialias: true

		});
		renderer.shadowMap.enabled = true // cree des ombres en rendu
		renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( renderer.domElement );
		const controls = new OrbitControls(camera, renderer.domElement) //l'addons orbit permetant de ce deplacer

//2- GEOMETRY N MATERIAL


	//Cree Mon donut

		const geometryDonut = new THREE.TorusGeometry(1, 0.3, 8, 50);
		const materialDonut = new THREE.MeshBasicMaterial({ color: 0xFF6347, wireframe : true });
		const donut = new THREE.Mesh( geometryDonut, materialDonut );
		donut.position.x = 3
		donut.position.y = 10
		donut.castShadow = true //le cube lance des lumières
		scene.add( donut );


	//Cree Mon losange

		const losange = new Box({    // jutilise le constructeur de cube BOX soit ( width, height, depth )  
			width: 1,
			height: 1,
			depth: 1,
			colors: 0x00ff00,
			velocity: { // je mets en place un mouvement par defaut vers le bas pour mon cube
				x: 0,
				y: 0,
				z: 0
			},
			position: { //sa position par default
				x: 0,
				y: 10,
				z: 0
			}
		}) 


		 // tourne la box

		const quaternion = new THREE.Quaternion();
		quaternion.setFromAxisAngle( new THREE.Vector3( 0, 0.6, 0 ), Math.PI / 2 );
		losange.applyQuaternion(quaternion)
		
		losange.castShadow = true //le cube lance des lumières
		scene.add( losange );

			//Cree Mon losange2

			const losange2 = new Box({    // jutilise le constructeur de cube BOX soit ( width, height, depth )  
				width: 1,
				height: 1,
				depth: 1,
				colors: 0xffffff,
				velocity: { // je mets en place un mouvement par defaut vers le bas pour mon cube
					x: 0,
					y: 0,
					z: 0,
				},
				position: { //sa position par default
					x: 0,
					y: 10,
					z: 0
				}
			}) 
	
	
	
			 // tourne la box
	
			const quaternion2 = new THREE.Quaternion();
			quaternion2.setFromAxisAngle( new THREE.Vector3( 0, 0.6, 0 ), Math.PI / 2 );
			losange2.applyQuaternion(quaternion2)
			
			losange2.castShadow = true //le cube lance des lumières
			scene.add( losange2 );

	//Cree Mon sol

		// const geometrySol = new THREE.BoxGeometry( 10, 0.4, 10 );
		// const materialSol = new THREE.MeshStandardMaterial( { color: 0x00ffff } );
		// const sol = new THREE.Mesh( geometrySol, materialSol );
		const sol = new Box({    // jutilise le constructeur de cube BOX soit ( width, height, depth )  
			width: 20,
			height: 0.4,
			depth: 20,
			colors: 0x00ffff,
			position: {
				x: 0,
				y: 0,
				z: 0
			}
		}) 
		sol.receiveShadow = true // le sol recupere des ombres
		scene.add( sol );

	// WALL

		const wallRight = new Box({    // jutilise le constructeur de cube BOX soit ( width, height, depth )  
			width: 0.2,
			height: 1.5,
			depth: sol.width,
			colors: 0x00ffff,
			position: {
				x: sol.width/2,
				y: sol.position.y + (sol.height/2),
				z: 0
			}
		}) 
		wallRight.receiveShadow = true // le sol recupere des ombres
		scene.add( wallRight );

		const wallBot = new Box({    // jutilise le constructeur de cube BOX soit ( width, height, depth )  
			width: sol.width+0.2,
			height: 1.5,
			depth: 0.2,
			colors: 0x00ffff,
			position: {
				x: 0,
				y: sol.position.y + (sol.height/2),
				z: sol.width/2,
			}
		}) 
		wallBot.receiveShadow = true // le sol recupere des ombres
		scene.add( wallBot );


		const wallTop = new Box({    // jutilise le constructeur de cube BOX soit ( width, height, depth )  
			width: sol.width,
			height: 1.5,
			depth: 0.2,
			colors: 0x00ffff,
			position: {
				x: 0,
				y: sol.position.y + (sol.height/2),
				z: -sol.width/2,
			}
		}) 
		wallTop.receiveShadow = true // le sol recupere des ombres
		scene.add( wallTop );

		const wallLeft = new Box({    // jutilise le constructeur de cube BOX soit ( width, height, depth )  
			width: 0.2,
			height: 1.5,
			depth: sol.width+0.2,
			colors: 0x00ffff,
			position: {
				x: -sol.width/2,
				y: sol.position.y + (sol.height/2),
				z: 0,
			}
		}) 
		wallLeft.receiveShadow = true // le sol recupere des ombres
		scene.add( wallLeft );





//ENEMIES

const multipleBox = [];

	


// for (let i = 0; i <= 10; i++) {
	const badWall = new Box({
		width: 3,
		height: 4,
		depth: 3,
		colors: 0x0000ff,
		position: {
			x: (Math.random() -0.5) * 25,
			y: 2,
			z:  5, // décaler chaque mur le long de l'axe z
		},
	});
	badWall.receiveShadow = true; 

	scene.add(badWall)

	const multipleWall = [badWall];

	

	for (let index = 1; index <= 15; index++ ) {
		let uwuWall = Math.floor(Math.random() * 2) + 1;
		const badWall = new Box({
			width: uwuWall,
			height: 2,
			depth: uwuWall,
			colors: 0x0000ff,
			position: {
				x: (Math.random() -0.5) * 20,
				y: 1,
				z:  (Math.random() -0.5) * 20, // décaler chaque mur le long de l'axe z
			},
		});

		badWall.receiveShadow = true; 
		scene.add(badWall)

		multipleWall.push(badWall)
	}



	
		

	



		
//LIGHT
		const light = new THREE.DirectionalLight(0xFFFFFF, 1 )// (couleur, intensite lumiere)
		// light. = 2
		light.position.y = 10
		light.position.x = 0
		light.position.z = 10 // positione la source de la lumière
		
		//Set up shadow properties for the light

		light.shadow.mapSize.width = 5120 
		light.shadow.mapSize.height = 5120 
		light.shadow.camera.near = 0.1 
		light.shadow.camera.far = 500 
		light.shadow.camera.top = -100
		light.shadow.camera.right = 100 
		light.shadow.camera.left = -100 
		light.shadow.camera.bottom = 100 

		light.castShadow = true // envoie des ombres
		scene.add(light)

		scene.add(new THREE.AmbientLight(0x404040, 0.4))


//skybox

		let materialArray = [];

		const topX = new THREE.TextureLoader().load("./galaxy/space_ft.png"); //charge chaque face ft
		const topY = new THREE.TextureLoader().load("./galaxy/space_bk.png"); //bk
		const topZ = new THREE.TextureLoader().load("./galaxy/space_up.png"); //up
		const botX = new THREE.TextureLoader().load("./galaxy/space_dn.png"); //dn
		const botY = new THREE.TextureLoader().load("./galaxy/space_rt.png"); //rt
		const botZ = new THREE.TextureLoader().load("./galaxy/space_lf.png"); //lf

		materialArray.push(new THREE.MeshBasicMaterial({map: topX})) // les loads
		materialArray.push(new THREE.MeshBasicMaterial({map: topY}))
		materialArray.push(new THREE.MeshBasicMaterial({map: topZ}))
		materialArray.push(new THREE.MeshBasicMaterial({map: botX}))
		materialArray.push(new THREE.MeshBasicMaterial({map: botY}))
		materialArray.push(new THREE.MeshBasicMaterial({map: botZ}))

		for (let i=0; i<6; i++) { // charge texture a l'interieur du cube
			materialArray[i].side = THREE.BackSide;
		}

		let skyboxGeo = new THREE.BoxGeometry(1000, 1000, 1000);
		let skybox = new THREE.Mesh(skyboxGeo, materialArray);
		scene.add(skybox);
		
//listener keydown
let LastKeyBeforeImpact = "KeyW"; // permet de gérer la collision
let LastKeyBeforeImpact2 = "KeyL"; // permet de gérer la collision
const keys = {
q: {
pressed: false,
},
d: {
pressed: false,
},
z: {
pressed: false,
},
s: {
pressed: false,
},
K: {
pressed: false,
},
O: {
pressed: false,
},
L: {
pressed: false,
},
M: {
pressed: false,
},
};

window.addEventListener("keydown", function (event) {
	if (multipleWall.some((badWall) => losange.colisionDetector(losange, badWall))) {
	} else {
		if (event.code == "KeyA" || event.code == "KeyD" || event.code == "KeyW" || event.code == "KeyS") {
		LastKeyBeforeImpact = event.code;
			switch (LastKeyBeforeImpact) {
				case "KeyA": // q en qwerty
					keys.q.pressed = true;
					keys.z.pressed = false;
					keys.d.pressed = false;
					keys.s.pressed = false;
					// losange.velocity.x = -0.1;
					break;
				case "KeyD":
					keys.d.pressed = true;
					keys.z.pressed = false;
					keys.q.pressed = false;
					keys.s.pressed = false;
					// losange.velocity.x = +0.1;
					break;
				case "KeyW": // z en qwerty
					keys.z.pressed = true;
					keys.q.pressed = false;
					keys.d.pressed = false;
					keys.s.pressed = false;
					// losange.velocity.z = -0.1;
					break;
				case "KeyS":
					keys.s.pressed = true;
					keys.z.pressed = false;
					keys.d.pressed = false;
					keys.q.pressed = false;
					// losange.velocity.z = +0.1;
					break;
				}
			}
		}
		});

		//listener keyup
		window.addEventListener("keyup", function (event) {
			switch (event.code) {
				case "KeyA":
				case "KeyD":
					keys.q.pressed = false;
					keys.d.pressed = false;
					losange.velocity.x = 0;
					break;
				case "KeyW":
				case "KeyS":
					keys.z.pressed = false;
					keys.s.pressed = false;
					losange.velocity.z = 0;
					break;
		}
		});

		window.addEventListener("keydown", function (event) {
			if (multipleWall.some((badWall) => losange2.colisionDetector(losange2, badWall))) {
			} else {
				if (event.code == "KeyK" || event.code == "KeyL" || event.code == "KeyO" || event.code == "Semicolon") {
					LastKeyBeforeImpact2 = event.code;
					switch (LastKeyBeforeImpact2) {
						case "KeyK": // q en qwerty
							keys.K.pressed = true;
							keys.L.pressed = false;
							keys.O.pressed = false;
							keys.M.pressed = false;
							// losange2.velocity.x = -0.1;
							break;
						case "Semicolon":
							keys.K.pressed = false;
							keys.L.pressed = false;
							keys.O.pressed = false;
							keys.M.pressed = true
							// losange2.velocity.x = +0.1;
							break;
						case "KeyO": // z en qwerty
							keys.K.pressed = false;
							keys.L.pressed = false;
							keys.O.pressed = true;
							keys.M.pressed = false
							// losange2.velocity.z = -0.1;
							break;
						case "KeyL":
							keys.K.pressed = false;
							keys.L.pressed = true;
							keys.O.pressed = false;
							keys.M.pressed = false
							// losange2.velocity.z = +0.1;
							break;
						}
					}
				}
				});

			

				//listener keyup
				window.addEventListener("keyup", function (event) {
				switch (event.code) {
					case "KeyK":
					case "Semicolon":
						keys.K.pressed = false;
						keys.M.pressed = false;
						losange2.velocity.x = 0;
						break;
					case "KeyO":
					case "KeyL":
						keys.O.pressed = false;
						keys.L.pressed = false;
						losange2.velocity.z = 0;
						break;
						}
					});

				





//ANIMATION

	let msPrevious = window.performance.now(); // recupere le temps actuel
    const fps = 60; // cape a 60fps
    const msPerFrame = 1000 / fps; // calcule le temps entre chaque frame
    let frames = 0; //depart

	let myIcmX = 0
	let myIcmZ = 0
	let movableNumber = 400;
	let counter = 0;




	function animate() {

			
			const animationId = requestAnimationFrame( animate ); //lance lanimation
			let soloPlayer 

	// fps 

            const msNow = window.performance.now(); 
            const msPassed = msNow - msPrevious; // calcule le temps ecoulé entre chaque frame
            stats.begin();

            if (msPassed < msPerFrame) { // si le temps ecoulé est inferieur au temps entre chaque frame
                return;
            }
            msPrevious = msNow - (msPassed % msPerFrame); // recupere le temps actuel
            const currentTime = performance.now();
            const deltaTime = currentTime - msPrevious;
			if (deltaTime >= 1000) {
                frames = 0;
            }
		
	// animate donut

			donut.rotation.x += 0.01;
			donut.rotation.y += 0.01;
			

	// update les positions 

			losange.update(sol)
			losange2.update(sol)

			if (keys.z.pressed){
				losange.velocity.z = -0.1;
			} else if (keys.q.pressed){
				losange.velocity.x = -0.1;
			} else if (keys.s.pressed){
				losange.velocity.z = +0.1;
			} else if (keys.d.pressed){
				losange.velocity.x = +0.1;
			}else if (keys.K.pressed){
				losange2.velocity.x = -0.1;
			}else if (keys.L.pressed){
				losange2.velocity.z = +0.1;
			}else if (keys.M.pressed){
				losange2.velocity.x = +0.1;
			}else if (keys.O.pressed){
				losange2.velocity.z = -0.1;
			}


			// for (let i = 0; i < multipleWall.length; j++) {
			// 	for (let j = 0; j < multipleWall.length; j++) {
			// 		if (i === j) {
			// 			continue; // passer à l'itération suivante si i est égal à j
			// 		}
						
			// 	}
			// }
				
					
			for (let i = 0; i < multipleBox.length; i++) { // colision entre deux rouges
					let ty = myIcmX
					let ty1 = myIcmZ
				for (let j = 0; j < multipleBox.length; j++) {
				  if (i === j) {
					continue; // la box ne peux pas ce colise elle meme
				  }
				  if (losange.colisionDetector(multipleBox[i], multipleBox[j])) {
					// multipleBox[i].velocity.x = 0
					// multipleBox[i].velocity.z = 0
					// multipleBox[i].zAcceleration = false
					
					if (ty > 0) {
						multipleBox[i].position.x -= 0.1
						multipleBox[i].velocity.x = 0;
						multipleBox[i].velocity.y = 0;
						multipleBox[i].velocity.z = 0;
						multipleBox[j].position.x += 0.1


					} else if (ty < 0) {
						multipleBox[i].position.x += 0.1
						multipleBox[i].velocity.x = 0;
						multipleBox[i].velocity.y = 0;
						multipleBox[i].velocity.z = 0;
						multipleBox[j].position.x -= 0.1

					} else if (ty1  > 0) {
						multipleBox[i].position.z -= 0.1
						multipleBox[i].velocity.x = 0;
						multipleBox[i].velocity.y = 0;
						multipleBox[i].velocity.z = 0;
						multipleBox[j].position.z += 0.1

					} else if (ty1<  0) {
						multipleBox[i].position.z += 0.1
						multipleBox[i].velocity.x = 0;
						multipleBox[i].velocity.y = 0;
						multipleBox[i].velocity.z = 0;
						multipleBox[j].position.z -= 0.1

					}
				  }
				}
			  }
				

			
			multipleWall.forEach((badWall) => {
				// badWall.update(sol)
			if (losange.colisionDetector(losange, badWall)){ // a d s w = q d s z
					// window.cancelAnimationFrame(animationId) // stop le jeu
					losange.velocity.x =0
					losange.velocity.y =0
					losange.velocity.z =0
					losange.zAcceleration = false
				
					if (LastKeyBeforeImpact == "KeyA") {
						losange.position.x += 0.01
					} else if (LastKeyBeforeImpact == "KeyD") {
						losange.position.x -= 0.01
					} else if (LastKeyBeforeImpact == "KeyS") {
						losange.position.z -= 0.01
					} else if (LastKeyBeforeImpact == "KeyW") {
						losange.position.z += 0.01
					}
				}else if (losange2.colisionDetector(losange2, badWall)){ // a d s w = q d s z
					// window.cancelAnimationFrame(animationId) // stop le jeu
					losange2.velocity.x =0
					losange2.velocity.y =0
					losange2.velocity.z =0
					losange2.zAcceleration = false
				
					if (LastKeyBeforeImpact2 == "KeyK") {
						losange2.position.x += 0.01
					} else if (LastKeyBeforeImpact2 == "Semicolon") {
						losange2.position.x -= 0.01
					} else if (LastKeyBeforeImpact2 == "KeyL") {
						losange2.position.z -= 0.01
					} else if (LastKeyBeforeImpact2 == "KeyO") {
						losange2.position.z += 0.01
					}
				}
			}
			)

			

			
			


			multipleBox.forEach((badBox) => {
				badBox.update(sol)
				if (losange.colisionDetector(losange, badBox)){
					window.cancelAnimationFrame(animationId) // stop le jeu
					document.location.href="GameOverPlayer2.html"
			} else if(losange2.colisionDetector(losange2, badBox)){
				window.cancelAnimationFrame(animationId) // stop le jeu
				document.location.href="GameOverPlayer1.html"
			}		
			if (losange.colisionDetector(losange, badWall)){ // a d s w = q d s z
				// window.cancelAnimationFrame(animationId) // stop le jeu
				losange.velocity.x =0
				losange.velocity.y =0
				losange.velocity.z =0
				losange.zAcceleration = false
			
				if (LastKeyBeforeImpact == "KeyA") {
					losange.position.x += 0.015
				} else if (LastKeyBeforeImpact == "KeyD") {
					losange.position.x -= 0.015
				} else if (LastKeyBeforeImpact == "KeyS") {
					losange.position.z -= 0.015
				} else if (LastKeyBeforeImpact == "KeyW") {
					losange.position.z += 0.015
				}
			}
				
				
				
				if (badBox.position.y <= -20) {

					scene.remove(badBox) // three remove la box qui tombe

				}
				// if (losange.colisionDetector(badBox, losange)){
				// 	window.cancelAnimationFrame(animationId) // stop le jeu
				// }
				for (let i = 0; i < multipleBox.length; i++) {
					let ty = myIcmX
					let ty1 = myIcmZ
					for (let j = 0; j < multipleWall.length; j++) {
					  if (multipleBox[i].colisionDetector(multipleBox[i], multipleWall[j])) { // ici je gère la colision entre wall et badbox

						console.log(i)
						console.log(multipleBox[i].wave)
						// multipleBox[i].velocity.x = 0;
						// multipleBox[i].velocity.y = 0;
						// multipleBox[i].velocity.z = 0;
						// multipleBox[i].zAcceleration = false;


						

						if (ty > 0) {
							multipleBox[i].position.x -= 0.1
							multipleBox[i].velocity.x = 0;
							multipleBox[i].velocity.y = 0;
							multipleBox[i].velocity.z = 0;

						} else if (ty < 0) {
							multipleBox[i].position.x += 0.1
							multipleBox[i].velocity.x = 0;
							multipleBox[i].velocity.y = 0;
							multipleBox[i].velocity.z = 0;

						} else if (ty1  > 0) {
							multipleBox[i].position.z -= 0.1
							multipleBox[i].velocity.x = 0;
							multipleBox[i].velocity.y = 0;
							multipleBox[i].velocity.z = 0;

						} else if (ty1<  0) {
							multipleBox[i].position.z += 0.1
							multipleBox[i].velocity.x = 0;
							multipleBox[i].velocity.y = 0;
							multipleBox[i].velocity.z = 0;
	
						}

						// if (multipleBox[i].colisionDetector(multipleBox[i], multipleBox[j])) {
						// 	multipleBox[i].velocity.x = 0;
						// 	multipleBox[i].velocity.y = 0;
						// 	multipleBox[i].velocity.z = 0;
						// 	multipleBox[j].velocity.x = 0;
						// 	multipleBox[j].velocity.y = 0;
						// 	multipleBox[j].velocity.z = 0;
							// if (losange.colisionDetector(multipleBox[0], multipleBox[1])){
							// 	console.log("HHHHHHHH")
							// 	losange.velocity.x =0
							// 	losange.position.y = 4
							// 	losange.velocity.z =0
							// 	losange.zAcceleration = false
							// }



						// }

						
					  }
					} 
				  }


				  


				if (losange.colisionDetector(losange, wallBot)){ // je gère la colision entre mon mur et mes badbox et mon mur et mon losange au cas par cas
					losange.velocity.x =0
					losange.velocity.y =0
					losange.velocity.z =0
					losange.position.z -= 0.01
					losange.zAcceleration = false
				}
				if (losange.colisionDetector(losange, wallLeft)){
					losange.velocity.x =0
					losange.velocity.y =0
					losange.velocity.z =0
					losange.position.x += 0.01
					losange.zAcceleration = false
				}
				if (losange.colisionDetector(losange, wallRight)){
					losange.velocity.x =0
					losange.velocity.y =0
					losange.velocity.z =0
					losange.position.x -= 0.01
					losange.zAcceleration = false
				}
				if (losange.colisionDetector(losange, wallTop)){
					losange.velocity.x =0
					losange.velocity.y =0
					losange.velocity.z =0
					losange.position.z += 0.01
					losange.zAcceleration = false
				}
				if (losange2.colisionDetector(losange2, wallBot)){ // je gère la colision entre mon mur et mes badbox et mon mur et mon losange au cas par cas
					losange2.velocity.x =0
					losange2.velocity.y =0
					losange2.velocity.z =0
					losange2.position.z -= 0.01
					losange2.zAcceleration = false
				}
				if (losange2.colisionDetector(losange2, wallLeft)){
					losange2.velocity.x =0
					losange2.velocity.y =0
					losange2.velocity.z =0
					losange2.position.x += 0.01
					losange2.zAcceleration = false
				}
				if (losange2.colisionDetector(losange2, wallRight)){
					losange2.velocity.x =0
					losange2.velocity.y =0
					losange2.velocity.z =0
					losange2.position.x -= 0.01
					losange2.zAcceleration = false
				}
				if (losange2.colisionDetector(losange2, wallTop)){
					losange2.velocity.x =0
					losange2.velocity.y =0
					losange2.velocity.z =0
					losange2.position.z += 0.01
					losange2.zAcceleration = false
				}
				if (losange.colisionDetector(badBox, wallBot)){
					badBox.velocity.x =0
					badBox.velocity.y =0
					badBox.velocity.z =0
					badBox.position.z -= 0.01
					// badBox.zAcceleration = false
				}
				if (losange.colisionDetector(badBox, wallLeft)){
					badBox.velocity.x =0
					badBox.velocity.y =0
					badBox.velocity.z =0
					badBox.position.x += 0.01
					// badBox.zAcceleration = false
				}
				if (losange.colisionDetector(badBox, wallRight)){
					badBox.velocity.x =0
					badBox.velocity.y =0
					badBox.velocity.z =0
					badBox.position.x -= 0.01
					// badBox.zAcceleration = false
				}
				if (losange.colisionDetector(badBox, wallTop)){
					badBox.velocity.x =0
					badBox.velocity.y =0
					badBox.velocity.z =0
					badBox.position.z += 0.01
					// badBox.zAcceleration = false
				}

			})

	// spawner a ennemis
			if (frames % movableNumber === 0) { // toute les 100frames un cube
				counter++
				movableNumber -= 10
				if (movableNumber <100) {
					movableNumber = 100
				}
				const badBox = new Box({    // jutilise le constructeur de cube BOX soit ( width, height, depth )  
					width: 1,
					height: 1,
					depth: 1,
					colors: 0xf00000,
					wave: 4,
					velocity: { // je mets en place un mouvement par defaut vers le bas pour mon cube
						x: 0,// acceleration de base peut etre remplacer par count pour augmenter constament 
						y: 0,
						z: 0
					},
					position: { //sa position par default
						x: (Math.random() -0.5) * 17,
						y: 15,
						z: (Math.random() -0.5) * 17, // spawn de manière random
					},
					zAcceleration: false,
				}) 
				badBox.castShadow = true //le cube lance des lumières
				scene.add( badBox );
				multipleBox.push(badBox)
				
	
			}

	// deplacement badbox

	if (frames % 400 === 0) {
			let randomRand = (Math.floor(Math.random() * 4) + 1)
			switch(randomRand) {
				case 1 :
					myIcmZ = 0
					myIcmX = 0.1
					break
				case 2 :
					myIcmZ = 0
					myIcmX = -0.1
					break
				case 3 :
					myIcmX = 0
					myIcmZ = 0.1
					break
				case 4 :
					myIcmX = 0
					myIcmZ = -0.1
					break
			}
			// console.log(i,"uwu", myIcmX, myIcmZ)
			

			for (let i = 0; i < multipleBox.length; i++) {
				multipleBox[i].velocity.x = myIcmX
				multipleBox[i].velocity.z = myIcmZ
				multipleBox[i].zAcceleration = true
			// if (myIcmX> 0 ) {
			// 	console.log("here2")
			// 	multipleBox[i].wave =1
			// } else if (myIcmX < 0 ) {
			// 	console.log("here3")
			// 	multipleBox[i].wave =2
			// } else if (myIcmZ > 0 ) {
			// 	console.log("here4")
			// 	multipleBox[i].wave =3
			// } else if (myIcmZ < 0 ) {
			// 	console.log("here5")
			// 	multipleBox[i].wave =4
			// }
			
	}
	
}

	

			stats.end();
			frames++;
			
			renderer.render( scene, camera );
}

// START GAME

	function startGame() {
		document.body.onkeyup = function(e) {
			if (e.key == " " || e.key == "1"  || e.key == "&" ) {
				animate();
			} else if (e.key == "2" || e.key == "é" ) {
				animate();
		  } else if (e.key == "p" || e.key == "P" ) {
			document.location.href = "aboutPage.html";
		  }
}}

window.addEventListener('load', () => {
	startGame();
  });