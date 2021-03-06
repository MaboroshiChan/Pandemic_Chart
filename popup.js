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
    var totalcases, time, recovered, deaths;
    const getData = countryName =>{
        $.getJSON(totalCasesDataUrl(countryName)).then(total=>{
            totalcases = total.map(x=>x.Cases);
            time = total.map(x=>x.Date.substring(0, 10));
            return $.getJSON(recoveredCasesUrl(countryName));
        }).then(cured=>{
            recovered = cured.map(x=>x.Cases);
            CoronaChart = createChart(mychart,countryName, totalcases, recovered, time);
            return $.getJSON(deathCasesUrl(countryName));
        }).then(death=>{
            deaths = death.map(x=>x.Cases);
            CoronaChart2 = createDeathChart(mychart2, countryName, deaths, time);
            CoronaChart3 = createDeathRateAndCuredRateChart(mychart3,countryName,totalcases, deaths,recovered, time);
        })
    };
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


    let defaultCountry = undefined;
    let read = new Promise((res, rej)=>{
        chrome.storage.sync.get(["countrySelected"], result=>{
            if(result.countrySelected){
                defaultCountry = result.countrySelected;
                console.log("The default is " + defaultCountry)
            }else{
                defaultCountry = "China";
            }
            res(defaultCountry);
        });
    });

    read.then((defaultCountry)=>{
        console.log(defaultCountry);
        return $.getJSON("https://api.covid19api.com/countries");
    }).then(data=>{
        countryList = data.map(x=>Object({Country: x.Country, Slug: x.Slug})).sort((u, v)=>{
           if(u.Slug > v.Slug){
               return 1;
           }
           else if(u.Slug < v.Slug){
               return -1;
           }
           return 0;
        });
        for(x of countryList){
            list.add(new Option(x.Country, x.Slug, false));
        }
        getData(defaultCountry);
    });

    $("#list").change(function(){
        CoronaChart.destroy();
        CoronaChart2.destroy();
        CoronaChart3.destroy();
        getData(list.value);
        chrome.storage.sync.set({"countrySelected": list.value}, ()=>{
            console.log("saved");
        });
    });

    console.log("End!");
});