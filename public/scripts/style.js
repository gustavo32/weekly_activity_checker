var table = document.getElementById("table");
// console.log(table);

function getStyle(el, styleProp) {
  if (el.currentStyle) return el.currentStyle[styleProp];

  return document.defaultView.getComputedStyle(el, null)[styleProp];
}

table.onkeydown = function (evt) {
  if (evt.which === 13) {
    evt.preventDefault();
    evt.target.blur();
  }
};

table.onclick = function (evt) {
  let td = evt.target;
  let color = getStyle(evt.target, "background-color");
  if (color === "rgb(255, 255, 255)") {
    td.style.backgroundColor = "#7fcd91";
  } else if (color === "rgb(127, 205, 145)") {
    td.style.backgroundColor = "white";
  } else if (
    td.className === "plus-button" ||
    td.className === "fa fa-plus-circle"
  ) {
    if (td.className === "fa fa-plus-circle") {
      td = td.parentNode;
    }
    let header = table.children[0].rows[0];

    var th = document.createElement("th");
    var text_th = document.createTextNode("New Task");
    var close_btn = document.createElement("span");
    close_btn.className = "close-btn";
    close_btn.contentEditable = false;
    th.appendChild(text_th);
    th.appendChild(close_btn);

    th.contentEditable = true;

    header.insertBefore(th, td);
    for (let i = 1; i < table.children[0].children.length; i++) {
      var new_td = document.createElement("td");
      var el = table.children[0].children[i];
      el.appendChild(new_td);
    }
    th.focus();
  } else if (td.className === "close-btn") {
    let parent = td.parentNode.parentNode;
    console.log(parent.children.length);
    if (parent.children.length > 3) {
      // let index = parent.children.indexOf(td.parentNode);
      var index = Array.prototype.indexOf.call(parent.children, td.parentNode);
      parent.removeChild(parent.children[index]);
      var e_parent = parent.parentNode;
      for (let i = 1; i < table.children[0].children.length; i++) {
        e_parent.children[i].removeChild(
          e_parent.children[i].children[index - 1]
        );
      }
    }
  }
};
