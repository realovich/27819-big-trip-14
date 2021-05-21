import AbstractView from './abstract';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {ChartSetting} from '../utils/const';
import {formatDuration} from '../utils/date';

const VALUE_POSITION = 1;

const getChartSettings = (labels, data, text, formatter) => {
  return {
    plugins: [ChartDataLabels],
    type: ChartSetting.TYPE,
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: ChartSetting.COLOR.WHITE,
          hoverBackgroundColor: ChartSetting.COLOR.WHITE,
          anchor: ChartSetting.ANCHOR.START,
          barThickness: ChartSetting.BAR_THICKNESS,
          minBarLength: ChartSetting.MIN_BAR_LENGTH,
        },
      ],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: ChartSetting.DATA_FONT_SIZE,
          },
          color: ChartSetting.COLOR.BLACK,
          anchor: ChartSetting.ANCHOR.END,
          align: ChartSetting.ALIGN,
          formatter,
        },
      },
      title: {
        display: true,
        text,
        fontColor: ChartSetting.COLOR.BLACK,
        fontSize: ChartSetting.TITLE_FONT_SIZE,
        position: ChartSetting.TITLE_POSITION,
      },
      scales: {
        yAxes: [
          {
            ticks: {
              fontColor: ChartSetting.COLOR.BLACK,
              padding: ChartSetting.TICKS_PADDING,
              fontSize: ChartSetting.TICKS_FONT_SIZE,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
          },
        ],
        xAxes: [
          {
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
          },
        ],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  };
};

const getChartData = (points) => {
  const chartValues = new Map();

  points.forEach((points) => {
    const {type, basePrice, dateFrom, dateTo} = points;
    const duration = dateTo - dateFrom;

    const typeValue = chartValues.get(type);
    if (!typeValue) {
      chartValues.set(type, {
        basePrice,
        count: 1,
        duration,
      });
    } else {
      const {basePrice: typeValueBasePrice, count, duration: typeValueDuration} = typeValue;

      chartValues.set(type,
        {
          basePrice: (typeValueBasePrice + basePrice),
          count: count + 1,
          duration: typeValueDuration + duration,
        });
    }
  });

  return chartValues;
};

const getSortedArray = (chartMap, fieldName) => {

  const sortedMap = [...chartMap.entries()].sort((first, second) => {
    const firstValue = first[VALUE_POSITION];
    const secondValue = second[VALUE_POSITION];
    return secondValue[fieldName] - firstValue[fieldName];
  });

  const sortedArray = sortedMap.reduce((acc, chartValue) => {
    const [titles, values] = acc;
    const [title, value] = chartValue;
    return [[...titles, title.toUpperCase()], [...values, value[fieldName]]];
  }, [[], []]);

  return sortedArray;
};

const renderMoneyChart = (moneyCtx, chartData) => {

  const [types, prices] = getSortedArray(chartData, 'basePrice');

  const priceFormatter = (val) => `€ ${val}`;

  moneyCtx.height = ChartSetting.BAR_HEIGHT * types.length;

  return new Chart(moneyCtx, getChartSettings(types, prices, ChartSetting.TEXT.MONEY, priceFormatter));
};

const renderTypeChart = (typeCtx, chartData) => {
  const [types, counts] = getSortedArray(chartData, 'count');

  const countFormatter = (val) => `${val}x`;

  typeCtx.height = ChartSetting.BAR_HEIGHT * types.length;

  return new Chart(typeCtx, getChartSettings(types, counts, ChartSetting.TEXT.TYPE, countFormatter));
};

const renderTimeChart = (timeCtx, chartData) => {
  const [types, durations] = getSortedArray(chartData, 'duration');

  const timeFormatter = (val) => formatDuration(val);

  timeCtx.height = ChartSetting.BAR_HEIGHT * types.length;

  return new Chart(timeCtx, getChartSettings(types, durations, ChartSetting.TEXT.TIME_SPEND, timeFormatter));
};

const createStatisticsTemplate = () => {
  return `<section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>

    <div class="statistics__item statistics__item--money">
      <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--transport">
      <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--time-spend">
      <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
    </div>
  </section>`;
};

export default class Statistics extends AbstractView {
  constructor(points) {
    super();

    this._points = points;

    this._moneyChart = null;
    this._typeChart = null;
    this._timeChart = null;

    this._setCharts();
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  _setCharts() {
    const moneyCtx = this.getElement().querySelector('.statistics__chart--money');
    const typeCtx = this.getElement().querySelector('.statistics__chart--transport');
    const timeCtx = this.getElement().querySelector('.statistics__chart--time');

    const chartData = getChartData(this._points);

    this._moneyChart = renderMoneyChart(moneyCtx, chartData);
    this._typeChart = renderTypeChart(typeCtx, chartData);
    this._timeChart = renderTimeChart(timeCtx, chartData);
  }
}
