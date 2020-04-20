var table = document.getElementById("table");
// console.log(table);

function getStyle(el, styleProp) {
  if (el.currentStyle) return el.currentStyle[styleProp];

  return document.defaultView.getComputedStyle(el, null)[styleProp];
}

table.onclick = function (evt) {
  let td = evt.target;
  let color = getStyle(evt.target, "background-color");
  if (color === "rgb(255, 255, 255)") {
    td.style.backgroundColor = "#7fcd91";
  } else if (color === "rgb(127, 205, 145)") {
    td.style.backgroundColor = "white";
  } else if (td.className == "plus-button") {
    let header = table.children[0].rows[0];

    var th = document.createElement("th");
    var text_th = document.createTextNode("New Task");
    th.appendChild(text_th);
    th.contentEditable = true;

    header.insertBefore(th, td);
    // var el;
    // console.log(table.children[0].children[1]);
    for (let i = 1; i < table.children[0].children.length; i++) {
      var new_td = document.createElement("td");
      var el = table.children[0].children[i];
      console.log(el);
      el.appendChild(new_td);
      console.log(el);
    }
    th.focus();
  }
};
