async function executeShiftsScripts() {
  const allShifts = await getAllShifts();
  createShiftsTable(allShifts);
}

function createShiftsTable(allShifts) {
  let tableBody = document.querySelector('.table-body');
  tableBody.remove();

  tableBody = document.createElement('tbody');
  tableBody?.classList?.add('table-body');
  const table = document.querySelector('.table');
  table.appendChild(tableBody);

  allShifts?.forEach((item) => {
    const row = document.createElement('tr');

    const id = document.createElement('td');
    id.innerHTML = item?.ID;

    const date = document.createElement('td');
    date.innerHTML = convertDateToString(item?.Date);

    const startTime = document.createElement('td');
    startTime.innerHTML = item?.Start_Time;

    const endTime = document.createElement('td');
    endTime.innerHTML = item?.End_Time;

    const employees = document.createElement('td');
    const employeesLinkList = item?.Employees?.map((e) => {
      const link = document.createElement('a');
      link.innerHTML = `${e?.First_Name} ${e?.Last_Name}`;
      link.addEventListener('click', async function () {
        await load_page('updateEmployee');
        executeScriptUpdateEmployeePage(e?.ID);
      });
      return link;
    });

    employeesLinkList.forEach((eLink, index) => {
      employees.appendChild(eLink);

      if (index !== employeesLinkList?.length - 1) {
        const coma = document.createElement('span');
        coma.innerText = ' ,';
        employees.appendChild(coma);
      }
    });

    row.appendChild(id);
    row.appendChild(date);
    row.appendChild(startTime);
    row.appendChild(endTime);
    row.appendChild(employees);
    tableBody.appendChild(row);
  });
}

async function getAllShifts() {
  try {
    const requestConfig = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };

    const url = 'https://localhost:44323/api/shift/getallshift';

    const response = await fetch(url, requestConfig);
    const result = await response.json();
    return result;
  } catch (err) {
    console.log(err);
  }
}

function convertDateToString(str) {
  var date = new Date(str),
    mnth = ('0' + (date.getMonth() + 1)).slice(-2),
    day = ('0' + date.getDate()).slice(-2);
  return [date.getFullYear(), mnth, day].join('-');
}

async function handleAddShiftButton() {
  await load_page('addShift');
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

async function handleAddNewShiftButton() {
  removeErrorMessage();
  removeSuccessMessage();
  const request = {
    date: document.querySelector('.shiftDate')?.value,
    startTime: parseInt(document.querySelector('.shiftStartTime')?.value),
    endTime: parseInt(document.querySelector('.shiftEndTime')?.value),
    employeeId: parseInt(document.querySelector('.employeeId')?.value),
  };
  addOneShiftRequest(request);
}

async function addOneShiftRequest(arg) {
  try {
    const requestConfig = {
      method: 'POST',
      body: JSON.stringify({
        Date: new Date(arg.date),
        Start_Time: arg.startTime,
        End_Time: arg.endTime,
      }),
      headers: { 'Content-Type': 'application/json' },
    };

    const url = `https://localhost:44323/api/shift/addShift?employeeId=${arg.employeeId}`;

    setAddNewShiftButtonIsLoading(true);
    const response = await fetch(url, requestConfig);
    const result = await response.json();

    if (!response.ok) {
      const errorMessageElement = document.querySelector('.error-message');
      errorMessageElement?.classList?.remove('is-hidden');
      errorMessageElement.innerHTML = result.Message;
      setAddNewShiftButtonIsLoading(false);
      return result;
    }
    setAddNewShiftButtonIsLoading(false);
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

function setAddNewShiftButtonIsLoading(isLoading) {
  const addNewShiftButtonElement = document.querySelector(
    '.add-new-shift-button'
  );
  if (isLoading) {
    if (!addNewShiftButtonElement?.classList?.contains('is-loading')) {
      addNewShiftButtonElement?.classList?.add('is-loading');
    }
  } else {
    if (addNewShiftButtonElement?.classList?.contains('is-loading')) {
      addNewShiftButtonElement?.classList?.remove('is-loading');
    }
  }
}

function setUpdateEmployeeButtonIsLoading(isLoading) {
  const updateEmployeeButtonElement = document.querySelector(
    '.update-employee-button'
  );
  if (isLoading) {
    if (!updateEmployeeButtonElement?.classList?.contains('is-loading')) {
      updateEmployeeButtonElement?.classList?.add('is-loading');
    }
  } else {
    if (updateEmployeeButtonElement?.classList?.contains('is-loading')) {
      updateEmployeeButtonElement?.classList?.remove('is-loading');
    }
  }
}

async function updateEmployeeRequest(arg) {
  try {
    const requestConfig = {
      method: 'PUT',
      body: JSON.stringify({
        First_Name: arg.firstName,
        Last_Name: arg.name,
        Start_Work_Year: parseInt(arg.startWorkYear),
        DepartmentID: parseInt(arg.departmentId),
      }),
      headers: { 'Content-Type': 'application/json' },
    };

    const url = `https://localhost:44323/api/employee/UpdateEmployee/${arg.employeeId}`;

    setUpdateEmployeeButtonIsLoading(true);
    const response = await fetch(url, requestConfig);
    const result = await response.json();

    if (!response.ok) {
      const errorMessageElement = document.querySelector('.error-message');
      errorMessageElement?.classList?.remove('is-hidden');
      errorMessageElement.innerHTML = result.Message;
      setUpdateEmployeeButtonIsLoading(false);
      return result;
    }
    setUpdateEmployeeButtonIsLoading(false);
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

async function executeScriptUpdateEmployeePage(id) {
  const result = await fetchEmployeeData(id);
  const departments = await fetchAllDepartment();
  assignEmployeeData(result, departments);
}

async function fetchEmployeeData(id) {
  try {
    const requestConfig = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };

    const url = `https://localhost:44323/api/employee/GetEmployee/${id}`;

    const response = await fetch(url, requestConfig);
    const result = await response.json();

    return result;
  } catch (err) {
    console.log(err);
  }
}

async function fetchAllDepartment() {
  try {
    const requestConfig = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };

    const url = `https://localhost:44323/api/department/GetAllDepartments`;

    const response = await fetch(url, requestConfig);
    const result = await response.json();

    return result;
  } catch (err) {
    console.log(err);
  }
}

function assignEmployeeData(data, departments) {
  const firstNameEmployee = document.querySelector('.firstNameEmployee');
  firstNameEmployee.value = data.FirstName;
  const nameEmployee = document.querySelector('.nameEmployee');
  nameEmployee.value = data.LastName;
  const startWorkYear = document.querySelector('.startWorkYear');
  startWorkYear.value = data.StartWorkYear;
  const departmentId = document.querySelector('.departmentId');
  departmentId.value = data.DepartmentId;
  departments?.forEach((dep) => {
    const option = document.createElement('option');
    option.innerHTML = dep?.DepartmentName;
    option.setAttribute('depId', dep?.DepId);
    if (data.DepartmentId === dep?.DepId) {
      option.selected = 'selected';
    }
    departmentId.appendChild(option);
  });
  const updateEmployeeButton = document.querySelector(
    '.update-employee-button'
  );
  updateEmployeeButton.setAttribute('employee-id', data.Id);
}

function getEmployeeData(departments) {
  const firstNameEmployee = document.querySelector('.firstNameEmployee');
  const nameEmployee = document.querySelector('.nameEmployee');
  const startWorkYear = document.querySelector('.startWorkYear');
  const departmentId = document.querySelector('.departmentId');
  const updateEmployeeButton = document.querySelector(
    '.update-employee-button'
  );

  return {
    firstName: firstNameEmployee.value,
    name: nameEmployee.value,
    startWorkYear: startWorkYear.value,
    departmentId: departments
      ?.filter((d) => d.DepartmentName === departmentId.value)
      ?.map((d) => d.DepId)?.[0],
    employeeId: parseInt(updateEmployeeButton.getAttribute('employee-id')),
  };
}

async function handleUpdateEmployee() {
  const departments = await fetchAllDepartment();
  const employeeData = getEmployeeData(departments);
  await updateEmployeeRequest(employeeData);
}
