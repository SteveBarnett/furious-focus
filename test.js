var drawContext;
var original;
var targetImage;
var controls;
var gameCanvas;
var lastTimeStamp=0;
var timeLeft;
var timeBox;
var scoreBox;
var score;
var controlOption;

function startSetUp()
{
   document.querySelector(".level-loading").classList.remove("l-dn");	
   //select base image
   var sel=document.querySelectorAll('.sourcepic');
   var item=(Math.random()*sel.length)|0;
   original=sel[item];
   
   sel=document.querySelectorAll('.controloption');
   item=(Math.random()*sel.length)|0;
   controlOption=sel[item].innerHTML;
   
   
   gameCanvas = document.getElementById('target');
   gameCanvas.height=gameCanvas.width;

   timeBox = document.querySelectorAll('.time');
   scoreBox = document.querySelectorAll('.score');
   
	
   lastTimeStamp=0;
   window.setTimeout(doSetUp,50);		
}


function showGameOver()
{   
   document.querySelector(".level-over").classList.remove("l-dn");	   	
   var messages=document.querySelectorAll(".compliment");
   var sel=(Math.random()*messages.length)|0;
   for (var i=0;i<messages.length;i+=1) {
     messages[i].classList.remove('l-dn');
	 if (i!=sel)
	   messages[i].classList.add('l-dn');	 
   }
   
   lastTimeStamp=0;   
}

function doSetUp(timeStamp)
{
	//window.requestAnimationFrame(GameLoop);		    
	window.setTimeout(GameLoop,1500);		
	//add the controls
	controls=new Array();
	for (var i=0;i<3;i+=1) {
	  switch (controlOption.charAt(i)) {
	    case 'S': controls.push(new desat_control()); break;
	    case 'N': controls.push(new noise_control()); break;
	    case 'W': controls.push(new filter_control("#FFF","light")); break;
	    case 'B': controls.push(new blur_control()); break;
	    case '-': controls.push(new null_control()); break;	  
	  }
	}	  
	
    //the target starts off as the base image
	var etCanvas = document.createElement('canvas');
	etCanvas.width=gameCanvas.width;
	etCanvas.height=gameCanvas.height;	
	drawContext = etCanvas.getContext('2d');	
	drawContext.drawImage(original,0,0,original.width,original.height,0,0,gameCanvas.width,gameCanvas.height);		
	//draw the layers on it
	for (var i=0;i<controls.length;i+=1) {
	  var  id=document.getElementById("filter"+i);
	  id.classList.remove("filter-noise");
	  id.classList.remove("filter-contrast");
	  id.classList.remove("filter-blur");
	  id.classList.remove("filter-light");
	  id.classList.remove("filter-desat");
	  id.classList.remove("l-dn");
	  id.classList.add(controls[i].displayClass);
	  
	  var tLev=((Math.random()*5)|0)*.25;      
	  controls[i].targetLevel=tLev;
	  controls[i].level=tLev;
	  controls[i].draw();
	  var sLev;
	  while (true) {
	    sLev=((Math.random()*5)|0)*.25;
		if (sLev!=tLev) break;
	  } 
	  controls[i].level=sLev;
	}
	targetImage=transformImage(etCanvas,makeSplit);	
		
	drawContext = gameCanvas.getContext('2d');				
	
}

function checkBoardMatch()
{
	for (var i=0;i<controls.length;i+=1)
		if ((!controls[i].isOkay)&&(controls[i].level!=controls[i].targetLevel)) return false;
	return true;
}

function setControls(index,bal)
{  	    
    controls[index].level=bal;
}

function drawBoard()
{  	    
    drawContext.globalAlpha=1;
	drawContext.drawImage(original,0,0,original.width,original.height,0,0,gameCanvas.width,gameCanvas.height);	
	for (var i=0;i<controls.length;i+=1)
	  controls[i].draw();
	drawContext.globalAlpha=1;
	drawContext.drawImage(targetImage,0,0);	
	
	drawContext.font="30px Arial";

    var timeVal=((timeLeft/100)|0)/10;
	
	for (var i=0;i<scoreBox.length;i+=1)
	  scoreBox[i].innerHTML=score;	
	for (var j=0;j<timeBox.length;j+=1)
	  timeBox[j].innerHTML=timeVal;	
}
 
 
 
function play() {
   score=0;
   timeLeft=10000;  
   startSetUp();
 } 
 
 function GameLoop(timeStamp) {
	  //Calculate our frametime
	  var frameTime=timeStamp-lastTimeStamp;
	  if (lastTimeStamp==0) {
	    frameTime=0;	  
	    document.querySelector(".level-loading").classList.add("l-dn");
		window.requestAnimationFrame(GameLoop);			  
		lastTimeStamp=1;
		return;      
	  }
	  if (lastTimeStamp==1) 
	    frameTime=0;	  
	  
	  timeLeft-=frameTime;
	  lastTimeStamp=timeStamp;	  
	  drawBoard();
	  if (checkBoardMatch()) {
	    score+=1;
	    startSetUp();
		return;
	  }
	  if (timeLeft<0) {
	    showGameOver();
		return;	  
	  }	  
	  window.requestAnimationFrame(GameLoop);			  
 }
 