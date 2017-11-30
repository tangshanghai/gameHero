(function(_global){
    var myScore = function(_root,$){
        this.root = _root;
        var scoreArr = this.root.find("span");
        this.setScore = function(score){
            var fen = parseInt(score).toString();
            for(var i=0;i<scoreArr.length;i++){
                if(i >= fen.length){
                    $(scoreArr[i]).hide();
                }else{
                    var num = parseInt(fen.charAt(i));
                    $(scoreArr[i]).css("background-position-x",-num*40);
                    $(scoreArr[i]).show();
                }
            }
            $(scoreArr[0]).css("margin-left",(scoreArr.length-fen.length)*25/2);
        }
    }

    window.MyScore = myScore;
})(this);