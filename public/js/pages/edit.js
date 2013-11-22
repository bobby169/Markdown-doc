$("#topbt").click(function(){
  var b = $(this).hasClass("btn-success");
  if(!b){
    $(this).addClass("btn-success");
    $("#input-top").val(true);
  }else{
    $(this).removeClass("btn-success");
    $("#input-top").val(false);
  }
})

var editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
  lineNumbers: true,
  theme: "default",
  mode:"markdown",
  extraKeys: {
    "F11": function(cm) {
      cm.setOption("fullScreen", !cm.getOption("fullScreen"));
    },
    "Esc": function(cm) {
      if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
    }
  }
});