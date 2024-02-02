document.getElementById("shareButton").addEventListener("click", function () {
    navigator.clipboard.writeText(window.location.href);
    console.log("Link Copied");
});
