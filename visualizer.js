/**
	@Author: Sahitya Mohan Lal
	@Title: Audio Visualizer for JS
	
	This program creates a simple visualization
	based on real-time processing(FFT) of audio meta-data
	to create the animations
	Audio Used: Spring in My Step (Under the Free GNU License)
*/

playButton = document.getElementById('buttonImg');
playButton.addEventListener("click", tweakImage);
audio = new Audio('Spring_In_My_Step.mp3');

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var analyser = audioCtx.createAnalyser();
var distortion = audioCtx.createWaveShaper();

//-----------------------Draw the Visualization on Canvas-----------------------------------
var posx, posy, canvas = document.getElementById("mycanvas"),
    ctx, objects = [],
	wW = canvas.width,
    wH = canvas.height,
    oRad;

function animate() {
    ctx.clearRect(0, 0, wW, wH);
    for (var i = 0; i < objects.length; i++) {
        oRad = objects[i].r;
		barHeight = dataArray[i];
        var r = barHeight + (25 * (i/bufferLength));
        var g = 250 * (i/bufferLength);
        var b = 255 * (i/bufferLength);
		ctx.fillStyle = "rgba("+r+","+g+","+b+","+ objects[i].o + ")";
        ctx.beginPath();
        ctx.arc(objects[i].x, objects[i].y, oRad, 0, Math.PI * 2, true);
        objects[i].r++
        if (oRad > wH / 7) objects[i].o -= 0.005;
        if (objects[i].o <= -3) objects.splice(i, 1);
        ctx.fill();
    }
}

function createDrops() {
	posx = Math.random() * wW;
	posy = Math.random() * wH;
    drawCircle();
}

function drawCircle() {
    var Circle = {
        x: posx,
        y: posy,
        r: 10,
        o: 0.3
    }
    objects.push(Circle);
}

if (!canvas.getContext) {
    document.write('Canvas Not Supported on Browser');
} else {
    ctx = canvas.getContext("2d");
    ctx.canvas.width = wW;
    ctx.canvas.height = wH;
    setInterval(function() {
        animate()
    }, 30);
}
//---------------------------------------------------------------------------------------------

audioSource = audioCtx.createMediaElementSource(audio);
audioSource.connect(analyser);
analyser.connect(distortion);
distortion.connect(audioCtx.destination);

analyser.fftSize = 256; //Take Sample Size of 256
var bufferLength = analyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);

audio.ontimeupdate = function() {timeUpFunc()}; //Acquire Frequency Data Continuously 

function timeUpFunc() {
	analyser.getByteFrequencyData(dataArray);
	createDrops();
}

function tweakImage() {
	//Create a TimeLineLite for Easy Tweening
	var tl = new TimelineLite();
	tl.from(playButton, 1, {height: '65', autoAlpha: 0, ease:Power4.easeInOut});
	audio.play();
}