function includeHTML() {
    const headerDiv = document.getElementById("headerDiv");
    const footerDiv = document.getElementById("footerDiv");

    if (headerDiv) {
        fetch("layout/header.html")
            .then(response => response.text())
            .then(data => {
                headerDiv.innerHTML = data;
            })
            .catch(error => {
                console.error('Error fetching header:', error);
            });
    }

    if (footerDiv) {
        fetch("layout/footer.html")
            .then(response => response.text())
            .then(data => {
                footerDiv.innerHTML = data;
            })
            .catch(error => {
                console.error('Error fetching footer:', error);
            });
    }
}

document.addEventListener("DOMContentLoaded", includeHTML);