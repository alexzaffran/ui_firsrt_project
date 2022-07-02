setHelloUserName();

function handleLogout() {
  sessionStorage.clear();
}

function setHelloUserName() {
  const helloUserElement = document.querySelector('.hello-user');
  const name = sessionStorage.getItem('name');
  helloUserElement.innerHTML = `Hello ${name}`;
}

async function load_page(pageName) {
  var content = document.getElementById('content');
  const departmentsPage = await fetch(`../pages/${pageName}.html`);
  const departmentsContent = await departmentsPage.text();
  content.innerHTML = departmentsContent;

  if (pageName === 'departments') {
    executeDepartmentsScripts();
  }

  if (pageName === 'shifts') {
    executeShiftsScripts();
  }

  if (pageName === 'employees') {
    executeEmployeesScripts();
  }
}
