const registerBtn = document.querySelector('#register-btn');
const loginBtn = document.querySelector('#login-btn');
const homeBtn = document.querySelector('#home-btn');
const registerForm = document.querySelector('#register-form');
const loginForm = document.querySelector('#login-fomr');
const registerBox = document.querySelector('#register-box');
const loginBox = document.querySelector('#login-box');
let container = document.querySelector('.container');

let personId = "";


window.onload = () => {
    setButtons();
}

const setButtons = () => {
    registerBtn.addEventListener('click', () => {
        registerBox.style.display = 'block';
        loginBox.style.display = 'none';
        registration();
    });

    loginBtn.addEventListener('click', () => {
        registerBox.style.display = 'none';
        loginBox.style.display = 'block';
    });

    homeBtn.addEventListener('click', () => {
        registerBox.style.display = 'none';
        loginBox.style.display = 'none';
    });
}


const registration = () => {
    registerForm.addEventListener('submit', (event) => {
        event.preventDefault();
        let messageTag = registerForm.querySelector('.message');
        const name = registerForm.querySelector('#name-inp-reg').value;
        const password = registerForm.querySelector('#pass-inp-reg').value;
        const email = registerForm.querySelector('#email-inp-reg').value;

        fetch("https://localhost:7171/api/Auth", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "userName": name,
                "password": password,
                "email": email
            })
        })
            .then(res => {
                if (!res.ok) {
                    toastr.warning('Error');

                } else {
                    toastr.success(`User created!`);

                }

            })
            .catch(err => {
                console.log(err);
            })
    })
}

const resetForm = (form) => {

}
