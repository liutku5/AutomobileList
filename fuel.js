let form = document.querySelector("#createFuelTypeForm");
let formBtn = document.querySelector("#formBtn");
let alertsContainer = document.querySelector("#alerts");
let baseUrl = "http://127.0.0.1";
let port = ":8000";

form.addEventListener("submit", createFuelType);
getFuelTypes();

function createFuelType(event) {
    event.preventDefault();
    const form = event.target;
    const formData = {};
    for (let field of form.elements) {
        if (field.name) {
            formData[field.name] = field.value;
        }
    }
    fetch(`${baseUrl}${port}/createFuelType`, {
        method: "POST",
        body: JSON.stringify(formData)
    })
        .then(response => {
             if (data.id) {
                showAlert(`created fuel type`);
                form.reset();
                getFuelTypes();
             } 
        })
}

function getFuelTypes() {
    fetch(`${baseUrl}${port}/getFuelTypes`)
        .then(response => response.json())
        .then(data => {
            fillTable(data);
        })
}

function fillTable(data) {
    let tbody = document.querySelector("#tbody");
    let HTML = "";
    let counter = 1;
    data.forEach(fuelType => {
        HTML += `<tr>
                    <td>${counter++}</td>
                    <td>${fuelType.type}</td>
                    <td>
                        <a href="" fuelTypeId="${fuelType.id}" class="btn btn-sm btn-primary update"><i class="fas fa-edit"></i> Edit</a>
                        <a href="" fuelTypeId="${fuelType.id}" class="btn btn-sm btn-danger delete"><i class="fas fa-trash-alt"></i> Delete</a>
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
            editFuelType(btn.getAttribute("fuelTypeId"));
            window.scrollTo(0, 0);
        });
    });
}

function addEventListenersOnDelete() {
    let deleteBtns = document.querySelectorAll(".delete");
    deleteBtns.forEach(btn => {
        btn.addEventListener("click", function (event) {
            deleteFuelType(btn.getAttribute("fuelTypeId"));
        });
    });
}

function deleteFuelType(fuelTypeId) {
    const formData = { "id": fuelTypeId };
    fetch(`${baseUrl}${port}/deleteFuelType`, {
        method: "POST",
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (response.ok) {
            showAlert("Fuel Type deleted successfully");
            getFuelTypes();
        } 
    })
    window.scrollTo(0, 0);
}

function editFuelType(id) {
    toggleForm(true);
    getFuelType(id);
}

function getFuelType(id) {
    fetch(`${baseUrl}${port}/getFuelType?id=${id}`)
        .then(response => response.json())
        .then(data => {
            fillForm(data);
        })
}

function fillForm(fuelType) {
    document.querySelector("#type").value = fuelType.type;
    document.querySelector("#id").value = fuelType.id;
}

function updateFuelType(event) {
    event.preventDefault();
    const form = event.target;
    const formData = {};
    for (let field of form.elements) {
        if (field.name) {
            formData[field.name] = field.value;
        }
    }
    fetch(`${baseUrl}${port}/updateFuelType`, {
        method: "POST",
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (response.ok) {
            showAlert("Fuel Type updated successfully");
            form.reset();
            getFuelTypes();
            toggleForm(false);
        } 
    })
    .catch(error => showAlert(`Error: ${error.message}`));
}

function toggleForm(state) {
    formBtn.classList.toggle("btn-success");
    formBtn.classList.toggle("btn-primary");
    document.querySelector("#id").value = "";
    if (state) {
        formBtn.innerText = "Update";
        form.removeEventListener("submit", createFuelType);
        form.addEventListener("submit", updateFuelType);
    } else {
        formBtn.innerText = "Save";
        form.removeEventListener("submit", updateFuelType);
        form.addEventListener("submit", createFuelType);
    }
}

function showAlert(message) {
    alertsContainer.innerHTML = `<div class="alert alert-success">${message}</div>`;
    setTimeout(() => {
        alertsContainer.innerHTML = ''; 
    }, 3000);
}
