async function executeEmployeesScripts() {
    const allEmployees = await getAllEmployees();
    createEmployeesTable(allEmployees);
}

async function executeEmployeesResultScripts(employeesResult) {
    createEmployeesResultTable(employeesResult);
}



function createEmployeesTable(allEmployees) {
    let tableBody = document.querySelector('.table-body');
    tableBody.remove();

    tableBody = document.createElement('tbody');
    tableBody?.classList?.add('table-body');
    const table = document.querySelector('.table');
    table.appendChild(tableBody);

    allEmployees?.forEach((item) => {
        const row = document.createElement('tr');

        const id = document.createElement('td');
        id.innerHTML = item?.Id;

        const name = document.createElement('td');
        name.innerHTML = `${item?.FirstName} ${item?.LastName}`;

        const startWorkYear = document.createElement('td');
        startWorkYear.innerHTML = item?.StartWorkYear;

        const departmentName = document.createElement('td');
        departmentName.innerHTML = item?.DepartmentName;

        const shifts = document.createElement('td');
        const shiftsSpanList = item?.ShiftList?.map((e) => {
            const span = document.createElement('span');
            span.innerHTML = `${convertDateToString(e?.Date)} ${e?.Start_Time}-${e?.End_Time}`;

            return span;
        });

        shiftsSpanList.forEach((shiftSpan, index) => {
            shifts.appendChild(shiftSpan);

            if (index !== shiftsSpanList?.length - 1) {
                const coma = document.createElement('span');
                coma.innerText = ', ';
                shifts.appendChild(coma);
            }
        });


        const updateSpan = document.createElement('span');
        updateSpan.classList.add('mdi');
        updateSpan.classList.add('mdi-pencil');
        updateSpan.classList.add('is-clickable');
        updateSpan.addEventListener('click', async function () {
            await load_page('updateEmployee');
            executeScriptUpdateEmployeePage(item?.Id);
        });

        const updateTd = document.createElement('td');
        updateTd.appendChild(updateSpan);

        const deleteSpan = document.createElement('span');
        deleteSpan.classList.add('mdi');
        deleteSpan.classList.add('mdi-delete');
        deleteSpan.classList.add('is-clickable');
        deleteSpan.addEventListener('click', async function () {
            await deleteOneEmployee(item?.Id);
            const employeesUpdated = await getAllEmployees();
            createEmployeesTable(employeesUpdated);
        });

        const deleteTd = document.createElement('td');
        deleteTd.appendChild(deleteSpan);


        const addShiftSpan = document.createElement('td');
        addShiftSpan.classList.add('mdi');
        addShiftSpan.classList.add('mdi-plus-box');
        addShiftSpan.classList.add('is-clickable');
        addShiftSpan.addEventListener('click', async function () {
            await load_page('addShift');
        });

        row.appendChild(id);
        row.appendChild(name);
        row.appendChild(startWorkYear);
        row.appendChild(departmentName);
        row.appendChild(shifts);
        row.appendChild(updateTd);
        row.appendChild(deleteTd);
        row.appendChild(addShiftSpan);
        tableBody.appendChild(row);
    });
}


async function getAllEmployees() {
    try {
        const requestConfig = {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        };

        const url = 'https://localhost:44323/api/employee/GetAllEmployees';

        const response = await fetch(url, requestConfig);
        const result = await response.json();
        return result;
    } catch (err) {
        console.log(err);
    }
}

async function searchAnEmployee(input) {
    try {
        const requestConfig = {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        };

        const url = `https://localhost:44323/api/employee/SearchEmployee?input=${input}`;

        const response = await fetch(url, requestConfig);
        const result = await response.json();
        return result;
    } catch (err) {
        console.log(err);
    }
}

async function handleSearchEmployeeButton() {
    const input = document.querySelector('.search-input')
    const employeesResult = await searchAnEmployee(input.value)
    await load_page('employeeResult')
    await executeEmployeesResultScripts(employeesResult);

}


function createEmployeesResultTable(allEmployees) {
    let tableBody = document.querySelector('.table-body');
    tableBody.remove();

    tableBody = document.createElement('tbody');
    tableBody?.classList?.add('table-body');
    const table = document.querySelector('.table');
    table.appendChild(tableBody);

    allEmployees?.forEach((item) => {
        const row = document.createElement('tr');

        const id = document.createElement('td');
        id.innerHTML = item?.Id;

        const name = document.createElement('td');
        name.innerHTML = `${item?.FirstName} ${item?.LastName}`;

        const startWorkYear = document.createElement('td');
        startWorkYear.innerHTML = item?.StartWorkYear;

        const departmentName = document.createElement('td');
        departmentName.innerHTML = item?.DepartmentName;

        const shifts = document.createElement('td');
        const shiftsSpanList = item?.ShiftList?.map((e) => {
            const span = document.createElement('span');
            span.innerHTML = `${convertDateToString(e?.Date)} ${e?.Start_Time}-${e?.End_Time}`;

            return span;
        });

        shiftsSpanList.forEach((shiftSpan, index) => {
            shifts.appendChild(shiftSpan);

            if (index !== shiftsSpanList?.length - 1) {
                const coma = document.createElement('span');
                coma.innerText = ', ';
                shifts.appendChild(coma);
            }
        });


        row.appendChild(id);
        row.appendChild(name);
        row.appendChild(startWorkYear);
        row.appendChild(departmentName);
        row.appendChild(shifts);
        tableBody.appendChild(row);
    });
}