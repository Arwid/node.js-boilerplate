/* Author: 

*/




$(function() {
  $("#signup_form").submit(function() {
    
    var email = $('input[name=email]');
    
    //Validation
    
    //Organize data
    var data = {
      email: email.val()
    };
    
    //Disable fields
    $('#signup_form input').attr('disabled','true');
    
    //Show loading sign
    $('#signup .loading').show();
    
    //Start the Ajax
    $.ajax({
      type: 'POST',
      url: '/signup', 
      data: data,
      cache: false,
      success: function(data) {
        $("#signup .message").hide();
        $('#signup_form input').removeAttr('disabled');
        if (data) {
          if (data.success) {
            $("#signup form").hide();
            $("#signup .error").hide();
            email.removeClass("highlight");
            $("#signup .success").fadeIn('slow');
          } else {
            $("#signup .error").fadeIn('slow');
            email.addClass("highlight");
          }
        } else {
          alert('Sorry, unexpected error. Please try again later.');
        }
      }, 
      dataType: 'json'
    });
    
    return false;
  });
});












