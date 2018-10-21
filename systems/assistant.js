/** globals AFRAME, annyang */

!function(){
  AFRAME.registerSystem('assistant', {
    init() {
    },

    addCommands(commands) {
      if (!annyang) return;

      annyang.addCommands(commands);
    },

    start(options) {
      if (!annyang) return;

      const scene = this.el;

      const recognition = annyang.getSpeechRecognizer();
      recognition.interimResults = true;

      recognition.onresult = function(event) {
        let interim = '';
        for (var i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            scene.emit('speech-transcript', { sentences: event.results[i][0].transcript });
            annyang.trigger(event.results[i][0].transcript); //If the sentence is "final" for the Web Speech API, we can try to trigger the sentence
          } else {
            interim += event.results[i][0].transcript;
            scene.emit('speech-transcript', { sentences: interim });
          }
        }
      };

      annyang.addCallback('resultMatch', () => scene.emit('speech-result-match'));
      annyang.addCallback('start', () => scene.emit('speech-began'));
      annyang.debug(true);
      annyang.start(options);
    },

    abort() {
      annyang.abort();
    }
  });
}();
