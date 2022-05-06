const newContactForm = document.querySelector("#newContactForm");

document.addEventListener("DOMContentLoaded", () =>
{
    newContactForm.addEventListener("submit", onNewContactSubmit);
});


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

            alert("Contact added successfully!"); // Show alert
        }
    }
    catch
    {

    }
}