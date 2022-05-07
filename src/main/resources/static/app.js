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

    // Send new contact data
    try
    {
        // Get form data
        const newContactData = new FormData(newContactForm);

        // Send form data
        const api = await fetch(`${window.location.href}contact/new`,
        {
            method: "POST",
            body: newContactData
        });


        // Check responses
        const response = await api.text();
        if(response == 200) // OK - contact added
        {
            newContactForm.reset(); // Reset form data
            document.querySelector("button#newContactBtn").click(); // Hide "new contact" form

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
    catch
    {
        Swal.fire(
        {
            icon: 'error',
            title: 'An error ocurred',
            text: 'Sorry, there was an internal error. Try again later.'
        });
    }
}


// Contacts table handler
function onContactsTableClick(e)
{

    // Check if user clicked on a contact avatar
    if(e.target.nodeName === "IMG" && e.target.className === "avatar") 
    {
        const imgUrl = e.target.src;
        const imgTitle = e.target.alt;

        console.log(imgUrl);
        console.log(imgTitle);

        Swal.fire(
        {
            title: imgTitle,
            imageUrl: imgUrl,
            imageWidth: 480,
            imageHeight: 480,
        });
    }
}