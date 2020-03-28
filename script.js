function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

function getRandomColor() {
    return {red: rand(0,255),
            green: rand(0,255),
            blue: rand(0,255)};
};

function updateChart(selectedIndex) {
    const area = ['cases', 'deaths', 'recovered', 'active'];

    let tempCovidInfo = covidInfo;
    tempCovidInfo.sort(function(a, b) {
        return (b[area[selectedIndex]] - a[area[selectedIndex]]);
    });
    tempCovidInfo.length = 10;

    let countryArray = [];
    let infectionArray = [];
    tempCovidInfo.forEach(element => {
        countryArray.push(element.country);
        infectionArray.push(element[area[selectedIndex]]);
    });

    bgColors = [];
    borderColors = [];
    for (let i = 0; i < 10; i++) {
        color = getRandomColor();
        bgColors.push('rgba(' + color.red +
                    ', ' + color.green +
                    ', ' + color.blue + ', 0.2)');
        borderColors.push('rgba(' + color.red +
                    ', ' + color.green +
                    ', ' + color.blue + ', 1)')
    }

    var ctx = document.getElementById('Chart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: countryArray,
            datasets: [{
                label: '# of ' + area[selectedIndex],
                data: infectionArray,
                backgroundColor: bgColors,
                borderColor: borderColors,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
};

var responding = function(event) {
    if (htmlRequest.status >= 200 && htmlRequest.status < 300) {
        covidInfo = JSON.parse(htmlRequest.response);
        updateChart(0);
    } else {
        console.warn(request.statusText, request.responseText);
    }
}
var today = new Date();
document.getElementById('date').innerHTML = today.toLocaleDateString();
var link = 'https://corona.lmao.ninja/countries'
var htmlRequest = new XMLHttpRequest();
var covidInfo = [];

htmlRequest.open('GET', link);
htmlRequest.addEventListener('load', responding);
htmlRequest.send();
