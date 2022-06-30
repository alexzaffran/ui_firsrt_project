async function handleLoginClick() {
  try {
    removeErrorMessage();
    const body = {
      Username: document.querySelector('.username').value,
      Password: document.querySelector('.password').value,
    };

    const requestConfig = {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    };

    const url = 'https://localhost:44323/api/login/login';

    setLoginButtonIsLoading(true);
    const response = await fetch(url, requestConfig);
    setLoginButtonIsLoading(false);
    const result = await response.json();
    sessionStorage.clear();
    if (result != null) {
      sessionStorage.setItem('username', result.User_Name);
      sessionStorage.setItem('userId', result.ID);
      sessionStorage.setItem('name', result.Full_Name);
      sessionStorage.setItem('isAuthenticated', 'true');
      window.location.href = '../pages/home.html';
    } else {
      const errorMessageElement = document.querySelector('.error-message');
      errorMessageElement?.classList?.remove('is-hidden');
    }
  } catch (err) {
    const errorMessageElement = document.querySelector('.error-message');
    errorMessageElement?.classList?.remove('is-hidden');
    setLoginButtonIsLoading(false);
    console.log(err);
  }
}

function handleInputChange() {
  removeErrorMessage();
}

function setLoginButtonIsLoading(isLoading) {
  const loginButtonElement = document.querySelector('.login-button');
  if (isLoading) {
    if (!loginButtonElement?.classList?.contains('is-loading')) {
      loginButtonElement?.classList?.add('is-loading');
    }
  } else {
    if (loginButtonElement?.classList?.contains('is-loading')) {
      loginButtonElement?.classList?.remove('is-loading');
    }
  }
}

function removeErrorMessage() {
  const errorMessageElement = document.querySelector('.error-message');
  if (!errorMessageElement?.classList?.contains('is-hidden')) {
    errorMessageElement?.classList?.add('is-hidden');
  }
}
