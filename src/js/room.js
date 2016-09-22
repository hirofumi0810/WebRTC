
    var multiparty;
    var APIKEY = '3d27e703-8d24-441b-9b22-773bd1c9a181';

    function start() {
      if (localStorage.chatLog === undefined) { localStorage.chatLog = JSON.stringify([]); }

      // MultiParty インスタンスを生成
      multiparty = new MultiParty( {
        "key": APIKEY,
        "reliable": true,
        "debug": 3
      });

      /////////////////////////////////
      // for MediaStream
      multiparty.on('my_ms', function(video) {
        // 自分のvideoを表示
        var vNode = MultiParty.util.createVideoNode(video);
        vNode.setAttribute("class", "video my-video");
        vNode.volume = 0;
        $(vNode).appendTo("#streams");
      }).on('peer_ms', function(video) {
        // console.log("video received!!");
        // peerのvideoを表示
        // console.log(video);
        var vNode = MultiParty.util.createVideoNode(video);
        vNode.setAttribute("class", "video peer-video");
        $(vNode).appendTo("#streams");
        // console.log($("#streams"));
      }).on('ms_close', function(peer_id) {
        // peerが切れたら、対象のvideoノードを削除する
        $("#"+peer_id).remove();
      }).on('open', function(id){
        peer_id = id;
        console.log(id);
      });

      ////////////////////////////////
      // for DataChannel
      multiparty.on('message', function(mesg) {
        // peerからテキストメッセージを受信
        $("p.receive").append(mesg.data + "<br>");
      });

      ////////////////////////////////
      // エラーハンドラ
      multiparty.on('error', function(err) {
        alert(err);
      });

      multiparty.start();

      //////////////////////////////////////////////////////////
      // テキストフォームに入力されたテキストをpeerに送信
      $("#message form").on("submit", function(ev) {
        ev.preventDefault();  // onsubmitのデフォルト動作（reload）を抑制

        // テキストデータ取得
        var $text = $(this).find("input[type=text]");
        var data = $text.val();
        // 時間取得
        var time = parseInt(Date.now() / 1000, 10);
        // オブジェクトに変換
        var temp = JSON.parse(localStorage.chatLog);
        console.log(temp);
        // push
        if (data != "") {
          obj = {};
          obj[time] = {'text': data, 'id': 1};
          temp.push(obj);
        }
        // 文字列に変換
        localStorage.chatLog = JSON.stringify(temp);
        console.log(localStorage.chatLog);

        if(data.length > 0) {
          data = data.replace(/</g, "&lt;").replace(/>/g, "&gt;");
          $("p.receive").append(data + "<br>");

          // メッセージを接続中のpeerに送信する
          multiparty.send(data);
          $text.val("");
        }
      });

      ///////////////////////////////////////////////////
      // handle mute/unmute
      $("#video-mute").on("click", function(ev) {
        var mute = !$(this).data("muted");
        multiparty.mute({video: mute});
        $(this).text("video " + (mute ? "unmute" : "mute")).data("muted", mute);
      });

      $("#audio-mute").on("click", function(ev) {
        var mute = !$(this).data("muted");
        multiparty.mute({audio: mute});
        $(this).text("audio " + (mute ? "unmute" : "mute")).data("muted", mute);
      });

      // 通話終了のイベント
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

