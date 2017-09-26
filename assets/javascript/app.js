  var playnumber;
        var players={
        choose:0,
        wins:0,
        losses:0,
        playername:''
    };
$( document ).ready(function() {
        var player2=players;
        var player1=players;

	var config = {
		apiKey: "AIzaSyA9vn_Ic7vk7AMRX7hukAmClV1mh_GWj0c",
		authDomain: "project-43621.firebaseapp.com",
		databaseURL: "https://project-43621.firebaseio.com",
		projectId: "project-43621",
		storageBucket: "project-43621.appspot.com",
		messagingSenderId: "505918979443"
	};
	firebase.initializeApp(config);
	var database=firebase.database();
	var ref=database.ref();
	var chat=database.ref('/chat');
    //chat*********************************
       function chating(){
        database.ref('/chat').on("child_added", function(snapshot) {
        console.log(snapshot.val());
        console.log(snapshot.val().indexOf(player2.playername));
        if (snapshot.val().indexOf(player2.playername)) {
        $('#messages').append("<div><p class='classpl2'>"+snapshot.val()+'</p></div>');
        }else{
        $('#messages').append("<div><p class='classpl1'>"+snapshot.val()+'</p></div>');
        }
    });
    $('#Send').click(function(event){
        var player=(sessionStorage.getItem('player'));
       text=$("input[name=message]").val().trim();
       $("input[name=message]").val('');
       chat.push(eval(player).playername+" :"+text);
    });
    }





    //desconected****************************
chat.onDisconnect().remove();
    //****************************************
    $('#Start').click(function(event){
        player1=players;
    	players.playername=$("input[name=player]").val();
    	database.ref('/player1').set(players);
        chat.set({});
    	$('#players').html('welcome '+ players.playername);
    	$('#pl1').text( players.playername);
        sessionStorage.setItem('player', 'player1');
    $('#Start').off();
    });
    start();
    function start()
    {
    	ref.on("value", function(snapshot) {
            console.log(sessionStorage.getItem('player'));
    		if (snapshot.hasChild('player1') ) {
    			   $('#players').html("<input type='text' name='player' placeholder='name'><button id='Start2'>Start</button>");
    		    	$('#pl1').html(snapshot.val().player1.playername);
    			    $('#Start2').click(function(event){
    				players.playername=$("input[name=player]").val();
                    $("input[name=player]").val('s');
    				database.ref('/player2').set(players);
    				$('#players').html('welcome '+ players.playername);
    				$('#pl2').text( players.playername);
                    sessionStorage.setItem('player', 'player2');
                    
    			});}
    			if (snapshot.hasChild('player2'))
    			{   
    				$('#players').html('welcome '+ players.playername);
    				$('#pl2').text(snapshot.val().player2.playername);
                    if (snapshot.hasChild('player1')==false)
                    {
                     sessionStorage.setItem('player', 'player1'); 
                     players=snapshot.val().player2;
                      database.ref('/player1').set(players);
                      database.ref('/player2').remove();
                    }
    			}
    			if(snapshot.hasChild('player1') && snapshot.hasChild('player2'))
    			{
                 ref.off();
                 choose();
    			}
    		});
    }
function play(){

      var choice1=0;
      var choise2=0;
        choice2=player2.choose;
        choice1=player1.choose;
        if (choice1 ==choice2) {
            $("#result").html("Tie");
            database.ref('/winner').remove();
            ref.child("player1").update(
                {       choose:0,
                    wins:player1.wins});
            ref.child("player2").update(
                {   choose:0,
                    losses:player2.losses});
            setTimeout(choose, 2000);
        } else if (choice1 == 'rock') {
            if (choice2 == 'paper') {
                console.log('win');
                winplayer1();

            } else if (choice2 == 'sissor') {
                winplayer2();
            }
        } else if (choice1 == 'paper') {
            if (choice2 == 'rock') {
                winplayer1();
            } else if (choice2 == 'sissor') {
                winplayer2();
            }
        } else if (choice1 == 'sissor') {
            if (choice2 == 'rock') {
                winplayer2();
            } else if (choice2 == 'paper') {
                winplayer1();
            }
       }
         function winplayer1(){

           ref.child("player1").update(
                {       choose:0,
                    wins:player1.wins+1});
            ref.child("player2").update(
                {       choose:0,
                    losses:player2.losses+1});
            $("#result").html(player1.playername +" won");
            database.ref('/winner').set(player1.playername +" won");
            database.ref('/turn').remove();
             setTimeout(choose, 2000);
        }
        function winplayer2(){
            database.ref().child("player2").update(
                {       choose:0,
                    wins:player2.wins +1});
            database.ref().child("player1").update(
                {       choose:0,
                    losses:player1.losses +1});
            $("#result").html(player2.playername +" won");
            database.ref('/winner').set(player2.playername +" won");
            database.ref('/turn').remove();
             setTimeout(choose, 1000);
            }
    }

    function choose(){
        chating();
        ref.on("value", function(snapshot){
        if (snapshot.hasChild('player2')){
             if (snapshot.hasChild('player1')==false){
                sessionStorage.setItem('player', 'player1'); 
                     players=snapshot.val().player2;
                      database.ref('/player1').set(players);
                      database.ref('/player2').remove();
                      Start();
             }
      
        }   

        });
        playnumber=0;
        database.ref("/turn").set('player1');
        database.ref('/winner').remove();
            var choix1;
           var choix2;
        $("#result").empty();
        database.ref('/player1').on("value", function(snapshot) {
        player1=snapshot.val();
        $('#record1').text("wins :"+player1.wins+" "+"losses :"+player1.losses);
        });
        database.ref('/player2').on("value", function(snapshot) {
        player2=snapshot.val();
        $('#record2').text("wins :"+player2.wins+" "+"losses :"+player2.losses);;
        });
        database.ref("/turn").on("value", function(snapshot) {
            playnumber++;
            console.log(snapshot.val());
            if(snapshot.val()=='player1')
            {   
                 $('#player2').off(); 
               // $('#result').html(snapshot.val()+" turn to play");
                $('#player1').addClass('blueclass');
                $('#player2').removeClass('blueclass');
                $('#img').remove();
                $('#pl1').append("<div id='img'></div>");
                $('#img').append("<img id='paper' class='images' src='assets/images/papper.png'>");
                $('#img').append("<img id='rock' class='images' src='assets/images/Rock.png'>");
                $('#img').append("<img id='sissor' class='images' src='assets/images/sissor.png'>");
                if(sessionStorage.getItem('player')=='player1'){

                $('#player1').on("click", ".images", function(){ 
                    $('#player1').off();
                    choix1=$(this).attr('id');
                    database.ref().child('player1').update({choose:choix1});
                    database.ref("/turn").set('player2');    
                });}
            }
            if(snapshot.val()=='player2')
            {  
                 $('#player1').off();
                 //$('#result').html(eval(snapshot.val()).playername+" turn to play");
                $('#player2').addClass('blueclass');
                $('#player1').removeClass('blueclass');    
                $('#img').remove();
                $('#pl2').append("<div id='img'></div>");
                $('#img').append("<img id='paper' class='images' src='assets/images/papper.png'>");
                $('#img').append("<img id='rock' class='images' src='assets/images/Rock.png'>");
                $('#img').append("<img id='sissor' class='images' src='assets/images/sissor.png'>");
                if(sessionStorage.getItem('player')=='player2'){
                $('#player2').on("click", ".images", function(){
                    choix2=$(this).attr('id');
                    database.ref().child('player2').update({choose:choix2});
                    database.ref("/turn").set('player1');
                });}
            }
            if( playnumber>2){
                database.ref('/turn').off();
                play();
            }
        });
    }

});