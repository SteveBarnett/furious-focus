
 
function setPixel(imageData, x, y, pixel) 
{
    var index = (x + y * imageData.width) * 4;
    imageData.data[index+0] = pixel.r;
    imageData.data[index+1] = pixel.g;
    imageData.data[index+2] = pixel.b;
    imageData.data[index+3] = pixel.a;
}

function getPixel(imageData,x,y)
{
   var index = (x + y * imageData.width) * 4;
   var pixel= { 
      r:  imageData.data[index+0],
	  g:  imageData.data[index+1],
	  b:  imageData.data[index+2],
	  a:  imageData.data[index+3],	  
   };
   return pixel;
}


function makeSplit(data,x,y,pixel)
{
  var ratio=data.width/data.height;
  var dist=data.width-x-y*ratio
  if ((dist<3)||(x<3)||(y<3)) { 
    pixel.r=0;
	pixel.g=0;
	pixel.b=0;  
  }
  if (dist<0) pixel.a=0;
  else pixel.a=255;
}


function control_base()
{
  this.level=0;
  this.targetLevel=-1;
  this.draw=function() { };    
  this.isOkay=false;  
}


function null_control()
{
  this.isOkay=true;
  this.displayClass="l-dn";
  id='filter1'
}
null_control.prototype=new control_base();


function desat_control()
{
  this.displayClass="filter-desat";  
  var finalCanvas=transformImage(original,
    function(data,x,y,pixel) {
	  var val=(pixel.r+pixel.g+pixel.b)/3;
	  pixel.r=val;
	  pixel.g=val;
	  pixel.b=val;	
	  }
    );			
	
  this.draw=function() {
    drawContext.globalAlpha=this.level;
	drawContext.drawImage(finalCanvas,0,0,original.width,original.height,0,0,gameCanvas.width,gameCanvas.height);	
  }
}
desat_control.prototype=new control_base();

function contrast_control()
{
  var finalCanvas=transformImage(original,
    function(data,x,y,pixel) {
	  var val=(pixel.r+pixel.g+pixel.b)/3;
	  val=(val<128)?(val*.3):(128+val*.3);
	  pixel.r=val;
	  pixel.g=val;
	  pixel.b=val;	
	  }
    );			
  this.displayClass="filter-contrast";  
  
  this.draw=function() {
    drawContext.globalAlpha=this.level*.5;
	drawContext.drawImage(finalCanvas,0,0,original.width,original.height,0,0,gameCanvas.width,gameCanvas.height);	
  }
}
contrast_control.prototype=new control_base();


function noise_control()
{
  var finalCanvas=transformImage(original,
    function(data,x,y,pixel) {
	  var val=Math.random()*255;
	  pixel.r=val;
	  pixel.g=val;
	  pixel.b=val;
	  pixel.a=((Math.random()*1000)<80)?255:0;	  
	  }
    );			
  this.displayClass="filter-noise";    
	
  this.draw=function() {
    drawContext.globalAlpha=this.level;
	drawContext.drawImage(finalCanvas,0,0,original.width,original.height,0,0,gameCanvas.width,gameCanvas.height);	
  }
}
noise_control.prototype=new control_base();


function blur_control()
{
  var finalCanvas=transformImage(original,
    function(data,x,y,pixel) {
	  var count=1;
	  for (var i=0;i<10;i+=1) {
	    if (x+i>=data.width) break;
		if (y+i>=data.height) break;
		
	    var p2=getPixel(data,x+i,y+i);
		pixel.r+=p2.r;
		pixel.b+=p2.b;
		pixel.g+=p2.g;
        count+=1;		
	  }
	  
	  pixel.r/=count;
	  pixel.g/=count;
	  pixel.b/=count;	  
	  }
    );			
	
  this.displayClass="filter-blur";  
  
	
  this.draw=function() {
    drawContext.globalAlpha=this.level*.6;
	drawContext.drawImage(finalCanvas,0,0,original.width,original.height,0,0,gameCanvas.width,gameCanvas.height);	
  }
}
blur_control.prototype=new control_base();


function filter_control(f_color,cname)
{
  this.draw=function() {
    drawContext.globalAlpha=this.level*.4;
	drawContext.fillStyle=f_color;
    drawContext.fillRect(0,0,gameCanvas.width,gameCanvas.height); 	
  }
  this.displayClass="filter-"+cname;    
}
filter_control.prototype=new control_base();


function transformImage(orig,transFunc)
{
	tCanvas = document.createElement('canvas');
	tCanvas.width=orig.width;
	tCanvas.height=orig.height;		
	var draw = tCanvas.getContext('2d');
	//copy the original to the canvas
	draw.drawImage(orig,0,0);	
	if (!transFunc) return tCanvas;
	var data=draw.getImageData(0,0,orig.width,orig.height);
	for (y=0;y<orig.width;y+=1) 
	  for (x=0;x<orig.width;x+=1)  {
	    var p=getPixel(data,x,y);
		transFunc(data,x,y,p);
		setPixel(data,x,y,p);		
	  }
	draw.putImageData(data,0,0);
    return tCanvas;	
}	
 
 function redify(data,x,y,pixel)
 {
	pixel.r=255;	
 }
 
 
 
 function mono(data,x,y,pixel)
 {
    var val=(pixel.r+pixel.g+pixel.b)/3;
	val=((val/50)|0)*50;
	//if (val>128) val=255; else val=0;
	  pixel.r=val;
	  pixel.g=val;
	  pixel.b=val;	
	
 }
 