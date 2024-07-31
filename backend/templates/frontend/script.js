document.addEventListener('DOMContentLoaded', function() {
    fetchData();
});

function fetchData() {
    fetch('/api/data')
        .then(response => response.json())
        .then(data => {
            console.log("Data received:", data);
            populateSelects(data);
        })
        .catch(error => console.error('Error:', error));
}


function populateSelects(data) {
    const endYears = [...new Set(data.map(item => item.end_year))].filter(Boolean).sort();
    const topics = [...new Set(data.map(item => item.topic))].filter(Boolean).sort();
    const sectors = [...new Set(data.map(item => item.sector))].filter(Boolean).sort();
    const regions = [...new Set(data.map(item => item.region))].filter(Boolean).sort();

    populateSelect('endYearSelect', endYears);
    populateSelect('topicSelect', topics);
    populateSelect('sectorSelect', sectors);
    populateSelect('regionSelect', regions);
}

function populateSelect(selectId, options) {
    const select = document.getElementById(selectId);
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.textContent = option;
        optionElement.value = option;
        select.appendChild(optionElement);
    });
}