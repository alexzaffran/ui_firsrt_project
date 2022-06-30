async function executeDepartmentsScripts() {
  const allDepartment = await getAllDepartment();
  createDepartmentsTable(allDepartment);
}

function createDepartmentsTable(allDepartment) {
  let tableBody = document.querySelector('.table-body');
  tableBody.remove();

  tableBody = document.createElement('tbody');
  tableBody?.classList?.add('table-body');
  const table = document.querySelector('.table');
  table.appendChild(tableBody);

  allDepartment?.forEach((item) => {
    const row = document.createElement('tr');

    const id = document.createElement('td');
    id.innerHTML = item?.DepId;

    const name = document.createElement('td');
    name.innerHTML = item?.DepartmentName;

    const manager = document.createElement('td');
    manager.innerHTML = item?.ManagerFullName;

    const updateSpan = document.createElement('span');
    updateSpan.classList.add('mdi');
    updateSpan.classList.add('mdi-pencil');
    updateSpan.classList.add('is-clickable');
    updateSpan.addEventListener('click', async function () {
      await load_page('updateDepartments');
      window.sessionStorage.removeItem('departmentIdToUpdate');
      window.sessionStorage.setItem('departmentIdToUpdate', item?.DepId);
    });

    const updateTd = document.createElement('td');
    updateTd.appendChild(updateSpan);

    const deleteSpan = document.createElement('span');
    deleteSpan.classList.add('mdi');
    deleteSpan.classList.add('mdi-delete');
    deleteSpan.classList.add('is-clickable');
    deleteSpan.addEventListener('click', async function () {
      await deleteOneDepartment(item?.DepId);
      const departmentsUpdated = await getAllDepartment();
      createTable(departmentsUpdated);
    });

    const deleteTd = document.createElement('td');
    if (item?.Employess?.length === 0) {
      deleteTd.appendChild(deleteSpan);
    }

    row.appendChild(id);
    row.appendChild(name);
    row.appendChild(manager);
    row.appendChild(updateTd);
    row.appendChild(deleteTd);
    tableBody.appendChild(row);
  });
}

async function getAllDepartment() {
  try {
    const requestConfig = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };

    const url = 'https://localhost:44323/api/department/GetAllDepartments';

    const response = await fetch(url, requestConfig);
    const result = await response.json();
    return result;
  } catch (err) {
    console.log(err);
  }
}

async function deleteOneDepartment(id) {
  try {
    const requestConfig = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    };

    const url = `https://localhost:44323/api/department/deleteDep?depId=${id}`;

    const response = await fetch(url, requestConfig);
    const result = await response.json();
    return result;
  } catch (err) {
    console.log(err);
  }
}

async function handleUpdateDepartmentButton() {
  removeErrorMessage();
  removeSuccessMessage();
  const request = {
    name: document.querySelector('.departmentName')?.value,
    managerId: document.querySelector('.departmentManagerId')?.value,
    id: parseInt(window.sessionStorage.getItem('departmentIdToUpdate')),
  };
  updateOneDepartment(request);
}

async function updateOneDepartment(arg) {
  try {
    const requestConfig = {
      method: 'PUT',
      body: JSON.stringify({
        Name: arg.name,
        Manager: arg.managerId,
      }),
      headers: { 'Content-Type': 'application/json' },
    };

    const url = `https://localhost:44323/api/department/editDep?depId=${arg.id}`;

    setUpdateButtonIsLoading(true);
    const response = await fetch(url, requestConfig);
    const result = await response.json();

    if (!response.ok) {
      const errorMessageElement = document.querySelector('.error-message');
      errorMessageElement?.classList?.remove('is-hidden');
      errorMessageElement.innerHTML = result.Message;
      setUpdateButtonIsLoading(false);
      return result;
    }
    setUpdateButtonIsLoading(false);
    const successMessageElement = document.querySelector('.success-message');
    successMessageElement?.classList?.remove('is-hidden');
    return result;
  } catch (err) {
    const errorMessageElement = document.querySelector('.error-message');
    errorMessageElement?.classList?.remove('is-hidden');
    setUpdateButtonIsLoading(false);
    console.log(err);
  }
}

function setUpdateButtonIsLoading(isLoading) {
  const updateButtonElement = document.querySelector('.update-button');
  if (isLoading) {
    if (!updateButtonElement?.classList?.contains('is-loading')) {
      updateButtonElement?.classList?.add('is-loading');
    }
  } else {
    if (updateButtonElement?.classList?.contains('is-loading')) {
      updateButtonElement?.classList?.remove('is-loading');
    }
  }
}

function removeErrorMessage() {
  const errorMessageElement = document.querySelector('.error-message');
  if (!errorMessageElement?.classList?.contains('is-hidden')) {
    errorMessageElement?.classList?.add('is-hidden');
  }
}

function removeSuccessMessage() {
  const successMessageElement = document.querySelector('.success-message');
  if (!successMessageElement?.classList?.contains('is-hidden')) {
    successMessageElement?.classList?.add('is-hidden');
  }
}
