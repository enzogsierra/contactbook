const newContactForm = document.querySelector("#newContactForm");
const contactsTable = document.querySelector("table>tbody#contactsTable");
const searchInput = document.querySelector("input#searchContact");


document.addEventListener("DOMContentLoaded", () =>
{
    newContactForm.addEventListener("submit", onNewContactSubmit);
    contactsTable.addEventListener("click", onContactsTableClick);
    searchInput.addEventListener("input", searchContact);

    sortContactList();
});


// New contact form handler
async function onNewContactSubmit(e)
{
    e.preventDefault();

    // Get form data
    const newContactData = new FormData(newContactForm);

    // Send form data
    const api = await fetch(`${window.location.href}contact/new`,
    {
        method: "POST",
        body: newContactData
    });

    // Check status code
    const response = await api.json();
    if(response.statusCode == 200) // OK - contact added
    {
        newContactForm.reset(); // Reset form data
        document.querySelector("button#newContactBtn").click(); // Hide "new contact" form

        // Add contact to contact list
        addContactToTable
        (
            response.id, 
            newContactData.get("name"),
            newContactData.get("lastName"),
            newContactData.get("phoneNumber"),
            newContactData.get("email"),
            newContactData.get("address"),
            response.avatarUrl
        );
        

        Swal.fire(
        {
            position: 'top-end',
            icon: 'success',
            title: 'New contact added successfully',
            showConfirmButton: false,
            timer: 1000
        });
    }
    else // Error
    {
        Swal.fire(
        {
            icon: 'error',
            title: 'An error ocurred',
            text: 'Check the data and try again'
        });
    }
}


let isEditing = false;
let originalHtml = "";

// Contacts table handler
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
        const tr = e.target.parentElement.parentElement.parentElement.parentElement; // Get <tr>
        const id = tr.getAttribute("contact-id"); // Get contact id

        // Avoid multicontact editing
        if(isEditing)
        {
            document.querySelector("#edit-btn-cancel").click(); // It will call "cancelBtn.onclick"
        }

        // Get fields values
        const name = tr.querySelector("td>span#contact-name").textContent;
        const lastName = tr.querySelector("td>span#contact-lastName").textContent;
        const phoneNumber = tr.querySelector("td>a#contact-phoneNumber").textContent;
        const email = tr.querySelector("td>a#contact-email").textContent;
        const address = tr.querySelector("td#contact-address").textContent;

        //
        isEditing = true;
        originalHtml = tr.innerHTML; // Save original html in case user clicks on cancel button

        tr.innerHTML =
        `
            <input type="hidden" name="id" value="${id}">

            <td class="text-center">
                <input type="file" class="form-control" name="avatarFile" value="Enzo">
                <small>Change Avatar</small>
            </td>

            <td>
                <input type="text" name="name" class="form-control d-inline mb-1" value="${name}" placeholder="Name" required>
                <input type="text" name="lastName" class="form-control d-inline" value="${lastName}" placeholder="Last name" required>
            </td>

            <td>
                <input type="text" name="phoneNumber" class="form-control" value="${phoneNumber}" placeholder="Phone number" required>
            </td>

            <td>
                <input type="email" name="email" class="form-control" value="${email}" placeholder="Email address">
            </td>

            <td>
                <input type="text" name="address" class="form-control" value="${address}" placeholder="Address">
            </td>

            <td class="d-flex flex-column gap-1">
                <button type="button" class="w-100 btn btn-primary" id="edit-btn-save">Save</button>
                <button type="button" class="w-100 btn btn-outline-secondary" id="edit-btn-cancel">Cancel</button>
            </td>
        `;


        // Save/Cancel buttons
        const saveBtn = tr.querySelector("#edit-btn-save");
        const cancelBtn = tr.querySelector("#edit-btn-cancel");

        // Save
        saveBtn.onclick = async function(e)
        {
            e.preventDefault();

            // Get form data
            const avatarFile = tr.querySelector("input[name='avatarFile']").files[0] || new File([""], "filename"); // Create an empty file object if there's no avatar update
            const name = tr.querySelector("input[name='name']").value.trim();
            const lastName = tr.querySelector("input[name='lastName']").value.trim();
            const phoneNumber = tr.querySelector("input[name='phoneNumber']").value.trim();
            const email = tr.querySelector("input[name='email']").value.trim();
            const address = tr.querySelector("input[name='address']").value.trim();
            
            // Generate form
            const form = new FormData();
            form.append("id", id);
            form.append("avatarFile", avatarFile);
            form.append("name", name);
            form.append("lastName", lastName);
            form.append("phoneNumber", phoneNumber);
            form.append("email", email);
            form.append("address", address);

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
                tr.remove(); // Remove <tr> element
                addContactToTable
                (
                    id, 
                    name,
                    lastName,
                    phoneNumber,
                    email,
                    address,
                    response.avatarUrl
                );

                Swal.fire(
                {
                    position: 'top-end',
                    icon: 'success',
                    title: 'Contact updated',
                    showConfirmButton: false,
                    timer: 1000
                });
            }
            else // Error
            {
                Swal.fire(
                {
                    icon: 'error',
                    title: 'An error ocurred',
                    text: "Contact couldn't be updated, try reloading page"
                });
            }

            // Reset values
            isEditing = false;
            originalHtml = "";
        }

        // Cancel
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
        const name = tr.querySelector("td>span#contact-name").textContent + " " + tr.querySelector("td>span#contact-lastName").textContent; // Get contact name

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
        })
        .then(async (result) =>
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
                        title: 'Contact deleted',
                        showConfirmButton: false,
                        timer: 1000
                    });
                }
                else // Error
                {
                    Swal.fire(
                    {
                        icon: 'error',
                        title: 'An error ocurred',
                        text: "Contact couldn't be deleted, try reloading page"
                    });
                }
            }
        })
    }
}


function addContactToTable(id, name, lastName, phoneNumber, email, address, avatarUrl)
{
    // Create element
    const tr = document.createElement("TR");
    tr.setAttribute("contact-id", `${id}`);

    // Generate HTML
    tr.innerHTML =
    `
        <!-- Avatar -->
        <td class="text-center">
            <img src="images/${avatarUrl}" class="avatar" alt="${name} ${lastName}'s avatar">
        </td>

        <!-- Full name -->
        <td>
            <span id="contact-name">${name}</span>
            <span id="contact-lastName">${lastName}</span>
        </td>

        <!-- Phone number -->
        <td>
            <a href="tel:${phoneNumber}" id="contact-phoneNumber">${phoneNumber}</a>
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
                <li>
                    <button class="dropdown-item" id="btn-edit-contact">Edit</button>
                </li>
                <li>
                    <button class="dropdown-item" id="btn-delete-contact">Delete</button>
                </li>
            </ul>
        </td>
    `;

    // Append
    contactsTable.appendChild(tr);
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
        const aVal = a.querySelector("span#contact-name").textContent.trim() + " " + a.querySelector("span#contact-lastName").textContent.trim(); // Get full name
        const bVal = b.querySelector("span#contact-name").textContent.trim() + " " + b.querySelector("span#contact-lastName").textContent.trim();
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


function searchContact()
{
    const text = searchInput.value;

    const exp = new RegExp(text, "i");
    const rows = document.querySelectorAll("#contactsTable tr");

    rows.forEach(row =>
    {
        row.style.display = "none"; // Hide row by default

        const name = row.querySelector("#contact-name").textContent + " " + row.querySelector("#contact-lastName").textContent;
        if(name.replace(/\s/g, " ").search(exp) !== -1)
        {
            row.style.display = "table-row";
        }
    });
}