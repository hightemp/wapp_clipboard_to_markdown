
export function fnSaveFromEditorToFile() 
{
  var oThis = this;
  var textToWrite = oThis.codemirror.getValue();
  var textFileAsBlob = new Blob([textToWrite], {
    type: "text/plain;charset=utf-8"
  });

  var sFileName = prompt("File name", `unnamed.md`);

  if (!sFileName) {
    return;
  }

  var downloadLink = document.createElement("a");
  downloadLink.download = sFileName;
  downloadLink.innerHTML = "Download File";
  if (window.webkitURL != null) {
    // Chrome allows the link to be clicked
    // without actually adding it to the DOM.
    downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
  } else {
    // Firefox requires the link to be added to the DOM
    // before it can be clicked.
    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
  }

  downloadLink.click();
}