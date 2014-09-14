var App = {

  Website : {

    init : function() {
      var _this = this;
      _this.init_exc();
    },

    init_exc : function() {
      //Templates
      var button_temp = _.template("<button type='button' id='<%=info.name%>' class='btn btn-default btn-lg'><%=info.name%></button>");
      var lang_button_temp = _.template("<button type='button' id='<%=info.name%>' class='lang btn btn-default btn-lg'><%=info.name%></button>");
      var niv_button_temp = _.template("<button type='button' id='<%=info.name%>' class='niv btn btn-default btn-lg'><%=info.name%></button>");
      var cat_button_temp = _.template("<button type='button' id='<%=info.name%>' class='cat btn btn-default btn-lg'><%=info.name%></button>");

      var task_count = 0;

      //Variablen
      var selec_lang;
      var selec_niv;
      var selec_cat;
      var word;
      var words;
      var answer_value = 0;


      //Handler
      $("body").on("click", ".lang", function() {
        //ggf. Aufgabezähler zurücksetzen für neue AUfgaben
        task_count = 0;
        //id aus Knopf auslesen
        var selec_id = this.id;

        selec_lang = $.grep(data.languages, function(e) {
          return e.name == selec_id;
        });
        selec_lang = selec_lang[0];

        //Build diff menu
        $(".mid").html("<h1>Welches Niveau möchten du heute üben?</h1></br>");

        $.each(selec_lang.nivs, function(index, value) {
          var show = niv_button_temp({
            info : value
          });
          //create and place button
          $(".mid").append(show);
        });
      });

      $("body").on("click", ".niv", function() {
        //id aus Knopf auslesen
        var id = this.id;

        selec_niv = $.grep(selec_lang.nivs, function(e) {
          return e.name == id;
        });

        selec_niv = selec_niv[0];
        //Build categorie menu
        $(".mid").html("<h1>Welche Thema möchten du heute bearbeiten?</h1></br>");

        $.each(selec_niv.categories, function(index_cat, value_cat) {
          var show = cat_button_temp({
            info : value_cat
          });

          //create and place button
          $(".mid").append(show);

        });
      });

      $("body").on("click", ".cat", function() {

        var id = this.id;

        selec_cat = $.grep(selec_niv.categories, function(e) {
          return e.name == id;
        });

        selec_cat = selec_cat[0];

        //Lang,diff,cat Info
        $(".top-info").html("<h3>Sprache: " + selec_lang.name + " | Niveau: " + selec_niv.name + " | Thema: " + selec_cat.name + "</h3>");

        words = selec_cat.words;

        //Stellen der Aufgaben
        get_task(words);

      });
      
      
        $('body').on("click",".answer", function() {
          var answer = $('#answer').val();
          var result = get_result(answer, word.lang2);
          //Ergebnis Rückgabe
          if (result === true) {
            //Gelöstes Wort aus Menge der Wörter entfernen
            words = $.grep(words, function(value) {
              return value != word;
            });

            result = "Richtig! Sehr gut!";
            if (words.length > 0) {
              answer_value = 0;
              $(".task").replaceWith("<div class='result'>" + result + "</div>");
              next_button(words);
            } else {
              answer_value = 0;
              $(".task").replaceWith("<div class='result'>" + result + "</div><br><div class='finished'<h1>Damit sind wir mit diesem Thema fertig.</h1></div>");
              back_button();
            }
          } else {
            if (answer_value === 0){
            answer_value = 1;
            result = "Leider falsch.";
            $(".a-form").before("<div class='result'>" + result + "</div>");
          }
          }
        });
      
      $('body').on("click",".back", function() {
          to_start();
        });

        $('body').on("click",".next", function() {
          get_task(words);
        });

      //Functions

      //Gibt ein zufälliges Wort-Objekt aus words aus
      function get_word(words) {
        var max = words.length - 1;
        var min = 0;
        var rnd = min + parseInt(Math.random() * ((max + 1 ) - min ));
        var word = words[rnd];
        return word;
      }

      //Vergleicht answer mit correct auf Gleichheit FIXME - erweitern um Schreibweisen, groß und klein etc.
      function get_result(answer, correct) {
        if (answer === correct) {
          return true;
        } else {
          return false;
        };
      }

      //Bindet Sound ein
      function sound(word) {
        if (word.sound != ""){
        $(".task").append("<audio src='sounds/" + word.sound + "' controls preload></audio>");
      }
      }

      //Erstellt Knopf zurück zur Startseite
      function back_button() {
        $(".finished").append("<br><button type='button' id='to_start' class='back btn btn-default btn-lg'>Nächste Lektion</button>");

      }

      //Erstellt Seite von Anfang
      function to_start(answer, correct) {
        //Build language menu
        $(".top-info").html("");

        $(".mid").html("<h1>Welche Sprache möchten du heute lernen?</h1></br>");

        $.each(data.languages, function(index_lang, value_lang) {
          var show = lang_button_temp({//use Button-Template
            info : value_lang
          });

          //create and place button
          $(".mid").append(show);
        });
      }

      function next_button(words) {
        $(".result").after("<button type='button' id='next' class='next btn btn-default btn-lg'>Nächste Übung</button>");
      }

      //Aufgabe stellen
      function get_task(words) {

        //Task
        task_count = task_count + 1;

        $(".mid").html("<h1>" + task_count + ". Aufgabe:</h1></br><div class='task'><div>");

        word = get_word(words);

        $(".task").append("<h1> Übersetze bitte: <b>" + word.lang1 + "</b></h1>");
        //Nur wenn Bild vorhanden ist laden
        if (word.img != ""){
        $(".task").append("<img class='img-frame' src='imgs/" + word.img + "'>");
        }else {
        $(".task").append("<img class='img-frame' src='imgs/no-pic.png'>"); 
        }

        sound(word);

        $(".task").append("<input type='text' class='a-form form-control' id='answer' placeholder='Antwort'>");

        $(".task").append("<button type='button' id='answer_send' class='answer btn btn-default btn-lg'>antworten</button>");

        $(".task").append("<div class='result'></div>");

      }

      //js start
      to_start();

    },
  }
};
