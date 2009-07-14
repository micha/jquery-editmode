(function($) {

  var enabledVal  = true;
  var q           = {};
  var search      = window.location.search.replace(/^\?/,"").split("&");
  var site        = window.location.hostname;
  var path        = window.location.pathname;
  var s3url       = "http://"+site+".s3.amazonaws.com/";
  var s3key       = path.replace(/^\/*/, "");
  var redir       = "https://my.simplemiami.com/"+site+"/?page="+path;
  var cancel      = "http://"+site+path;
  var discard     = window.location.href;

  for (var i=0; i<search.length; i++) {
    search[i] = decodeURIComponent(search[i]);
    q[search[i].replace(/=.*$/,"")] = search[i].replace(/^[^=]*=/,"");
  }

  if (!q.key || !q.pol || !q.sig) {
    $.eip.enabled(false);
    return;
  }

  var styles = {
    parse : function(elem) {
      var ret = {};
      if (elem) {
        var tmp = elem.split(";");
        for (var i=0; i<tmp.length; i++) {
          ret[$.trim(tmp[i].replace(/:.*$/,""))] = 
            $.trim(tmp[i].replace(/^[^:]+:/,""));
        }
      }
      return ret;
    },
    toString : function(styl) {
      var ret = "";
      for (var i in styl)
        ret += i+":"+styl[i]+";";
      return ret.length ? ret : null;
    }
  };

  $.editmode = {
    set : {
      nav : function() {
        $.eip.enabled(false);
        $("#editmode .message").text(
          "Navigate to the page you wish to edit, then press the 'edit' "+
          "button. The 'cancel' link takes you out of editing mode."
        );
        $("#editmode input[type='submit']")
          .attr("disabled", false)
          .val("edit");
        $("#editmode a").attr("href", cancel);
        $("#editmode form").unbind("submit").submit(function(event) {
          $.editmode.set.edit();  
          return false;
        });
      },
      edit : function() {
        $.eip.enabled(true);

        $("#editmode .message").text(
          "Click on editable items to edit them, press the 'save' "+
          "button when done. The 'cancel' link discards your changes."
        );
        $("#editmode input[type='submit']")
          .attr("disabled", false)
          .val("save");
        $("#editmode a").attr("href", "#").click(function() {
          window.location.reload();
          return false;
        });
        $("#editmode form").unbind("submit").submit(function(event) {
          // prevent multiple form submissions
          $("#editmode input[type='submit']").attr("disabled", true);

          $("#editmode .message").text("Saving...");

          $.eip.enabled(false);

          // jquery stuff modifies the display:xxx inline style sometimes
          $("body [style]").each(function(k,v) {
            var tmp = styles.parse($(this).attr("style"));
            delete tmp.display;
            $(this).attr("style", styles.toString(tmp));
          });

          // sizzle css selector engine adds these attributes
          $("body [sizcache], body [sizset]").each(function(k,v) {
            $(this).attr("sizcache", null).attr("sizset", null);
          });

          // some things (tinyMCE, for example) add scripts to the <body/>
          $("body script").remove();

          // temporarily remove the editmode taskbar
          var tb = $("#editmode").remove();

          $("#editmode input[name='file']").val("");

          $.ajax({
            async: false,
            url: window.location.pathname, 
            success: function(data) {
              var newHtml = data.replace(
                /\s*<body(>|\s+[^>]+>)(.|\s)*<\/body>\s*/,
                "\n<body>\n"+$.trim($("body").html())+"\n</body>\n"
              );
              $("body").append(tb);
              $("#editmode input[name='file']").val(newHtml);
            }
          });

          // suppress form submit if no content
          return ($("#editmode input[name='file']").val().length > 0);
        });
      },
      eip: function() {
        $("#editmode .message").text(
          "Press the 'done' button when finished editing the item."
        );
        $("#editmode input[type='submit']").attr("disabled", true);
        $("#editmode a").attr("href", discard);
        $("#editmode form").unbind("submit").submit(function(event) {
          return false;
        });
      }
    }
  };

  $(function() {

    $("head").append($(
      "<style type='text/css'> "+
        "div#editmode { "+
          "position: fixed; "+
          "bottom: 0px; "+
          "left: 0px; "+
          "z-index: 99999 !important; "+
          "background: black !important; "+
          "color: white !important; "+
          "width: 100%; "+
          "opacity: 0.75; "+
          "filter: alpha(opacity = 75); "+
        "} "+
        "div#editmode .message, div#editmode .controls { "+
          "padding: 7px 10px; "+
        "} "+
        "div#editmode a { "+
          "color: red; "+
          "margin-left: 10px; "+
        "} "+
      "</style>"
    ));

    function hidden(name) {
      return $("<input/>").attr("type", "hidden").attr("name", name);
    }

    var tb = $("<div/>").attr("id", "editmode").append(
      $("<table/>")
        .attr("cellspacing", "0")
        .attr("cellpadding", "0")
        .attr("width", "100%")
        .append(
          $("<tr/>").append(
            $("<td/>").append(
              $("<div/>").addClass("message")
            )
          ).append(
            $("<td/>").attr("align", "right").append(
              $("<div/>").addClass("controls").append(
                $("<form/>")
                  .attr("action", s3url)
                  .attr("method", "post")
                  .attr("enctype", "multipart/form-data")
                  .attr("encoding", "multipart/form-data")
                  .append(hidden("AWSAccessKeyId").val(q.key))
                  .append(hidden("policy").val(q.pol))
                  .append(hidden("signature").val(q.sig))
                  .append(hidden("acl").val("public-read"))
                  .append(hidden("key").val(s3key))
                  .append(hidden("success_action_redirect").val(redir))
                  .append(hidden("Content-Type").val("text/html"))
                  .append(hidden("file"))
                  .append($("<input/>").attr("type", "submit"))
                  .append($("<a/>").text("cancel"))
              )
            )
          )
        )
    );

    $("body").append(tb);
    $.editmode.set.nav();
  });

})(jQuery);
