var PLAYER_CONTROL_PHASE_STEP1 = 0;
var PLAYER_CONTROL_PHASE_STEP2 = 1;

var GAME_CONTROL = {
    TURN : 1,
    PLAYER_CONTROL_PHASE : PLAYER_CONTROL_PHASE_STEP1,
    PHASE_STEP1_TARGET_X : 0,
    PHASE_STEP1_TARGET_Y : 0
}

var capture_piece_list1 = new Array();
var capture_piece_list2 = new Array();

var board_obj = {
  piece:"",
  player:0,
};

//capture_piece_list初期化
for(var i =0 ;i<20;i++){
  capture_piece_list1.unshift(board_obj);
  capture_piece_list2.unshift(board_obj);
}

//盤面初期化[y][x]
var board_status = new Array();
for(var y=0;y<=8;y++){
    board_status[y] = new Array();
    for(var x=0;x<=8;x++){
      var tmp_obj = {
        piece:"",
        player:0,
      };
      if( y == 2 || y == 6 ){
        tmp_obj.piece = "歩";
        if(y == 2){
          tmp_obj.player = 2;
        }else{
          tmp_obj.player = 1;
        }
      }else if((y == 0 || y == 8) && (x == 0 || x == 8)){
        tmp_obj.piece = "香";
        if(y == 0){
          tmp_obj.player = 2;
        }else{
          tmp_obj.player = 1;
        }
      }else if((y == 0 || y == 8) && (x == 1 || x == 7)){
        tmp_obj.piece = "桂";
        if(y == 0){
          tmp_obj.player = 2;
        }else{
          tmp_obj.player = 1;
        }
      }else if((y == 0 || y == 8) && (x == 2 || x == 6)){
        tmp_obj.piece = "銀";
        if(y == 0){
          tmp_obj.player = 2;
        }else{
          tmp_obj.player = 1;
        }
      }else if((y == 0 || y == 8) && (x == 3 || x == 5)){
        tmp_obj.piece = "金";
        if(y == 0){
          tmp_obj.player = 2;
        }else{
          tmp_obj.player = 1;
        }
      }else if(y == 1 && x == 7 || y == 7 && x == 1){
        tmp_obj.piece = "角";
        if(y == 1){
          tmp_obj.player = 2;
        }else{
          tmp_obj.player = 1;
        }
      }else if(y == 1 && x == 1 ||y == 7 && x == 7){
        tmp_obj.piece = "飛";
        if(y == 1){
          tmp_obj.player = 2;
        }else{
          tmp_obj.player = 1;
        }
      }else if(x == 4 && (y ==0 ||y ==8)){
        tmp_obj.piece = "王";
        if(y == 0){
          tmp_obj.player = 2;
        }else{
          tmp_obj.player = 1;
        }
      }
      board_status[y][x] = tmp_obj;
    }
}
display();

const board = document.getElementById("board");
board.addEventListener("click", getTarget, false);

const select_piec_reset = document.getElementById("select_piec_reset");
select_piec_reset.addEventListener("click", selectPieceReset, false);


//クリックされた要素のカスタムデータ取得
function getTarget(event) {
   let target = event.target;
   var target_y = target.getAttribute('data-y');
   var target_x = target.getAttribute('data-x');
   if(GAME_CONTROL.PLAYER_CONTROL_PHASE == PLAYER_CONTROL_PHASE_STEP1){
     //駒のないますならスルー
     if(board_status[target_y][target_x].player == 0){
       return ;
     }
     //自分のターンに自分の駒以外をクリックしたらスルー
     if(GAME_CONTROL.TURN % 2 == 1 && board_status[target_y][target_x].player != 1){
       return ;
     }
     if(GAME_CONTROL.TURN % 2 == 0 && board_status[target_y][target_x].player != 2){
       return ;
     }
     // 1度目に押された座標を格納
    GAME_CONTROL.PHASE_STEP1_TARGET_Y = target_y;
    GAME_CONTROL.PHASE_STEP1_TARGET_X = target_x;
    GAME_CONTROL.PLAYER_CONTROL_PHASE = PLAYER_CONTROL_PHASE_STEP2;
  }else if(GAME_CONTROL.PLAYER_CONTROL_PHASE == PLAYER_CONTROL_PHASE_STEP2){
    //コマ行動判定
    if(board_status[GAME_CONTROL.PHASE_STEP1_TARGET_Y][GAME_CONTROL.PHASE_STEP1_TARGET_X].piece == "歩"){
      if(!controlActivityPawn(target_y,target_x)){
        return ;
      }
    }else if(board_status[GAME_CONTROL.PHASE_STEP1_TARGET_Y][GAME_CONTROL.PHASE_STEP1_TARGET_X].piece == "金"){
      if(!controlActivityGoldGeneral(target_y,target_x)){
        return ;
      }
    }else if(board_status[GAME_CONTROL.PHASE_STEP1_TARGET_Y][GAME_CONTROL.PHASE_STEP1_TARGET_X].piece == "銀"){
      if(!controlActivitySilverGeneral(target_y,target_x)){
        return ;
      }
    }else if(board_status[GAME_CONTROL.PHASE_STEP1_TARGET_Y][GAME_CONTROL.PHASE_STEP1_TARGET_X].piece == "王"){
      if(!controlActivityKing(target_y,target_x)){
        return ;
      }
    }else if(board_status[GAME_CONTROL.PHASE_STEP1_TARGET_Y][GAME_CONTROL.PHASE_STEP1_TARGET_X].piece == "桂"){
      if(!controlActivityKnight(target_y,target_x)){
        return ;
      }
    }else if(board_status[GAME_CONTROL.PHASE_STEP1_TARGET_Y][GAME_CONTROL.PHASE_STEP1_TARGET_X].piece == "香"){
      if(!controlActivityLance(target_y,target_x)){
        return ;
      }
    }else if(board_status[GAME_CONTROL.PHASE_STEP1_TARGET_Y][GAME_CONTROL.PHASE_STEP1_TARGET_X].piece == "飛"){
      if(!controlActivityRook(target_y,target_x)){
        return ;
      }
    }else if(board_status[GAME_CONTROL.PHASE_STEP1_TARGET_Y][GAME_CONTROL.PHASE_STEP1_TARGET_X].piece == "角"){
      if(!controlActivityBishop(target_y,target_x)){
        return ;
      }
    }

    //駒移動
    movePiece(target_y,target_x);

    GAME_CONTROL.PLAYER_CONTROL_PHASE = PLAYER_CONTROL_PHASE_STEP1;
    GAME_CONTROL.TURN++;
  }
  event.preventDefault();
  display();
}


//コマ移動関数
function movePiece(target_y,target_x){
  if(board_status[target_y][target_x].player == 0){
    board_status[target_y][target_x] = board_status[GAME_CONTROL.PHASE_STEP1_TARGET_Y][GAME_CONTROL.PHASE_STEP1_TARGET_X];
    board_status[GAME_CONTROL.PHASE_STEP1_TARGET_Y][GAME_CONTROL.PHASE_STEP1_TARGET_X] = board_obj;
  }else{
    if(board_status[GAME_CONTROL.PHASE_STEP1_TARGET_Y][GAME_CONTROL.PHASE_STEP1_TARGET_X].player == 1){
      tmp_piece = board_status[target_y][target_x];
      tmp_piece.player = 1;
      capture_piece_list1.unshift(tmp_piece);
    }else if(board_status[GAME_CONTROL.PHASE_STEP1_TARGET_Y][GAME_CONTROL.PHASE_STEP1_TARGET_X].player == 2){
      tmp_piece = board_status[target_y][target_x];
      tmp_piece.player = 2;
      capture_piece_list2.unshift(tmp_piece);
    }
    board_status[target_y][target_x] = board_status[GAME_CONTROL.PHASE_STEP1_TARGET_Y][GAME_CONTROL.PHASE_STEP1_TARGET_X];
    board_status[GAME_CONTROL.PHASE_STEP1_TARGET_Y][GAME_CONTROL.PHASE_STEP1_TARGET_X] = board_obj;
  }
}

//選んだ駒リセット
function selectPieceReset(){
  GAME_CONTROL.PLAYER_CONTROL_PHASE = PLAYER_CONTROL_PHASE_STEP1;
  display();
}


// 描画
function display(){
   //tableタグの子要素を全て削除
   let parent = document.getElementById('board');
   while(parent.lastChild){
     parent.removeChild(parent.lastChild);
   }
   for(var i = 0; i<board_status.length;i++){
      var tr = document.createElement('tr');
      tr.id = "y"+i;
      document.getElementById('board').appendChild(tr);
      for(var j = 0; j<board_status[i].length;j++){
        var td = document.createElement('td');
        //id属性追加
        td.id = "y" + i + "x" + j;
        td.onclick = "square";
        td.width = "33";
        td.height = "36";
        document.getElementById("y"+i).appendChild(td);
        //カスタムデータ属性追加
        var tmp_elem = document.getElementById("y" + i + "x" + j);
        tmp_elem.dataset.x = j;
        tmp_elem.dataset.y = i;
        if(board_status[i][j]["player"] == 1){
          td.innerHTML = board_status[i][j]["piece"];
        }
        //後手の場合にはコマの表示を逆さに
        if(board_status[i][j]["player"] == 2){
          var span = document.createElement('span');
          span.style = "transform: rotate(180deg); display: inline-block;"
          td.appendChild(span);
          span.innerHTML = board_status[i][j]["piece"];
        }
      }
    }
    //行動表示
    let game_control_display = document.getElementById('game_control_display');
    if(GAME_CONTROL.PLAYER_CONTROL_PHASE == PLAYER_CONTROL_PHASE_STEP1 && GAME_CONTROL.TURN % 2 == 1){
      game_control_display.innerHTML = "先手：動かすコマを決めてください";
    }else if(GAME_CONTROL.PLAYER_CONTROL_PHASE == PLAYER_CONTROL_PHASE_STEP2 && GAME_CONTROL.TURN % 2 == 1){
      game_control_display.innerHTML = "先手：コマを動かすマス決めてください" ;
    }else if(GAME_CONTROL.PLAYER_CONTROL_PHASE == PLAYER_CONTROL_PHASE_STEP1 && GAME_CONTROL.TURN % 2 == 0){
      game_control_display.innerHTML = "後手：動かすコマを決めてください" ;
    }else if(GAME_CONTROL.PLAYER_CONTROL_PHASE == PLAYER_CONTROL_PHASE_STEP2 && GAME_CONTROL.TURN % 2 == 0){
      game_control_display.innerHTML = "後手：コマを動かすマス決めてください" ;
    }
    //持ち駒表示
    displayCapturePiece(1);
    displayCapturePiece(2);
}


//クリックされたマスが歩の動けるマスか判定
function controlActivityPawn(target_y,target_x){
  //player1
  if(board_status[GAME_CONTROL.PHASE_STEP1_TARGET_Y][GAME_CONTROL.PHASE_STEP1_TARGET_X].player == 1){
    if(GAME_CONTROL.PHASE_STEP1_TARGET_Y != parseInt(target_y) + 1 || GAME_CONTROL.PHASE_STEP1_TARGET_X != target_x){
      return false;
    }
    if(board_status[target_y][target_x].player == 1){
      return false;
    }
  }
  //player2
  if(board_status[GAME_CONTROL.PHASE_STEP1_TARGET_Y][GAME_CONTROL.PHASE_STEP1_TARGET_X].player == 2){
    if(GAME_CONTROL.PHASE_STEP1_TARGET_Y != (parseInt(target_y) - 1) || GAME_CONTROL.PHASE_STEP1_TARGET_X != target_x){
      return false;
    }
    if(board_status[target_y][target_x].player == 2){
      return false;
    }
  }
  return true;
}

//クリックされたマスが金の動けるマスか判定
//動けないマスならfalse
function controlActivityGoldGeneral(target_y,target_x){
  //player1
  if(board_status[GAME_CONTROL.PHASE_STEP1_TARGET_Y][GAME_CONTROL.PHASE_STEP1_TARGET_X].player == 1){
    if((GAME_CONTROL.PHASE_STEP1_TARGET_Y == parseInt(target_y) + 1 && GAME_CONTROL.PHASE_STEP1_TARGET_X == target_x) ||
      (GAME_CONTROL.PHASE_STEP1_TARGET_Y == parseInt(target_y) + 1 && GAME_CONTROL.PHASE_STEP1_TARGET_X == parseInt(target_x) + 1) ||
      (GAME_CONTROL.PHASE_STEP1_TARGET_Y == parseInt(target_y) + 1 && GAME_CONTROL.PHASE_STEP1_TARGET_X == parseInt(target_x) - 1) ||
      (GAME_CONTROL.PHASE_STEP1_TARGET_Y == target_y && GAME_CONTROL.PHASE_STEP1_TARGET_X == parseInt(target_x) - 1)||
      (GAME_CONTROL.PHASE_STEP1_TARGET_Y == target_y && GAME_CONTROL.PHASE_STEP1_TARGET_X == parseInt(target_x) + 1) ||
      (GAME_CONTROL.PHASE_STEP1_TARGET_Y == parseInt(target_y) -1 && GAME_CONTROL.PHASE_STEP1_TARGET_X == target_x)
    ){
      if(board_status[target_y][target_x].player != 1){
        return true;
      }
    }
  }
  //player2
  if(board_status[GAME_CONTROL.PHASE_STEP1_TARGET_Y][GAME_CONTROL.PHASE_STEP1_TARGET_X].player == 2){
    if((GAME_CONTROL.PHASE_STEP1_TARGET_Y == parseInt(target_y) - 1 && GAME_CONTROL.PHASE_STEP1_TARGET_X == target_x) ||
      (GAME_CONTROL.PHASE_STEP1_TARGET_Y == parseInt(target_y) - 1 && GAME_CONTROL.PHASE_STEP1_TARGET_X == parseInt(target_x) + 1) ||
      (GAME_CONTROL.PHASE_STEP1_TARGET_Y == parseInt(target_y) - 1 && GAME_CONTROL.PHASE_STEP1_TARGET_X == parseInt(target_x) - 1) ||
      (GAME_CONTROL.PHASE_STEP1_TARGET_Y == target_y && GAME_CONTROL.PHASE_STEP1_TARGET_X == parseInt(target_x) - 1)||
      (GAME_CONTROL.PHASE_STEP1_TARGET_Y == target_y && GAME_CONTROL.PHASE_STEP1_TARGET_X == parseInt(target_x) + 1) ||
      (GAME_CONTROL.PHASE_STEP1_TARGET_Y == parseInt(target_y) + 1 && GAME_CONTROL.PHASE_STEP1_TARGET_X == target_x)
    ){
      if(board_status[target_y][target_x].player != 2){
        return true;
      }
    }
  }
  return false;
}

//クリックされたマスが銀の動けるマスか判定
function controlActivitySilverGeneral(target_y,target_x){
  //player1
  if(board_status[GAME_CONTROL.PHASE_STEP1_TARGET_Y][GAME_CONTROL.PHASE_STEP1_TARGET_X].player == 1){
    if((GAME_CONTROL.PHASE_STEP1_TARGET_Y == parseInt(target_y) + 1 && GAME_CONTROL.PHASE_STEP1_TARGET_X == target_x) ||
      (GAME_CONTROL.PHASE_STEP1_TARGET_Y == parseInt(target_y) + 1 && GAME_CONTROL.PHASE_STEP1_TARGET_X == parseInt(target_x) + 1) ||
      (GAME_CONTROL.PHASE_STEP1_TARGET_Y == parseInt(target_y) + 1 && GAME_CONTROL.PHASE_STEP1_TARGET_X == parseInt(target_x) - 1) ||
      (GAME_CONTROL.PHASE_STEP1_TARGET_Y == parseInt(target_y) -1 && GAME_CONTROL.PHASE_STEP1_TARGET_X == parseInt(target_x) - 1)||
      (GAME_CONTROL.PHASE_STEP1_TARGET_Y == parseInt(target_y) -1 && GAME_CONTROL.PHASE_STEP1_TARGET_X == parseInt(target_x) + 1)
    ){
      if(board_status[target_y][target_x].player != 1){
        return true;
      }
    }
  }
  //player2
  if(board_status[GAME_CONTROL.PHASE_STEP1_TARGET_Y][GAME_CONTROL.PHASE_STEP1_TARGET_X].player == 2){
    if((GAME_CONTROL.PHASE_STEP1_TARGET_Y == parseInt(target_y) - 1 && GAME_CONTROL.PHASE_STEP1_TARGET_X == target_x) ||
      (GAME_CONTROL.PHASE_STEP1_TARGET_Y == parseInt(target_y) - 1 && GAME_CONTROL.PHASE_STEP1_TARGET_X == parseInt(target_x) + 1) ||
      (GAME_CONTROL.PHASE_STEP1_TARGET_Y == parseInt(target_y) - 1 && GAME_CONTROL.PHASE_STEP1_TARGET_X == parseInt(target_x) - 1) ||
      (GAME_CONTROL.PHASE_STEP1_TARGET_Y == parseInt(target_y) + 1 && GAME_CONTROL.PHASE_STEP1_TARGET_X == parseInt(target_x) - 1)||
      (GAME_CONTROL.PHASE_STEP1_TARGET_Y == parseInt(target_y) + 1 && GAME_CONTROL.PHASE_STEP1_TARGET_X == parseInt(target_x) + 1)
    ){
      if(board_status[target_y][target_x].player != 2){
        return true;
      }
    }
  }
  return false;
}


//クリックされたマスが王の動けるマスか判定
function controlActivityKing(target_y,target_x){
  //player1
  if(board_status[GAME_CONTROL.PHASE_STEP1_TARGET_Y][GAME_CONTROL.PHASE_STEP1_TARGET_X].player == 1){
    if((GAME_CONTROL.PHASE_STEP1_TARGET_Y == parseInt(target_y) + 1 && GAME_CONTROL.PHASE_STEP1_TARGET_X == target_x) ||
      (GAME_CONTROL.PHASE_STEP1_TARGET_Y == parseInt(target_y) + 1 && GAME_CONTROL.PHASE_STEP1_TARGET_X == parseInt(target_x) + 1) ||
      (GAME_CONTROL.PHASE_STEP1_TARGET_Y == parseInt(target_y) + 1 && GAME_CONTROL.PHASE_STEP1_TARGET_X == parseInt(target_x) - 1) ||
      (GAME_CONTROL.PHASE_STEP1_TARGET_Y == parseInt(target_y) -1 && GAME_CONTROL.PHASE_STEP1_TARGET_X == parseInt(target_x) - 1)||
      (GAME_CONTROL.PHASE_STEP1_TARGET_Y == parseInt(target_y) -1 && GAME_CONTROL.PHASE_STEP1_TARGET_X == parseInt(target_x) + 1)||
      (GAME_CONTROL.PHASE_STEP1_TARGET_Y == target_y && GAME_CONTROL.PHASE_STEP1_TARGET_X == parseInt(target_x) - 1)||
      (GAME_CONTROL.PHASE_STEP1_TARGET_Y == target_y && GAME_CONTROL.PHASE_STEP1_TARGET_X == parseInt(target_x) + 1) ||
      (GAME_CONTROL.PHASE_STEP1_TARGET_Y == parseInt(target_y) -1 && GAME_CONTROL.PHASE_STEP1_TARGET_X == target_x)
    ){
      if(board_status[target_y][target_x].player != 1){
        return true;
      }
    }
  }
  //player2
  if(board_status[GAME_CONTROL.PHASE_STEP1_TARGET_Y][GAME_CONTROL.PHASE_STEP1_TARGET_X].player == 2){
    if((GAME_CONTROL.PHASE_STEP1_TARGET_Y == parseInt(target_y) - 1 && GAME_CONTROL.PHASE_STEP1_TARGET_X == target_x) ||
      (GAME_CONTROL.PHASE_STEP1_TARGET_Y == parseInt(target_y) - 1 && GAME_CONTROL.PHASE_STEP1_TARGET_X == parseInt(target_x) + 1) ||
      (GAME_CONTROL.PHASE_STEP1_TARGET_Y == parseInt(target_y) - 1 && GAME_CONTROL.PHASE_STEP1_TARGET_X == parseInt(target_x) - 1) ||
      (GAME_CONTROL.PHASE_STEP1_TARGET_Y == parseInt(target_y) + 1 && GAME_CONTROL.PHASE_STEP1_TARGET_X == parseInt(target_x) - 1)||
      (GAME_CONTROL.PHASE_STEP1_TARGET_Y == parseInt(target_y) + 1 && GAME_CONTROL.PHASE_STEP1_TARGET_X == parseInt(target_x) + 1)||
      (GAME_CONTROL.PHASE_STEP1_TARGET_Y == target_y && GAME_CONTROL.PHASE_STEP1_TARGET_X == parseInt(target_x) - 1)||
      (GAME_CONTROL.PHASE_STEP1_TARGET_Y == target_y && GAME_CONTROL.PHASE_STEP1_TARGET_X == parseInt(target_x) + 1) ||
      (GAME_CONTROL.PHASE_STEP1_TARGET_Y == parseInt(target_y) + 1 && GAME_CONTROL.PHASE_STEP1_TARGET_X == target_x)
    ){
      if(board_status[target_y][target_x].player != 2){
        return true;
      }
    }
  }
  return false;
}

//クリックされたマスが桂の動けるマスか判定
function controlActivityKnight(target_y,target_x){
  //player1
  if(board_status[GAME_CONTROL.PHASE_STEP1_TARGET_Y][GAME_CONTROL.PHASE_STEP1_TARGET_X].player == 1){
    if((GAME_CONTROL.PHASE_STEP1_TARGET_Y == parseInt(target_y) + 2 && GAME_CONTROL.PHASE_STEP1_TARGET_X == parseInt(target_x) + 1) ||
      (GAME_CONTROL.PHASE_STEP1_TARGET_Y == parseInt(target_y) + 2 && GAME_CONTROL.PHASE_STEP1_TARGET_X == parseInt(target_x) - 1)
    ){
      if(board_status[target_y][target_x].player != 1){
        return true;
      }
    }
  }
  //player2
  if(board_status[GAME_CONTROL.PHASE_STEP1_TARGET_Y][GAME_CONTROL.PHASE_STEP1_TARGET_X].player == 2){
    if((GAME_CONTROL.PHASE_STEP1_TARGET_Y == parseInt(target_y) - 2 && GAME_CONTROL.PHASE_STEP1_TARGET_X == parseInt(target_x) + 1) ||
      (GAME_CONTROL.PHASE_STEP1_TARGET_Y == parseInt(target_y) - 2 && GAME_CONTROL.PHASE_STEP1_TARGET_X == parseInt(target_x) - 1)
    ){
      if(board_status[target_y][target_x].player != 2){
        return true;
      }
    }
  }
  return false;
}

//クリックされたマスが香の動けるマスか判定
function controlActivityLance(target_y,target_x){
  //player1
  if(board_status[GAME_CONTROL.PHASE_STEP1_TARGET_Y][GAME_CONTROL.PHASE_STEP1_TARGET_X].player == 1){
    for(var i = GAME_CONTROL.PHASE_STEP1_TARGET_Y-1; i > 0 ; i--){
      if(target_y == i && GAME_CONTROL.PHASE_STEP1_TARGET_X == target_x){
        if(board_status[target_y][target_x].player != 1){
          return true;
        }
      }
      console.log("i"+i);
      if(board_status[i][GAME_CONTROL.PHASE_STEP1_TARGET_X].player == 1){
        break;
      }
    }
  }
  //player2
  if(board_status[GAME_CONTROL.PHASE_STEP1_TARGET_Y][GAME_CONTROL.PHASE_STEP1_TARGET_X].player == 2){
    for(var i = parseInt(GAME_CONTROL.PHASE_STEP1_TARGET_Y)+1; i < 8 ; i++){
      if(target_y == i && GAME_CONTROL.PHASE_STEP1_TARGET_X == target_x){
        if(board_status[target_y][target_x].player != 2){
          return true;
        }
      }
      console.log("i"+i);
      if(board_status[i][GAME_CONTROL.PHASE_STEP1_TARGET_X].player == 2){
        break;
      }
    }
  }
  return false;
}

//クリックされたマスが飛の動けるマスか判定
function controlActivityRook(target_y,target_x){
  //player1,player2
    //前

    for(var i = GAME_CONTROL.PHASE_STEP1_TARGET_Y-1; i >= 0 ; i--){
      if(target_y == i && GAME_CONTROL.PHASE_STEP1_TARGET_X == target_x){
        if(board_status[target_y][target_x].player != board_status[GAME_CONTROL.PHASE_STEP1_TARGET_Y][GAME_CONTROL.PHASE_STEP1_TARGET_X].player){
          return true;
        }
      }
      if(board_status[i][GAME_CONTROL.PHASE_STEP1_TARGET_X].player == board_status[GAME_CONTROL.PHASE_STEP1_TARGET_Y][GAME_CONTROL.PHASE_STEP1_TARGET_X].player){
        break;
      }
    }
    //後
    for(var i = parseInt(GAME_CONTROL.PHASE_STEP1_TARGET_Y)+1; i <= 8 ; i++){
      if(target_y == i && GAME_CONTROL.PHASE_STEP1_TARGET_X == target_x){
        if(board_status[target_y][target_x].player != board_status[GAME_CONTROL.PHASE_STEP1_TARGET_Y][GAME_CONTROL.PHASE_STEP1_TARGET_X].player){
          return true;
        }
      }
      if(board_status[i][GAME_CONTROL.PHASE_STEP1_TARGET_X].player == board_status[GAME_CONTROL.PHASE_STEP1_TARGET_Y][GAME_CONTROL.PHASE_STEP1_TARGET_X].player){
        break;
      }
    }
    //右
    for(var i = parseInt(GAME_CONTROL.PHASE_STEP1_TARGET_X)+1; i <= 8 ; i++){
      if(target_x == i && GAME_CONTROL.PHASE_STEP1_TARGET_Y == target_y){
        if(board_status[target_y][target_x].player != board_status[GAME_CONTROL.PHASE_STEP1_TARGET_Y][GAME_CONTROL.PHASE_STEP1_TARGET_X].player){
          return true;
        }
      }
      if(board_status[GAME_CONTROL.PHASE_STEP1_TARGET_Y][i].player == board_status[GAME_CONTROL.PHASE_STEP1_TARGET_Y][GAME_CONTROL.PHASE_STEP1_TARGET_X].player){
        break;
      }
    }
    //左
    for(var i = parseInt(GAME_CONTROL.PHASE_STEP1_TARGET_X)-1; i >= 0 ; i--){
      if(target_x == i && GAME_CONTROL.PHASE_STEP1_TARGET_Y == target_y){
        if(board_status[target_y][target_x].player != board_status[GAME_CONTROL.PHASE_STEP1_TARGET_Y][GAME_CONTROL.PHASE_STEP1_TARGET_X].player){
          return true;
        }
      }
      if(board_status[GAME_CONTROL.PHASE_STEP1_TARGET_Y][i].player == board_status[GAME_CONTROL.PHASE_STEP1_TARGET_Y][GAME_CONTROL.PHASE_STEP1_TARGET_X].player){
        break;
      }
    }

  return false;
}
//クリックされたマスが角の動けるマスか判定
function controlActivityBishop(target_y,target_x){
  //player1,player2共通
  for(var i = 1; parseInt(GAME_CONTROL.PHASE_STEP1_TARGET_Y)-i >= 0 && parseInt(GAME_CONTROL.PHASE_STEP1_TARGET_X)-i >= 0; i++){
    //左前
    if(target_y == parseInt(GAME_CONTROL.PHASE_STEP1_TARGET_Y)-i  && target_x == parseInt(GAME_CONTROL.PHASE_STEP1_TARGET_X)-i){
      if(board_status[target_y][target_x].player != board_status[GAME_CONTROL.PHASE_STEP1_TARGET_Y][GAME_CONTROL.PHASE_STEP1_TARGET_X].player){
        return true;
      }
    }
    if(board_status[parseInt(GAME_CONTROL.PHASE_STEP1_TARGET_Y)-i][parseInt(GAME_CONTROL.PHASE_STEP1_TARGET_X)-i].player == board_status[GAME_CONTROL.PHASE_STEP1_TARGET_Y][GAME_CONTROL.PHASE_STEP1_TARGET_X].player){
      break;
    }
  }
  for(var i = 1; parseInt(GAME_CONTROL.PHASE_STEP1_TARGET_Y)-i >= 0 && parseInt(GAME_CONTROL.PHASE_STEP1_TARGET_X) + i <= 8 ; i++){
    //右前
    if(target_y == parseInt(GAME_CONTROL.PHASE_STEP1_TARGET_Y)-i  && target_x == parseInt(GAME_CONTROL.PHASE_STEP1_TARGET_X)+i){
      if(board_status[target_y][target_x].player != board_status[GAME_CONTROL.PHASE_STEP1_TARGET_Y][GAME_CONTROL.PHASE_STEP1_TARGET_X].player){
        return true;
      }
    }
    console.log(parseInt(GAME_CONTROL.PHASE_STEP1_TARGET_Y)-i);
    console.log(parseInt(GAME_CONTROL.PHASE_STEP1_TARGET_X)+i);
    console.log(board_status[parseInt(GAME_CONTROL.PHASE_STEP1_TARGET_Y)-i][parseInt(GAME_CONTROL.PHASE_STEP1_TARGET_X)+i].player);
    if(board_status[parseInt(GAME_CONTROL.PHASE_STEP1_TARGET_Y)-i][parseInt(GAME_CONTROL.PHASE_STEP1_TARGET_X)+i].player == board_status[GAME_CONTROL.PHASE_STEP1_TARGET_Y][GAME_CONTROL.PHASE_STEP1_TARGET_X].player){
      break;
    }
  }
  for(var i = 1; parseInt(GAME_CONTROL.PHASE_STEP1_TARGET_Y)+ i <= 8 && parseInt(GAME_CONTROL.PHASE_STEP1_TARGET_X) - i >= 0; i++){
    //左後
    if(target_y == parseInt(GAME_CONTROL.PHASE_STEP1_TARGET_Y)+i  && target_x == parseInt(GAME_CONTROL.PHASE_STEP1_TARGET_X)-i){
      if(board_status[target_y][target_x].player != board_status[GAME_CONTROL.PHASE_STEP1_TARGET_Y][GAME_CONTROL.PHASE_STEP1_TARGET_X].player){
        return true;
      }
    }
    if(board_status[parseInt(GAME_CONTROL.PHASE_STEP1_TARGET_Y)+i][parseInt(GAME_CONTROL.PHASE_STEP1_TARGET_X)-i].player == board_status[GAME_CONTROL.PHASE_STEP1_TARGET_Y][GAME_CONTROL.PHASE_STEP1_TARGET_X].player){
      break;
    }
  }
  for(var i = 1; parseInt(GAME_CONTROL.PHASE_STEP1_TARGET_Y) + i <= 8 && parseInt(GAME_CONTROL.PHASE_STEP1_TARGET_X)+i <= 8; i++){
    //右後
    if(target_y == parseInt(GAME_CONTROL.PHASE_STEP1_TARGET_Y)+i  && target_x == parseInt(GAME_CONTROL.PHASE_STEP1_TARGET_X)+i){
      if(board_status[target_y][target_x].player != board_status[GAME_CONTROL.PHASE_STEP1_TARGET_Y][GAME_CONTROL.PHASE_STEP1_TARGET_X].player){
        return true;
      }
    }
    if(board_status[parseInt(GAME_CONTROL.PHASE_STEP1_TARGET_Y)+i][parseInt(GAME_CONTROL.PHASE_STEP1_TARGET_X)+i].player == board_status[GAME_CONTROL.PHASE_STEP1_TARGET_Y][GAME_CONTROL.PHASE_STEP1_TARGET_X].player){
      break;
    }
  }

  return false;
}
//持ち駒表示
function displayCapturePiece(player_number){
  //tableタグの子要素を全て削除
  let parent = document.getElementById('player'+player_number+'_capture_piece');
  while(parent.lastChild){
    parent.removeChild(parent.lastChild);
  }
  for(var i=0 ; i < 5 ; i++){
    var tr = document.createElement('tr');
    tr.id = "capture_piece_y"+i;
    var capture_piece = document.getElementById('player'+player_number+'_capture_piece');
    capture_piece.appendChild(tr);
    for(var j=0 ; j < 4 ; j++){
      var td = document.createElement('td');
      //id属性追加
      td.id = "capture_piece_y" + i + "capture_piece_x" + j;
      td.width = "33";
      td.height = "36";
      document.getElementById("capture_piece_y"+i).appendChild(td);
      //カスタムデータ属性追加
      var tmp_elem = document.getElementById("capture_piece_y" + i + "capture_piece_x" + j);
      tmp_elem.dataset.x = j;
      tmp_elem.dataset.y = i;
      if(player_number == 1){
        td.innerHTML = capture_piece_list1[ j + i * 4].piece;
      }
      //後手の場合にはコマの表示を逆さに
      if(player_number == 2){
        var span = document.createElement('span');
        span.style = "transform: rotate(180deg); display: inline-block;";
        td.appendChild(span);
        span.innerHTML = capture_piece_list2[ j + i * 4].piece;
      }
    }
  }
}
