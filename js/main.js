var App = {

  Website : {

    init : function() {
      var _this = this;
      _this.init_exc();
    },

    init_exc : function() {
      //Templates
      var button_temp = _.template("<button type='button' id='<%=info.name%>' class='btn btn-default btn-lg'><%=info.name%></button>");
      var task_count = 0;

      //Functions

      //Gibt ein zufälliges Wort-Objekt aus words aus
      function get_word(words) {
        var max = words.length - 1;
        var min = 0;
        var rnd = min + parseInt(Math.random() * ((max + 1 ) - min ));
        var word = words[rnd];
        return word;
      }

      //Vergleicht answer mit correct
      function get_result(answer, correct) {
        if (answer === correct) {
          return true;
        } else {
          return false;
        };
      }

      //Bindet Sound
      function sound(word) {
        $(".mid").append("<audio src='sounds/" + word.sound + "' controls preload></audio>");
      }

      //Erstellt Knopf zurück zur Startseite
      function back_button() {
        $(".mid").append("<br><button type='button' id='to_start' class='btn btn-default btn-lg'>Zurück zum Anfang</button>");
        $('#to_start').on("click", function() {
          to_start();
        });

      }

      //Erstellt Seite von Anfang
      function to_start(answer, correct) {
        //Build language menu
        $(".top-info").html("");

        $(".mid").html("<h1>Welche Sprache möchten du heute lernen?</h1></br>");

        $.each(data.languages, function(index_lang, value_lang) {
          var show = button_temp({//use Button-Template
            info : value_lang
          });

          //create and place button
          $(".mid").append(show);

          // Create EventHandler
          $('#' + value_lang.name).on("click", function() {
            //Build diff menu
            $(".mid").html("<h1>Welches Niveau möchten du heute üben?</h1></br>");

            $.each(value_lang.nivs, function(index_diff, value_diff) {
              var show = button_temp({//use Button-Template
                info : value_diff
              });

              //create and place button
              $(".mid").append(show);

              $('#' + value_diff.name).on("click", function() {// Create EventHandler
                //Build categorie menu
                $(".mid").html("<h1>Welche Thema möchten du heute bearbeiten?</h1></br>");

                $.each(value_diff.categories, function(index_cat, value_cat) {
                  var show = button_temp({//use Button-Template
                    info : value_cat
                  });

                  //create and place button
                  $(".mid").append(show);

                  $('#' + value_cat.name).on("click", function() {// Create EventHandler
                    //Lang,diff,cat Info
                    $(".top-info").html("<h3>Sprache: " + value_lang.name + " | Niveau: " + value_diff.name + " | Thema: " + value_cat.name + "</h3>");

                    var words = value_cat.words;

                    //Stellen der Aufgaben
                    get_task(words);

                  });

                });
              });
            });
          });
        });
      }

      function next_button(words) {
        $("#answer_send").replaceWith("<button type='button' id='next' class='btn btn-default btn-lg'>Nächste Übung</button>");
        $('#next').on("click", function() {
          get_task(words);
        });
      }

      //Aufgabe stellen
      function get_task(words) {

        //Task
        task_count = task_count + 1;

        $(".mid").html("<h1>" + task_count + ". Aufgabe:</h1></br>");

        var word = get_word(words);

        $(".mid").append("<h1> Übersetze bitte: <b>" + word.lang1 + "</b></h1>");

        $(".mid").append("<img class='img-frame' src='imgs/" + word.img + "'>");

        sound(word);

        $(".mid").append("<input type='text' class='form-control' id='answer' placeholder='Antwort'>");

        $(".mid").append("<button type='button' id='answer_send' class='btn btn-default btn-lg'>antworten</button>");

        $(".mid").append("<div class='result'></div>");

        $('#answer_send').on("click", function() {
          var answer = $('#answer').val();
          var result = get_result(answer, word.lang2);
          if (result === true) {
            //Gelöstes Wort aus Menge der Wörter entfernen
            words = $.grep(words, function(value) {
              return value != word;
            });

            result = "Richtig! Sehr gut!";
            if (words.length > 0) {
              $(".result").replaceWith("<div class='result'>" + result + "</div>");
              next_button(words);
            } else {
              $(".result").replaceWith("<div class='result'>" + result + "</div><br><h1>Damit sind wir mit diesem Thema fertig.</h1>");
              back_button();
            }
          } else {
            result = "Leider falsch.";
            $(".result").replaceWith("<div class='result'>" + result + "</div>");
          }
        });
      }

      //js start
      to_start();

    },
  }
};
