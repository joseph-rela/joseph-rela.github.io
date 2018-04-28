var list = [];
var lines;
var startState = 1;
var accState = 2;
var currState = [];
var nextState = [];
var replaceChar = [];
var direction = [];
var inChar = [];
var state;
var title = ['RULES', 'Start State: 1', 'Accepting State: 2'];
var modString;
var openFile = function(event) {
  // clear out variables
  currState = [];
  nextState = [];
  inChar = [];
  list = [];

  // clear out list each time
  document.getElementById('outputList').innerHTML = '';

  var input = event.target;
  var reader = new FileReader();
  reader.onload = function(){

    var text = reader.result;
    var node = document.getElementById('output');

    lines = reader.result.split('\n');
    lines = lines.filter(function(n){return n != '\r'});
    var reAcc = /(accept*)/i;
    lines = lines.filter(function(m){
      return !(m.match(reAcc));
    });

    // populate rules display
    for (var i = 0; i < title.length; i++){
      listTitle = document.createElement("li");
      listTitle.classList.add("list-group-item");
      listTitle.appendChild(document.createTextNode(title[i]));
      document.getElementById('outputList').appendChild(listTitle);
    }


    for (var line = 0; line < lines.length; line++) {
        var li = document.createElement("li");
        li.classList.add("list-group-item");
        li.appendChild(document.createTextNode(lines[line]));
        document.getElementById('outputList').appendChild(li);
        list.push(lines[line]);
    }

    //populate rules
    for (var i = 0; i < list.length; i++){
      currState.push(list[i][2]);
      inChar.push(list[i][4]);
      nextState.push(list[i][8]);
      replaceChar.push(list[i][10]);
      direction.push(list[i][12]);
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

  // TURING MACHINE
  state = startState;
  var success = false;
  var cntr = 0;
  modString = inStr.split('');

  for (var j = 0; j < modString.length; ++j){
    var valid = false;
    console.log(j);
    if(cntr > 100){break;}
    for (var k = 0; k < currState.length; k++){
      if(state == currState[k] && modString[j] == inChar[k]){
        var li = document.createElement("li");
        li.classList.add("list-group-item");
        li.appendChild(document.createTextNode('read character: ' + modString[j] + ' || current state: ' + state + ' || rule: ' + lines[k] ));
        document.getElementById('resultList').appendChild(li);
        modString[j] = replaceChar[k];
        state = nextState[k];
        cntr += 1;
        if(direction[k] == 'L'){
          j -= 2;
        }
        valid = true;
        k = currState.length;
      }
    }
    if(!valid) break;
  }

  // add success or failure to bottom of the results
  var li = document.createElement("li");

  // if process runs 1000 times, fail on infinite loop
  if (cntr > 100){
    li.classList.add("list-group-item");
    li.classList.add("list-group-item-danger");
    li.appendChild(document.createTextNode('Infinite Loop Detected!'));
    document.getElementById('resultList').appendChild(li);
  }

  if(valid){
    if (state == accState) success = true;
  }

  if (success){
    li.classList.add("list-group-item");
    li.classList.add("list-group-item-success");
    li.appendChild(document.createTextNode('Final String ' + modString.join('') + ' Accepted!'));
    document.getElementById('resultList').appendChild(li);
  } else {
    li.classList.add("list-group-item");
    li.classList.add("list-group-item-danger");
    li.appendChild(document.createTextNode('Final String ' + modString.join('') + ' Rejected'));
    document.getElementById('resultList').appendChild(li);
  }
}
