// USE FOR ON PAGE EVENTS ONLY
$(() => {
  let orderArray = [];
  $( "#sortable" ).sortable({
  update: function(event, ui) {
    var order =   $(this).sortable('toArray');
    orderArray = order;
    // console.log(orderArray);
    }
  });
  $( "#sortable" ).disableSelection();

  $( "#voteSubmit").on("click", function() {
    $.ajax({
      method: 'POST',
      url: '/polls/:v_url/',
      data: orderArray
    });
    console.log(orderArray);
  });
});

