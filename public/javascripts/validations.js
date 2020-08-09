function validateDuplicateDir() {
    const dirName = document.getElementById("directoryName").value;
    const results = document.getElementById("dirResults").value;
    const temp = JSON.parse(results);
    const check = temp.find(obj => obj.directoryName == dirName);
    if (check) {
        alert(`Directory name with ${dirName} is already exists.`);
        return false;
    } else {
        return true;
    }
}
//no duplication
function validateDuplicateFile() {
    const fileNmame = document.getElementById("file1").files[0].name;
    const results = document.getElementById("fileResults").value;
    const temp = JSON.parse(results);
    const check = temp.find(obj => obj.fileName == fileNmame);
    if (check) {
        alert(`File with name ${fileNmame} is already exists.`);
        return false;
    } else {
        return true;
    }
}

function onFileSelect(input) {
    const file = input.files[0];
    if (file) {
        let uploadBtn = document.getElementById("uploadBtn")
        uploadBtn.disabled = false;
    }
}