var list = [];
var lines;
var startState;
var accState = [];
var currState = [];
var nextState = [];
var inChar = [];
var state;

var openFile = function(event) {
  // clear out variables
  accState = [];
  currState = [];
  nextState = [];
  inChar = [];
  list = [];

  // clear out list each time
  document.getElementById('outputList').innerHTML = '';

  var input = event.target;
  var reader = new FileReader();
  reader.onload = function(){
    console.log(event);
    var text = reader.result;
    var node = document.getElementById('output');

    lines = reader.result.split('\n');

    for (var line = 0; line < lines.length; line++) {
        var li = document.createElement("li");
        li.classList.add("list-group-item");
        li.appendChild(document.createTextNode(lines[line]));
        document.getElementById('outputList').appendChild(li);
        list.push(lines[line]);
    }

    // find starting state
    var r0 = new RegExp(/\d+/g);
    var s0 = list[0];
    startState = r0.exec(s0)[0];

    // find accepting state
    var r1 = new RegExp(/\d+/g);
    var s1 = list[1];
    var resp1;
    while ((resp1 = r1.exec(s1)) != null) {
      accState.push(resp1[0]);
    }

    // find currState && nextState && inChar
    var r2 = new RegExp(/[a-z]/);
    var resp2;
    for (var i = 3; i < list.length; i++){
      while ((resp2 = r1.exec(list[i])) != null){
        //console.log(resp2);
        if(currState.length == nextState.length){
          currState.push(resp2[0]);
        }else{
          nextState.push(resp2[0]);
        }
      }
    }

    // find input characters
    for (var i = 3; i < list.length; i++){
      inChar.push(r2.exec(list[i])[0]);
    }

  };

  // free up memory and display input box and rules list
  reader.readAsText(input.files[0]);
  document.getElementById("myForm").style.visibility = "visible";
  document.getElementById("output").style.visibility = "visible";
};

var checkStr = function(){
  var inStr = document.getElementById('inText').value;
  document.getElementById("results").style.visibility = "visible";

  // clear out list each time
  document.getElementById('resultList').innerHTML = '';

  // check if input string is successful
  state = startState;
  var success = false;
  for (var j = 0; j < inStr.length; j++){
    var valid = false;
    for (var k = 0; k < currState.length; k++){
      if(state == currState[k] && inStr[j] == inChar[k]){
        var li = document.createElement("li");
        li.classList.add("list-group-item");
        li.appendChild(document.createTextNode('read character: ' + inStr[j] + ' || current state: ' + state + ' || rule: ' + lines[k + 3]));
        document.getElementById('resultList').appendChild(li);
        state = nextState[k];
        valid = true;
        k = currState.length;
      }
    }
    if(!valid) break;
  }

  // add success or failure to bottom of the results
  var li = document.createElement("li");

  if(valid){
    for (var l = 0; l < accState.length; l++){
      if (state == accState[l]) success = true;
    }
  }

  if (success){
    li.classList.add("list-group-item");
    li.classList.add("list-group-item-success");
    li.appendChild(document.createTextNode('Success!'));
    document.getElementById('resultList').appendChild(li);
  } else {
    li.classList.add("list-group-item");
    li.classList.add("list-group-item-danger");
    li.appendChild(document.createTextNode('Input String Failed'));
    document.getElementById('resultList').appendChild(li);
  }
}
