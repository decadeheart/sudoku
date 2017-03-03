/*
design by 软工1502 袁巡 U201517030
*/
 

	function $(elem){return document.getElementById(elem);}

	Array.prototype.remove = function(val) {
		for (var i = 0; i < this.length; i++) {
			if (this[i] == val) {
				this.splice(i, 1);
				i--;
			}
		}
	};

	document.nativeGetElementsByName = document.getElementsByName; 
	document.getElementsByName = function(name) {
    	var elemByName = document.nativeGetElementsByName(name); 
    	if(elemByName){ 
   			if(elemByName.length > 0) return elemByName;
    		elemByName = new Array();
    		var e = document.getElementsByTagName('div');
   			for(i = 0; i < e.length; i++) {
    			if(e[i].getAttribute("name") == name) {
     				elemByName[elemByName.length] = e[i];
    			}
    		}
    		return elemByName;
    	} 
      	return null; 
	}

var S = Sudoku = {
	
	numTable : [],								
	gameTable: [],								
	editable : [],								
	editIndex: '',								
	selectTab: '',								
	elem	 : '',								
	answerStr: '',								
	num		 : [1,2,3,4,5,6,7,8,9],				
	tab		 : [								
					[[],[],[]],
					[[],[],[]],
					[[],[],[]]
				],	
	row		 : [[],[],[],[],[],[],[],[],[]],	
	col		 : [[],[],[],[],[],[],[],[],[]],	
	level	 : [20,40,60,80],					
	interval : null,							
	time     : 0,								

	clear : function(){
		S.numTable = [];
		S.elem = "";
		S.tab = [[[],[],[]],[[],[],[]],[[],[],[]]];	
		S.row = [[],[],[],[],[],[],[],[],[]];
		S.col = [[],[],[],[],[],[],[],[],[]];
		S.time = 0;
		S.answerStr = '';
		S.selectTab = '';
		if (S.interval != null) clearInterval(S.interval);
		$('time').innerHTML="0 : 0"
	},

	getNewTable : function(){
		
		//生成第一行
		S.num.sort(function(){return Math.random()>0.5?-1:1;});
		for (var i=0 ; i<9 ; i++){
			S.numTable.push(S.num[i]);
			S.col[i].push(S.num[i]);
			S.tab[0][parseInt((i%9)/3)].push(S.num[i]);
		}
		//生成后八行
		for (var i=1 ; i<9 ; i++){
			for(var j=0 ; j<9 ; j++){
				var flag = true;		//flag 记录新生成数是否正确
				var answer = [1,2,3,4,5,6,7,8,9];//未开始验证时1-9均可
				//在可选答案中除去列相同元素
				for(var k=0; k<S.col[j].length ; k++){
					answer[S.col[j][k]-1]=0;
				}
				//在可选答案中除去行相同元素
				for(var k=0; k<S.row[i].length ; k++){
					answer[S.row[i][k]-1]=0;
				}
				//在可选答案中除去3x3相同元素
				for(var k=0; k<S.tab[parseInt(i/3)][parseInt(j/3)].length ; k++){
					answer[S.tab[parseInt(i/3)][parseInt(j/3)][k]-1]=0;
				}
				//得到可行数组
				answer.remove(0);
				//若得到可行数组长度为0 则此处无解 生成数独失败
				if(answer.length == 0){
					S.answerInit();return false;
				}
				//可行数组中随机产生一个可行解
				insertNum = answer[Math.floor(Math.random()*answer.length)]
				//将这个数存入验证数组				
				S.numTable.push(insertNum);
				S.row[i].push(insertNum);
				S.col[j].push(insertNum);
				S.tab[parseInt(i/3)][parseInt(j/3)].push(insertNum);
				
			}
		}
		return true;
	},
	

	answerInit : function(){
		S.clear();
		if(S.getNewTable()){
			for (var i=0 ; i<81 ; i++){
				//开始向数独数组内存数number对象
				rows = parseInt(i/9) + 1;
				cols = parseInt(i%9) + 1;
				//开始创建界面
				if( ((rows<=3||rows>=7) && (cols<=3||cols>=7)) || ((rows>=4&&rows<=6) && (cols>=4&&cols<=6)) )
					background = "background1";
				else
					background = "background2";
				S.answerStr += "<div class='block radius "+ background +"' id='"+i+"'>"+S.numTable[i]+"</div>";
			}
		}
	},

	gameInit : function(){
		//提取等级
		var lv=1;
		oDomLv = document.getElementsByName('lv');
		for (i in oDomLv){
			if(oDomLv[i].checked){
				lv = parseInt(oDomLv[i].value);
			}
		}
		S.gameTable = S.numTable;
		blank = S.level[lv-1];	//产生空格数
		//初始化可编辑表，所有位置均不可编辑
		for(var i=0 ; i<81 ; i++){
			S.editable[i] = false;
		}
		//产生游戏数组 在空格位置置空
		for(var i=0 ; i<blank ; i++){
			var rand = parseInt(Math.random()*81)
			S.editable[rand] = true;
			S.gameTable[rand] = '';
		}
		S.gameBoard();
		//数字选择表初始化
		for(var i=1 ; i<10 ; i++){
			S.selectTab += '<div name="selectDiv" class="selectDiv font color radius">' + i + '</div>';
		}
		$('selectBoard').innerHTML = S.selectTab;
		//生成成功计时开始
		S.interval = setInterval('S.showTime()',1000);
	},

	gameBoard : function(){

		S.elem = "";
		$('gameBoard').innerHTML = "";
		for (var i=0 ; i<81 ; i++){
			//开始向数独数组内存数number对象
			rows = parseInt(i/9) + 1;
			cols = parseInt(i%9) + 1;
			//开始创建界面
			if( ((rows<=3||rows>=7) && (cols<=3||cols>=7)) || ((rows>=4&&rows<=6) && (cols>=4&&cols<=6)) )
				background = "background1";
			else
				background = "background2";
			if(!S.editable[i])
				S.elem += "<div class='block radius "+ background +"' id='"+i+" ' name='blank'>"+S.gameTable[i]+"</div>";
			else
				S.elem += "<div class='block radius editable "+ background +"' id='"+i+" ' name='blank'>"+S.gameTable[i]+"</div>";
		}
		$('gameBoard').innerHTML = S.elem;	
		if(S.editIndex!=""){
			S.gameCheck();
		}
		S.gameEvent();
	},

	gameEvent : function(){
		//单击可编辑格事件
		var flag = 'close';
		dom_blank = document.getElementsByName('blank');
		for(var i=0 ; i<dom_blank.length ; i++){
			if(S.editable[i]){
				dom_blank[i].onclick = function(e){
					e=e||window.event;
					$('selectBoard').style.top=e.clientY+10+"px";
					$('selectBoard').style.left=e.clientX+10+"px";
					if(flag == 'close'){
						S.editIndex = this.id;
						$('selectBoard').style.display = "block";
						flag = 'open';
					}else{
						S.editIndex = -1;
						$('selectBoard').style.display = "none";
						flag = 'close';
					}
				}
			}
		}
		//点击选择面板事件
		dom_select = document.getElementsByName('selectDiv');
		for(i in dom_select){
			dom_select[i].onclick = function(){
				S.gameTable[parseInt(S.editIndex)] = parseInt(this.innerHTML);
				$('selectBoard').style.display = "none";
				S.gameBoard();
			}
		}
	},

	gameCheck : function(){
		winFlag = true;
		for (var checkIndex=0 ; checkIndex<81 ; checkIndex++){
			if(S.editable[checkIndex] && S.gameTable[checkIndex]!=""){//可编辑且不为空
				var row = parseInt(parseInt(checkIndex)/9);
				var col = parseInt(parseInt(checkIndex)%9);
				var tabX = parseInt(row/3);
				var tabY = parseInt(col/3);
				for (var i=0 ; i<9 ; i++){
					for (var j=0 ; j<9 ; j++){
						if(i==row || j==col || (parseInt(i/3)==tabX && parseInt(j/3)==tabY)){//与被检查元素相关
							if(S.gameTable[i*9+j] == S.gameTable[parseInt(checkIndex)] && parseInt(checkIndex) != i*9+j){
								dom_blank[i*9+j].style.background = "#c6c";
								dom_blank[parseInt(checkIndex)].style.background = "#c6c";
								winFlag=false;
							}
						}
					}
				}
			}else if(S.gameTable[checkIndex] == ""){
				winFlag=false;
			}
		}
		//判断胜利
		if(winFlag){
			clearInterval(S.interval);
			alert('游戏胜利！\n用时：'+$('time').innerHTML);
		}
	},

	showTime : function(){
		S.time++;
		var sec = S.time%60;
		var min = parseInt(S.time/60);
		var str = new String();
		$("time").innerHTML = min+" 分 "+sec+" 秒";
	},

	gameOver : function(){
		if(S.elem == ''){
			alert('游戏未开始');
		}else{
			clearInterval(S.interval);
			$('gameBoard').innerHTML = S.answerStr;
		}
	},

	init : function(){
		S.answerInit();
		S.gameInit();
		S.gameEvent();
	},
}


onload = function(){
	if(navigator.appName.indexOf("Microsoft")==-1) $('help').style.display = 'none'
}