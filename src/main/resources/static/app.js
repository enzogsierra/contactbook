const newContactForm = document.querySelector("form#newContactForm");
const contactsTable = document.querySelector("#contactsTable");
const searchInput = document.querySelector("input#searchContact");
let avatarSourceUrl = "";


document.addEventListener("DOMContentLoaded", async function()
{
    newContactForm.addEventListener("submit", onNewContactSubmit);
    contactsTable.addEventListener("click", onContactsTableClick);
    searchInput.addEventListener("input", searchContact);
    avatarSourceUrl = await getAvatarSourceUrl();
});



// New contact form handler
async function onNewContactSubmit(e)
{
    e.preventDefault();

    newContactForm.querySelectorAll("p[id^='error-']").forEach(p => { p.classList.add("d-none") }); // Default - hide all error messages

    // Send form data
    const contact = new FormData(newContactForm); // Store form data
    const api = await fetch(`${window.location.href}contact/save`, // Send form data to ApiController
    {
        method: "POST",
        body: contact
    });
    const response = await api.json(); // Parse response to json

    if(response.statusCode == 200) // OK
    {
        addContactToTable(
            response.id,
            contact.get("name"),
            contact.get("surname"),
            contact.get("phone"),
            contact.get("email"),
            contact.get("address"),
            response.avatarUrl,
        );

        Swal.fire(
        {
            position: 'top-end',
            icon: 'success',
            title: 'New contact added successfully',
            showConfirmButton: false,
            timer: 1000
        });

        // Reset form
        newContactForm.reset();
        document.querySelector("button#newContactBtn").click(); // Hide "new contact" form
    }
    else // Error
    {
        for(const [key, value] of Object.entries(response)) // Loop over response keys
        {
            const field = key.toString(); // Parse key (field) to string
            if(!field.includes("error-")) continue; // If its not a "error" field

            const p = newContactForm.querySelector(`p#${field}`); // Select the element that shows error message
            p.textContent = value; // Element's text content is now the error message
            p.classList.remove("d-none"); // Show element
        }
    }
}



// Contacts table handler
let isEditing = false;
let originalHtml = "";

async function onContactsTableClick(e)
{
    // SHOW AVATAR
    if(e.target.nodeName === "IMG" && e.target.className === "avatar") 
    {
        const imgUrl = e.target.src; // Get img source
        const imgTitle = e.target.alt; // Get img alternative text

        Swal.fire(
        {
            title: imgTitle,
            imageUrl: imgUrl,
            imageWidth: 480,
            imageHeight: 480,
        });
    }


    // EDIT CONTACT
    if(e.target.nodeName === "BUTTON" && e.target.id === "btn-edit-contact")
    {
        const tr = e.target.parentElement.parentElement.parentElement.parentElement; // Get <tr> element
        
        // Avoid multicontact editing
        if(isEditing)
        {
            document.querySelector("#edit-btn-cancel").click(); // It will call "cancelBtn.onclick"
        }

        // Get fields values
        const id = tr.getAttribute("contact-id");
        const name = tr.querySelector("td>span#contact-name").textContent;
        const surname = tr.querySelector("td>span#contact-surname").textContent;
        const phone = tr.querySelector("td>a#contact-phone").textContent;
        const email = tr.querySelector("td>a#contact-email").textContent;
        const address = tr.querySelector("td#contact-address").textContent;

        //
        isEditing = true;
        originalHtml = tr.innerHTML; // Save original html in case user clicks on cancel button

        tr.innerHTML =
        `
            <input type="hidden" name="id" value="${id}">

            <td class="text-center">
                <input type="file" class="form-control" name="avatarFile">
                <small>Change Avatar</small>
            </td>

            <td>
                <input type="text" class="form-control d-inline" name="name" value="${name}" placeholder="Name" required>
                <p id="error-name" class="d-none m-0 form-text text-danger"></p>
                <input type="text" class="form-control d-inline mt-1" name="surname" value="${surname}" placeholder="Surname" required>
                <p id="error-surname" class="d-none m-0 form-text text-danger"></p>
            </td>

            <td>
                <input type="text" class="form-control" name="phone" value="${phone}" placeholder="Phone number" required>
                <p id="error-phone" class="m-0 form-text text-danger"></p>
            </td>

            <td>
                <input type="email" class="form-control" name="email" value="${email}" placeholder="Email address">
            </td>

            <td>
                <input type="text" class="form-control" name="address" value="${address}" placeholder="Address">
            </td>

            <td class="d-flex flex-column gap-1">
                <button type="button" class="w-100 btn btn-primary" id="edit-btn-save">Save</button>
                <button type="button" class="w-100 btn btn-outline-secondary" id="edit-btn-cancel">Cancel</button>
            </td>
        `;


        // Save/Cancel buttons
        const saveBtn = tr.querySelector("#edit-btn-save");
        const cancelBtn = tr.querySelector("#edit-btn-cancel");

        // Save button
        saveBtn.onclick = async function(e)
        {
            e.preventDefault();
            tr.querySelectorAll("p[id^='error-']").forEach(p => { p.classList.add("d-none") }); // Default - hide all error messages

            // Get form data
            const avatarFile = tr.querySelector("input[name='avatarFile']").files[0] || new File([""], "filename"); // Create an empty file object if there's no avatar update
            const name = tr.querySelector("input[name='name']").value.trim();
            const surname = tr.querySelector("input[name='surname']").value.trim();
            const phone = tr.querySelector("input[name='phone']").value.trim();
            const email = tr.querySelector("input[name='email']").value.trim();
            const address = tr.querySelector("input[name='address']").value.trim();
            
            // Generate form
            const form = new FormData();
            form.append("id", id);
            form.append("name", name);
            form.append("surname", surname);
            form.append("phone", phone);
            form.append("email", email);
            form.append("address", address);
            form.append("avatarFile", avatarFile);

            // Send fetch
            const api = await fetch(`${window.location.href}contact/edit`,
            {
                method: "PUT",
                body: form
            });

            // Check status code
            const response = await api.json(); 
            if(response.statusCode == 200) // Success
            {
                tr.remove(); // Remove old contact from table (<tr> element)
                addContactToTable
                (
                    id, 
                    name,
                    surname,
                    phone,
                    email,
                    address,
                    response.avatarUrl
                ); // Add updated contact to table

                Swal.fire(
                {
                    position: 'top-end',
                    icon: 'success',
                    title: 'Contact updated',
                    showConfirmButton: false,
                    timer: 1000
                });

                // Reset values
                isEditing = false;
                originalHtml = "";
            }
            else if(response.statusCode == 400) // Contact doesnt exists
            {
                cancelBtn.click(); // Hide edit form

                Swal.fire(
                {
                    icon: 'error',
                    title: 'Oops!',
                    html: "This contact doesn't exists anymore, page will reload in 2 seconds...",
                    timer: 2000,
                    timerProgressBar: true
                }).then(_ => 
                {
                    window.location.reload();
                });
            }
            else // Form validation error
            {
                for(const [key, value] of Object.entries(response)) // Loop over response keys
                {
                    const field = key.toString(); // Parse key (field) to string
                    if(!field.includes("error-")) continue; // If its not a "error" field

                    const p = tr.querySelector(`p#${field}`); // Select the element that shows error message
                    p.textContent = value; // Element's text content is now the error message
                    p.classList.remove("d-none"); // Show element
                }
            }
        }

        // Cancel button
        cancelBtn.onclick = function(e)
        {
            tr.innerHTML = originalHtml;
            isEditing = false;
        }
    }


    // DELETE CONTACT
    if(e.target.nodeName === "BUTTON" && e.target.id === "btn-delete-contact")
    {
        const tr = e.target.parentElement.parentElement.parentElement.parentElement; // Get <tr>
        const id = tr.getAttribute("contact-id"); // Get contact id
        const name = tr.querySelector("td>span#contact-name").textContent + " " + tr.querySelector("td>span#contact-surname").textContent; // Get contact name

        // Show alert confirmation
        Swal.fire
        ({
            title: `Delete ${name}?`,
            text: "You are about to delete this contact, this action cannot be reverted!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then(async (result) => // Response
        {
            if(result.isConfirmed) // "Yes"
            {
                // Generate form
                const form = new FormData()
                form.append("id", id); // Append contact id

                // Send fetch
                const api = await fetch(`${window.location.href}contact/delete`,
                {
                    method: "DELETE",
                    body: form
                });

                // Check status code
                const response = await api.text(); 
                if(response == 200) // Contact deleted
                {
                    tr.remove(); // Remove <tr> element

                    Swal.fire(
                    {
                        position: 'top-end',
                        icon: 'success',
                        title: 'Contact deleted successfully',
                        showConfirmButton: false,
                        timer: 1000
                    });
                }
                else // Error
                {
                    Swal.fire(
                    {
                        icon: 'error',
                        title: 'Oops!',
                        html: "Contact couldn't be deleted, page will reload in 2 seconds...",
                        timer: 2000,
                        timerProgressBar: true
                    })
                    .then(_ => 
                    {
                        window.location.reload();
                    });
                }
            }
        });
    }
}


function searchContact()
{
    const text = searchInput.value;

    const exp = new RegExp(text, "i");
    const rows = document.querySelectorAll("#contactsTable tr");

    rows.forEach(row =>
    {
        row.style.display = "none"; // Hide row by default

        const name = row.querySelector("#contact-name").textContent + " " + row.querySelector("#contact-surname").textContent;
        if(name.replace(/\s/g, " ").search(exp) !== -1)
        {
            row.style.display = "table-row";
        }
    });
}


function addContactToTable(id, name, surname, phone, email, address, avatarUrl)
{
    const tr = document.createElement("TR");
    tr.setAttribute("contact-id", `${id}`);

    // Generate HTML
    tr.innerHTML =
    `
        <!-- Avatar -->
        <td class="text-center">
            <img 
                src="${avatarSourceUrl}${avatarUrl}"
                alt="${name} + ' ' + ${surname} + '\'s avatar'"
                class="avatar"
            >
        </td>

        <!-- Full name -->
        <td>
            <span id="contact-name">${name}</span>
            <span id="contact-surname">${surname}</span>
        </td>

        <!-- Phone number -->
        <td>
            <a href="tel:${phone}" id="contact-phone">${phone}</a>
        </td>

        <!-- Email -->
        <td>
            <a href="mailto:${email}" id="contact-email">${email}</a>
        </td>

        <!-- Address -->
        <td id="contact-address">${address}</td>

        <!-- Action buttons -->
        <td class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" role="button" id="dropdownContactHandler" data-bs-toggle="dropdown" aria-expanded="false"></button>
            
            <ul class="dropdown-menu" aria-labelledby="dropdownContactHandler">
                <li><button class="dropdown-item" id="btn-edit-contact">Edit</button></li>
                <li><button class="dropdown-item" id="btn-delete-contact">Delete</button></li>
            </ul>
        </td>
    `;

    contactsTable.appendChild(tr); // Append new contact to contact table list
    sortContactList();
}




// Sorts contact list by name
function sortContactList()
{
    const body = document.querySelector("tbody#contactsTable");
    const rows = Array.from(body.querySelectorAll("tr")); // Create an array with all <tr> elements

    // Sort 
    let sortedList = rows.sort((a, b) =>
    {
        const aVal = a.querySelector("span#contact-name").textContent.trim() + " " + a.querySelector("span#contact-surname").textContent.trim(); // Get full name
        const bVal = b.querySelector("span#contact-name").textContent.trim() + " " + b.querySelector("span#contact-surname").textContent.trim();
        return aVal > bVal ? (1) : (-1); // Compare
    });
    
    // Empty the table body
    while(body.firstChild)
    {
        body.removeChild(body.firstChild);
    }
    
    // Append the sorted list (<tr>)
    body.append(...sortedList);
}


// Fetch avatar source url - from ApiController
async function getAvatarSourceUrl()
{
    const api = await fetch(`${window.location.href}contact/getAvatarSourceUrl`, {method: "POST"});
    return await api.text();
}