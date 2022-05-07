const newContactForm = document.querySelector("#newContactForm");
const contactsTable = document.querySelector("table>tbody#contactsTable");


document.addEventListener("DOMContentLoaded", () =>
{
    newContactForm.addEventListener("submit", onNewContactSubmit);
    contactsTable.addEventListener("click", onContactsTableClick);
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
            newContactData.get("name") + " " + newContactData.get("lastName"),
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


// Contacts table handler
async function onContactsTableClick(e)
{
    // User clicked on a contact avatar
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

    // User clicked on edit button
    if(e.target.nodeName === "BUTTON" && e.target.id === "btn-edit-contact")
    {
        //const id = e.target.parentElement.querySelector("input#hidden-contact-id").value; // Get contact id

        let html = "";


    }

    if(e.target.nodeName === "BUTTON" && e.target.id === "btn-delete-contact")
    {
        const tr = e.target.parentElement.parentElement.parentElement.parentElement; // Get <tr>
        const id = tr.getAttribute("contact-id"); // Get contact id
        const name = tr.querySelector("td#contact-name").innerText; // Get contact name

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


function addContactToTable(id, fullName, phoneNumber, email, address, avatarUrl)
{
    // Create element
    const tr = document.createElement("TR");
    tr.setAttribute("contact-id", `${id}`);

    // Generate HTML
    let html = "";
    html += `<td class="text-center">`;
    html += `   <img src="images/${avatarUrl}" class="avatar" alt="${fullName}'s avatar">`;
    html += `</td>`;

    html += `<td id="contact-name">${fullName}</td>`;

    html += `<td id="contact-phoneNumber">`;
    html += `   <a href="tel:${phoneNumber}">${phoneNumber}</a>`;
    html += `</td>`;

    html += `<td id="contact-email">`;
    html += `   <a href="mailto:${email}">${email}</a>`;
    html += `</td>`;

    html += `<td id="contact-address">${address}</td>`;

    html += `<td class="dropdown">`;
    html += `   <a class="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownContactHandler" data-bs-toggle="dropdown" aria-expanded="false"></a>`;
    html += `   <ul class="dropdown-menu" aria-labelledby="dropdownContactHandler">`;
    html += `       <li>`;
    html += `           <button class="dropdown-item" id="btn-edit-contact">Edit</button>`;
    html += `       </li>`;
    html += `       <li>`;
    html += `           <button class="dropdown-item" id="btn-delete-contact">Delete</button>`;
    html += `       </li>`;
    html += `   </ul>`;
    html += `</td>`;

    tr.innerHTML = html;

    // Append
    contactsTable.appendChild(tr);
}
