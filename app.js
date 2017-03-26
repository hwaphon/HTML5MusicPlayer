/*
 * @Author: hwaphon
 * @Date:   2017-02-17 09:57:59
 * @Last Modified by:   hwaphon
 * @Last Modified time: 2017-03-26 21:53:07
 */

(function() {
	var musicControl = document.getElementById("music-stop"),
		player = document.getElementById("player"),
		controlIcon = document.getElementById("control-icon"),
		durationElement = document.getElementById("duration"),
		currentTimeElement = document.getElementById("current-time"),
		progressElement = document.getElementById("music-progress"),
		volumeUpElement = document.getElementById("volume-up"),
		volumeDownElement = document.getElementById("volume-down"),
		volumeProgress = document.getElementById("music-sound"),
		fileElement = document.getElementById("file"),
		nextElement = document.getElementById("music-next"),
		preElement = document.getElementById("music-pre"),
		musicTitleElement = document.getElementById("music-title"),
		addMusicElement = document.getElementById("add-music"),
		albumPicElment = document.getElementById("picture"),
		musicPlayer = document.getElementById("music-player"),
		musicUL = document.getElementById("musics"),
		loopElement = document.getElementById("play-style-loop"),
		randomElement = document.getElementById("play-style-random"),
		liElementsCache = [];

	/* music queue to save and get music to play */
	function MusicQueue() {
		var musics = [];
		var index = -1;
		var loop = true;

		this.setLoop = function() {
			loop = true;
		};

		this.setRandom = function() {
			loop = false;
		};

		this.addMusic = function(music) {
			musics.push(music);
		};

		this.addList = function(list) {
			var length = list.length;

			for(var i = 0; i < length; i++) {
				this.addMusic(list[i]);
			}
		};

		this.getMusic = function() {
			if(loop === true) {
				if(index >= musics.length - 1) {
					index = -1;
				}
				index += 1;
				return musics[index];
			} else {
				index = Math.floor(Math.random() * musics.length);
				return musics[index];
			}
		};

		this.getPreMusic = function() {
			if(loop) {
				if(index === 0) {
					return musics[0];
				} else {
					index -= 1;
					return musics[index];
				}
			} else {
				return this.getMusic();
			}
		};

		this.getMusicByName = function(name) {
			index = this.getIndexByName(name);
			return musics[index];
		};

		this.getIndexByName = function(name) {
			for(var i = 0; i < musics.length; i++) {
				if(musics[i].name === name) {
					return i;
				}
			}
		}

		this.getAllMusic = function() {
			return musics;
		};

		this.pushMusics = function(ms) {
			musics = ms;
		};
	}
	/* music queue end */

	/* init view */
	var musicQueue = new MusicQueue(),
		index = 0;

	(function init() {
		var music = new Music("风筝误", "raw/fly.ogg");
		musicQueue.addMusic(music);
		musicTitleElement.innerHTML = music.name;
		player.src = music.src;
		setTimeout(setDuration, 500);
		appendMusicToDOM("风筝误");
		setSelected(index);
	})();
	/* end init view */

	/* register event handler */
	loopElement.addEventListener("click", function(event) {
		musicQueue.setRandom();
		randomElement.classList.remove("hidden");
		loopElement.classList.add("hidden");
	},false);

	randomElement.addEventListener("click", function(event) {
		musicQueue.setLoop();
		loopElement.classList.remove("hidden");
		randomElement.classList.add("hidden");
	}, false);

	// next music logic
	nextElement.addEventListener("click", function(event) {
		preparePlay(musicQueue.getMusic());
	}, false);

	// pre music logic
	preElement.addEventListener("click", function(event) {
		preparePlay(musicQueue.getPreMusic());
	},false);

	musicPlayer.addEventListener("dragover", function(e) {
		e.preventDefault();
	});

	
	musicPlayer.addEventListener("drop", readData, false);
	function readData(e) {
		e.preventDefault();
		var filelist = e.dataTransfer.files;
		if (!filelist) { return; }

		if (filelist.length > 0) {
			var file = filelist[0];
			if((file.type).indexOf("audio") !== -1 && file.size > 8094) {
				musicQueue.addMusic(getMusic(file));
				appendMusicToDOM(file.name);
			}
		}
	}

	var timeId;

	musicControl.addEventListener("click", function() {
		if (player.paused) {
			player.play();
			start();
			timeId = setTimeout(change, 500);
		} else {
			player.pause();
			pause();
			clearTimeout(timeId);
		}
	});

	player.addEventListener("ended", function() {
		var music = musicQueue.getMusic();
		removeSelected(index);
		preparePlay(music);
	});

	volumeDownElement.addEventListener("click", function() {
		var volume = player.volume;
		player.volume = (volume - 0.2 >= 0) ? volume - 0.2 : 0;
		volumeProgress.value = player.volume * 10;
	});

	volumeUpElement.addEventListener("click", function() {
		var volume = player.volume;
		player.volume = (volume + 0.2 <= 1) ? volume + 0.2 : 1;
		volumeProgress.value = player.volume * 10;
	});

	volumeProgress.addEventListener("click", function(event) {
		var t = (event.offsetX / 100).toFixed(1);
		player.volume = t;
		volumeProgress.value = t*10;
	},false);

	fileElement.addEventListener("change", function(event) {

		var files = fileElement.files;
		for(var i = 0; i < files.length; i++) {
			if((files[i].type).indexOf("audio") !== -1 && files[i].size > 8094) {
				var music = getMusic(files[i]);
				musicQueue.addMusic(music);
				appendMusicToDOM(music.name);
			}

		}
	});

	addMusicElement.addEventListener("click", function(event) {
		fileElement.click();
	});

	// set current time by progress element in dom
	progressElement.addEventListener("click", function(event) {
		var t = (event.offsetX / 470).toFixed(2);
		var currentTime = player.duration * t;
		player.currentTime = currentTime;
		change();
	},false);

	musics.addEventListener("dblclick", function(event) {
		var name = event.target.innerHTML;
		preparePlay(musicQueue.getMusicByName(name));
	},false);
	/* end register event handler */

	function start() {
		// change icon
		controlIcon.classList.remove("fa-play");
		controlIcon.classList.add("fa-pause");

		setDuration();
	}

	function pause() {
		controlIcon.classList.remove("fa-pause");
		controlIcon.classList.add("fa-play");
	}

	function preparePlay(music) {
		musicTitleElement.innerHTML = music.name;
		player.src = music.src;

		start();
		changeImage();
		setCurrentTime();

		player.play();
		setTimeout(setDuration, 500);
		clearTimeout(timeId);
		timeId = setTimeout(change, 500);

		removeSelected(index);
		index = musicQueue.getIndexByName(music.name);
		setSelected(index);
	}

	// set music total time in dom
	function setDuration() {
		var total = player.duration;
		total = total ? total : 0;
		durationElement.innerHTML = "/ " + timeFormat(total);
	}

	// set the current time of music in dom
	function setCurrentTime() {
		var total = player.currentTime;
		currentTimeElement.innerHTML = timeFormat(total);
	}

	// transform time format to hh:mm
	function timeFormat(total) {
		var minute = parseInt(total / 60),
			second = parseInt(total - minute * 60),
			result;

		second = (second >= 10) ? second : '0' + second;
		result = minute + ":" + second;
		return result;
	}

	// update the progress
	function change() {
		setCurrentTime();
		var currentTime = player.currentTime,
			duration = player.duration;

		var progress = (currentTime / duration).toFixed(2) * 100;
		progress = progress <= 100 ? progress : 100;
		progressElement.value = progress;

		timeId = setTimeout(change, 500);
	}

	function getMusic(file) {
		var url = URL.createObjectURL(file);
		return new Music(file.name, url);
	}

	function Music(name, src) {
		this.name = name;
		this.src = src;
	}

	function changeImage() {
		var num = parseInt(Math.random() * 16),
			src;	

		num = (num > 0) ? num : num + 1;
		src = "raw/" + num + ".jpg";
		albumPicElment.src = src;
	}

	function appendMusicToDOM(name) {
		var li = document.createElement("li");
		var text = document.createTextNode(name);
		li.appendChild(text);
		liElementsCache.push(li);
		musicUL.appendChild(li);
	}

	function setSelected(index) {
		liElementsCache[index].classList.add("selected");
		liElementsCache[index].scrollIntoView(false);
	}

	function removeSelected(index) {
		liElementsCache[index].classList.remove("selected");
	}
})();