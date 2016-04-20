(function(){
	var startInitTime = (new Date()).getTime();
	console.log("---------------------Initializing--------------------")
	$(document).ready(function(){ 

		var game = {};
		game.canvas = document.getElementById("canvas");
		game.width = canvas.width;
		game.height = canvas.height;
		game.midWidth = game.width / 2;
		game.midHeight = game.height / 2;
		game.offsetL = $("#canvas").offset().left;
		game.offsetT = $("#canvas").offset().top;
		
		game.mapWidth = 0;
		game.mapHeight = 0;
		game.tiles = [];
		game.tileSize = 64;
		game.scale = 1;
		
		function tile(id, x, y){
			this.id = id;
			this.x = x;
			this.y = y;
		}

		game.oldTime = (new Date().getTime());
		game.time = 0;
		game.canAnimIcon = true;

		game.imagesToLoadInit = [
			"textures/blankTile.png","textures/blankTileHighlighted.png", "textures/grass.png"
		];
         //4 images per line
		game.initImages = [];
		game.doneInitImages = 0;
		game.requiredInitImages = game.imagesToLoadInit.length;

		game.updates = 0;
		game.frames = 0;
		game.loadFrames = 0;
		game.loadResources = 0;
		
		game.x = 0;
		game.y = 0;
		game.rotationX = 0;
		game.rotationY = 0;
		game.rotationZ = 0;
		
		game.context = canvas.getContext("2d");
		
		game.chatMessage = "";
		game.chatLog =[];
		
		game.keys = [];
		
		var mouse = {};
		mouse.x = 0;
		mouse.y = 0;
		mouse.down = 0;
		mouse.lastUpX = 0;
		mouse.lastUpY = 0;
		
		var users = {};
		users.clientUsername = "User";
		
		/*<----- Starting Initilization JQuery Methoods ----->*/
		$("#loadingContainer").hide();
		$("#serverCreationContainer").hide();
		$("#loginContainer").hide();
		$("#registerContainer").hide();
		$("#joinGameSetting").hide();
		$("#createGameSetting").hide();
		$("#charactersSetting").hide();
		$("#donateSetting").hide();
		/*<----- End Of Initilization JQuery Methoods ----->*/
		
		$(window).resize(function(){
			var width = window.innerWidth;
			var height = window.innerHeight;
			
			if(width < 700){
				$("#container").hide();
				$("#loadingContainer").hide();
			}
			
			if(width >= 700){
				$("#container").show();
				$("#loadingContainer").show();
			}
		});
		
		//tells you the keyCode of the key that is being pressed
		$(document).keydown(function(e){
			//alert(e.keyCode);
			game.keys[e.keyCode] = true;
		})

		//tells you the keyCode of the key that is being unpressed
		$(document).keyup(function(e){
			game.keys[e.keyCode] = false;
		})
		
		$("#canvas").mousedown(function(event){
			switch(event.which){
				case 1:
					mouse.down = true;	
				break;
				
				default:
			};
			
			});
		
		$(document).mouseup(function(){
			mouse.down = false;
		});
		$("#iconSettings").toggle();
		
		$("#iconMap").click(function(){
			if(game.canAnimIcon){
				game.canAnimIcon = false;
				$("#iconSettings").slideToggle(function(){game.canAnimIcon = true;});
				playAudio("audios/boom.mp3");
			}
		});
		
		$("#iconContainer").mouseleave(function(){
			if(game.canAnimIcon){
				$("#iconSettings").slideUp(function(){game.canAnimIcon = true;});
			}
		});
		
		$("#canvas").on("mousewheel", function(e){mousewheel(e)});
		$("#toolbar").on("mousewheel", function(e){mousewheel(e)});
		
		$("#iconMap").imageMapResize();
		
		$("#chatInput").mousedown(function(){
			extendChat();
		});
		
		$("#chatInput").keydown(function(){
			extendChat();
		});
		
		$("#canvas").mousemove(function(){
			$("#chatBox").css("overflow", "hidden");
			$("#chatLog").css("pointer-events", "none");
		});
		
		document.onmousemove = function(e){
			mouse.x = e.clientX;
			mouse.y = e.clientY;
			if(!mouse.down){
				mouse.lastUpX = mouse.x;
				mouse.lastUpY = mouse.y;
			}
		}
		
		$("#resetViewPort").click(function(){
			game.x = 0;
			game.y = 0;
			game.scale = 1;
		})
		
		$("#chatInput").keyup(function(e){
			if(e.keyCode == 13){
				readChatinput();
				if(game.chatMessage != ""){
					addChatMessage(game.chatMessage);
				}
			}
		})
		
		$("#createGame").click(function(){
			startServerCreation();
		});
		
		$("#createGameSetting").click(function(){
			$("#iconSettings").slideUp();
			$("#serverCreationContainer").show();
		});
		
		$("#submitCreateServer").click(function(){
			$("#serverCreationContainer").hide();
			url = "createGameServer.php";
			data = "serverName=" + document.getElementById("createdServerNameInput").value;
			document.getElementById("createdServerNameInput").value = "";
			xmlRequestPOST(url, data, true, function(xhttp){
				console.log(xhttp.responseText);
			});
		});
		
		$("#loginSetting").click(function(){
			$("#registerContainer").hide();
			$("#iconSettings").slideUp();
			$("#loginContainer").show();
		});
		
		$("#registerSetting").click(function(){
			$("#loginContainer").hide();
			$("#iconSettings").slideUp();
			$("#registerContainer").show();
		});
		
		$("#submitRegister").click(function(){
			if(document.getElementById("passwordRegisterInput").value == document.getElementById("passwordRegisterConfirmInput").value){
				$("#registerContainer").hide();
				$.post("createUser.php", {
					username: document.getElementById("usernameRegisterInput").value,
					password: document.getElementById("passwordRegisterInput").value
				}, function(data){
					if(!("trueR".localeCompare(data))){
						$.post("loginUser.php", {
							username: document.getElementById("usernameRegisterInput").value,
							password: document.getElementById("passwordRegisterInput").value
						}, function(data){
							console.log(data);
							if(!("trueL".localeCompare(data))){
								console.log("success");
							}
						})
					}
				})
			}else{
				document.getElementById("usernameRegisterInput").value = "";
				document.getElementById("passwordRegisterInput").value = "";
				document.getElementById("passwordRegisterConfirmInput").value = "";
			}
		});
		
		
		
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
		Control			17
		*/
		
		/*<----- 	END OF NON-FUNCTION JQERY METHOODS	----->*/
		
		function mousewheel(e){
			if(e.originalEvent.wheelDelta > 0){
				game.scale +=.25;
				if(game.scale > 3) {
					game.scale = 3;
				}else{
					game.x -= (mouse.x - game.x - game.offsetL) / (game.scale-.25) / 4;
					game.y -= (mouse.y - game.y - game.offsetT) / (game.scale-.25) / 4;
				}
			}else{
				game.scale -=.25;
				if(game.scale <.5){
					game.scale = .5;
				}else{
					game.x += (mouse.x - game.x - game.offsetL) / (game.scale+.25) / 4;
					game.y += (mouse.y - game.y - game.offsetT) / (game.scale+.25) / 4;
				}
			}
		}
		
		function extendChat(){
			$("#chatBox").css("overflow", "visible");
			$("#chatLog").css("pointer-events", "auto");
		}
		
		function readChatinput(){
			game.chatMessage = document.getElementById("chatInput").value;
		}
		
		function addChatMessage(msg){
			game.chatLog.push(msg);
			var div = document.createElement("div");
			div.id = game.chatLog.length;
			div.className ="chatMessage";
			div.innerHTML = users.clientUsername + ": " + msg;
			document.getElementById("chatLog").appendChild(div);
			$("#chatLog").css("top", 170 - $("#chatLog").height());
			document.getElementById("chatInput").value = "";
		}
		
		function renderMap(){
			for(var i in game.tiles){
				var img = game.initImages[getImage("textures/blankTile.png")]
				var x = game.tiles[i].x * game.scale * game.tileSize + game.x;
				var y = game.tiles[i].y * game.scale * game.tileSize + game.y;
				var width = game.tileSize * game.scale;
				var height = game.tileSize * game.scale;
				game.context.drawImage(img, x, y, width, height);
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
			game.x += mouse.x - mouse.lastUpX;
			game.y += mouse.y - mouse.lastUpY;
			if(mouse.down){
				mouse.lastUpX = mouse.x;
				mouse.lastUpY = mouse.y;
			}
		}
		
		//upadates all logic and keeps track of how many updates the game has
		//uses few functions based on what needs to be updated
		function update(){
			if(game.keys[17]) moveBase();

			game.updates++;
		}

		//renders all elements and objects and keeps track of how many frames the game has
		//uses few functions based on what needs to be rendered
		function render(){
			game.canvas.width = $("#base").width();
			game.canvas.height = $("#base").height();
			game.context.clearRect(0, 0, game.width, game.height);
			renderMap();
			
			game.frames++;
		}
		
		function startLoad(resources){
			$("#container").hide();
			$("#percentLoaded").width(0 + "%");
			$("#loadingContainer").show();
			$("#backgroundAnimator").show();
			game.loadResources = resources;
		}
		function progressLoad(){
			game.loadFrames++;
			$("#percentLoaded").width((game.loadFrames / game.loadResources * 100) + "%");
		}
		function endLoad(){
			game.loadFrames = 0;
			game.loadResources = 0;
			$("#icon").hide();
			$("#loadingIconUnsaturated").hide();
			$("#container").show();
			$("#backgroundAnimator").fadeOut(1000);
			$("#percentLoaded").css("overflow","visible");
			$("#loadingIcon").animate({
				width: "200px",
				height: "200px"
			}, 1000);
			$("#loadingCenter").animate({
				left: "0",
				top: "0"
			}, 1000, function(){
				$("#icon").show();
				$("#loadingContainer").hide();
				$("#percentLoaded").css("overflow","hidden");
				$("#loadingIcon").css("width","200px","height","200px");
			});
		}
		
		function sleep(milliseconds) {
			var start = new Date().getTime();
			for (var i = 0; i < 1e7; i++) {
				if ((new Date().getTime() - start) > milliseconds){
					break;
				}
			}
		}
		
		//loads images used after the initialization process
  		function initAudios(paths){ 
  			game.requiredInitAudios = paths.length;
  			for(i in paths){ 
  				var aud = new Audio();
  				aud.src = paths[i];
				aud.load();
  				game.initAudios[i] = aud; 
  				console.log(paths[i] + " Loaded"); 
  				game.doneInitAudios++;  
				progressLoad();
  			} 
  		} 
		
		function playAudio(path){
			var audio = new Audio();
			audio.src = path;
			audio.load();
			audio.play();
		}

  		//ensures that each image is loaded before starting the actual game
  		function checkInitAudios(){ 
  			if(game.doneInitAudios >= game.requiredInitAudios){
				endLoad();
  				init(); 
  			}else{ 
  				setTimeout(function(){ 
  					checkInitImages();   
  				}, 1); 
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
					progressLoad();
  				} 
  			} 
  		} 

  		//ensures that each image is loaded before starting the actual game
  		function checkInitImages(){ 
  			if(game.doneInitImages >= game.requiredInitImages){
  				endLoad();
  				init(); 
  			}else{ 
  				setTimeout(function(){ 
  					checkInitImages();   
  				}, 1); 
  			} 
  		}

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
		
		function getAudio(string){
			for(i in game.initAudios){
				if(i == game.initAudios.length - 1){
					return i;
				}

				if(string.localeCompare(game.audiosToLoadInit[i])==0){
					return i;
				}
			}
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

		//creates a loop that the entire game runs on
		function run(){
			requestAnimFrame(function(){
				run();
			});
			update();
			render();
		}
		startLoad(game.requiredInitImages + game.requiredInitAudios);
		initImages(game.imagesToLoadInit);
		checkInitImages();
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