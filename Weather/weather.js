const express=require('express')
const ejs=require('ejs')
const PORT=2000
const SERVER=express()
const axios=require('axios')

SERVER.set('view engine','ejs')

SERVER.get('/',(req,res)=>{
    res.render('Home')
})

SERVER.get('/info',(req,res)=>{
    res.render('GetCityName')
})

SERVER.get('/GetCityName',async (req,res)=>{
    let CityDetails=''
    let city=req.query.ct
    console.log(city)

    const URL=`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=2de127ea0ce130f232c365dea34d9876`
    await axios({
        method:'GET',
        url:URL
    }).then((response)=>{
        CityDetails=response.data
        console.log(CityDetails)
    }).catch((error)=>{
        console.log('Some Error Occurred' +error)
    })

    if(CityDetails && CityDetails.length>0)
    {
        let Country=CityDetails[0].country
        let State=CityDetails[0].state
        let Latit=CityDetails[0].lat
        let Longit=CityDetails[0].lon
        
        console.log('Country='+Country)
        console.log('State='+State)
        console.log('Latitude  of '+city+'='+Latit)
        console.log('Longitude of '+city+'='+Longit)
        

        //console.log('---in if---')
        const URL_Weather=`http://api.openweathermap.org/data/2.5/weather?`+`lat=${Latit}&lon=${Longit}&units=metric&appid=2de127ea0ce130f232c365dea34d9876`

        console.log('Weather URL:'+URL_Weather)
        axios({
            method:'GET',
            url:URL_Weather
        }).then((response)=>{
            console.log(response.data)
            let weatherData=response.data
            let weather=
            {
                country:Country,
                state:State,
                city:city,
                lat:Latit,
                lon:Longit,
                weather_id:weatherData.weather[0].id,
                description:weatherData.weather[0].description,
                temp:weatherData.main.temp,
                feels_like:weatherData.main.feels_like,
                temp_min:weatherData.main.temp_min,
                temp_max:weatherData.main.temp_max,
                humidity:weatherData.main.humidity,
                pressure:weatherData.main.pressure
            }
            console.log(weather)
            res.render('DisplayWeatherData',{weather})

        }).catch((err)=>{
            console.log('Cannot Fetch Weather Data Some Error Occurred while fetching data' +err)
        })

    }
    else
    {
        res.render('Error')
    }
})



SERVER.listen(PORT,()=>{
    console.log(`URL:- http://localhost:${PORT}`)
})