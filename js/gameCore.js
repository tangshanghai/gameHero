(function(_global){
    var gameCore = function(_root,$,_other){
        this.root = _root;
        
        var self = this;
        var stick = _root.find(".stick");
        var boy = _root.find(".boy");
        var column1 = _root.find(".column1");
        var column2 = _root.find(".column2");

        var column1_w = 2; //1-4之间
        var column2_w = 2;
        var stick_h = 0;
        var dis_w = 1;//1-9之间
        var boy_w = 1.6;//rem
        var index = 0;

        var score = 0;

        
        var gameState = 0;
        var timer = 0;

        this.lostBack = null;
        this.winBack = null;
        this.scoreBack = null;

        var other = _other;
        var $bgmusic = other.bgmusic;
        var $musicBtn =  other.musicBtn;
        var $cowsound = other.cowsound;
        

        other.promptLost.hide();
        other.promptWin.hide();
        other.scoreDis.text("0ML");
        $($musicBtn.find("img")[1]).hide();

        var golda = column2.find(".gold_a");
        var goldd = column2.find(".gold_d");
        // console.log(golda,goldd)
        var golds = [];

        this.startGame = function(){

            column1_w = Math.floor(Math.random()*5)*0.5+1;
            column2_w = Math.floor(Math.random()*5)*0.5+1;
            dis_w = Math.floor(Math.random()*10)+1;
            column1.css("width",column1_w+"rem");
            column2.css("width",column2_w+"rem");


            // var pixel = column1.width();
            // boy.animate({"left":(pixel-boy_w)},200);
            // column2.animate({ "left":(column1_w+dis_w)+"rem"},200)
            boy.animate({
                "left":(column1_w-boy_w)+"rem",
                "bottom":10+"rem"
            },200);
            column2.animate({ "left":(column1_w+dis_w)+"rem"},200);
            stick.css({
                "left":column1_w+"rem",
                "height":0,
                "transform":"rotate(0deg)"
            });

            golds = ["a","a","d","d"];
            for(var i=0;i<13;i++){
                golds.push("0");
            }
            golds.sort(function(a,b){
                return Math.floor(Math.random()*3-1);
            });
            golds.push("0","0","0","0","0","0","0","0","0","0","0","0");
            // console.log(golds);

            other.scoreDis.text("0ML");
            gameState = 0;
            index = 0;
            score = 0;
            if(golds[index] == "a"){
                golda.show();
            }else if(golds[index] == "d"){
                goldd.show();
            }else{
                golda.hide();
                goldd.hide();
            }
            
            
        }

        this.playBg = function(b){
            if(b){
                $bgmusic[0].play();
                console.log($musicBtn)
                $($musicBtn.find("img")[0]).show();
                $($musicBtn.find("img")[1]).hide();
            }else{
                $bgmusic[0].pause();
                $($musicBtn.find("img")[0]).hide();
                $($musicBtn.find("img")[1]).show();
            }
        }

        this.root.on("touchstart",function(event){
            event.preventDefault();
            event.stopPropagation();
            if(gameState != 0) return;

            gameState = 1;
            stick_h = 0;
            stick.css({"transform":"rotate(0deg)"});
            timer = setInterval(function(){
                stick_h += 0.1;
                stick.css("height",stick_h+"rem");
            },20);

            other.explain.hide();
        });

        this.root.on("touchend",function(event){
            event.preventDefault();
            event.stopPropagation();
            if(gameState != 1) return;
            gameState = 2;
            clearInterval(timer);
            var moveTimer = 0;
            var age = 0;
            moveTimer = setInterval(function(){
                age += 15;
                if(age >= 90){
                    age = 90;
                    clearInterval(moveTimer);
                    stick.css({"transform":"rotate("+age+"deg)"});
                    gameState = 10;
                    boyMove();
                } 

                stick.css({"transform":"rotate("+age+"deg)"});
            },40);

        });

        function boyMove(){
            if(gameState != 10 ) return;
            gameState = 20;
            var dis = 0;
            if(stick_h >= dis_w && stick_h <= dis_w+column2_w){
                dis = dis_w+column1_w+column2_w-boy_w;
                setTimeout(function(){
                    tip(10);
                    score += 10;
                    if(golds[index] == "a" || golds[index] == "d"){
                        tip(5);
                        score += 5;
                    }

                    golda.hide();
                    goldd.hide();
                    other.scoreDis.text(score+"ML");

                    index++;
                },1050);
                setTimeout(moveToInit,1400);
            }else{
                dis = stick_h+column1_w-boy_w/2;
                setTimeout(lostHandler,1050);
            }
            boy.animate({"left":dis+"rem"},1000);
        }

        function moveToInit(){

            if(score >= 195){
                gameWin();
                return;
            }
            var diffX = column2.position().left;
            var dura = 500;
            column1.animate({"left":column1.position().left-diffX},dura);
            column2.animate({"left":0},dura);
            stick.animate({"left":stick.position().left-diffX},dura);
            boy.animate({"left":boy.position().left-diffX},dura);
            
            setTimeout(initPosition,550);
        }

        function initPosition(){
            column1_w = column2_w;
            column2_w = Math.floor(Math.random()*5)*0.5+1;
            dis_w = Math.floor(Math.random()*10)+1;
            stick_h = 0;
            column1.css({
                "left":0,
                "width":column1_w+"rem"
            });
            column2.css({
                "left":"15rem",
                "width":column2_w+"rem"
            });

            boy.css({
                "left":(column1_w-boy_w)+"rem",
                "bottom":10+"rem"
            });
            column2.animate({ "left":(column1_w+dis_w)+"rem"},200);
            stick.css({
                "left":column1_w+"rem",
                "height":stick_h,
                "transform":"rotate(0deg)"
            });

            if(golds[index] == "a"){
                golda.show();
            }else if(golds[index] == "d"){
                goldd.show();
            }else{
                golda.hide();
                goldd.hide();
            }

            gameState = 0;
        }

        function lostHandler(){
            var moveTimer = 0;
            var age = 90;
            moveTimer = setInterval(function(){
                age += 7.5;
                if(age >= 175){
                    age = 175;
                    clearInterval(moveTimer);
                    stick.css({"transform":"rotate("+age+"deg)"});
                    
                } 

                stick.css({"transform":"rotate("+age+"deg)"});
            },40);
            boy.animate({
                "bottom":-boy_w+"rem"
            },400);
            $cowsound[0].play();
            setTimeout(showGoonWindow,410);
        }

        function tip(num){
            var tipdis = $("<div>");
            
            tipdis.css({
                left:parseInt(num/5*25)+"%",
                width:"2rem",
                height:"0.9rem",
                "text-align":"center",
                position:"absolute",
                "bottom":"10rem",
                "opacity":1,
                "color":"#0068b7"
            })
            tipdis.text("+"+num+"ML");
            _root.append(tipdis);

            tipdis.animate({
                "bottom":"17rem",
                "opacity":0
            },900,"linear",function(){
                tipdis.remove();
            });
        }

        function gameWin(){
            other.promptWin.show();
            var str = new Date().toLocaleDateString().split("/").join("");
            var num = 1500+Math.floor(Math.random()*100);
            other.promptWin.find(".win_time").text(str+num);
        }
        function showGoonWindow(){
            // if(self.lostBack){
            //     self.lostBack(score);
            // }
            other.promptLost.find(".line_score1").text("获得"+score+"ml");
            other.promptLost.show();
        }
        other.promptLost.find(".goon_btn").on("click",function(){
            other.promptLost.hide();
            gameState = 0;
            self.startGame();
        });

        $musicBtn.on("click",function(){
            if($bgmusic[0].paused){
                $bgmusic[0].play();
                $($musicBtn.find("img")[0]).show();
                $($musicBtn.find("img")[1]).hide();
            }else{
                $bgmusic[0].pause();
                $($musicBtn.find("img")[0]).hide();
                $($musicBtn.find("img")[1]).show();
            }
        })
    }

    window.GameCore = gameCore;
})(this);