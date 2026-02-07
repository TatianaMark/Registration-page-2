const mainTitle = document.getElementById('mainTitle')
const mainText = document.getElementById('main-text')
const labelName = document.getElementById('labelName')
const errorEmptyName = document.getElementById('error-empty-name')
const errorWrongName = document.getElementById('error-wrong-name')
const fullNameInput = document.getElementById('name');
const userNameLabel = document.getElementById('userNameLabel');
const userNameInput = document.getElementById('userName');
const errorEmptyUsername = document.getElementById('error-empty-username');
const errorWrongUserName = document.getElementById('error-wrong-username');
const labelEmail = document.getElementById('labelEmail')
const emailInput = document.getElementById('email')
const errorEmptyEmail = document.getElementById('error-empty-email')
const errorWrongEmail = document.getElementById('error-wrong-email')
const password = document.getElementById('password');
const passwordLabel = document.getElementById('password-label');

const errorEmptyPassword = document.getElementById('error-empty-password');
const errorWrongPassword = document.getElementById('error-wrong-password');
const labelRepeatPassword = document.getElementById('labelRepeatPassword');
const repeatPassword = document.getElementById('repeatPassword');
const errorEmptyRepeatPassword = document.getElementById('error-empty-repeatpassword');
const errorWrongRepeatPassword = document.getElementById('error-wrong-repeatpassword');
const labelAgreement = document.getElementById('labelAgreement')
const agreement = document.getElementById('agreement');
const errorAgreement = document.getElementById('error-agreement');
const submitButton = document.getElementById('submitButton');
const questionLink = document.getElementById('question');
const formRegistration = document.getElementById('signup-form');


const fillNameInputReg = /^[A-Za-zА-Яа-яЁё\\s]+$/;
const userNameInputReg = /^[\p{L}0-9_-]+$/u;
const emailInputReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordInputReg = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]).{8,}$/


const popup = document.getElementById('success-popup');
const closeBtn = document.getElementById('popup-ok-button');

let signIn = false;
let isLoggedIn = false; // Флаг для отслеживания состояния входа

// Функция валидации отдельного поля
function change(input, errorEmpty, errorWrong, reg, uniqCheck = false) {
    let isValid = true;

    if (!input.value && !signIn) {
        errorEmpty.style.display = 'block';
        input.classList.add('form-input-error');
        errorWrong.style.display = 'none';
        isValid = false;
    } else if ((uniqCheck || !input.value.match(reg)) && !signIn) {
        errorWrong.style.display = 'block';
        input.classList.add('form-input-error');
        errorEmpty.style.display = 'none';
        isValid = false;
    } else {
        errorWrong.style.display = 'none';
        errorEmpty.style.display = 'none';
        input.classList.remove('form-input-error');
        isValid = true;
    }

    return isValid;
}

// Новая функция для проверки всей формы регистрации
function validateForm() {
    if (signIn) return true; // Для формы входа используем другую проверку

    // Собираем результаты всех проверок
    const validations = [
        change(fullNameInput, errorEmptyName, errorWrongName, fillNameInputReg),
        change(userNameInput, errorEmptyUsername, errorWrongUserName, userNameInputReg),
        change(emailInput, errorEmptyEmail, errorWrongEmail, emailInputReg),
        change(password, errorEmptyPassword, errorWrongPassword, passwordInputReg),
        change(
            repeatPassword,
            errorEmptyRepeatPassword,
            errorWrongRepeatPassword,
            '',
            password.value !== repeatPassword.value
        )
    ];

    // Проверяем checkbox согласия
    const agreementValid = agreement.checked;
    if (!agreementValid) {
        errorAgreement.style.display = 'block';
    } else {
        errorAgreement.style.display = 'none';
    }

    // Все валидации должны быть true
    return validations.every(result => result === true) && agreementValid;
}

// Проверка формы входа
function checkSignInForm() {
    console.log('Проверка формы входа');

    // Сбрасываем предыдущие ошибки
    errorEmptyUsername.style.display = 'none';
    errorWrongUserName.style.display = 'none';
    errorEmptyPassword.style.display = 'none';
    errorWrongPassword.style.display = 'none';
    userNameInput.classList.remove('form-input-error');
    password.classList.remove('form-input-error');

    let hasErrors = false;

    // Проверка на пустые поля
    if (!userNameInput.value) {
        errorEmptyUsername.style.display = 'block';
        userNameInput.classList.add('form-input-error');
        hasErrors = true;
    }

    if (!password.value) {
        errorEmptyPassword.style.display = 'block';
        password.classList.add('form-input-error');
        hasErrors = true;
    }

    // Проверка формата
    const usernameValid = userNameInput.value.match(userNameInputReg);
    const passwordValid = password.value.match(passwordInputReg);

    if (userNameInput.value && !usernameValid) {
        errorWrongUserName.style.display = 'block';
        userNameInput.classList.add('form-input-error');
        hasErrors = true;
    }

    if (password.value && !passwordValid) {
        errorWrongPassword.style.display = 'block';
        password.classList.add('form-input-error');
        hasErrors = true;
    }

    // Если есть ошибки - возвращаем false
    if (hasErrors) {
        console.log('Ошибки в форме входа');
        return false;
    }

    // Проверка существующего пользователя
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const foundUser = users.find(user =>
        user.userName === userNameInput.value ||
        user.email === userNameInput.value
    );

    if (!foundUser) {
        errorWrongUserName.style.display = 'block';
        userNameInput.classList.add('form-input-error');
        console.log('Пользователь не найден');
        return false;
    }

    // В реальном приложении здесь была бы проверка пароля
    // Для демо просто считаем, что вход успешен
    console.log('Вход успешен для пользователя:', foundUser.fullName);

    // Обновляем интерфейс
    mainTitle.textContent = `Welcome, ${foundUser.fullName}!`;
    mainText.remove();
    userNameLabel.remove();
    userNameInput.remove();
    passwordLabel.remove();
    password.remove();
    submitButton.innerText = 'Exit';
    questionLink.remove();

    // Устанавливаем флаг успешного входа
    isLoggedIn = true;

    return true;
}

// Функция для перезагрузки страницы
function reloadPage() {
    location.reload();
}

// Главный обработчик формы
formRegistration.addEventListener('submit', function(event) {
    event.preventDefault();

    // Если пользователь уже вошел - перезагружаем страницу
    if (isLoggedIn) {
        reloadPage();
        return;
    }

    // Если это форма регистрации
    if (!signIn) {
        const isFormValid = validateForm();

        if (isFormValid) {
            openPopup();
            addUser();
        }
    }
    // Если это форма входа
    else {
        const loginSuccessful = checkSignInForm();

        // После успешного входа следующий клик перезагрузит страницу
        // Это произойдет из-за проверки isLoggedIn в начале функции
    }
});

// Добавление клиента в localStorage
function addUser() {
    let clients;

    const user = {
        fullName: fullNameInput.value,
        userName: userNameInput.value,
        email: emailInput.value,
    };

    if (localStorage.getItem('users')) {
        clients = JSON.parse(localStorage.getItem('users'))
        console.log(clients)
    } else {
        clients = []
    }

    clients.push(user)

    localStorage.setItem('users', JSON.stringify(clients))
}

// Открытие Popup
function openPopup() {
    popup.style.display = 'flex'
    closeBtn.addEventListener('click', (e) => {
        popup.style.display = 'none';
        changePageContent()
    });
}

// Переход на страницу входа
function changePageContent() {
    mainTitle.innerText = 'Log in to the system'
    submitButton.innerText = 'Sign In'
    labelName.remove()
    fullNameInput.remove()
    errorEmptyName.remove()
    errorWrongName.remove()
    labelEmail.remove()
    emailInput.remove()
    errorEmptyEmail.remove()
    errorWrongEmail.remove()
    labelRepeatPassword.remove()
    repeatPassword.remove()
    errorEmptyRepeatPassword.remove()
    errorWrongRepeatPassword.remove()
    labelAgreement.remove()
    agreement.remove()
    errorAgreement.remove()
    questionLink.innerHTML = 'Registration'
    signIn = true;
}

// Работа ссылки Already have an account?
questionLink.addEventListener('click', (e) => {
    e.preventDefault();

    if (!signIn) {
        changePageContent();
    } else {
        location.reload();
    }
});