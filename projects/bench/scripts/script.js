var View = new Vue({
  el: '#app',
  data: {
    queue: [], // STORES NAME IN THE ARRAY
    email: [], // STORES EMAIL IN THE ARRAY
    isInPair: [],
    // pairsName: [],
    pairsEmail: [],
    current_email: ['','','',''],// stores email for people using the bench
    spotter_email: ['','','',''],
    current_pair: [false,false,false,false],
    email_subject:
    ["Confirmation: You Have Joined the Bench Press Queue",
    "Bench Press Queue: It is Your Turn",
    "Bench Press Queue: Your Time is Up",
    //for pair
    "Bench Press Queue: It is Your Turn"
  ],
    email_body:
    ["you have joined the queue. You will receive another email when it is your turn.",
    "you have 20 minutes to use the flat bench. You will receive another email when the time is up.",
    "your time is up.",
    //for pair
    "you and your partner have 40 minutes to use the flat bench. You will receive another email when the time is up."
  ],

    timesAdded: [0,0,0,0],
  },
  method: {

  },
})


// https://www.w3schools.com/js/tryit.asp?filename=tryjs_timing_clock

// https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_countdown

// MAIN FUNCTION
$(document).ready(function(){
  $('#instructions').hide();// hides the instructions pop-up
  $('#email_pop_up_1').hide();
  $('#type_name').hide();
  $('#type_email').hide();
  $('#form_submitted_popup').hide();
  $('#form_not_submitted_popup').hide();


  initialize();
  document.getElementById("spotter_yes").checked = false;
  document.getElementById("spotter_no").checked = true;
  $('#spotter_message')[0].innerHTML = "Note: You will have 20 minutes to use the bench.";



  $('#spotter_yes').click(function(){// user has a spotter
    $('#spotter_message')[0].innerHTML = "Note: You and your partner will have 40 minutes to use the bench.";
    document.getElementById("spotter_yes").checked = true;
    document.getElementById("spotter_no").checked = false;
    document.getElementById("spotter_section").style.display = '';
  });

  $('#spotter_no').click(function(){// user doesn't have a spotter
    $('#spotter_message')[0].innerHTML = "Note: You will have 20 minutes to use the bench.";
    document.getElementById("spotter_no").checked = true;
    document.getElementById("spotter_yes").checked = false;
    document.getElementById("spotter_section").style.display = 'none';
  });



  $('#join_button').click(function(){// when join button is clicked
    var isPair = false, spotter_name = "", spotter_email = "";
    if (!document.getElementById('name_input').value.trim().length) { // check if a user didn't type in the name
      $('#type_name').show();
      return;
    }
    if(!document.getElementById('name_input_spotter').value.trim().length && document.getElementById("spotter_yes").checked){
      $('#type_name').show();
      return;
    }
    if(!validateEmail(document.getElementById('email_input').value)){// check if a user didn't type in the email
      $('#type_email').show();
      return;
    }
    $('#email_pop_up_1').show();// show pop up
    if(document.getElementById("spotter_yes").checked){//checking in a pair;
      document.getElementById("spotter_yes").checked = false;
      document.getElementById("spotter_no").checked = true;
      isPair = true;
      spotter_name = document.getElementById("name_input_spotter").value;
      spotter_email = document.getElementById("email_input_spotter").value;
      document.getElementById("spotter_section").style.display = 'none';
      document.getElementById("name_input_spotter").value = "";
      document.getElementById("email_input_spotter").value = "";
    }
    $('#spotter_message')[0].innerHTML = "Note: You will have 20 minutes to use the bench.";


    if ($('#bench_1')[0].innerHTML == "Not Taken"){// BENCH 1 IS NOT TAKEN
      if(isPair){
        $('#bench_1')[0].innerHTML = document.getElementById('name_input').value + ' & '+spotter_name;
        if(validateEmail(spotter_email)){
          sendEmail(spotter_email,
          $('#bench_1')[0].innerHTML, 3);
        }
        sendEmail(document.getElementById('email_input').value,
        $('#bench_1')[0].innerHTML, 3);
        View.$data.current_pair[0] = true;
      }
      else{// not in pair
        $('#bench_1')[0].innerHTML = document.getElementById('name_input').value;
        sendEmail(document.getElementById('email_input').value,
        document.getElementById('name_input').value, 1);
      }
      View.$data.timesAdded[0] = 0;
      View.$data.current_email[0] = document.getElementById('email_input').value;
      View.$data.spotter_email[0] = spotter_email;
      var maxTime = 20;
      if(isPair){
        maxTime = 40;
      }
      let a = setInterval(function(){
        // console.log(View.$data.timesAdded[0]);
        var time_remaining_1 = maxTime - View.$data.timesAdded[0];
        var quotient_1 = Math.floor(time_remaining_1/60);
        var remainder_1 = time_remaining_1 % 60;
        if(quotient_1 < 10){
          if(quotient_1 === 0){
            quotient_1 = "00";
          }
          else{
            quotient_1 = "0"+quotient_1;
          }
        }
        if(remainder_1 < 10){
          if(remainder_1 === 0){
            remainder_1 = "00";
          }
          else{
            remainder_1 = "0"+remainder_1;
          }
        }

        $('#time_1')[0].innerHTML = quotient_1+":"+ remainder_1;
        View.$data.timesAdded[0]++;

        if(View.$data.timesAdded[0] >= maxTime+1){
          sendEmail(View.$data.current_email[0],$('#bench_1')[0].innerHTML, 2);
          if(View.$data.current_pair[0]){
            if(validateEmail(View.$data.spotter_email[0]),$('#bench_1')[0].innerHTML, 2){
              sendEmail(View.$data.spotter_email[0],$('#bench_1')[0].innerHTML, 2);
            }
          }
          View.$data.current_pair[0] = false;
          if(View.$data.queue.length != 0){// if someone is in queue
            $('#bench_1')[0].innerHTML = View.$data.queue[0];
            View.$data.current_email[0] = View.$data.email[0];
            if(View.$data.isInPair[0]){// if pair
              View.$data.spotter_email[0] = View.$data.pairsEmail[0];
              if(validateEmail(View.$data.spotter_email[0])){
                sendEmail(View.$data.spotter_email[0],$('#bench_1')[0].innerHTML,3);
              }
              sendEmail(View.$data.email[0], $('#bench_1')[0].innerHTML, 3);
              maxTime = 40;
              View.$data.current_pair[0] = true;
            }
            else{
              sendEmail(View.$data.email[0], View.$data.queue[0], 1);
              maxTime = 20;
            }
            View.$data.queue.shift();
            View.$data.email.shift();
            View.$data.pairsEmail.shift();
            View.$data.isInPair.shift();
            View.$data.timesAdded[0] = 0;
          }
          else{
            clearInterval(a);
            $('#bench_1')[0].innerHTML = 'Not Taken';
            $('#time_1')[0].innerHTML = "";// clear time in bench 1
          }

        }
      }, 1000)
    }
    else if ($('#bench_2')[0].innerHTML == "Not Taken"){// BENCH 2 IS NOT TAKEN  
      if(isPair){
        $('#bench_2')[0].innerHTML = document.getElementById('name_input').value + ' & '+spotter_name;
        if(validateEmail(spotter_email)){
          sendEmail(spotter_email, $('#bench_2')[0].innerHTML, 3);
        }
        sendEmail(document.getElementById('email_input').value, $('#bench_2')[0].innerHTML, 3);
        View.$data.current_pair[1] = true;
      }
      else{// not in pair
        $('#bench_2')[0].innerHTML = document.getElementById('name_input').value;
        sendEmail(document.getElementById('email_input').value, document.getElementById('name_input').value, 1);
      }
      View.$data.timesAdded[1] = 0;
      View.$data.current_email[1] = document.getElementById('email_input').value;
      View.$data.spotter_email[1] = spotter_email;
      var maxTime = 20;
      if(isPair){
        maxTime = 40;
      }
      let b = setInterval(function(){
        var time_remaining_2 = maxTime - View.$data.timesAdded[1];
        var quotient_2 = Math.floor(time_remaining_2/60);
        var remainder_2 = time_remaining_2 % 60;
        if(quotient_2 < 10){
          if(quotient_2 === 0){
            quotient_2 = "00";
          }
          else{
            quotient_2 = "0"+quotient_2;
          }
        }
        if(remainder_2 < 10){
          if(remainder_2 === 0){
            remainder_2 = "00";
          }
          else{
            remainder_2 = "0"+remainder_2;
          }
        }
        $('#time_2')[0].innerHTML = quotient_2+":"+ remainder_2;
        View.$data.timesAdded[1]++;

        if(View.$data.timesAdded[1] >= maxTime+1){
          sendEmail(View.$data.current_email[1],$('#bench_2')[0].innerHTML, 2);
          if(View.$data.current_pair[1]){
            if(validateEmail(View.$data.spotter_email[1]),$('#bench_2')[0].innerHTML, 2){
              sendEmail(View.$data.spotter_email[1],$('#bench_2')[0].innerHTML, 2);
            }
          }
          View.$data.current_pair[1] = false;

          if(View.$data.queue.length != 0){
            $('#bench_2')[0].innerHTML = View.$data.queue[0];
            View.$data.current_email[1] = View.$data.email[0];
            if(View.$data.isInPair[0]){// if pair
              View.$data.spotter_email[1] = View.$data.pairsEmail[0];
              if(validateEmail(View.$data.spotter_email[1])){
                sendEmail(View.$data.spotter_email[1],$('#bench_2')[0].innerHTML,3);
              }
              sendEmail(View.$data.email[0], $('#bench_2')[0].innerHTML, 3);
              maxTime = 40;
              View.$data.current_pair[1] = true;
            }
            else{
              sendEmail(View.$data.email[0], View.$data.queue[0], 1);
              maxTime = 20;
            }
            View.$data.pairsEmail.shift();
            View.$data.isInPair.shift();
            View.$data.queue.shift();
            View.$data.email.shift();
            View.$data.timesAdded[1] = 0;
          }
          else{
            clearInterval(b);
            $('#bench_2')[0].innerHTML = 'Not Taken';
            $('#time_2')[0].innerHTML = "";// clear time in bench 2
          }
        }
      }, 1000)
    }
    else if ($('#bench_3')[0].innerHTML == "Not Taken"){// BENCH 3 IS NOT TAKEN 
      if(isPair){
        $('#bench_3')[0].innerHTML = document.getElementById('name_input').value + ' & '+spotter_name;
        if(validateEmail(spotter_email)){
          sendEmail(spotter_email,
          $('#bench_3')[0].innerHTML, 3);
        }
        sendEmail(document.getElementById('email_input').value,
        $('#bench_3')[0].innerHTML, 3);
        View.$data.current_pair[2] = true;
      }
      else{// not in pair
        $('#bench_3')[0].innerHTML = document.getElementById('name_input').value;
        sendEmail(document.getElementById('email_input').value,
        document.getElementById('name_input').value, 1);
      }
      View.$data.timesAdded[2] = 0;
      View.$data.current_email[2] = document.getElementById('email_input').value;
      View.$data.spotter_email[2] = spotter_email;
      var maxTime = 20;
      if(isPair){
        maxTime = 40;
      }
      let c = setInterval(function(){
        var time_remaining_3 = maxTime - View.$data.timesAdded[2];
        var quotient_3 = Math.floor(time_remaining_3/60);
        var remainder_3 = time_remaining_3 % 60;

        if(quotient_3 < 10){
          if(quotient_3 === 0){
            quotient_3 = "00";
          }
          else{
            quotient_3 = "0"+quotient_3;
          }
        }
        if(remainder_3 < 10){
          if(remainder_3 === 0){
            remainder_3 = "00";
          }
          else{
            remainder_3 = "0"+remainder_3;
          }
        }
        $('#time_3')[0].innerHTML = quotient_3+":"+ remainder_3;
        View.$data.timesAdded[2]++;
        if(View.$data.timesAdded[2] >= maxTime+1){
          sendEmail(View.$data.current_email[2],$('#bench_3')[0].innerHTML, 2);
          if(View.$data.current_pair[2]){
            if(validateEmail(View.$data.spotter_email[2]),$('#bench_3')[0].innerHTML, 2){
              sendEmail(View.$data.spotter_email[2],$('#bench_3')[0].innerHTML, 2);
            }
          }
          View.$data.current_pair[2] = false;

          if(View.$data.queue.length != 0){// if someone is in queue
            $('#bench_3')[0].innerHTML = View.$data.queue[0];
            View.$data.current_email[2] = View.$data.email[0];
            if(View.$data.isInPair[0]){// if pair
              View.$data.spotter_email[2] = View.$data.pairsEmail[0];
              if(validateEmail(View.$data.spotter_email[2])){
                sendEmail(View.$data.spotter_email[2],$('#bench_3')[0].innerHTML,3);
              }
              sendEmail(View.$data.email[0], $('#bench_3')[0].innerHTML, 3);
              maxTime = 40;
              View.$data.current_pair[2] = true;
            }
            else{
              sendEmail(View.$data.email[0], View.$data.queue[0], 1);
              maxTime = 20;
            }
            View.$data.pairsEmail.shift();
            View.$data.isInPair.shift();
            View.$data.queue.shift();
            View.$data.email.shift();
            View.$data.timesAdded[2] = 0;
          }
          else{
            clearInterval(c);
            $('#bench_3')[0].innerHTML = 'Not Taken';
            $('#time_3')[0].innerHTML = "";// clear time in bench 1
          }

        }
      }, 1000)
    }
    else if ($('#bench_4')[0].innerHTML == "Not Taken"){// BENCH 4 IS NOT TAKEN 
      if(isPair){
        $('#bench_4')[0].innerHTML = document.getElementById('name_input').value + ' & '+spotter_name;
        if(validateEmail(spotter_email)){
          sendEmail(spotter_email, $('#bench_4')[0].innerHTML, 3);
        }
        sendEmail(document.getElementById('email_input').value, $('#bench_4')[0].innerHTML, 3);
        View.$data.current_pair[3] = true;
      }
      else{// not in pair
        $('#bench_4')[0].innerHTML = document.getElementById('name_input').value;
        sendEmail(document.getElementById('email_input').value, document.getElementById('name_input').value, 1);
      }
      View.$data.timesAdded[3] = 0;
      View.$data.current_email[3] = document.getElementById('email_input').value;
      View.$data.spotter_email[3] = spotter_email;
      var maxTime = 20;
      if(isPair){
        maxTime = 40;
      }
      let d = setInterval(function(){
        var time_remaining_4 = maxTime - View.$data.timesAdded[3];
        var quotient_4 = Math.floor(time_remaining_4/60);
        var remainder_4 = time_remaining_4 % 60;
        if(quotient_4 < 10){
          if(quotient_4 === 0){
            quotient_4 = "00";
          }
          else{
            quotient_4 = "0"+quotient_4;
          }
        }
        if(remainder_4 < 10){
          if(remainder_4 === 0){
            remainder_4 = "00";
          }
          else{
            remainder_4 = "0"+remainder_4;
          }
        }
        $('#time_4')[0].innerHTML = quotient_4+":"+ remainder_4;
        View.$data.timesAdded[3]++;

        if(View.$data.timesAdded[3] >= maxTime+1){
          sendEmail(View.$data.current_email[3],$('#bench_4')[0].innerHTML, 2);
          if(View.$data.current_pair[3]){
            if(validateEmail(View.$data.spotter_email[3]),$('#bench_4')[0].innerHTML, 2){
              sendEmail(View.$data.spotter_email[3],$('#bench_4')[0].innerHTML, 2);
            }
          }
          View.$data.current_pair[3] = false;

          if(View.$data.queue.length != 0){// if someone is in queue
            $('#bench_4')[0].innerHTML = View.$data.queue[0];
            View.$data.current_email[3] = View.$data.email[0];
            if(View.$data.isInPair[0]){// if pair
              View.$data.spotter_email[3] = View.$data.pairsEmail[0];
              if(validateEmail(View.$data.spotter_email[3])){
                sendEmail(View.$data.spotter_email[3],$('#bench_4')[0].innerHTML,3);
              }
              sendEmail(View.$data.email[0], $('#bench_4')[0].innerHTML, 3);
              maxTime = 40;
              View.$data.current_pair[3] = true;
            }
            else{
              sendEmail(View.$data.email[0], View.$data.queue[0], 1);
              maxTime = 20;
            }
            View.$data.pairsEmail.shift();
            View.$data.isInPair.shift();
            View.$data.queue.shift();
            View.$data.email.shift();
            View.$data.timesAdded[3] = 0;
          }
          else{
            clearInterval(d);
            $('#bench_4')[0].innerHTML = "Not Taken";
            $('#time_4')[0].innerHTML = "";// clear time in bench 4
          }
        }
      }, 1000)
    }
    else{// if no spot is open

      View.$data.email.push(document.getElementById('email_input').value);// add email to the queue
      if(isPair){
        View.$data.queue.push(document.getElementById('name_input').value + ' & ' + spotter_name);// add name to the queue
        View.$data.isInPair.push(true);
        View.$data.pairsEmail.push(spotter_email);
      }
      else{
        View.$data.queue.push(document.getElementById('name_input').value);
        View.$data.isInPair.push(false);
        View.$data.pairsEmail.push("");
      }


    }
    document.getElementById('name_input').value = '';// clear text box
    document.getElementById('email_input').value = '';// clear email box


  });



  $('#instructions_button').click(function(){// when instructions button is clicked
    $('#instructions').show();
  });

  $('#instructions_close_button').click(function(){// when instructions close button is clicked
    $('#instructions').hide();
  });

  $('#email_close_button').click(function(){// when email close button is clicked
    $('#email_pop_up_1').hide();
  });

  $('#type_name_close_button').click(function(){// when type name close button is clicked
    $('#type_name').hide();
  });

  $('#type_email_close_button').click(function(){// when type name close button is clicked
    $('#type_email').hide();
  });

  $('#form_submit_button').click(function(){// when form submit button is clicked
    if(!document.getElementById('form_comment').value.trim().length){// if nothing is in comment
      $('#form_not_submitted_popup').show();
    }
    else{// send email to bench.press.queue@gmail.com
      // if(validateEmail(document.getElementById('form_email').value)){// if email is valid
      //   	Email.send({
      //       SecureToken: "b228e2f8-62e2-4f00-82b0-a7ae80e20306",
      //       To: document.getElementById('form_email').value,// receiver
      //   		From: "bench.press.queue@gmail.com",
      //   		Subject: "Bench Press Queue: Here is the Comment We Received From You",
      //   		Body: document.getElementById('form_comment').value,
      //   	})
      //   		.then(function (message) {});
      // }
      Email.send({
        SecureToken: "b228e2f8-62e2-4f00-82b0-a7ae80e20306",
        To: "bench.press.queue@gmail.com",// receiver
    		From: "bench.press.queue@gmail.com",
        Subject: "Comment From Users",
        Body: "Name: "+document.getElementById('form_name').value+" Email: "
        +document.getElementById('form_email').value+
        " Comment: "+document.getElementById('form_comment').value,
      })

      document.getElementById('form_name').value = '';
      document.getElementById('form_email').value = '';
      document.getElementById('form_comment').value = '';
      // $('#form_email').value = '';
      // $('#form_comment').value = '';
      $('#form_submitted_popup').show();
    }

  });

  $('#form_submitted_popup_close_button').click(function(){// when form submit close button is clicked
    $('#form_submitted_popup').hide();
  });

  $('#form_not_submitted_popup_close_button').click(function(){// when form not submit close button is clicked
    $('#form_not_submitted_popup').hide();
  });




});// End of the main function



// Initialises
function initialize(){
  $('#bench_1')[0].innerHTML = 'Not Taken';
  $('#bench_2')[0].innerHTML = 'Not Taken';
  $('#bench_3')[0].innerHTML = 'Not Taken';
  $('#bench_4')[0].innerHTML = 'Not Taken';


}

// sends an email
function sendEmail(receiver_email, name,num) {
	Email.send({
    SecureToken: "b228e2f8-62e2-4f00-82b0-a7ae80e20306",
    To: receiver_email,// receiver
		From: "bench.press.queue@gmail.com",
		Subject: View.$data.email_subject[num],
		Body: 'Hi '+name+', '+View.$data.email_body[num],
	})
		.then(function (message) {});
	}

// checks if an email is valid
function validateEmail(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}


  // setTimeout function
  function inUse(divID){
    // $(divID)[0].innerHTML = '';
    if(View.$data.queue.length != 0){
      $(divID)[0].innerHTML = View.$data.queue[0];
      View.$data.queue.shift();
    }
  }




//   Bench_Press_Queue10
