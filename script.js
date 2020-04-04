function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

function getRandomColor() {
    return {red: rand(0,255),
            green: rand(0,255),
            blue: rand(0,255)};
};

function updateChart(selectedIndex, init=true) {
    //var sel = document.getElementById('statistic');
    var selected = $('#statistic').get()[0].options[selectedIndex].value;
    let tempCovidInfo = [...covidInfo];
    tempCovidInfo.sort(function(a, b) {
        return (b[selected] - a[selected]);
    });
    tempCovidInfo.length = 10;

    let countryArray = [];
    let infectionArray = [];
    tempCovidInfo.forEach(element => {
        countryArray.push(element.country);
        infectionArray.push(element[selected]);
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
    if (init == false) {
        myChart.destroy();
    }
    myChart = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: countryArray,
            datasets: [{
                label: '# of ' + area.get(selected),
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
        var timeUpdated = new Date(covidInfo[0].updated);
        document.getElementById('date').innerHTML = timeUpdated.toLocaleString();
        updateChart(0);
    } else {
        console.warn(htmlRequest.statusText, htmlRequest.responseText);
    }
}

var link = 'https://corona.lmao.ninja/countries'
var htmlRequest = new XMLHttpRequest();
var covidInfo = [];
var myChart;
var area = new Map([
    ['cases', 'cases'],
    ['todayCases', 'cases today'],
    ['casesPerOneMillion', 'cases / million'],
    ['deaths', 'deaths'],
    ['todayDeaths', 'deaths today'],
    ['deathsPerOneMillion', 'deaths / million'],
    ['recovered', 'recovered'],
    ['active', 'active cases'],
    ['critical', 'critical']
    ]);

area.forEach(function(value, key) {
    $('#statistic').append('<option value="' + key + '"># of ' + value + '</option>');
});

htmlRequest.open('GET', link);
htmlRequest.addEventListener('load', responding);
htmlRequest.send();
