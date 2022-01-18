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

function goToEditPageFromShow(id) {
     window.location='/users/edit/'+id;
}

function retirerCandidature(id) {
     window.location='/users/exitcourse/'+id;
}

function showCandidate(id) {
     window.location='/users/show/'+id;
}

function confirmCandidate(id) {
    let codePrompt = prompt('Veillez entrer le code pour confirmer votre parrainage');

    if (codePrompt === 'test1234') {
        window.location='/users/confirm/'+id;
    } else {
        alert ('le code saisis est incorrect')
    }

}