var modal = document.getElementById("myModal");
var btn = document.querySelector(".open-button");
var span = document.querySelector(".close");
btn.onclick = function() {
    modal.classList.add("show");
}
span.onclick = function() {
    closeModal();
}
window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
}
function closeModal() {
    modal.classList.remove("show");
}