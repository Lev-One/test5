document.addEventListener('DOMContentLoaded', function () {

  let widgetLang = 'ka';

  const widgetUrlGet = "https://citynet.ge/b2b/get_schedule.php";
  const widgetUrlSet = "https://citynet.ge/b2b/request_call.php";

  let widgetDates = [];
  let widgetCallMode = 0;
  let widgetTimeInSecondsTotal = 30000;
  let widgetTimeInSeconds = 0;
  let widgetTimerInterval;

  const widgetContainer = document.createElement('div');

  widgetContainer.id = 'widget-container';
  document.body.appendChild(widgetContainer);

  const widgetTimerSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="#fff"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M360 0H24C10.7 0 0 10.7 0 24v16c0 13.3 10.7 24 24 24 0 91 51 167.7 120.8 192C75 280.3 24 357 24 448c-13.3 0-24 10.7-24 24v16c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24v-16c0-13.3-10.7-24-24-24 0-91-51-167.7-120.8-192C309 231.7 360 155 360 64c13.3 0 24-10.7 24-24V24c0-13.3-10.7-24-24-24zm-64 448H88c0-77.5 46.2-144 104-144 57.8 0 104 66.5 104 144z"/></svg>`;
  const widgetTimerEndPhone = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="#fff"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M97.3 507c-129.9-129.9-129.7-340.3 0-469.9 5.7-5.7 14.5-6.6 21.3-2.4l64.8 40.5a17.2 17.2 0 0 1 6.8 21l-32.4 81a17.2 17.2 0 0 1 -17.7 10.7l-55.8-5.6c-21.1 58.3-20.6 122.5 0 179.5l55.8-5.6a17.2 17.2 0 0 1 17.7 10.7l32.4 81a17.2 17.2 0 0 1 -6.8 21l-64.8 40.5a17.2 17.2 0 0 1 -21.3-2.4zM247.1 95.5c11.8 20 11.8 45 0 65.1-4 6.7-13.1 8-18.7 2.6l-6-5.7c-3.9-3.7-4.8-9.6-2.3-14.4a32.1 32.1 0 0 0 0-29.9c-2.5-4.8-1.7-10.7 2.3-14.4l6-5.7c5.6-5.4 14.8-4.1 18.7 2.6zm91.8-91.2c60.1 71.6 60.1 175.9 0 247.4-4.5 5.3-12.5 5.7-17.6 .9l-5.8-5.6c-4.6-4.4-5-11.5-.9-16.4 49.7-59.5 49.6-145.9 0-205.4-4-4.9-3.6-12 .9-16.4l5.8-5.6c5-4.8 13.1-4.4 17.6 .9zm-46 44.9c36.1 46.3 36.1 111.1 0 157.5-4.4 5.6-12.7 6.3-17.9 1.3l-5.8-5.6c-4.4-4.2-5-11.1-1.3-15.9 26.5-34.6 26.5-82.6 0-117.1-3.7-4.8-3.1-11.7 1.3-15.9l5.8-5.6c5.2-4.9 13.5-4.3 17.9 1.3z"/></svg>`;

  widgetContainer.innerHTML = `
        <div id="widget-phone" class="widget-phone">
          <div class="widget-phone-content">
            <div class="widget-circle"></div>
            <div class="widget-circle-fill"></div>
            <div class="widget-img-circle">
            <div style="width: 30px;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff">
                <path d="M21.384,17.752a2.108,2.108,0,0,1-.522,3.359,7.543,7.543,0,0,1-5.476.642C10.5,20.523,3.477,13.5,2.247,8.614a7.543,7.543,0,0,1,.642-5.476,2.108,2.108,0,0,1,3.359-.522L8.333,4.7a2.094,2.094,0,0,1,.445,2.328A3.877,3.877,0,0,1,8,8.2c-2.384,2.384,5.417,10.185,7.8,7.8a3.877,3.877,0,0,1,1.173-.781,2.092,2.092,0,0,1,2.328.445Z"/>
              </svg>
            </div>
            </div>
          </div>
        </div>

        <div id="widget-modal" class="widget-modal">
          <div class="widget-modal-content">
            <div class="widget-modal-header">
              <span class="widget-close">&times;</span>
              <h2>&nbsp;</h2>
            </div>
            <div class="widget-modal-body" id="widget-modal-body">
              <div id="widget-modal-body-call">
                <div style="text-align: center;">
                  <p class="widget-body-title">გნებავთ ჩვენ გადმოგირეკავთ?</p>
                  <p class="widget-body-title-sub">მიუთითეთ თქვენი ნომერი და ჩვენ დაგიკავშირდებით 30 წამში!</p>
                </div>
                <div>
                  <div>
                    <div class="widget-row">
                      <div class="widget-input-group widget-prefix">
                        <span class="widget-input-group-addon">
                          <svg style="width: 40px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 5 36 26">
                            <path fill="#EEE" d="M32 5H20.5v10.5H36V9c0-2.209-1.791-4-4-4z" />
                            <path fill="#E8112D" d="M20.5 5h-5v10.5H0v5h15.5V31h5V20.5H36v-5H20.5z" />
                            <path fill="#E8112D" d="M28.915 9.585c.031-.623.104-1.244.221-1.86-.588.073-1.183.073-1.77 0 .117.615.19 1.237.221 1.86-.623-.031-1.244-.104-1.86-.221.073.588.073 1.183 0 1.77.615-.117 1.237-.19 1.86-.221-.031.623-.104 1.244-.221 1.86.588-.073 1.183-.073 1.77 0-.117-.615-.19-1.237-.221-1.86.623.031 1.244.104 1.86.221-.073-.588-.073-1.183 0-1.77-.616.118-1.237.191-1.86.221z" />
                            <path fill="#EEE" d="M15.5 5H4C1.791 5 0 6.791 0 9v6.5h15.5V5z" />
                            <path fill="#E8112D" d="M8.415 9.585c.031-.623.104-1.244.221-1.86-.588.073-1.183.073-1.77 0 .117.615.19 1.237.221 1.86-.623-.031-1.244-.104-1.86-.221.073.588.073 1.183 0 1.77.615-.117 1.237-.19 1.86-.221-.031.623-.104 1.244-.221 1.86.588-.073 1.183-.073 1.77 0-.117-.615-.19-1.237-.221-1.86.623.031 1.244.104 1.86.221-.073-.588-.073-1.183 0-1.77-.616.118-1.237.191-1.86.221z" />
                            <path fill="#EEE" d="M36 27v-6.5H20.5V31H32c2.209 0 4-1.791 4-4z" />
                            <path fill="#E8112D" d="M28.915 26.415c.031.623.104 1.244.221 1.86-.588-.073-1.183-.073-1.77 0 .117-.615.19-1.237.221-1.86-.623.031-1.244.104-1.86.221.073-.588.073-1.183 0-1.77.615.117 1.237.19 1.86.221-.031-.623-.104-1.244-.221-1.86.588.073 1.183.073 1.77 0-.117.615-.19 1.237-.221 1.86.623-.031 1.244-.104 1.86-.221-.073.588-.073 1.183 0 1.77-.616-.118-1.237-.191-1.86-.221z" />
                            <path fill="#EEE" d="M15.5 20.5H0V27c0 2.209 1.791 4 4 4h11.5V20.5z" />
                            <path fill="#E8112D" d="M8.415 26.415c.031.623.104 1.244.221 1.86-.588-.073-1.183-.073-1.77 0 .117-.615.19-1.237.221-1.86-.623.031-1.244.104-1.86.221.073-.588.073-1.183 0-1.77.615.117 1.237.19 1.86.221-.031-.623-.104-1.244-.221-1.86.588.073 1.183.073 1.77 0-.117.615-.19 1.237-.221 1.86.623-.031 1.244-.104 1.86-.221-.073.588-.073 1.183 0 1.77-.616-.118-1.237-.191-1.86-.221z" />
                          </svg>
                        </span>
                        <input type="number" placeholder="5xx xx xx xx" name="widget_input_mobile" class="widget-input" id="widget-input">
                      </div>
                      <div class="error-message" id="error-message"></div>
                    </div>
                  </div>
                  <div class="widget-select-call-date" id="widget-select-call-date" style="margin: 10px 0;">
                    <div>
                      <select name="widget_day_pick" id="widget-day-pick">
                        <option value="_">დღეს</option>
                        <option value="_">30/12</option>
                        <option value="_">31/12</option>
                      </select>
                    </div>
                    <div>
                      <select name="widget_time_pick" id="widget-time-pick">
                        <option value="_">10:00</option>
                        <option value="_">10:15</option>
                        <option value="_">10:30</option>
                        <option value="_">10:45</option>
                        <option value="_">11:00</option>
                        <option value="_">11:15</option>
                        <option value="_">11:30</option>
                        <option value="_">11:45</option>
                        <option value="_">12:00</option>
                        <option value="_">13:15</option>
                        <option value="_">13:30</option>
                        <option value="_">13:45</option>
                        <option value="_">14:00</option>
                      </select>
                    </div>
                  </div>
                  <div class="widget-keypad" id="widget-keypad">
                    <div class="widget-key">1</div>
                    <div class="widget-key">2</div>
                    <div class="widget-key">3</div>
                    <div class="widget-key">4</div>
                    <div class="widget-key">5</div>
                    <div class="widget-key">6</div>
                    <div class="widget-key">7</div>
                    <div class="widget-key">8</div>
                    <div class="widget-key">9</div>
                    <div class="widget-key">0</div>
                    <div class="widget-key">←</div>
                    <div class="widget-key">x</div>
                  </div>
                  <div style="margin: 10px 0;">
                    <button class="widget-button" id="widget-button-submit" style="width: 100%;">ველოდები ზარს!</button>
                  </div>
                  <div class="widget-choose-date" style="text-align: center;margin: 10px 0;text-decoration: underline; cursor: pointer;">
                    აირჩიეთ დაკავშირების სასურველი დრო
                  </div>
                  <div class="widget-choose-date-now" style="display: none; text-align: center;margin: 10px 0;text-decoration: underline; cursor: pointer;">
                    ახლავე
                  </div>
                </div>
              </div>
              <div id="widget-modal-body-result">
              </div>
            </div>
            <div class="widget-modal-footer">
              <div style="text-align: center;"><a href="https://citynet.ge/ka/biznesistvis" target="_blank">Powered by Citynet</a></div>
            </div>
          </div>
        </div>
    `;




  const widgetModalBody = document.getElementById('widget-modal-body');
  const widgetModalBodyCall = document.getElementById('widget-modal-body-call');
  const widgetModalBodyResult = document.getElementById('widget-modal-body-result');

  const widgetUnputField = document.getElementById('widget-input');

  const widgetCD = document.getElementsByClassName("widget-choose-date")[0]
  const widgetCDN = document.getElementsByClassName("widget-choose-date-now")[0]
  const widgetSCD = document.getElementsByClassName("widget-select-call-date")[0]

  const modal = document.getElementById("widget-modal");

  const widgetPhone = document.getElementById("widget-phone");
  const widgetButtonSubmit = document.getElementById("widget-button-submit");

  const widgetClose = document.getElementsByClassName("widget-close")[0];

  widgetPhone.onclick = function () {
    widgetModalBody.classList.remove('result-body');
    modal.style.display = "block";
    widgetModalBodyCall.style.display = "block";
    widgetModalBodyResult.style.display = "none";
    if (widgetApiKey) {
      getWidgetData();
    }
  }

  widgetClose.onclick = function () {
    modal.style.display = "none";
    widgetUnputField.value = '';
  }

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
      widgetUnputField.value = '';
    }
  }


  widgetCD.onclick = function () {
    widgetSCD.style.setProperty('display', 'flex');
    widgetCD.style.setProperty('display', 'none');
    widgetCDN.style.setProperty('display', 'block');
    widgetCallMode = 1;
  }

  widgetCDN.onclick = function () {
    widgetSCD.style.removeProperty('display');
    widgetCDN.style.setProperty('display', 'none');
    widgetCD.style.setProperty('display', 'block');
    widgetCallMode = 0;
  }


  //keypad
  const keypad = document.getElementById('widget-keypad');

  keypad.addEventListener('click', function (event) {
    const clickedElement = event.target;
    if (clickedElement.classList.contains('widget-key')) {
      const inputValue = widgetUnputField.value;
      const clickedValue = clickedElement.innerText;

      if (clickedValue === '←') {
        widgetUnputField.value = inputValue.slice(0, -1);
      } else if (clickedValue === 'x') {
        widgetUnputField.value = '';
      } else {
        widgetUnputField.value = inputValue + clickedValue;
      }
    }
  });


  document.getElementById('widget-input').addEventListener('blur', function () {
    validateWidgetPhoneNumber();
  });

  widgetButtonSubmit.addEventListener('click', function (event) {
    if (validateWidgetPhoneNumber()) {
      sendWidgetData();
    } else {
      console.log('err');
    }
  });

  const validateWidgetPhoneNumber = () => {
    const errorMessage = document.getElementById('error-message');
    const phoneNumberRegex = /^5\d{2}\d{2}\d{2}\d{2}$/;

    if (phoneNumberRegex.test(widgetUnputField.value)) {
      errorMessage.textContent = '';
      return true;
    } else {
      errorMessage.textContent = 'ნომერი არასწორად არის მითითებული';
      return false;
    }
  }

  const getWidgetData = async () => {
    const formData = new FormData();

    formData.append("apikey", widgetApiKey);

    const url = `${widgetUrlGet}`;
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      console.log('შეცდომა');
      return;
    }

    try {
      const data = await response.json();
      const result = Object.values(data).map(dayData => {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;
        const currentDate = new Date().getDate();
        const currentDayOfWeek = new Date().getDay();

        const weekDayId = currentDayOfWeek === 0 ? 7 : currentDayOfWeek;

        let daysUntilWeekDay = dayData.week_day_id - weekDayId;
        if (daysUntilWeekDay < 0) {
          daysUntilWeekDay += 7;
        }

        const startDate = new Date(currentYear, currentMonth - 1, currentDate + daysUntilWeekDay);
        const formattedDate = `${startDate.getDate().toString().padStart(2, '0')}/${(startDate.getMonth() + 1).toString().padStart(2, '0')}`;
        const formattedFullDate = `${startDate.getFullYear()}-${(startDate.getMonth() + 1).toString().padStart(2, '0')}-${startDate.getDate().toString().padStart(2, '0')}`;
        return {
          ...dayData,
          date: formattedDate,
          value: formattedFullDate,
          working_hours: generateWorkingHours(dayData)
        };
      });

      widgetDates = result;

      const currentDateAvailable = widgetDates.some(data => data.value === widgetGetFormattedDateTime().substring(0, 10));

      const initialDate = widgetDates[0].value;
      updateSelectOptions("widget-day-pick", widgetDates.map(day => ({
        value: day.value,
        label: day.date
      })));
      updateSelectOptions("widget-time-pick", getWorkingHours(initialDate));

      if (!currentDateAvailable) {
        widgetCD.click();
        widgetCDN.style.setProperty('display', 'none');
      }

    } catch (error) {
      console.log('error');
      console.log(error);
    }
  }

  const sendWidgetData = async () => {
    let time = '';

    if (widgetCallMode == 0) {
      time = widgetGetFormattedDateTime(new Date(), 30);
    } else {
      const dayPick = document.getElementById("widget-day-pick").value;
      const timePick = document.getElementById("widget-time-pick").value;
      time = widgetGetFormattedDateTime(`${dayPick} ${timePick}:00`);
    }
    const formData = new FormData();

    formData.append("apikey", widgetApiKey);
    formData.append("phone", widgetUnputField.value);
    formData.append("time", time);

    const url = `${widgetUrlSet}`;
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      console.log('შეცდომა');
      return;
    }

    try {
      const data = await response.json();

      if (data.result == 'success') {
        widgetModalBodyCall.style.display = "none";
        widgetModalBodyResult.style.display = "block";
        widgetRenderResult(time.replace('T', ' '));
      }

    } catch (error) {
      console.log('error');
      console.log(error);
    }

  }

  function widgetGetFormattedDateTime(dateParam = new Date(), secondsToAdd = 0) {
    let currentDate = new Date(dateParam);

    // Add seconds to the current date
    currentDate.setSeconds(currentDate.getSeconds() + secondsToAdd);

    let year = currentDate.getFullYear();
    let month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    let day = currentDate.getDate().toString().padStart(2, '0');

    let hours = currentDate.getHours().toString().padStart(2, '0');
    let minutes = currentDate.getMinutes().toString().padStart(2, '0');
    let seconds = currentDate.getSeconds().toString().padStart(2, '0');

    let formattedDateTime = year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':' + seconds;

    return formattedDateTime;
  }

  function parseDateTime(dateTimeString) {
    const [date, time] = dateTimeString.split('T');
    const [year, month, day] = date.split('-');
    const [hours, minutes, seconds] = time.split(':');
    return new Date(year, month - 1, day, hours, minutes, seconds);
  }


  const generateWorkingHours = (dayData) => {
    const result = [];
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const currentDayOfWeek = new Date().getDay();

    const weekDayId = parseInt(dayData.week_day_id, 10);

    const currentHour = new Date().getHours();
    const currentMinute = new Date().getMinutes();

    const startTime = parseDateTime(`${currentYear}-${currentMonth}-${currentDayOfWeek + 1}T${dayData.work_start}`);
    const endTime = parseDateTime(`${currentYear}-${currentMonth}-${currentDayOfWeek + 1}T${dayData.work_end}`);
    const breakStart = dayData.break_start ? parseDateTime(`${currentYear}-${currentMonth}-${currentDayOfWeek + 1}T${dayData.break_start}`) : null;
    const breakEnd = dayData.break_end ? parseDateTime(`${currentYear}-${currentMonth}-${currentDayOfWeek + 1}T${dayData.break_end}`) : null;

    let currentWorkingHour = new Date(startTime);

    if (currentDayOfWeek === weekDayId && currentHour > currentWorkingHour.getHours()) {
      currentWorkingHour.setHours(currentHour, Math.ceil(currentMinute / 15) * 15, 0);
    }

    while (currentWorkingHour <= endTime) {
      if (!(breakStart && currentWorkingHour >= breakStart && currentWorkingHour < breakEnd)) {
        const label = currentWorkingHour.toLocaleTimeString('ka-GE', { hour12: false }).slice(0, 5);
        result.push({
          value: label,
          label: label,
        });
      }
      currentWorkingHour.setMinutes(currentWorkingHour.getMinutes() + 15);
    }

    return result;
  }

  function widgetRenderResult(time) {

    widgetModalBody.classList.add('result-body');

    let resultData = '';

    if (widgetCallMode == 0) {
      resultData = `<div style="text-align: center;">
                    <h3>გაკავშირებთ მენეჯერს...</h3>
                    <div style="display: inline-block; margin-top: 40px;">
                      <div style="display: inline-block; width: 60px;margin-right: 30px;">${widgetTimerSvg}</div>
                      <div style="display: inline-block; vertical-align: sub;"><h2 id="widget-timer"></h2></div>
                    </div>
                  </div>`;

      clearInterval(widgetTimerInterval);
      widgetTimeInSeconds = widgetTimeInSecondsTotal;
      updateWidgetTimer();
      widgetTimerInterval = setInterval(updateWidgetTimer, 100);
    } else {
      resultData = `<div style="text-align: center;">
                      <h2>მადლობა</h2>
                      <h4>ჩვენ დაგიკავშირდებით! დრო: ${time}</h4>
                    </div>`;
    }

    widgetModalBodyResult.innerHTML = resultData;
  }

  function updateSelectOptions(selectId, options) {
    const selectElement = document.getElementById(selectId);
    selectElement.innerHTML = "";
    options.forEach(option => {
      const optionElement = document.createElement("option");
      optionElement.value = option.value;
      optionElement.textContent = option.label;
      selectElement.appendChild(optionElement);
    });
  }

  function getWorkingHours(selectedDate) {
    const selectedDay = widgetDates.find(day => day.value === selectedDate);
    return selectedDay ? selectedDay.working_hours : [];
  }

  function handleDateSelectionChange() {
    const selectedDate = document.getElementById("widget-day-pick").value;
    const workingHours = getWorkingHours(selectedDate);
    updateSelectOptions("widget-time-pick", workingHours);
  }

  function updateWidgetTimer() {

    const seconds = Math.floor(widgetTimeInSeconds / 1000);
    const milliseconds = Math.floor((widgetTimeInSeconds % 1000) / 10); // Extract only 2 digits
    const formattedTime = `${seconds < 10 ? '0' : ''}${seconds}.${milliseconds < 10 ? '0' : ''}${milliseconds}`;

    const timerElement = document.getElementById('widget-timer');

    if (timerElement) {
      timerElement.textContent = formattedTime;
      widgetTimeInSeconds -= 100;

      if (widgetTimeInSeconds < 0) {
        clearInterval(widgetTimerInterval);
        widgetModalBodyResult.innerHTML = `<div style="text-align: center;">
                                            <div>
                                              <div style="display: inline-block; width: 60px; margin-bottom: 30px;">${widgetTimerEndPhone}</div>
                                            </div>
                                            <h3>უკაცრავად, მალე დაგიკავშირდებით!</h3>
                                          </div>`;
      }
    }
  }

  document.getElementById("widget-day-pick").addEventListener("change", handleDateSelectionChange);

});