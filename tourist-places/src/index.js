import { getData, getDistHaversinusFormula, getWalkingDistance, getWalkingTime } from './functions.js';

/**
 * Create application whith tourist places jn the map
 * @class
 */
class App {
    constructor(elem) {
        this.elem = elem;
        this.map = null;
        this.mapPoints = [];
        this.selectedPoints = [];
        this.path = [];
        this.walkingDistance = 0;
        this.walkingTime = 0;
        this.sumWalkingTime = 0;
        this.sumPointsTime = 0;
        this.totalCost = 0;
    }

    /** Application entry point */
    async start() {
        const touristPlaces = await getData('touristPlaces.json');
        /** Data-array whith points - tourist places */
        this.mapPoints = touristPlaces;

        // eslint-disable-next-line
        ymaps.ready(() => this.initMap());
    }

    /** Map initialization, display points on the map and information about these points */
    initMap() {
        // eslint-disable-next-line
        this.map = new ymaps.Map("map", {
            center: [50.447814, 30.492368],
            zoom: 12
        });

        this.mapPoints.forEach((item) => {
            // eslint-disable-next-line
            const point = new ymaps.Placemark([item.latitude, item.longitude], {
                hintContent: `${item.name}`,
                balloonContent: `<div class="balloon-content">
                                  <div class="image"><img src="${item.img}"></div>
                                  <div class="text">
                                      <div class="title">${item.name}</div>
                                      <div class="description">${item.description}</div>
                                      <div class="pictogram">
                                          <button class="price"><i class="material-icons">attach_money</i> - ${item.ticketPrice} грн.</button>
                                          <button class="average-time"><i class="material-icons">access_time</i> - ${item.averageTime} мин.</button>
                                      </div>
                                  </div>
                               </div> 
                               <button type="button" class="add-route">Добавить в маршрут</button>`
            }, {
                preset: 'islands#orangeCircleDotIcon',
                iconColor: '#ff8800'
            });
            this.map.geoObjects.add(point);

            point.events.add('balloonopen', () => {
                /** Container for displaying information about a point - tourist place */
                const addInRoute = document.querySelector('.add-route');
                addInRoute.addEventListener('click', () => {
                    if (!this.selectedPoints.includes(item)) {
                        this.selectedPoints.push(item);
                        this.path.push([item.latitude, item.longitude]);

                        /** 
                         * Total time spent in all tourist places selected by the user
                         * @global
                         */
                        this.sumPointsTime += item.averageTime;

                        /** 
                         * Total cost of visiting all tourist places selected by the user
                         * @global
                         */
                        this.totalCost += item.ticketPrice;

                        if (this.selectedPoints.length > 1) {
                            this.drawLines(this.path);
                        }
                    }
                    this.displayTouristPlaces(item);
                });
            });
        })
    }

    /**
     * Display html markup and information about point (tourist place) selected by the user on a map
     * @param {object} item an array of data points selected by the user on a map
     */
    displayTouristPlaces(item) {
        /** Container for displaying information about selected points - tourist places */
        const routePoints = document.getElementById('route-points');

        if (this.selectedPoints.length > 1) {
            this.displayDistanceInfo(routePoints);
        }

        routePoints.insertAdjacentHTML('beforeend', `
      <div class="place-info">
          <div class="name">${item.name}</div>
          <div class="add-info">
              <div class="address">Адрес: ${item.address}</div>
              <div class="time">Время работы: <span class="bold">с ${item.timeStart} до ${item.timeEnd}</span></div>
              <div class="price">Стоимость билета - <span class="bold">${item.ticketPrice} грн.</span></div>
              <div class="average-time">Среднее время нахождения в туристическом месте - <span class="bold">${item.averageTime} мин.</span></div>
              <div class="geoCoord">Географические координаты: широта ${item.latitude}; долгота ${item.longitude}</div>
          </div>
      </div>`);
    }

    /** Display information about distance of the walking path between two points in meters and in minutes */
    displayDistanceInfo(container) {
        /** Distance between two points whith latitude (lat1, lat2) and longitude (long1, long2) */
        const distance = getDistHaversinusFormula(this.selectedPoints[this.selectedPoints.length - 2].latitude, this.selectedPoints[this.selectedPoints.length - 1].latitude,
            this.selectedPoints[this.selectedPoints.length - 2].longitude, this.selectedPoints[this.selectedPoints.length - 1].longitude);

        /** 
         * Distance of the walking path between two points in meters
         * @global
         * @type {number}
         */
        this.walkingDistance = getWalkingDistance(distance);

        /** 
         * Distance of the walking path between two points in minutes
         * @global
         * @type {number}
         */
        this.walkingTime = getWalkingTime(this.walkingDistance);

        /** 
         * Total distance of the walking path between two points in minutes
         * @global
         * @type {number}
         */
        this.sumWalkingTime += this.walkingTime;

        container.insertAdjacentHTML('beforeend', `
               <div class="dist-info">
                   <div class="walk-distance"><i class="material-icons">directions_walk</i>. . .<i class="material-icons">location_on</i> - ${this.walkingDistance} м.</div>
                   <div class="walk-time"><i class="material-icons">access_time</i>. . .<i class="material-icons">location_on</i> - ${this.walkingTime} мин.</div>
               </div>`);

        this.getSummaryInfo();
    }

    /** Draw lines between selected points - tourist places */
    drawLines(path) {
        // eslint-disable-next-line
        const line = new ymaps.Polyline(path, {
            hintContent: "Ломаная"
        }, {
            strokeColor: '#ff8800',
            strokeWidth: 4
        });
        this.map.geoObjects.add(line);
    }

    /** Get and display the total information about the time at which the user will be at the last point of the route, and the total cost of the walk */
    getSummaryInfo() {
        /** Extraction container for entering the time at which the user will be at the first point of the route */
        const start = document.getElementById('start');
        /** Extraction button for calculation total walking time and the total cost of the walk*/
        const calculateButton = document.getElementById('calculate-button');
        /** Сontainer for display time at which the user will be at the last point of the route */
        const totalTime = document.getElementById('total-time');
        /** Сontainer for display total cost of the walk */
        const totalCostWalk = document.getElementById('total-cost');

        /**
         * Total time spent by the user in a tourist place and the duration of the walk between all points on the route 
         * @constant {number}
         */
        const sumWalkingTime = this.sumWalkingTime + this.sumPointsTime;

        calculateButton.addEventListener('click', () => {
            /** Get data-array from entering the time at which the user will be at the first point of the route */
            const userTime = start.value.split(':');
            /** Number of hours from entering the time at which the user will be at the first point of the route */
            const userTimeHours = Number(userTime[0]);
            /** Number of minutes from entering the time at which the user will be at the first point of the route */
            const userTimeMinutes = Number(userTime[1]);

            /** 
             * Time spent by the user at the first point of the route
             * @constant {number} 
             */
            const totalUserTime = userTimeHours * 60 + userTimeMinutes;

            /** 
             * Total walking time in minutes
             * @constant {number}
             */
            const totalTimeInMinutes = sumWalkingTime + totalUserTime;
            /** Number of minutes in a walk */
            let minutes = 0;
            /** Number of hours in a walk */
            let hours = 0;

            if (totalTimeInMinutes < 60) {
                minutes = totalTimeInMinutes;
            } else {
                hours = Math.floor(totalTimeInMinutes / 60);
                minutes = totalTimeInMinutes % 60;
            }

            if (minutes < 10) {
                minutes = '0' + minutes;
            }

            totalTime.innerText = `${hours}:${minutes} ч.`;
            totalCostWalk.innerText = `${this.totalCost} грн.`;
        });
    }
}

const app = new App(document.getElementById('app'));
app.start();