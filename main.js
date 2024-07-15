$(document).ready(function() {
    function fetchAutomobiles() {
        $.get("http://localhost:8000/getAutomobiles", function(data) {
            const automobiles = JSON.parse(data);
            const tableBody = $("#automobileTable tbody");
            tableBody.empty();
            automobiles.forEach(auto => {
                tableBody.append(`
                    <tr>
                        <td>${auto.id}</td>
                        <td>${auto.manufacturer}</td>
                        <td>${auto.model}</td>
                        <td>${auto.releaseYear}</td>
                        <td>
                            <button class="btn btn-warning btn-sm edit-btn" data-id="${auto.id}">Edit</button>
                            <button class="btn btn-danger btn-sm delete-btn" data-id="${auto.id}">Delete</button>
                        </td>
                    </tr>
                `);
            });

            // Attach click handlers for edit and delete buttons
            $(".edit-btn").click(function() {
                const id = $(this).data("id");
                // Load the automobile data into a form for editing
                // Implement your edit form logic here
            });

            $(".delete-btn").click(function() {
                const id = $(this).data("id");
                $.ajax({
                    url: "http://localhost:8000/deleteAutomobile",
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(id),
                    success: function(response) {
                        alert("Automobile deleted successfully!");
                        fetchAutomobiles();
                    },
                    error: function(error) {
                        console.error("There was an error deleting the automobile:", error);
                    }
                });
            });
        });
    }

    // Fetch automobiles on page load
    fetchAutomobiles();

    // Handle form submission
    $("#createForm").submit(function(event) {
        event.preventDefault();
        const manufacturer = $("#manufacturer").val();
        const model = $("#model").val();
        const releaseYear = $("#releaseYear").val();

        const newAutomobile = {
            manufacturer: manufacturer,
            model: model,
            releaseYear: parseInt(releaseYear)
        };

        $.ajax({
            url: "http://localhost:8000/createAutomobile",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(newAutomobile),
            success: function(response) {
                alert("Automobile created successfully!");
                fetchAutomobiles();
                $("#createForm")[0].reset();
            },
            error: function(error) {
                console.error("There was an error creating the automobile:", error);
            }
        });
    });
});