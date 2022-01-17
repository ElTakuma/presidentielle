function redirectToHome() {
    window.location='/users';
}

function goToEditPage(code, id) {
    let codePrompt = prompt('Veillez entrer le code pour editer');

    if (codePrompt === code) {
        window.location='/users/edit/'+id;
    } else {
        alert ('le code saisis est incorrect')
    }

}