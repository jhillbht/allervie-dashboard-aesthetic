async function fetchAnalyticsData(days = 7, metrics = 'all') {
    try {
        const response = await fetch(`/api/data?days=${days}&metrics=${metrics}`);
        const data = await response.json();
        
        if (data.success) {
            updateDashboard(data.data, data.metadata);
        } else {
            console.error('Error fetching data:', data.error);
            showError('Failed to fetch analytics data');
        }
    } catch (error) {
        console.error('Error:', error);
        showError('Failed to connect to the server');
    }
}

function updateDashboard(data, metadata) {
    // Update metric tiles
    Object.entries(metadata.metrics).forEach(([metricKey, metricConfig]) => {
        const latestValue = data[data.length - 1][metricKey];
        updateMetricTile(metricKey, latestValue, metricConfig);
    });
    
    // Update charts
    updateCharts(data, metadata);
}

function formatMetric(value, format) {
    switch (format) {
        case 'percent':
            return `${value.toFixed(1)}%`;
        case 'currency':
            return `$${value.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        case 'number':
            return value.toLocaleString('en-US');
        default:
            return value;
    }
}

function updateMetricTile(metric, data) {
    const tile = document.querySelector(`[data-metric="${metric}"]`);
    if (!tile) return;

    const valueEl = tile.querySelector('.metric-value');
    const changeEl = tile.querySelector('.metric-change');
    
    valueEl.textContent = formatMetric(data.value, data.format);
    
    if (changeEl) {
        const changeClass = data.change >= 0 ? 'positive' : 'negative';
        changeEl.textContent = `${data.change >= 0 ? '+' : ''}${data.change.toFixed(1)}%`;
        changeEl.className = `metric-change ${changeClass}`;
    }
}

// Helper functions
function formatNumber(num) {
    return new Intl.NumberFormat().format(num);
}

function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${Math.floor(seconds % 60)}s`;
}

async function fetchGA4Metrics() {
    try {
        const response = await fetch('/api/ga4-metrics');
        const result = await response.json();
        
        if (result.success) {
            Object.entries(result.data).forEach(([metric, data]) => {
                updateMetricTile(metric, data);
            });
        } else {
            console.error('Failed to fetch GA4 metrics:', result.error);
        }
    } catch (error) {
        console.error('Error fetching GA4 metrics:', error);
    }
}

// Call this when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchAnalyticsData();
    fetchGA4Metrics();
    
    // Refresh data every 5 minutes
    setInterval(() => {
        fetchAnalyticsData();
        fetchGA4Metrics();
    }, 5 * 60 * 1000);
}); 