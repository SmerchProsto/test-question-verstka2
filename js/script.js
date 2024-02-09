document.addEventListener('DOMContentLoaded', () => {
    const viewDataButton = document.getElementById('viewDataButton');
    const exportExcelButton = document.getElementById('exportExcelButton');
    const dataContainer = document.getElementById('dataContainer');
    let fetchedData; // Добавим переменную для хранения полученных данных
    const loader = document.querySelector('.loader'); // Загрузчик

    // Функция для показа загрузчика
    function showOrCloseLoader() {
        loader.classList.toggle('hidden');
    }

    async function fetchData() {
        try {
            const response = await fetch('https://petstore.swagger.io/v2/pet/findByStatus?status=pending');
            fetchedData = await response.json(); // Сохраняем полученные данные
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
        }
    }

    fetchData();

    viewDataButton.addEventListener('click', () => {
        if (!fetchedData) {
            showOrCloseLoader(); // Показываем загрузчик, если данные еще не загружены
            fetchData().then(() => {
                displayData(fetchedData); // Отображаем данные после успешной загрузки
                showOrCloseLoader(); // Скрываем загрузчик после отображения данных
            });
        } else {
            displayData(fetchedData); // Отображаем данные, если они уже загружены
        }
    });

    exportExcelButton.addEventListener('click', () => {
        if (!fetchedData) {
            showOrCloseLoader(); // Показываем загрузчик, если данные еще не загружены
            fetchData().then(() => {
                exportToExcel(fetchedData); // Экспортируем данные после успешной загрузки
                showOrCloseLoader(); // Скрываем загрузчик после экспорта данных
            });
        } else {
            exportToExcel(fetchedData); // Экспортируем данные, если они уже загружены
        }
    });



    function displayData(data) {
        if (!data)
            return;
        // Создаем элемент таблицы
        const table = document.createElement('table');

        // Создаем заголовок таблицы
        const headerRow = document.createElement('tr');
        const idHeader = document.createElement('th');
        idHeader.textContent = 'ID';
        const nameHeader = document.createElement('th');
        nameHeader.textContent = 'Name';
        headerRow.appendChild(idHeader);
        headerRow.appendChild(nameHeader);
        table.appendChild(headerRow);

        // Добавляем строки с данными из массива
        data.forEach(pet => {
            const row = document.createElement('tr');
            const idCell = document.createElement('td');
            idCell.textContent = pet.id;
            const nameCell = document.createElement('td');
            nameCell.textContent = pet.name;
            row.appendChild(idCell);
            row.appendChild(nameCell);
            table.appendChild(row);
        });

        // Очищаем контейнер и добавляем таблицу в него
        dataContainer.innerHTML = '';
        dataContainer.appendChild(table);
    }


    function exportToExcel(data) {
        if (!data) {
            return;
        }
        const filename = 'pets.xlsx';
        const worksheet = XLSX.utils.book_new();
        const wsData = [];

        // Добавляем заголовки столбцов в массив данных
        wsData.push(['ID', 'Name']);

        // Добавляем данные в массив данных
        data.forEach(pet => {
            wsData.push([pet.id, pet.name]);
        });

        // Преобразуем массив данных в лист Excel
        const ws = XLSX.utils.aoa_to_sheet(wsData);

        // Добавляем лист Excel к рабочей книге
        XLSX.utils.book_append_sheet(worksheet, ws, 'Pets');

        // Сохраняем книгу в файл Excel
        XLSX.writeFile(worksheet, filename);
    }
});
