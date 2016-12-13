var db,
    items = [],
    tasklist, editBox, lastHoveredItem, item, startIndex;

function add() {
    var value = editBox.value.trim();
    if (value == '') {
        alert('Empty');
        return;
    }

    editBox.value = '';
    var item = {
        value: value,
        status: false
    };
    addLi(item);
    items.push(item);
    save();
}

function addLi(item) {
    var li = document.createElement('li');
    li.textContent = item.value;
    li.draggable = true;
    tasklist.appendChild(li);
    // tasklist.insertBefore(li, tasklist.firstChild);
}

function load() {
    items = JSON.parse(localStorage.getItem('items') || '[]');

    items.forEach(function (item) {
       addLi(item);
    });

}

function save() {
    localStorage.setItem('items', JSON.stringify(items));
}

function dragStart(event) {
    console.log('dragStart', event);
    item = event.target;
    //startIndex
    [].forEach.call(item.parentNode.childNodes, function (el, idx) {
        if (el == item) {
            startIndex = idx;
        }
    });
}

function dragOver(event) {
    console.log('dragOver', event);
    if (event.target.tagName.toLowerCase() == 'li') {
        lastHoveredItem = event.target;
    }
    event.preventDefault();
}

function drop(event) {
    console.log('drop', event);

    tasklist.insertBefore(item, lastHoveredItem);

    var dropIndex = 0;
    [].forEach.call(item.parentNode.childNodes, function (el, idx) {
        if (el == item) {
            dropIndex = idx;
        }
    });

    if (startIndex > dropIndex) {
        items.splice(dropIndex, 0, items[startIndex]);
        items.splice(startIndex + 1, 1);
    } else {
        items.splice(dropIndex + 1, 0, items[startIndex]);
        items.splice(startIndex, 1);
    }
    save();
}

window.addEventListener('load', function () {
    tasklist = document.getElementById('tasklist');
    editBox = document.getElementById('editBox');
    load();

    editBox.addEventListener('keyup', function (event) {
        if (event.keyCode == 13) {
            add();
        }
    });

    tasklist.addEventListener('dragstart', dragStart);
    tasklist.addEventListener('dragover', dragOver);
    tasklist.addEventListener('drop', drop);



    db = openDatabase('taskDb2', '1.0', 'hello db', 2 * 1024 * 1024, function (db) {
        db.transaction(function (tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS tasks (title, status, position)');
        });
    });
    db.transaction(function (tx) {
        // here be the transaction
        // do SQL magic here using the tx object

        tx.executeSql('INSERT INTO tasks (title, status) VALUES ("hello2", "false")');


        // tx.executeSql('CREATE TABLE IF NOT EXISTS foo (id unique, text)');
        // tx.executeSql('INSERT INTO foo (id, text) VALUES (2, "22synergies")');
    }, function () {
        console.log('error', arguments);
    }, function () {
        console.log('success', arguments);
    });



});

var items = [];

