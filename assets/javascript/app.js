  var playnumber;
$( document ).ready(function() {
        var player2;
        var player1;
        var players={
        choose:0,
        wins:0,
        losses:0,
        playername:''
    };
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
    $('#Start').click(function(event){
    	players.playername=$("input[name=player]").val();
    	database.ref('/player1').set(players);
    	$('#players').html('welcome '+ players.playername);
    	$('#player1').text( players.playername);
        players={
        choose:0,
        wins:0,
        losses:0,
        playername:''
    };
    });
    ref.child('player1').on("value", function(snapshot) {
        player1=snapshot.val();
        console.log(player1);
    });
    start();
    function start()
    {
    	ref.on("value", function(snapshot) {
            console.log(snapshot.val());
    		if (snapshot.hasChild('player1')) {
    			$('#players').html("<input type='text' name='player' placeholder='name'><button id='Start'>Start</button>");
    			$('#player1').html(snapshot.val().player1.playername);	
    			$('#Start').click(function(event){
    				players.playername=$("input[name=player]").val();
    				database.ref('/player2').set(players);
    				$('#players').html('welcome '+ players.playername);
    				$('#player2').text( players.playername);

    			});}
    			if (snapshot.hasChild('player2'))
    			{   
    				$('#players').html('welcome '+ players.playername);
    				$('#player2').text(snapshot.val().player2.playername);
    			}
    			if(snapshot.hasChild('player1') && snapshot.hasChild('player2'))
    			{
                 ref.off();
    				database.ref('/turn').set('player1');
                  choose();
    			}
    		});
    }
function play(){
      var choice1=0;
      var choise2=0;

        ref.child('player1').once("child_changed", function(snapshot) {
        choice1=snapshot.val();
        ref.child('player2').once("value", function(snapshot) {
        choice2=snapshot.val().choose;
        player2=snapshot.val();
        console.log(choice1 +'    '+ choice2);
        if (choice1 === choice2) {
            $("#result").html("Tie");
            //database.ref('/winner').set("Tie");
            
        } else if (choice1 == 'rock') {
            if (choice2 == 'paper') {
                console.log('win');
                winplayer1();

            } else if (choice2 == 'sissor') {
                winplayer2();
                console.log('win');
            }
        } else if (choice1 == 'paper') {
            if (choice2 == 'rock') {
                winplayer1();
                console.log('win');
            } else if (choice2 == 'sissor') {
                winplayer2();
                console.log('win');
            }
        } else if (choice1 == 'sissor') {
            if (choice2 == 'rock') {
                winplayer2();
                console.log('win');
            } else if (choice2 == 'paper') {
                winplayer1();
            }
       }
        if (choice1==0 && choice2==0) {
              database.ref('/winner').once("value", function(snapshot)
              {
               $("#result").html(snapshot.val());
               setTimeout(choose, 1000);
            if (snapshot.val()==null) {
               $("#result").html(snapshot.val("Tie"));}
              });
        }
        });
        });
         function winplayer1(){

           ref.child("player1").update(
                {       choose:0,
                    wins:player1.wins+1});
            ref.child("player2").update(
                {       choose:0,
                    losses:player2.losses+1});
            $("#result").html(player1.playername +" won");
            database.ref('/winner').set(player1.playername +" won");
            console.log(player1.playername +"won");
        }
        function winplayer2(){
              console.log(player2.wins +1);
            database.ref().child("player2").update(
                {       choose:0,
                    wins:player2.wins +1});
            database.ref().child("player1").update(
                {       choose:0,
                    losses:player1.losses +1});
            $("#result").html(player2.playername +" won");
               console.log(player2.playername +"won");
               database.ref('/winner').set(player2.playername +" won");
            }
    }

    function choose(){
        playnumber=0;
        database.ref('/winner').remove();
            var choix1;
           var choix2;
        $("#result").empty();
        database.ref("/turn").on("value", function(snapshot) {
            playnumber++;
            console.log(snapshot.val());
            console.log(playnumber);
            if(snapshot.val()=='player1')
            {   
                $('#player1').addClass('blueclass');
                $('#player2').removeClass('blueclass');
                $('#img').remove();
                $('#player1').append("<div id='img'></div>");
                $('#img').append("<img id='paper' class='images' src='assets/images/papper.png'>");
                $('#img').append("<img id='rock' class='images' src='assets/images/Rock.png'>");
                $('#img').append("<img id='sissor' class='images' src='assets/images/sissor.png'>");
                $('#ground').on("click", ".images", function(){ 
                    choix1=$(this).attr('id');
                    database.ref("/turn").set('player2');  
                    $('#ground').off();     
                });
            }
            else
            {   
                $('#player2').addClass('blueclass');
                $('#player1').removeClass('blueclass');    
                $('#img').remove();
                $('#player2').append("<div id='img'></div>");
                $('#img').append("<img id='paper' class='images' src='assets/images/papper.png'>");
                $('#img').append("<img id='rock' class='images' src='assets/images/Rock.png'>");
                $('#img').append("<img id='sissor' class='images' src='assets/images/sissor.png'>");
                $('#ground').on("click", ".images", function(){
                    choix2=$(this).attr('id');
                    database.ref().child('player2').update({choose:choix2});
                    database.ref("/turn").set('player1');
                    
                     $('#ground').off(); 
                });
            }
            if( playnumber>2){
                database.ref('/turn').off();
                database.ref().child('player1').update({choose:choix1});
                play();
            }
        });
    }
});