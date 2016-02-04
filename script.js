(function(){
	var startInitTime = (new Date()).getTime();
	console.log("---------------------Initializing--------------------")
	$(document).ready(function(){ 

		var game = {};
		game.width = 0;
		game.height = 0;
		game.midWidth = game.width / 2;
		game.midHeight = game.height / 2;
		
		game.mapWidth = 0;
		game.mapHeight = 0;
		game.tiles = [];
		
		function tile(id, x, y){
			this.id = id;
			this.x = x;
			this.y = y;
		}

		game.oldTime = (new Date().getTime());
		game.time = 0;

		game.preInitImages = [];
		game.donePreInitImages = 0;
		game.requiredPreInitImages = 0;

		game.initImages = [];
		game.doneInitImages = 0;
		game.requiredInitImages = 0;

		game.imagesToLoadInit = [
			"textures/blankTile.png","textures/blankTileHighlighted.png"
		];
         //4 images per line

		game.updates = 0;
		game.frames = 0;
		
		game.x = 0;
		game.xRoot = 0;
		game.y = 0;
		game.yRoot = 0;
		game.rotationX = 0;
		game.rotationY = 0;
		game.rotationZ = 0;
		
		game.context = document.getElementById("canvas").getContext("2d");
		
		var mouse = {};
		mouse.x = 0;
		mouse.y = 0;
		mouse.down = 0;
		mouse.lastUpX = 0;
		mouse.lastUpY = 0;
		
		document.body.onmousedown = function(){
			mouse.down = true;
		}
		document.body.onmouseup = function(){
			mouse.down = false;
		}
		document.onmousemove = function(e){
			mouse.x = e.pageX;
			mouse.y = e.pageY;
			if(!mouse.down){
				mouse.lastUpX = e.pageX;
				mouse.lastUpY = e.pageY;
			}
		}
		$("#resetViewPort").click(function(){
			game.x = 0;
			game.xRoot = 0;
			game.y = 0;
			game.yRoot = 0;
		})
		
		/* Key Codes
		Up Arrow		38
		Down Arrow		40
		Left Arrow		37
		Right Arrow		39

		A 				65 ---
		B 				66
		C 				67
		D 				68 ---
		S 				83 ---
		W 				87 ---
		
		Space			32
		*/
		
		function renderMap(){
			for(i in game.tiles){
				game.context.drawImage(game.initImages[getImage("textures/blankTile.png")], game.tiles[i].x + game.x, game.tiles[i].y + game.y);
			}
		}
		
		function createMap(width, height){
			for(var y = 0; y < height;y++){
				for(var x = 0; x < width;x++){
					var Tile = new tile(0, x, y);
					game.tiles.push(Tile);
				}
			}
		}
		
		function moveBase(){
			if(!mouse.down){
				game.xRoot = game.x;
				game.yRoot = game.y;
			}
			game.x = mouse.x - mouse.lastUpX + game.xRoot;
			game.y = mouse.y - mouse.lastUpY + game.yRoot;
		}

		//loads images used during the initialization process
		function preInitImages(paths){ 
			game.requiredPreInitImages = paths.length; 
			for(i in paths){ 
				var img = new Image; 
				img.src = paths[i]; 
				game.preInitImages[i] = img; 
				console.log(paths[i] + " Loaded"); 
				game.preInitImages[i].onload = function(){ 
					game.donePreInitImages++; 

				} 
			} 
		} 

  		//loads images used after the initialization process
  		function initImages(paths){ 
  			game.requiredInitImages = paths.length;
  			for(i in paths){ 
  				var img = new Image; 
  				img.src = paths[i]; 
  				game.initImages[i] = img; 
  				console.log(paths[i] + " Loaded"); 
  				game.initImages[i].onload = function(){ 
  					game.doneInitImages++; 
  					preInit();   
  				} 
  			} 
  		} 

  		//ensures that each image from the preInitImages is loaded before initializing
  		function checkPreInitImages() { 
  			if(game.donePreInitImages >= game.requiredPreInitImages){ 
  				preInit(); 

                //all images that need loading go here
                initImages(game.imagesToLoadInit);
                checkInitImages(); 
            }else{ 
            	setTimeout(function(){ 
            		checkPreInitImages();    
            	}, 1); 
            } 
        } 

  		//ensures that each image is loaded before starting the actual game
  		function checkInitImages(){ 
  			if(game.doneInitImages >= game.requiredInitImages){ 
  				init(); 
  			}else{ 
  				setTimeout(function(){ 
  					checkInitImages();   
  				}, 1); 
  			} 
  		}

        //draws the loading bar and orgathia icon during the initialization
        function preInit(){}

		//adds what needs to be added before the first frame is drawn and ends the initialization process
		function init(){
			createMap(4, 5);
			//all processes that need to be initialized go above this
			console.log("RequestAnimationFrame: Set");
			console.log("---------------------Initialized---------------------");
			var endInitTime = (new Date()).getTime();
			var timeElapsed = (endInitTime - startInitTime) / 1000;
			console.log("Loaded | Time: " + timeElapsed + " seconds");
			run();	
		}

		function getImage(string){
			for(i in game.initImages){
				if(i == game.initImages.length - 1){
					return i;
				}

				if(string.localeCompare(game.imagesToLoadInit[i])==0){
					return i;
				}
			}
		}

		//upadates all logic and keeps track of how many updates the game has
		//uses few functions based on what needs to be updated
		function update(){
			moveBase();
			
			if(game.updates%60 ==0){
				console.log("mouse x: " + mouse.x + " y: " + mouse.y);
			}
			game.updates++;
		}

		//renders all elements and objects and keeps track of how many frames the game has
		//uses few functions based on what needs to be rendered
		function render(){
			renderMap();
			
			game.frames++;
		}

		//creates a loop that occurs before the game runs
		function preInitRun(){
			requestAnimFrame(function(){
				preInitRun();
			})
			
		}

		//creates a loop that the entire game runs on
		function run(){
			requestAnimFrame(function(){
				run();
			});
			update();
			render();
		}

		preInitImages([])
		checkPreInitImages();
	}); 
})();

//returns how many frames the game should run from the current browser
window.requestAnimFrame = (function(){
	return window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame||
	window.mozRequestAnimationFrame ||
	window.oRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	function(callback){
		window.setTimeout(callback, 1000 / 60);
		console.log("RequestAnimationFrame: Failed")
	};
})();

//returns a random integer between the min and max, including the min and max
function randInt(min, max){
	if (min >= max) {
		console.log("Error: Could Not Calculate Random Integer")
		return 0;
	} else {
		return Math.round((Math.random() * (max - min)) + min);
	}
}

//renturns a long between the min and max, including the min and max
//a long is a "long" string of numbers - basically a lot of decimals
function randLong(min, max){
	if (min >= max) {
		console.log("Error: Could Not Calculate Random Long")
		return 0;
	} else {
		return (Math.random() * (max - min)) + min;
	}
}