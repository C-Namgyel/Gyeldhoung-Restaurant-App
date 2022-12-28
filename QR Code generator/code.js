new QRCode(document.getElementById("qrcode"), prompt("Enter Anything"))
/*function download() {
    html2canvas(document.getElementById("holder")).then(function(canvas) {
        const image = canvas.toDataURL("image/png", 1.0);
        const link = document.createElement("a");
        link.download = prompt("File name")+".png";
        link.href = image;
        link.click();
    });
}
download()*/