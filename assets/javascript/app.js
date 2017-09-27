/************************************* 
for better functionning use two  
windows browser I am usingg the 
session storage
 **************************************/
 var playnumber;
 //define the structure of the object player 
 var players={
  choose:0,
  wins:0,
  losses:0,
  playername:''
};
$( document ).ready(function() {
  var choice1=0;
  var choise2=0;
  var player2=players;
  var player1=players;
  //firebase************************************************
//init the therm of connectifity to firebase
var config = {
  apiKey: "AIzaSyA9vn_Ic7vk7AMRX7hukAmClV1mh_GWj0c",
  authDomain: "project-43621.firebaseapp.com",
  databaseURL: "https://project-43621.firebaseio.com",
  projectId: "project-43621",
  storageBucket: "project-43621.appspot.com",
  messagingSenderId: "505918979443"
};
  //connect to firebase database
  firebase.initializeApp(config);
  var database=firebase.database();
  // refer the data path
  var ref=database.ref();
  var chat=database.ref('/chat');
  //chat*******************************************************
  // define a function chat to allow chat between two players
  function chating(){
    //add a listner on the /chat each time a child add the following code will be executed
    database.ref('/chat').on("child_added", function(snapshot) {
      //if its player2 the text will float left with a green background 
      if (snapshot.val().indexOf(player2.playername)!=-1) {
        $('#messages').append("<div><p class='classpl2'>"+snapshot.val()+'</p></div>');
      }else//otherwise the text will float wright with a red background 
      {
        $('#messages').append("<div><p class='classpl1'>"+snapshot.val()+'</p></div>');
      }
    });
    // add a click eventlistner on button send to update data refered by /chat
    $('#Send').click(function(event){
      var player=(sessionStorage.getItem('player'));
      text=$("input[name=message]").val().trim();
      $("input[name=message]").val('');
      chat.push(eval(player).playername+" :"+text);
    });
  }  
   //disconected************************************************
   //if a player disconnet his data will be removed 
    chat.onDisconnect().remove();
    database.ref('/turn').onDisconnect().remove();
    database.ref('/'+sessionStorage.getItem('player')).onDisconnect().remove();
  //start*******************************************************
  // call the function start
    start();
  // define the function start
    function start()
    {
      //add a eventlistner on button start 
        $('#Start').click(function(event){
        event.preventDefault();
        player1=players;
        players.playername=$("input[name=player]").val();
        //initiate /player1
        database.ref('/player1').set(players);
        //initiate /chat
        chat.set({});
        $('#players').html('welcome '+ players.playername);
        $('#pl1').text( players.playername);
        // initiate the local session storage with player1
        sessionStorage.setItem('player', 'player1');
    });
    // add a listner on the whole data 
    	ref.on("value", function(snapshot) {
        // if we player1 is in the data execute this code to allow a second player to join the game
            if (snapshot.hasChild('player1' && (sessionStorage.getItem(player2))==null) ) {
              $('#players').html("<input type='text' name='player' placeholder='name'><button id='Start2'>Start</button>");
              $('#pl1').html(snapshot.val().player1.playername);
              $('#Start2').click(function(event){
                players.playername=$("input[name=player]").val();
                $("input[name=player]").val('s');
                //initiate player2 data
                database.ref('/player2').set(players);
                $('#players').html('welcome '+ players.playername);
                $('#pl2').text( players.playername);
                // initiate the local session storage with player2 
                sessionStorage.setItem('player', 'player2');
            });}
              // if player2 was succesfully initiated 
              if (snapshot.hasChild('player2'))
              {   
               // display player2 info 
                $('#players').html('welcome '+ players.playername);
                $('#pl2').text(snapshot.val().player2.playername); 
           }
           // if we have both players trigger function choose and stop the data event listner
           if(snapshot.hasChild('player1') && snapshot.hasChild('player2'))
           {
               ref.off();
               choose();
           }
       });
    }
    //play*******************************************************
    function play(){
    // this function will be comparing each play choose and basied on that will decide who won
      choice2=player2.choose;
      choice1=player1.choose;
      if (choice1 ==choice2) {
        $("#result").html("Tie");
        database.ref('/winner').remove();
        ref.child("player1").update(
            {   choose:0,
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
     // this function in case player one win will increment player1 wins and player2 losses and exucute function choose after 5 secondes
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
     setTimeout(choose, 5000);
 }
   // this function in case player one win will increment player2 wins and player1 losses and exucute function choose after 5 secondes 
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
    setTimeout(choose, 5000);
}
}

function choose(){
  // this will be listening if one of the players leave the game so it will allow another player to join it
    ref.on('child_removed', function(snapshot){
        if (snapshot.hasChild('player1') ){
            sessionStorage.setItem('player', 'player1'); 
            database.ref('/player1').set(player2);
            $('#player2').html('Waiting for player2');
            $('#players').html('welcome '+ players.playername);
            Start();
        }
          if (snapshot.hasChild('player2') ){
            $('#player2').html('Waiting for player2');
            $('#players').html('welcome '+ players.playername);
            Start();
        }
    }   
    });
    // call function chat so to players can chat 
    chating();
    playnumber=0;
    // set the first round of the game for player1
    database.ref("/turn").set('player1');
    database.ref('/winner').remove();
    var choix1;
    var choix2;
    $("#result").empty();
    // keep track of wins and losses for player 1
    database.ref('/player1').on("value", function(snapshot) {
        player1=snapshot.val();
        if (player1!=null) {
        $('#record1').text("wins :"+player1.wins+" "+"losses :"+player1.losses);}
    });
    // keep track of wins and losses for player 2
    database.ref('/player2').on("value", function(snapshot) {
        player2=snapshot.val();
        if (player2!=null) {
        $('#record2').text("wins :"+player2.wins+" "+"losses :"+player2.losses);;}
    });
    // this will gave each player a chance to choose
    database.ref("/turn").on("value", function(snapshot) {
        playnumber++;
        console.log(snapshot.val());
        // if its player1 turn
        if(snapshot.val()=='player1')
        {    
           $('#player2').off(); 
            // this indicate which player have to play 
               $('#result').html(eval(snapshot.val()).playername+" turn to play");
               $('#player1').addClass('blueclass');
               $('#player2').removeClass('blueclass');
               $('#img').remove();
               $('#pl1').append("<div id='img'></div>");
               $('#img').append("<img id='paper' class='images' src='assets/images/papper.png'>");
               $('#img').append("<img id='rock' class='images' src='assets/images/Rock.png'>");
               $('#img').append("<img id='sissor' class='images' src='assets/images/sissor.png'>");
               // this will allow only player1 to click 
               if(sessionStorage.getItem('player')=='player1'){
                
                $('#player1').on("click", ".images", function(){ 
                    $('#player1').off();
                    choix1=$(this).attr('id');
                    database.ref().child('player1').update({choose:choix1});
                // this will turn the round to player2 to play
                    database.ref("/turn").set('player2');    
                });}
            }
            if(snapshot.val()=='player2')
            {  
               $('#player1').off();
                 $('#result').html(eval(snapshot.val()).playername+" turn to play");
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
                 // after both players has choosen the function play will be triggered to decide how won
                    database.ref('/turn').off();
                    play();
                }
            });
}

});