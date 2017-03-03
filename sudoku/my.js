/*js数独*/

//简化获取元素操作
function $(elem){return document.getElementById(elem);}
//删除数组中指定元素
Array.prototype.remove=function(val){
	for (var i=0;i<this.length;i++){
		if(this[i]=val){
			this.splice(i,1);
			i--;
		}
	}
}
//使document.getElementsByName在IE中支持W3c标准
var S=Sudoku={
	/*数据存储*/
	numTable:[],//答案用表
	gameTable:[],//游戏用表
	editable:[],//可编辑表
	editIndex:'',//现在正在编辑Index
	selectTab:'',//数字选择表
	elem:'',//DIV生成字符串
	answerStr:'',//答案生成字符串
	num:[1,2,3,4,5,6,7,8,9],//1-9数组
	tab:[					//9块3x3
		[[],[],[]],
		[[],[],[]],
		[[],[],[]],
	],
	row:[[],[],[],[],[],[],[],[],[]],//9 line
	col:[[],[],[],[],[],[],[],[],[]],
	level:[20,40,60,80]//4个等级
	interval:null,//计时器
	time:0,//计时器，单位秒
}
/*数据初始化*/
clear:function(){
   S.numTable=[];
   S.elem="";
   S.tab=[[[],[],[]],[[],[],[]],[[],[],[]]];
   S.row=[[],[],[],[],[],[],[],[],[]];
   S.col=[[],[],[],[],[],[],[],[],[]];
   S.time=0;
   S.answerStr='';
   S.selectTab='';
   if(S.imterval!=null)clearInterval(S.interval);
   $('time').innerHTML="0:0";
}
/*生成数独*/

getNewTable:functiion(){
	//生成第一行
	S.num.sort(function(){return Math.random()>0.5?-1:1;});
	for(var i=0;i<9;i++){
	S.numTable.push(S.num[i]);
   	S.col[i].push(S.num[i]);
   	S.tab[0][paseInt((i%9)/3)].push(S.num[i]);
   }
   //生成后8行
   for(var i=1;i<9;i++){
   	for(var j=1;j<9;j++){
   		
   	}
   }
}