// USE FOR ON PAGE EVENTS ONLY
$(() => {
  if (document.getElementById('sortable')) {
    $("#errorMsg").hide();
    let orderArray = [];
    $( "#sortable" ).sortable({
    update: function(event, ui) {
      var order =   $(this).sortable('toArray');
      orderArray = order;
      // console.log(orderArray);
      }
    });
    $( "#sortable" ).disableSelection();

    $( "#nameField" ).on("input", function() {
      $("#errorMsg").slideUp();
    });

    $( "#voteSubmit").on("click", function(event) {
      event.preventDefault();
      let voterName = $(this).parents("#voteSubmitForm").find("#nameField").val();
      if(voterName === "") {
        $("#errorMsg").slideDown();
      } else {
        $.ajax({
          method: 'POST',
          url: '/polls/:v_url/',
          data: JSON.stringify({orderArray}),
          contentType: 'application/json',
          success:function(result){
            console.log("we are working");
            window.location = "http://localhost:8080" ;
          },
          error:function(err){
            console.log("something happened");
          }
        });
      }
    });
  }

  if (document.getElementById('addOptionBtn')) {
    let optionCount = 3;
    $( "#addOptionBtn").on('click', function () {
      optionCount += 1;
    });
  }
});
