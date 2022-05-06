const newContactForm = document.querySelector("#newContactForm");

document.addEventListener("DOMContentLoaded", () =>
{
    newContactForm.addEventListener("submit", onNewContactSubmit);
});


async function onNewContactSubmit(e)
{
    e.preventDefault();

    // Generate form
    const newContactData = new FormData(newContactForm);

    // Send new contact data
    try
    {
        const api = await fetch(`${window.location.href}contact/new`,
        {
            method: "POST",
            body: newContactData
        });

        const response = await api.text();
        console.log(response);
    }
    catch
    {

    }
}