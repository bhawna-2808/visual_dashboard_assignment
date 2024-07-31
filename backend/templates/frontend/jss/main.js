document.addEventListener('DOMContentLoaded', function() {
    let data = [];
    const intensityChart = new Chart(document.getElementById('intensityChart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Intensity',
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0.6)'
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Intensity by Country'
            }
        }
    });

    const likelihoodChart = new Chart(document.getElementById('likelihoodChart').getContext('2d'), {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Likelihood',
                data: [],
                borderColor: 'rgba(255, 99, 132, 1)',
                fill: false
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Likelihood over Time'
            }
        }
    });

    const relevanceChart = new Chart(document.getElementById('relevanceChart').getContext('2d'), {
        type: 'pie',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)'
                ]
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Relevance by Topic'
            }
        }
    });

    function fetchData() {
        fetch('/api/data')
            .then(response => response.json())
            .then(responseData => {
                data = responseData;
                updateCharts();
                populateFilters();
            });
    }

    function updateCharts() {
        // Update Intensity Chart
        const intensityData = data.reduce((acc, item) => {
            if (!acc[item.country]) {
                acc[item.country] = 0;
            }
            acc[item.country] += item.intensity;
            return acc;
        }, {});

        intensityChart.data.labels = Object.keys(intensityData);
        intensityChart.data.datasets[0].data = Object.values(intensityData);
        intensityChart.update();

        // Update Likelihood Chart
        const likelihoodData = data.reduce((acc, item) => {
            if (!acc[item.added]) {
                acc[item.added] = 0;
            }
            acc[item.added] += item.likelihood;
            return acc;
        }, {});

        likelihoodChart.data.labels = Object.keys(likelihoodData);
        likelihoodChart.data.datasets[0].data = Object.values(likelihoodData);
        likelihoodChart.update();

        // Update Relevance Chart
        const relevanceData = data.reduce((acc, item) => {
            if (!acc[item.topic]) {
                acc[item.topic] = 0;
            }
            acc[item.topic] += item.relevance;
            return acc;
        }, {});

        relevanceChart.data.labels = Object.keys(relevanceData);
        relevanceChart.data.datasets[0].data = Object.values(relevanceData);
        relevanceChart.update();
    }

    function populateFilters() {
        const endYears = [...new Set(data.map(item => item.end_year))].filter(Boolean);
        const topics = [...new Set(data.map(item => item.topic))];
        const sectors = [...new Set(data.map(item => item.sector))];
        const regions = [...new Set(data.map(item => item.region))];

        populateSelect('endYearFilter', endYears);
        populateSelect('topicFilter', topics);
        populateSelect('sectorFilter', sectors);
        populateSelect('regionFilter', regions);
    }

    function populateSelect(id, options) {
        const select = document.getElementById(id);
        options.forEach(option => {
            const el = document.createElement('option');
            el.textContent = option;
            el.value = option;
            select.appendChild(el);
        });
    }

    document.getElementById('applyFilters').addEventListener('click', function() {
        const endYear = document.getElementById('endYearFilter').value;
        const topic = document.getElementById('topicFilter').value;
        const sector = document.getElementById('sectorFilter').value;
        const region = document.getElementById('regionFilter').value;

        let filteredData = data;

        if (endYear) filteredData = filteredData.filter(item => item.end_year == endYear);
        if (topic) filteredData = filteredData.filter(item => item.topic === topic);
        if (sector) filteredData = filteredData.filter(item => item.sector === sector);
        if (region) filteredData = filteredData.filter(item => item.region === region);

        // Update charts with filtered data
        // (You'll need to modify the updateCharts function to accept a data parameter)
        updateCharts(filteredData);
    });

    fetchData();
});