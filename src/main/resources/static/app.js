const newContactForm = document.querySelector("#newContactForm");

document.addEventListener("DOMContentLoaded", () =>
{
    newContactForm.addEventListener("submit", onNewContactSubmit);
});


async function onNewContactSubmit(e)
{
    e.preventDefault();

    // Get inputs values
    const name = newContactForm.querySelector("input#name").value;
    const lastName = newContactForm.querySelector("input#lastName").value;
    const phoneNumber = newContactForm.querySelector("input#phoneNumber").value;
    const email = newContactForm.querySelector("input#email").value;
    const address = newContactForm.querySelector("input#address").value;

    // Create form
    /*const form = new FormData();
    form.append("name", name.value);
    form.append("lastName", lastName.value);
    form.append("phoneNumber", phoneNumber.value);
    form.append("email", email.value);
    form.append("address", address.value);*/

    // Send form data
    try
    {
        const api = await fetch(`${window.location.href}contact/new`,
        {
            method: "POST",
            headers:
            {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
            {
                name: name,
                lastName: lastName,
                phoneNumber: phoneNumber,
                email: email,
                address: address
            })
        });
        const response = await api.text();
        console.log(response);
    }
    catch
    {

    }
}