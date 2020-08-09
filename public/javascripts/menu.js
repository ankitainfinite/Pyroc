$(function() {
    let newName = "";
    $.contextMenu({
        selector: '.context-menu-one',
        callback: function(key, options) {
            const action = key;
            const id = JSON.parse(options.$trigger[0].id);
            //renaming the files
            if (newName && action == "rename") {

                const dirUrl = "http://localhost:3000/directory/rename";
                const fileUrl = "http://localhost:3000/file/rename";
                let body = {};
                let url = "";
                if (id.type.trim() == "file") {
                    url = fileUrl;
                    body = { fileId: id.id, newFileName: newName }
                } else {
                    url = dirUrl;
                    body = {
                        dirId: id.id,
                        newDirName: newName
                    };
                }
                requestModule(url, body, (err, res) => {
                    window.location.reload();
                });
                //deleting the files
            } else if (action == "delete") {

                const dirUrl = "http://localhost:3000/directory/delete";
                const fileUrl = "http://localhost:3000/file/delete";
                let body = {};
                let url = "";
                if (id.type.trim() == "file") {
                    url = fileUrl;
                    body = { fileId: id.id };
                } else {
                    url = dirUrl;
                    body = {
                        dirId: id.id
                    };
                }
                requestModule(url, body, (err, res) => {
                    window.location.reload();
                });
            }
        },
        items: {
            "rename": {
                name: "Rename",
                icon: "edit",
                items: {
                    name: {
                        name: "New Name",
                        type: 'text',
                        events: {
                            keyup: function(e) {
                                newName = e.target.value;
                            }
                        }
                    },
                    rename: {
                        name: "Submit"
                    }
                }
            },
            "delete": { name: "Delete", icon: "delete" },
            "sep1": "---------",
            "quit": {
                name: "Close Panel",
                icon: function($element, key, item) {
                    return 'context-menu-icon context-menu-icon-quit';
                }
            }
        }
    });

    $('.context-menu-one').on('click', function(e) {})
});
//updating the databse
function requestModule(url, body, cb) {
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    }).then(res => {
        console.log(res);
        return cb(null, res);
    }).catch(err => {
        console.log(err);
        return cb(err, null);
    })
}