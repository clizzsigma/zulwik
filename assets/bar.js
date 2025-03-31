var params = new URLSearchParams(window.location.search);

function sendTo(url){
    // Preserve current URL parameters when navigating
    const currentParams = window.location.search;
    window.location.href = "./" + url + ".html" + currentParams;
}

document.querySelectorAll(".bottom_element_grid").forEach((element) => {
    element.addEventListener('click', () => {
        const page = element.getAttribute("send");
        sendTo(page);
    });
});

function getMobileOperatingSystem() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/windows phone/i.test(userAgent)) return 1;
    if (/android/i.test(userAgent)) return 2;
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) return 3;
    return 4;
}

if (getMobileOperatingSystem() == 2){
    document.querySelector(".bottom_bar").style.height = "70px";
}