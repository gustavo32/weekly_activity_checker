var table = document.getElementById("table");

function create_new_column(column_name, element_before = null) {
    let header = table.children[0].rows[0];

    var th = document.createElement("th");
    var text_th = document.createTextNode(column_name);
    var close_btn = document.createElement("span");
    close_btn.className = "close-btn";
    close_btn.contentEditable = false;
    th.appendChild(text_th);
    th.appendChild(close_btn);
    th.contentEditable = true;
    if (element_before !== null) {
        header.insertBefore(th, element_before);
    } else {
        header.insertBefore(th, header.children[header.children.length - 1]);
    }

    for (let i = 1; i < table.children[0].children.length; i++) {
        var new_td = document.createElement("td");
        var el = table.children[0].children[i];
        el.appendChild(new_td);
    }

    return th;
}

function set_rows(value, indice) {
    for (let i = 1; i < table.children[0].children.length; i++) {
        console.log(table.children[0].children[i]);
        if (value[i - 1]) {
            table.children[0].children[i].children[
                indice
            ].style.backgroundColor = "#5588a3";
        }
    }
}

function set_initial_tasks(tasks) {
    var i = 0;
    Object.entries(tasks[0]).forEach(([key, value]) => {
        create_new_column(key);
        set_rows(value, i);
        i += 1;
    });
}

window.addEventListener(
    "load",
    function () {
        xhr = new XMLHttpRequest();
        xhr.open("GET", "/task_list", true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                var res = JSON.parse(xhr.response);
                set_initial_tasks(res);
            }
        };
        xhr.send(null);
    },
    false
);

function getStyle(el, styleProp) {
    if (el.currentStyle) return el.currentStyle[styleProp];

    return document.defaultView.getComputedStyle(el, null)[styleProp];
}

function send_data(data, url) {
    var xhttp = new XMLHttpRequest();
    // xhttp.onreadystatechange = function () {
    //   if (this.readyState == 4 && this.status == 200) {
    //     document.getElementById("demo").innerHTML = xhttp.responseText;
    //   }
    // };
    xhttp.open("POST", url, true);
    xhttp.send(JSON.stringify(data));
}

table.onkeydown = function (evt) {
    if (evt.which === 13) {
        evt.preventDefault();
        evt.target.blur();
        let header = evt.target.parentNode;
        let arr = [];
        for (i = 0; i < header.children.length; i++) {
            if (header.children[i].textContent !== "")
                arr.push(header.children[i].textContent);
        }
        send_data(arr, "/headers");
    }
};

table.onclick = function (evt) {
    let td = evt.target;
    let color = getStyle(evt.target, "background-color");
    if (color === "rgb(232, 232, 232)") {
        td.style.backgroundColor = "#5588a3";
    } else if (color === "rgb(85, 136, 163)") {
        td.style.backgroundColor = "#e8e8e8";
    } else if (
        td.className === "plus-button" ||
        td.className === "fa fa-plus-circle"
    ) {
        if (td.className === "fa fa-plus-circle") {
            td = td.parentNode;
        }

        let th = create_new_column("New Task", td);
        th.focus();
    } else if (td.className === "close-btn") {
        let parent = td.parentNode.parentNode;
        if (parent.children.length > 3) {
            var index = Array.prototype.indexOf.call(
                parent.children,
                td.parentNode
            );
            parent.removeChild(parent.children[index]);
            var e_parent = parent.parentNode;
            var offset = 1;
            for (let i = 1; i < table.children[0].children.length; i++) {
                if ((i - 1) % 7 === 0) offset = 1;
                e_parent.children[i].removeChild(
                    e_parent.children[i].children[index - 1 + offset]
                );
                offset = 0;
            }
        }
    }
};
