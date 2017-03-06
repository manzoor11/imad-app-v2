//Submit username & password to login
var login = document.getElementById('login_btn');
submit.onclick = function() {
    
    // creat a request to counter end point
     var request = new XMLHttpRequest();
     
         //capture the response
      request.onreadystatechange = function () {
        if(request.readyState === XMLHttpRequest.DONE) {
            // take some action 
            if(request.status === 200) {
              alert('Logged in succesfully');
            } else if (repuest.status === 403) {
                alert('Username/Password is incorrect');
            } else if (repuest.status === 500) {
                alert('something went wrong on the server');
            }
        }
        // Not done yet
      };
    
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
      
    // make request
    request.open('POST', 'http://manzoor11.imad.hasura-app.io/login', true);
    request.send(JSON.stringify({username: username, password: password}));
    
};



// counter code

var button = document.getElementById("counter");
button.onclick = function() {
  
  // creat a request to counter end point
  var request = new XMLHttpRequest();
  
  //capture the response
  request.onreadystatechange = function () {
    if(request.readyState === XMLHttpRequest.DONE) {
        // take some action 
        if(request.status === 200) {
            var counter = request.responseText;
            var span = document.getElementById('count');
            span.innerHTML = counter.toString();
        }
    }
     // not done yet
  };
    // make request
    request.open('GET', 'http://manzoor11.imad.hasura-app.io/counter', true);
    request.send(null);
};

//submit Name
var submit = document.getElementById('submit_btn');
submit.onclick = function() {
    
    // creat a request to counter end point
     var request = new XMLHttpRequest();
     
         //capture the response
      request.onreadystatechange = function () {
        if(request.readyState === XMLHttpRequest.DONE) {
            // take some action 
            if(request.status === 200) {

              //capture a list of names and render it as a list
              var names = request.responseText;
              names = JSON.parse(names);
              var list = '';
              for (var i=0;i<names.length;i++) {
                  list += '<li>' + names[i] + '</li>';
              }
              var ul = document.getElementById('namelist');
              ul.innerHTML = list;
            }
        }
        // Not done yet
      };
    
    var nameInput = document.getElementById('name');
    var name = nameInput.value;  
      
    // make request
    request.open('GET', 'http://manzoor11.imad.hasura-app.io/submit-name/' + name, true);
    request.send(null);
    
};