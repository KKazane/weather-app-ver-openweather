window.addEventListener("load", () => {
  let long;
  let lat;
  let temperatureDescription = document.querySelector(".temperature-description");
  let temperatureDegree = document.querySelector(".temperature-degree");
  let locationTimezone = document.querySelector(".location-timezone");
  let degreeSection = document.querySelector(".degree-section");
  let degreeSpan = document.querySelector(".degree-section span");

  if(navigator.geolocation) { // GeolocationAPIに対応しているかどうか。現在位置取得できるかどうか
    navigator.geolocation.getCurrentPosition(position => { // 現在位置が取得できた場合に実行する関数
      // console.log(position);　
      long = position.coords.longitude; // 現在位置の経度。-90~90で表す
      lat = position.coords.latitude; // 現在位置の緯度。-180~180で表す
      // 動画で使うdarkskyじゃなくてopenWeather使用
      const api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=a03b4c782374fce2ae75a0fffc57829f`;
      // const api = `http://api.openweathermap.org/data/2.5/weather?id=524901&appid=a03b4c782374fce2ae75a0fffc57829f`
      fetch(api)
        .then(response => {
          return response.json();
        })
        .then(data => {
          console.log(data);
          const nowWeather = data.weather[0].description;
          // console.log(nowWeather);
          const nowTemp = data.main.temp;
          temperatureDegree.textContent = Math.floor(nowTemp - 273.15); // おそらくこの数字はKelvinScaleになってる。0度=273.15ケルビン
          temperatureDescription.textContent = nowWeather;
          locationTimezone.textContent = `${data.name}/${data.sys.country}`;
          // set Icon YouTubeで使ってるskyiconはdarkskyAPIのアイコンだったから、openWeatherのアイコンを使用
          let locationIcon = document.querySelector('.weather-icon');
          const icon = data.weather[0].icon;
          // こっちが内部参照で、https://github.com/yuvraaaj/openweathermap-api-icons / のGitHubを参考
          // locationIcon.innerHTML = `<img src="icons/${icon}.png"></img>`;
          //次が外部参照で、現在のopenWeatherで公開されてるアイコンを使用　https://openweathermap.org/weather-conditions#Icon-list / こっちのほうがおしゃれ
          // いずれも / https://stackoverflow.com/questions/44177417/how-to-display-openweathermap-weather-icon / 参考
          locationIcon.innerHTML = `<img src="http://openweathermap.org/img/wn/${icon}@2x.png"></img>`;
          
          // 摂氏と華氏変える
          degreeSection.addEventListener("click", () => {
            if (degreeSpan.textContent === "C") {
              degreeSpan.textContent = "F";
              temperatureDegree.textContent = Math.floor(1.8 * (nowTemp - 273.15) + 32); // ケルビンから華氏はF=1.8*(K-273.15)+32
            } else {
              degreeSpan.textContent = "C";
              temperatureDegree.textContent = Math.floor(nowTemp - 273.15);
            }
          })

        });
    });
  }
});