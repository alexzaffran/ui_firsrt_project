isOnline();

function isOnline() {
  if (sessionStorage.getItem('isAuthenticated') !== 'true') {
    window.location.href = '../pages/login.html';
  }
}
