(function(){
	var startInitTime = (new Date()).getTime();
	console.log("---------------------Initializing--------------------")
	$(document).ready(function(){ 

		var game = {};
		game.width = 0;
		game.height = 0;
		game.midWidth = game.width / 2;
		game.midHeight = game.height / 2;

		game.oldTime = (new Date().getTime());
		game.time = 0;

		game.preInitImages = [];
		game.donePreInitImages = 0;
		game.requiredPreInitImages = 0;

		game.initImages = [];
		game.doneInitImages = 0;
		game.requiredInitImages = 0;

		game.imagesToLoadInit = []
         //4 images per line

		game.updates = 0;
		game.frames = 0;

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

				if(string == game.imagesToLoadInit[i]){
					return i;
				}
			}
		}

		//upadates all logic and keeps track of how many updates the game has
		//uses few functions based on what needs to be updated
		function update(){
			
			game.updates++;
		}

		//renders all elements and objects and keeps trak of how many frames the game has
		//uses few functions based on what needs to be rendered
		function render(){
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