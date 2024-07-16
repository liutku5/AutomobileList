let form = document.querySelector("#createAutomobileForm");
let formBtn = document.querySelector("#formBtn");
let alertsContainer = document.querySelector("#alerts");
let baseUrl = "http://127.0.0.1";
let port = ":8000";

form.addEventListener("submit", createAutomobile);
getAutomobiles();

function createAutomobile(event) {
    event.preventDefault();
    const form = event.target;
    const formData = {};
    for (let field of form.elements) {
        if (field.name) {
            formData[field.name] = field.value;
        }
    }
    fetch(`${baseUrl}${port}/createAutomobile`, {
        method: "POST",
        body: JSON.stringify(formData)
    })
        .then(response => {
            if (response.ok) {
                showAlert("created");
                form.reset();
                getAutomobiles();
            }
        })
}

function getAutomobiles() {
    fetch(`${baseUrl}${port}/getAutomobiles`)
        .then(response => response.json())
        .then(data => {
            fillTable(data);
        })
}

function fillTable(data) {
    let tbody = document.querySelector("#tbody");
    let HTML = "";
    let counter = 1;
    data.forEach(auto => {
        HTML += `<tr>
                    <td>${counter++}</td>
                    <td>${auto.manufacturer}</td>
                    <td>${auto.model}</td>
                    <td>${auto.releaseYear}</td>
                    <td>
                        <a href="" automobileId="${auto.id}"class="btn btn-sm btn-primary update"><i class="fas fa-edit"></i> Edit</a>
                        <a href="" automobileId="${auto.id}" class="btn btn-sm btn-danger delete"><i class="fas fa-trash-alt"></i> Delete</a>
                    </td>
                </tr>`;
});
    tbody.innerHTML = HTML;
    addEventListenersOnDelete();
    addEventListenersOnUpdate();
}

function addEventListenersOnUpdate() {
    let updateBtns = document.querySelectorAll(".update");
    updateBtns.forEach(btn => {
        btn.addEventListener("click", function (event) {
            event.preventDefault();
            editAutomobile(btn.getAttribute("automobileId"));
            window.scrollTo(0, 0);
        })
    });
}

function addEventListenersOnDelete() {
    let deleteBtns = document.querySelectorAll(".delete");
    deleteBtns.forEach(btn => {
        btn.addEventListener("click", function (event) {
            deleteAutomobile(btn.getAttribute("automobileId"));
        })
    });
}

function deleteAutomobile(automobileId) {
    event.preventDefault();
    const formData = { "id": automobileId };
    fetch(`${baseUrl}${port}/deleteAutomobile`, {
        method: "POST",
        body: JSON.stringify(formData)
    })
        .then(response => {
            if (response.ok) {
                showAlert("deleted");
                getAutomobiles();
            }
        })
    window.scrollTo(0, 0);
}

function editAutomobile(id) {
    toggleForm(true);
    getAutomobile(id);
}

function getAutomobile(id) {
    fetch(`${baseUrl}${port}/getAutomobile?id=${id}`)
        .then(response => response.json())
        .then(data => {
            fillForm(data);
        })
}

function fillForm(auto) {
    document.querySelector("#manufacturer").value = auto.manufacturer;
    document.querySelector("#model").value = auto.model;
    document.querySelector("#releaseYear").value = auto.releaseYear;
    document.querySelector("#id").value = auto.id;
}

function updateAutomobile(event) {
    event.preventDefault();
    const form = event.target;
    const formData = {};
    for (let field of form.elements) {
        if (field.name) {
            formData[field.name] = field.value;
        }
    }
    fetch(`${baseUrl}${port}/updateAutomobile`, {
        method: "POST",
        body: JSON.stringify(formData)
    })
        .then(response => {
            if (response.ok) {
                showAlert("updated");
                form.reset();
                getAutomobiles();
                toggleForm(false);
            }
        })
}

function toggleForm(state) {
    formBtn.classList.toggle("btn-success");
    formBtn.classList.toggle("btn-primary");
    document.querySelector("#id").value = "";
    if (state) {
        formBtn.innerText = "Update";
        form.removeEventListener("submit", createAutomobile);
        form.addEventListener("submit", updateAutomobile);

    } else {
        formBtn.innerText = "Save";
        form.removeEventListener("submit", updateAutomobile);
        form.addEventListener("submit", createAutomobile);
    }
}

function showAlert(status) {
    alertsContainer.innerHTML = `
        <div class="alert alert-success">
            <strong>Success!</strong> Automobile successfully ${status}.
        </div>
    `;
    setTimeout(() => {
        alertsContainer.innerHTML = ''; // Clear the alert message
    }, 3000);
}
