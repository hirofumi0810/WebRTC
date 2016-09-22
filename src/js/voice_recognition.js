// var grammar = '#JSGF V1.0; grammar colors; public <color> = aqua | azure | beige | bisque | black | blue | brown | chocolate | coral | crimson | cyan | fuchsia | ghostwhite | gold | goldenrod | gray | green | indigo | ivory | khaki | lavender | lime | linen | magenta | maroon | moccasin | navy | olive | orange | orchid | peru | pink | plum | purple | red | salmon | sienna | silver | snow | tan | teal | thistle | tomato | turquoise | violet | white | yellow ;'
// var recognition = new SpeechRecognition();
// var speechRecognitionList = new SpeechGrammarList();
// speechRecognitionList.addFromString(grammar, 1);
// recognition.grammars = speechRecognitionList;
// //recognition.continuous = false;
// recognition.lang = 'en-US';
// recognition.interimResults = false;
// recognition.maxAlternatives = 1;

// var diagnostic = document.querySelector('.output');
// var bg = document.querySelector('html');

// document.body.onclick = function() {
//     recognition.start();
//     console.log('Ready to receive a color command.');
// };

// recognition.onresult = function(event) {
//     var color = event.results[0][0].transcript;
//     diagnostic.textContent = 'Result received: ' + color;
//     bg.style.backgroundColor = color;
// };

    var recognizing;
    var recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.onend = reset;
    recognition.lang = "ja";

    if (localStorage.voiceLog === undefined) { localStorage.voiceLog = JSON.stringify([]); }

    // 認識開始
    recognition.onstart = function() {
        recognizing = true;
    };

    // 認識結果表示
    recognition.onresult = function (event) {
      data = event.results[0][0].transcript;
      // 時間取得
      var time = parseInt(Date.now() / 1000, 10);
      // オブジェクトに変換
      var temp = JSON.parse(localStorage.voiceLog);
      // push
      obj = {};
      obj[time] = {'text': data, 'id': 1};
      temp.push(obj);
      // 文字列に変換
      localStorage.voiceLog = JSON.stringify(temp);
      console.log(localStorage.voiceLog);

      if(data.length > 0) {
          data = data.replace(/</g, "&lt;").replace(/>/g, "&gt;");
          $("p.receive").append(data + "<br>");

          // メッセージを接続中のpeerに送信する
          // peer_id = existingCall.peer;
          // peer_id = multiparty.peer_id;
          // console.log(multiparty.peer_id);
          multiparty.send(peer_id + data);
          // $text.val("");

      // // var final_transcript;
      // for (var i = event.resultIndex; i < event.results.length; ++i) {
      //   if (event.results.final) {
      //     textarea.value += event.results[i][0].transcript;
      //     console.log(event.results[i][0].transcript);
      //   }
      }
    }



    function reset() {
      recognizing = false;
      button.innerHTML = "Click to Speak";
    }

    function toggleStartStop() {
      if (recognizing) {
        recognition.stop();
        reset();
      } else {
        recognition.start();
        recognizing = true;
        button.innerHTML = "Click to Stop";
      }
    }
