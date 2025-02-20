// Global chart instances
let usersChart = null;
let sourcesChart = null;
let conversionsChart = null;

// Function to destroy existing charts
function destroyCharts() {
    if (usersChart) usersChart.destroy();
    if (sourcesChart) sourcesChart.destroy();
    if (conversionsChart) conversionsChart.destroy();
}

// Function to update charts
function updateCharts(days) {
    fetch(`/api/data?days=${days}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Update quick stats
            document.getElementById('quickStats').innerHTML = `
                <p><strong>Total Users:</strong> ${data.quick_stats.total_users.toLocaleString()}</p>
                <p><strong>Total Sessions:</strong> ${data.quick_stats.total_sessions.toLocaleString()}</p>
                <p><strong>Conversion Rate:</strong> ${data.quick_stats.conversion_rate}%</p>
            `;
            
            // Destroy existing charts
            destroyCharts();
            
            // Create users chart
            const usersCtx = document.getElementById('usersChart').getContext('2d');
            usersChart = new Chart(usersCtx, {
                type: 'line',
                data: {
                    labels: data.users_data.dates,
                    datasets: [{
                        label: 'Active Users',
                        data: data.users_data.values,
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.1)',
                        tension: 0.1,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
            
            // Create sources chart
            const sourcesCtx = document.getElementById('sourcesChart').getContext('2d');
            sourcesChart = new Chart(sourcesCtx, {
                type: 'pie',
                data: {
                    labels: data.sources_data.labels,
                    datasets: [{
                        data: data.sources_data.values,
                        backgroundColor: [
                            'rgb(255, 99, 132)',
                            'rgb(54, 162, 235)',
                            'rgb(255, 205, 86)',
                            'rgb(75, 192, 192)',
                            'rgb(153, 102, 255)'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'right'
                        }
                    }
                }
            });
            
            // Create conversions chart
            const conversionsCtx = document.getElementById('conversionsChart').getContext('2d');
            conversionsChart = new Chart(conversionsCtx, {
                type: 'bar',
                data: {
                    labels: data.conversion_data.dates,
                    datasets: [{
                        label: 'Conversions',
                        data: data.conversion_data.values,
                        backgroundColor: 'rgb(75, 192, 192)'
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            document.getElementById('quickStats').innerHTML = `
                <div class="alert alert-danger">
                    Error loading analytics data. Please try again later.
                </div>
            `;
        });
}

// Event listener for form submission
document.getElementById('dateForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const days = document.getElementById('dateRange').value;
    updateCharts(days);
});

// Initial load
document.addEventListener('DOMContentLoaded', function() {
    updateCharts(7);
});