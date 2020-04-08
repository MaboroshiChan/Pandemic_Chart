

Chart.defaults.derivedLine = Chart.defaults.line;

Chart.controllers.derivedLine = Chart.controllers.line.extend({
    name: 'derivedLine',
    draw: function(ease){
        Chart.controllers.line.prototype.draw.call(this, ease);
        if(this.chart.tooltip._active && this.chart.tooltip._active.length){
            var activePoint = this.chart.tooltip._active[0],
            ctx = this.chart.ctx,
            x = activePoint.tooltipPosition().x,
            topY = this.chart.scales['y-axis-0'].top,
            bottomY = this.chart.scales['y-axis-0'].bottom;
            // draw line
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x, topY);
            ctx.lineTo(x, bottomY);
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#000000';
            ctx.stroke();
        }
    }
});
  

var _options = (countryName) => ({
    title:{
        display:true,
        text: countryName.toUpperCase()
    },
    tooltips: {
        mode: 'index',
        intersect: false
     },
     hover: {
        mode: 'index',
        intersect: false
     },
     plugins: {
        zoom: {
            // Container for pan options
            pan: {
                // Boolean to enable panning
                enabled: true,

                rangeMin: {
                    // Format of min pan range depends on scale type
                    x: 30,

                },
                rangeMax: {
                    // Format of max pan range depends on scale type
                    x: 100,
                },

                speed: 500,

                threhold: 5,

                // Panning directions. Remove the appropriate direction to disable 
                // Eg. 'y' would only allow panning in the y direction
                mode: 'x'
            },

            // Container for zoom options
            zoom: {
                speed: 100,
                // Boolean to enable zooming
                enabled: true,
                sensitivity: 0.2,

                // Zooming directions. Remove the appropriate direction to disable 
                // Eg. 'y' would only allow zooming in the y direction
                mode: 'x',
            }
        }
    }
})

function createDeathChart(_mychart,countryName,datas, time){

    var newDeaths = [0];
    for(let i = 1; i < datas.length;++i){
        newDeaths.push(datas[i] - datas[i - 1]);
    }

    return new Chart(_mychart, {
        type: 'derivedLine',
        data: {
            labels: time,
            datasets: [
                {
                    label: "Total Deaths",
                    fill: false,
                    data: datas,
                    backgroundColor:"black",
                    borderColor:"black",
                    pointHoverRadius: 7,
                    pointHoverBackgroundColor: 'white'
                },
                {
                    label: "New Deaths",
                    fill: false,
                    data: newDeaths,
                    backgroundColor:"grey",
                    borderColor:"grey",
                    pointHoverRadius: 7,
                    pointHoverBackgroundColor: 'white'
                }
            ],
            
        },
        options: _options(countryName)
    })
}


function createChart(_mychart,countryName,TotalCases,curedCases, time){
    var newcases = [0];

    for(let i = 1; i < TotalCases.length;++i){
        newcases.push(TotalCases[i] - TotalCases[i - 1]);
    }
    var remaningCases = [];
    for(let i = 0; i < curedCases.length;++i){
        remaningCases.push(TotalCases[i] - curedCases[i]);
    }
    return new Chart(_mychart, {
        type: 'derivedLine',
        data:{
            labels: time,
            datasets: [{
                label: 'Total Cases',
                fill: false,
                data: TotalCases,
                backgroundColor:"#07f2e3",
                borderColor:"#42f563",
                pointHoverRadius: 7,
                pointHoverBackgroundColor: 'white'
            },{
                label:'New Cases',
                fill: false,
                data: newcases,
                backgroundColor:"#f2ea07",
                borderColor:"#f2ea07",
                pointHoverRadius: 7,
                pointHoverBackgroundColor: 'white'
            },{
                label: 'Remaining Cases',
                fill: false,
                data: remaningCases,
                backgroundColor:"#ff69ca",
                borderColor:"#ff69ca",
                pointHoverRadius: 7,
                pointHoverBackgroundColor: 'white'
            }]
        },
        options: _options(countryName)
        
    }); 
}


function createDeathRateAndCuredRateChart(_mychart, countryName, caseData, deathData, recoverData, time){


    var deathRate = new Array(caseData.length).fill(0), recoverRate = new Array(caseData.length).fill(0);

    for(let i = 0; i < caseData.length; ++i){
        deathRate[i] = (deathData[i]/caseData[i]);
        recoverRate[i] = (recoverData[i]/caseData[i]);
    }


    return new Chart(_mychart, {
        type: 'derivedLine',
        data: {
            labels: time,
            datasets: [{
                label: "Death Rate",
                fill: false,
                data: deathRate,
                backgroundColor:"#b0b0b0",
                borderColor:"#b0b0b0",
                pointHoverRadius: 7,
                pointHoverBackgroundColor: 'white'
            },{
                label: "Recover Rate",
                fill: false,
                data: recoverRate,
                backgroundColor:"#07f2e3",
                borderColor:"#42f563",
                pointHoverRadius: 7,
                pointHoverBackgroundColor: 'white'
            }]
        },
        options: _options(countryName)
    });   
}



document.addEventListener("DOMContentLoaded", function(){
    var slideIndex = 1;
        showSlides(slideIndex);

    // Next/previous controls
    function plusSlides(n) {
     showSlides(slideIndex += n);
    }

    // Thumbnail image controls
    function currentSlide(n) {
        showSlides(slideIndex = n);
    }

    function showSlides(n) {
        var i;
        var slides = document.getElementsByClassName("mySlides");
        var dots = document.getElementsByClassName("dot");
        if (n > slides.length) {slideIndex = 1}
        if (n < 1) {slideIndex = slides.length}
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        for (i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        }
        slides[slideIndex-1].style.display = "block";
        dots[slideIndex-1].className += " active";
    }

    let list = document.getElementById("list");
    let graph = document.getElementById("chart");
    let graph2 = document.getElementById("chart2");
    let graph3 = document.getElementById("chart3");
    var countryList;
    var CoronaChart;
    var CoronaChart2;
    var CoronaChart3;
    let mychart = graph.getContext('2d');
    let mychart2 = graph2.getContext('2d');
    let mychart3 = graph3.getContext('2d');
    const totalCasesDataUrl = (name)=>`https://api.covid19api.com/total/country/${name.toLowerCase()}/status/confirmed`;
    const recoveredCasesUrl = (name)=>`https://api.covid19api.com/total/country/${name.toLowerCase()}/status/recovered`;
    const deathCasesUrl = (name)=>`https://api.covid19api.com/total/country/${name.toLowerCase()}/status/deaths`;
    //TODO: Kill Chart.
    const getData = (countryName) => {
        $.getJSON(totalCasesDataUrl(countryName), function(total){
            var totalcases = total.map(x=>x.Cases);
            var time = total.map(x=>x.Date.substring(0, 10));
            $.getJSON(recoveredCasesUrl(countryName), function(cured){
                var recovered = cured.map(x=>x.Cases);
                CoronaChart = createChart(mychart,countryName, totalcases, recovered, time);
                $.getJSON(deathCasesUrl(countryName), function(death){
                    var deaths = death.map(x=>x.Cases);
                    CoronaChart2 = createDeathChart(mychart2, countryName, deaths, time);
                    CoronaChart3 = createDeathRateAndCuredRateChart(mychart3,countryName,totalcases, deaths,recovered, time);
                });
            });
        });
    }
    for(let i = 1; i < 4; ++i){
        $(`#dot${i}`).click(function(){
            currentSlide(i);
        });
    }
    $(".prev").click(function(){
        slideIndex = (slideIndex - 1) % 3;
        showSlides(slideIndex);
    })
    $(".next").click(function(){
        slideIndex = (slideIndex) % 3 + 1;
        showSlides(slideIndex);
    })

    if(list && graph && graph2 && graph3){
        $.getJSON("https://api.covid19api.com/countries", function(data){
            countryList = data.map(x=>Object({Country: x.Country, Slug: x.Slug}));
            for(x of countryList){
                list.add(new Option(x.Country, x.Slug, false, x.Country === "China"));
            }
        });
        getData("China");

        list.addEventListener('change', function(){
            getData(list.value);
        });
    }
    console.log("Done!");
});