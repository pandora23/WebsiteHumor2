var main = function(){
	//add listeners here
};

var portNum = 8416;
var ip = "107.170.80.97";
var dat = Object;
var done= false;
var count=0;

//var whichQuery = 0;
var p1UrlList = [];

var hitsP1 = [];
var hitsP2 = [];
var hitsM1 = [];
var hitsM2 = [];

var dataP1 = [];
var dataP2 = [];
var dataM1 = [];
var dataM2 = [];

var ngWidth = -1;

//for a hack
var mz = "";

var initialized = false;
var idNumber=-1;
var processed = 0;
var A = "";
var d = 3;
var fs = 100;
var m2="";
var donePulling = false;

var enough = false;

//things that don't get reset
var urlCount=-1;


var initializeDataOnServer = function(){
	
	$.ajax({
				type: 'GET',
				url: 'http://107.170.80.97:'+portNum+'/initialize/',
				//data : {dataInitialized: initialized, idNum: idNumber},
				success: function(data){
					idNumber=data['idNum'];
					console.log("IDNUM: " + idNumber);
					initialized=data['initialized'];
					console.log(initialized);
					
					continueRunning();

				},
				error: function(XMLHttpRequest, textStatus, errorThrown) { 
						alert("Status: " + textStatus); alert("Error: " + errorThrown); 
					}       
			});
};

var clearData = function(){
	//$('#runButton').attr('disabled','enabled');
	//$('#runButton').disabled(false);
	
	dat = Object;
	done= false;
	count=0;
	//var whichQuery = 0;
	p1UrlList = [];

	hitsP1 = [];
	hitsP2 = [];
	hitsM1 = [];
	hitsM2 = [];

	dataP1 = [];
	dataP2 = [];
	dataM1 = [];
	dataM2 = [];

	//ngDist = 3;
    //clear on server TODO
	
	
	//for a hack
	mz = "";

	initialized = false;
	idNumber=-1;
	processed = 0;
	A = "";
	d = 3;
	m2="";
	donePulling = false;
	//urlCount=10;
	enough = false;
	$('.form5').val('');
	
	/* $('.form1').val()='est';
	$('.form2').val();
	$('.form3').val();
	$('.form4').val();
	$('.formE').val();
	$('.formD').val(); */
	
};
var runExperiment= function(){
	
	
	
	
	//MOVE
	initializeDataOnServer();
	
	/* getSiteList(p1,hitsP1);
	while(hitsP1.length < 40){
		var dumbJS = "why did they depricate async false";
	}
	getSiteList(p2,hitsP2);
	while(hitsP2.length < 40){
		var dumbJS = "why did they depricate async false";
	}
	getSiteList(m1,hitsM1);
	while(hitsM1.length < 40){
		var dumbJS = "why did they depricate async false";
	}
	getSiteList(m2,hitsM2);
	while(hitsM2.length < 40){
		var dumbJS = "why did they depricate async false";
	} */
	console.log("dumbJS");
	
	
	
	
	
};

var continueRunning = function(){
	
	donePulling = false;
	
	A = $('.form5').val();
	var p1 = $('.form1').val();
	var p2 = $('.form2').val();
	var m1 = $('.form3').val();
	fs = $('.formG').val();
	m2 = $('.form4').val();
	d = $('.formD').val();
	ngWidth = $('.formE').val();
	urlCount = $('.formF').val();
	
	//greyout button
	//$('#runButton').disabled(true);
	
	
	
	$(".Freq1").text("Most frequent words and bigrams that co-occur with \'"+ A +"\' given \'" + p1 + "\':");
	$(".Freq2").text("Most frequent words and bigrams that co-occur with \'"+ A +"\' given \'" + p2 + "\':");
	$(".Freq3").text("Most frequent words and bigrams that co-occur with \'"+ A +"\' given \'" + m1 + "\':");
	$(".Freq4").text("Most frequent words and bigrams that co-occur with \'"+ A +"\' given \'" + m2 + "\':");
	
	setTimeout(function(){
		console.log("LISTCHECK2");
		console.log(hitsP1);
		pullAllDataUsingSiteList(p1, "P1");
		pullAllDataUsingSiteList(p2, "P2");
		pullAllDataUsingSiteList(m1, "M1");
		pullAllDataUsingSiteList(m2, "M2");

	}, 1000);
	
}


function pullAllDataUsingSiteList(string, whichQuery){
	
	//move to next query
	
	
	console.log("URLLIST");
	//console.log(urlList);
	
	//var dataFromSites = []
	
	//CHANGE BACKn ONCE DONE DEVELOPING
	
	getSiteData(string, whichQuery, 1, 0);
		
	
	
	
	//whichQuery++;
	

};

function setDataPoint(dataPoint, whichList, urlX){
	
	
		console.log("dataP1:"+dataP1.length.toString());
		console.log("dataP2:"+dataP2.length.toString());
		console.log("dataM1:"+dataM1.length.toString());
		console.log("dataM2:"+dataM2.length.toString());
		
		console.log(dataP1.length == urlCount &&
			dataP2.length == urlCount &&
			dataM1.length == urlCount &&
			dataM2.length == urlCount &&
			donePulling == false);
			
		//console.log(urlCount);
		if( dataP1.length == urlCount &&
			dataP2.length == urlCount &&
			dataM1.length == urlCount &&
			dataM2.length == urlCount &&
			donePulling == false){
					console.log("LASTTEXTGRABBED");
					donePulling = true;
					console.log("LASTTEXTGRABBED");
					getFrequencies();
				}
		else{
			console.log("setting " + whichList);
	
			if(whichList != 'fail'){
				
				console.log("NextPoint "+dataPoint)
				console.log(dataPoint)
				if(dataPoint != []){
					$('.currentPart').text(whichList);
					$('.allTextP1').append($('<li>').text(dataPoint));
					
					if(whichList==="P1"){
						$('.resultsListP1').append($('<li class=\"greyText\">').text(urlX));
						if(dataP1.length <= urlCount){
						dataP1.push(dataPoint);
						}
					}
					if(whichList==="P2"){
						$('.resultsListP1').append($('<li>').text(urlX));
						if(dataP2.length <= urlCount){
						dataP2.push(dataPoint);
						}	
					}
					if(whichList==="M1"){
						$('.resultsListP1').append($('<li>').text(urlX));
						if(dataM1.length <= urlCount){
						dataM1.push(dataPoint);
						}
					}
					if(whichList==="M2"){
						$('.resultsListP1').append($('<li>').text(urlX));
						if(dataM2.length <= urlCount){
						console.log("dp");
						console.log(dataPoint);	
						dataM2.push(dataPoint);
						}
					
					}
				}
				
				/* last = whichList;
				if(last != whichList){
					$('.resultsListP1').append($('<li>').text(whichList))
				} */
				$('.allTextP1').scrollTop($('.allTextP1').scrollHeight-1);
				$('.resultsListP1').scrollTop($('.resultsListP1').scrollHeight);
				
				//$('.resultsListP1').animate({ scrollTo: $('.resultsListP1').scrollHeight});
				//$('.allTextP1').animate({ scrollTo: $('.allTextP1').scrollHeight});
					
				}
				if( dataP1.length == urlCount &&
			dataP2.length == urlCount &&
			dataM1.length == urlCount &&
			dataM2.length == urlCount &&
			donePulling == false){
					console.log("LASTTEXTGRABBED");
					donePulling = true;
					console.log("LASTTEXTGRABBED");
					getFrequencies();
				}
	}
	
	
	
};


function getFrequencies(){
		
	$.ajax({
            type: 'POST',
            url: 'http://107.170.80.97:'+portNum+'/freqFinder/',
			async: false,
            data : {'idNum':idNumber, 'ambiguous':A, 'distance':d, 'ngWidth':ngWidth, 'numFreqs':fs},
            success: function(data){
				displayCounts(data);
				displayCorrelationAndVisualize(data);
				
            },
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
                    alert("Status: " + textStatus); alert("Error: " + errorThrown); 
                }       
        });	
		
		
};

function displayCorrelationAndVisualize(data){
	
	c1x = data['C1X']['score'][0].toFixed(3);
	$('#c1x').text(c1x.toString());
	c1y = data['C1Y']['score'][0].toFixed(3);
	$('#c1y').text(c1y.toString());
	c2x = data['C2X']['score'][0].toFixed(3);
	$('#c2x').text(c2x.toString());
	c2y = data['C2Y']['score'][0].toFixed(3);
	$('#c2y').text(c2y.toString());
	
	draw(c1x,c1y,c2x,c2y);
	//c1x = data['c1x']['score'];
}
function displayCounts(data){
	console.log(data);
	
	//grab the top frequencies
	var countData = [data['P1Freq'],data['P2Freq'],data['M1Freq'],data['M2Freq']];
	
	var numToDisplay = 20
	//display the top frequencies
	for(var i = 0; i <= 3; i++){
		var mostFrequentString = "";
		for(var j = 0; j < numToDisplay; j++){
			mostFrequentString = mostFrequentString + "("+countData[i][j][0]+","+countData[i][j][1].toFixed(3)+"), ";
		}
		$('.Freq'+(i+1)+'List').text(mostFrequentString);
	}
	
}



function getSiteList(string, hits){
	
	var search_type = "Web";
	var query = string;
	query = query.replace(" ","+");
	console.log(query);
	var skipN = 0;
	var urlList = [];
	
	//REPLACE BY USER INPUT
	var numHits = urlCount*2;
	//var numRequests = Math.floor(numHits/40) + 1;
	//console.log("NumAPIRequestsBING: " + numRequests);
	
	
	
	//replace with bing var url = 'https://api.datamarket.azure.com/Data.ashx/Bing/Search/'+search_type+'?Query=%27'+query+'%27&$top=50&$format=json&$skip='+skipN;-->

	var url = 'https://www.googleapis.com/customsearch/v1?key=AIzaSyAzpdhdxAS0Yd6gaL-rm1V3jy0tflFE9JE&cx=015484707549482425261:b5q1t9m6bpa&q='+query;
	$.ajax({
            type: 'GET',
            url: url,
            dataType: "json", 
            context: this,
			async: false,
            success: function(data,status){
				console.log(data);
                //parse data...   
				for(var i = 0; i < data.items.length; i++){
					hits.push(data.items[i].formattedUrl);
					//console.log(data.items[i]);
					console.log(hits[i]);
				}

            }
        });
	var url = 'https://www.googleapis.com/customsearch/v1?key=AIzaSyAzpdhdxAS0Yd6gaL-rm1V3jy0tflFE9JE&cx=015484707549482425261:b5q1t9m6bpa&start=11&q='+query;
	$.ajax({
            type: 'GET',
            url: url,
            dataType: "json", 
            context: this,
			async: false,
            success: function(data,status){
				console.log(data);
                //parse data...   
				for(var i = 0; i < data.items.length; i++){
					hits.push(data.items[i].formattedUrl);
					//console.log(data.items[i]);
					//console.log(hits[i]);
				}

            }
        });
	var url = 'https://www.googleapis.com/customsearch/v1?key=AIzaSyAzpdhdxAS0Yd6gaL-rm1V3jy0tflFE9JE&cx=015484707549482425261:b5q1t9m6bpa&start=21&q='+query;
	$.ajax({
            type: 'GET',
            url: url,
            dataType: "json", 
            context: this,
			async: false,
            success: function(data,status){
				console.log(data);
                //parse data...   
				for(var i = 0; i < data.items.length; i++){
					hits.push(data.items[i].formattedUrl);
					//console.log(data.items[i]);
					//console.log(hits[i]);
				}

            }
        });
	var url = 'https://www.googleapis.com/customsearch/v1?key=AIzaSyAzpdhdxAS0Yd6gaL-rm1V3jy0tflFE9JE&cx=015484707549482425261:b5q1t9m6bpa&start=31&q='+query;
	$.ajax({
            type: 'GET',
            url: url,
            dataType: "json", 
            context: this,
			async: false,
            success: function(data,status){
				console.log(data);
                //parse data...   
				for(var i = 0; i < data.items.length; i++){
					hits.push(data.items[i].formattedUrl);
					//console.log(data.items[i]);
					//console.log(hits[i]);
				}

            }
        });
	var url = 'https://www.googleapis.com/customsearch/v1?key=AIzaSyAzpdhdxAS0Yd6gaL-rm1V3jy0tflFE9JE&cx=015484707549482425261:b5q1t9m6bpa&start=41&q='+query;
	$.ajax({
		type: 'GET',
		url: url,
		dataType: "json", 
		context: this,
		async: false,
		success: function(data,status){
			console.log(data);
			//parse data...   
			for(var i = 0; i < data.items.length; i++){
				hits.push(data.items[i].formattedUrl);
				//console.log(data.items[i]);
				//console.log(hits[i]);
			}

		}
	});
	//THIS IS NOT HOW YOU WANT TO PROGRAM, I JUST NEEDED SOMETHING WORKING
	var url = 'https://www.googleapis.com/customsearch/v1?key=AIzaSyAzpdhdxAS0Yd6gaL-rm1V3jy0tflFE9JE&cx=015484707549482425261:b5q1t9m6bpa&start=51&q='+query;
	$.ajax({
		type: 'GET',
		url: url,
		dataType: "json", 
		context: this,
		async: false,
		success: function(data,status){
			console.log(data);
			//parse data...   
			for(var i = 0; i < data.items.length; i++){
				hits.push(data.items[i].formattedUrl);
				//console.log(data.items[i]);
				//console.log(hits[i]);
			}

		}
	});
};


function processNext(string, i, dataIn, whichList, n, total, dataLen){

	if(total < urlCount){
					
						var u = dataIn.items[n].formattedUrl;
						$.ajax({
							type: 'POST',

							url: 'http://107.170.80.97:'+portNum+'/urlGrab/',
							data : {texts : dataIn.items[n].formattedUrl, which: whichList, AmbiguousWord: A, dataInitialized: initialized, idNum: idNumber, dist: d},
							success: function(data){
								idNumber=data['idNum'];
								console.log("IDNUM: " + idNumber);
								console.log(data)
								initialized=data['initialized'];
								console.log(initialized);
								
								setDataPoint(""+data['texts'], ""+data['which'], u);
								if(""+data['texts']!=[]){
									total = total +1;
									console.log("total" + total.toString() + "which" + whichList);
								}
								
								if(total >= urlCount){
								}
								else{
									if(n == dataLen-1){
										getSiteData(string, whichList, i+10, total);
										console.log("enough"+whichList);
									}
									else{
										processNext(string,i,dataIn,whichList,n+1,total,dataLen);
										console.log("nextA");
									}
								}
								///done=true;

							},
							error: function(XMLHttpRequest, textStatus, errorThrown) { 
									alert("Status: " + textStatus); alert("Error: " + errorThrown); 
								}       
						});
						//while(!done){
						//}
						
					
					}
};

function getSiteData(string, whichList, i, total){
	

	var search_type = "Web";
	var query = string;
	query = query.replace(" ","+");
	console.log(query);
	console.log("Which " + whichList);
	//append to website 
	
	//var dist = 5;

	if(total >= urlCount){
		
	}
	else{
	
		console.log("EYE");
		console.log(i.toString());
		console.log("AYE");
		var doneProcessingBatch = false;
		var url = 'https://www.googleapis.com/customsearch/v1?key=AIzaSyAzpdhdxAS0Yd6gaL-rm1V3jy0tflFE9JE&cx=015484707549482425261:b5q1t9m6bpa&start='+i.toString()+'&q='+query;
		console.log(url);
		$.ajax({
			type: 'GET',
			url: url,
			dataType: "json", 
			context: this,
			async: false,
			success: function(data,status){
				
				console.log(data);
				//parse data...   
				var hits = [];
				var items = data.items;
				processNext(string, i, data, whichList, 0, total, items.length)
				
				//for(var j = 0; j < data.items.length; j++){
					//console.log(data.items[j].formattedUrl);
					//var u = data.items[j].formattedUrl;
					
					//done=false;
					
					
				//}
				//if(total < urlCount){
				//	getSiteData(string, whichList, i+10, total)
				//}
				

			}
		});
	
	}
	
		
		
	
		
	// if( dataP1.length >= urlCount &&
			// dataP2.length >= urlCount &&
			// dataM1.length >= urlCount &&
			// dataM2.length >= urlCount ){
					
					// console.log("LASTTEXTGRABBED");
					// getFrequencies();
				// }
		

	
	
}


var draw = function(c1x,c1y,c2x,c2y){
	
		var canvas = document.getElementById("canvas1");
		if (canvas.getContext) {
			var ctx = canvas.getContext("2d");
			
			var offSetX = 50;
			var offSetY = 100
			
			//
			var width = canvas.width - offSetX;
			var height = canvas.height - offSetY;
			
			//set so it starts at origin
			var offSetY = 0;
			
			
			//draw axis
			ctx.beginPath();
			ctx.strokeStyle = '#0000ff'
			//(0,0)
			ctx.moveTo(offSetX+1,height+offSetY);
			//line to (0,1)
			ctx.lineTo(offSetX+1,offSetY);
			
			//(0,0)
			ctx.moveTo(offSetX,height+offSetY);
			//line to (1,0)
			ctx.lineTo(width+offSetX,height+offSetY);
			
			ctx.closePath();
			ctx.stroke();
			
			
			//label axis
			ctx.font = "12px Arial";
			ctx.fillText("Correlation with",0,10);
			ctx.fillText("Meaning Y",0,35);
			ctx.fillText("Correlation with Meaning X",width-150,height+10);
			
			
			
			//color 
			var classVal = $("input[name=class]:checked").val();
			console.log(classVal);
			ctx.beginPath();
			if(classVal === 'NonJoke'){
				ctx.strokeStyle = '#ff0000';
			}
			else if(classVal === 'Joke'){
				ctx.strokeStyle = '#00ff00';
			}
			else{
				ctx.strokeStyle = '#0000ff';
			}
			
			//draw vector
			//var linePath2 = new Path2D();
			//ctx.beginPath();
			ctx.moveTo(c1x*width+offSetX,height-c1y*height+offSetY);
			ctx.lineTo(c2x*width+offSetX,height-c2y*height+offSetY);
			ctx.closePath();
			ctx.stroke();
			
			//draw arrowhead
			canvas_arrow(ctx,c1x*width,c1y*height,c2x*width,c2y*height, height, offSetX, offSetY);
			
		  }
		  
		    
	}

//method obtained from stackoverflow.com
//method obtained from stackoverflow.com
function canvas_arrow(context, fromx, fromy, tox, toy, height, offSetX, offSetY){
    var headlen = 10;   // length of head in pixels
    var angle = Math.atan2(toy-fromy,(tox-fromx));
	//var linePath3=new Path2D();
	context.beginPath();
    context.moveTo(fromx+offSetX, height-1-fromy+offSetY);
    context.lineTo(tox+offSetX, height-1-toy+offSetY);
    context.lineTo(tox-headlen*Math.cos(angle-Math.PI/6)+offSetX,height-1-(toy-headlen*Math.sin(angle-Math.PI/6))+offSetY);
    context.lineTo(tox-headlen*Math.cos(angle+Math.PI/6)+offSetX,height-1-(toy-headlen*Math.sin(angle+Math.PI/6))+offSetY);
	context.lineTo(tox+offSetX, height-1-toy+offSetY);
	context.closePath();
	context.stroke();
	}

var base64_encode = function(data) {
  // http://kevin.vanzonneveld.net
  // +   original by: Tyler Akins (http://rumkin.com)
  // +   improved by: Bayron Guevara
  // +   improved by: Thunder.m
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   bugfixed by: Pellentesque Malesuada
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: Rafal Kukawski (http://kukawski.pl)
  // *     example 1: base64_encode('Kevin van Zonneveld');
  // *     returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='
  // mozilla has this native
  // - but breaks in 2.0.0.12!
  //if (typeof this.window['btoa'] == 'function') {
  //    return btoa(data);
  //}
  var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
    ac = 0,
    enc = "",
    tmp_arr = [];

  if (!data) {
    return data;
  }

  do { // pack three octets into four hexets
    o1 = data.charCodeAt(i++);
    o2 = data.charCodeAt(i++);
    o3 = data.charCodeAt(i++);

    bits = o1 << 16 | o2 << 8 | o3;

    h1 = bits >> 18 & 0x3f;
    h2 = bits >> 12 & 0x3f;
    h3 = bits >> 6 & 0x3f;
    h4 = bits & 0x3f;

    // use hexets to index into b64, and append result to encoded string
    tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
  } while (i < data.length);

  enc = tmp_arr.join('');

  var r = data.length % 3;

  return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);

};
	
$(document).ready(main);