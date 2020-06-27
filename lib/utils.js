(function() {
  var cors_api_host = 'cors-anywhere.herokuapp.com';
  var cors_api_url = 'https://' + cors_api_host + '/';
  var slice = [].slice;
  var origin = window.location.protocol + '//' + window.location.host;
  var open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function() {
      var args = slice.call(arguments);
      var targetOrigin = /^https?:\/\/([^\/]+)/i.exec(args[1]);
      if (targetOrigin && targetOrigin[0].toLowerCase() !== origin &&
          targetOrigin[1] !== cors_api_host) {
          args[1] = cors_api_url + args[1];
      }
      return open.apply(this, args);
  };
})();

export async function blobToBase64(blob) {
  return new Promise((fnResolve, fnReject) => {
    var reader = new FileReader();
    reader.onload = function() {
      var dataUrl = reader.result;
      var base64 = dataUrl.split(',')[1];
      fnResolve(dataUrl);
    };
    reader.onerror = fnReject;
    reader.readAsDataURL(blob);
  });
};

export async function fnConvertFileFromURLToBase64(url, fileName)
{
  return new Promise((fnResolve, fnReject) => {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";
    xhr.onload = function() {
      // var urlCreator = window.URL || window.webkitURL;
      // fnResolve(urlCreator.createObjectURL(this.response));

      console.log('this.response', this.response);      
      fnResolve(blobToBase64(this.response));

      // var urlCreator = window.URL || window.webkitURL;
      // var imageUrl = urlCreator.createObjectURL(this.response);
      // var tag = document.createElement('a');
      // tag.href = imageUrl;
      // tag.download = fileName;
      // document.body.appendChild(tag);
      // tag.click();
      // document.body.removeChild(tag);
    };
    xhr.onerror = fnReject;
    xhr.send();
  });
}

export async function fnConvertImageFileFromURLToBase64(url, fileName)
{
  return new Promise((fnResolve, fnReject) => {
    var image = document.createElement('img'); //  new Image();

    document.body.appendChild(image);
    image.style.position = "absolute";
    image.style.zIndex = "-1";

    image.crossOrigin = ""; // "anonymous";
    image.src = url;

    fileName = fileName || image.src.split(/(\\|\/)/g).pop();

    image.onload = function () {
      var canvas = document.createElement('canvas');
      canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
      canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size
      canvas.getContext('2d').drawImage(this, 0, 0);
      var blob;
      
      if (image.src.indexOf(".jpg") > -1) {
        blob = canvas.toDataURL("image/jpeg");
      } else if (image.src.indexOf(".png") > -1) {
        blob = canvas.toDataURL("image/png");
      } else if (image.src.indexOf(".gif") > -1) {
        blob = canvas.toDataURL("image/gif");
      } else {
        blob = canvas.toDataURL("image/png");
      }
      
      fnResolve(blob);
      // $("body").html("<b>Click image to download.</b><br><a download='" + fileName + "' href='" + blob + "'><img src='" + blob + "'/></a>");
      canvas.remove();
      image.remove();
    };
  });
}