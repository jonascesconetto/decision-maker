// USE FOR ON PAGE EVENTS ONLY
$(() => {
  if (document.getElementById('sortable')) {
    $("#errorMsg").hide();
    let orderArray = [];
    $( "#sortable" ).sortable({
    update: function(event, ui) {
      var order =   $(this).sortable('toArray');
      orderArray = order;
      }
    });
    $( "#sortable" ).disableSelection();

    $( "#nameField" ).on("input", function() {
      $("#errorMsg").slideUp();
    });

    $( "#voteSubmit").on("click", function (event) {
      event.preventDefault();
      let voterName = $("#voterName").val();
      if(voterName === "") {
        $("#errorMsg").slideDown();
      } else {
        $.ajax({
          method: 'POST',
          url: '/polls/:url/',
          data: JSON.stringify({ oa: orderArray, url: window.location.href, name: voterName }),
          contentType: 'application/json',
          success:function (result) {
            console.log("Vote Data Submitted Successfully");
            window.location = result.result;
          },
          error:function (err) {
            console.log("Error Occurred", err);
          }
        });
      }
    });
  }

  if (document.getElementById('addOptionBtn')) {
    let optionCount = 3;
    $( "#addOptionBtn").on('click', function (event) {
      event.preventDefault();
      let newOption = $('<div>').addClass("form-group");
      let newDesc = $('<div>').addClass("form-group");
      newOption.append(
        $('<label>')
          .attr('for', `option${optionCount}`)
          .text(`Option ${optionCount}`),
        $('<input>')
          .attr('type', 'text')
          .addClass('form-control')
          .attr('name', `option${optionCount}`)
          .attr('placeholder', `Option ${optionCount}`)
      );
      newDesc.append(
        $('<label>')
          .attr('for', "comment")
          .text("Description (optional):"),
        $('<textarea>')
          .addClass('form-control')
          .attr('rows', '5')
          .attr('name', `details${optionCount}`)
      );
      let renderOption = newOption[0].outerHTML;
      let renderDesc = newDesc[0].outerHTML;
      $('#optionsList').append(renderOption);
      $('#optionsList').append(renderDesc);
      optionCount += 1;
    });
  }
});
