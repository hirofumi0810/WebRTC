
  var multiparty;

  // SkyWayサーバに接続し，peerに接続
  function start() {
    if (localStorage.chatLog === undefined) { localStorage.chatLog = JSON.stringify([]); }

    // MultiPartyインスタンスを生成
    multiparty = new MultiParty( {
      "key": '3d27e703-8d24-441b-9b22-773bd1c9a181',  // SkyWay key
      "reliable": true,  // データチャンネルで信頼性のあるデータ転送(sctp)を行う
      "debug": 3  // すべてのログを表示
    });


    /////////////////////////////////
    // for MediaStream
    /////////////////////////////////
    // このウィンドウのvideo/audioストリームのセットアップ完了時
    multiparty.on('my_ms', function(video) {
      // 自分のvideoを表示
      var vNode = MultiParty.util.createVideoNode(video);
      vNode.setAttribute("class", "video my-video");
      vNode.volume = 0;
      $(vNode).appendTo("#streams");

      // peerのvideo/audioストリームのセットアップ完了時
      }).on('peer_ms', function(video) {
        // peerのvideoを表示
        var vNode = MultiParty.util.createVideoNode(video);
        vNode.setAttribute("class", "video peer-video");
        $(vNode).appendTo("#streams");

      // peerのメディアストリームのクローズ時
      }).on('ms_close', function(peer_id) {
        // peerが切れたら、対象のvideoノードを削除する
        $("#"+peer_id).remove();

      // SkyWayサーバとのコネクション確立時
      }).on('open', function(id){
        peer_id = id;
    });


    ////////////////////////////////
    // for DataChannel
    /////////////////////////////////
    // peerから受信したメッセージを表示
    multiparty.on('message', function(mesg) {
      $("p.receive").append(mesg.data + "<br>");
    });

    // 接続中のpeerにメッセージを送信
    $("#message form").on("submit", function(ev) {
      ev.preventDefault();  // onsubmitのデフォルト動作（reload）を抑制

      // テキスト・時間データ取得
      var $text = $(this).find("input[type=text]");
      var data = $text.val();
      var time = parseInt(Date.now() / 1000, 10);

      // 過去のチャットログスタックをオブジェクトに変換
      var temp = JSON.parse(localStorage.chatLog);
      // console.log(temp);

      // push（空なら無視）
      if (data != "") {
        obj = {};
        obj[time] = {'text': data, 'id': peer_id};
        temp.push(obj);
        console.log('pushed!!');
      }

      // 文字列に変換
      localStorage.chatLog = JSON.stringify(temp);
      // console.log(localStorage.chatLog);

      if(data.length > 0) {
        data = data.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        $("p.receive").append(data + "<br>");

        // メッセージを接続中のpeerに送信
        multiparty.send(data);
        $text.val("");
      }
    });


    ////////////////////////////////
    // Error handling
    /////////////////////////////////
    multiparty.on('error', function(err) {
      alert(err);
    });

    // サーバとpeerに接続
    multiparty.start();


    /////////////////////////////////
    // handle mute/unmute
    /////////////////////////////////
    // ビデオのミュート
    $("#video-mute").on("click", function(ev) {
      var mute = !$(this).data("muted");
      multiparty.mute({video: mute});
      $(this).text("video " + (mute ? "unmute" : "mute")).data("muted", mute);
    });
    // 音声のミュート
    $("#audio-mute").on("click", function(ev) {
      var mute = !$(this).data("muted");
      multiparty.mute({audio: mute});
      $(this).text("audio " + (mute ? "unmute" : "mute")).data("muted", mute);
    });


    /////////////////////////////////
    // 通話終了のイベント
    /////////////////////////////////
    $("#finish").on("click", function(ev) {
      var result = {};
      // オブジェクトに変換
      chatLog = JSON.parse(localStorage.chatLog);
      voiceLog = JSON.parse(localStorage.voiceLog);
      var result = {};
      for (var i in chatLog) {
        console.log(chatLog[i]);
        result.push(chatLog[i]);
      }
      for (var i in voiceLog) {
        result.push(voiceLog[i]);
      }
      console.log(result);
    });
  }

$(document).ready(function(){
    start();
});

