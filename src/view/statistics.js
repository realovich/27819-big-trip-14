import AbstractView from './abstract';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {ChartSetting} from '../utils/const';
import {formatDuration} from '../utils/date';

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
            barThickness: ChartSetting.BAR_THICKNESS,
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
            minBarLength: ChartSetting.MIN_BAR_LENGTH,
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

const getSortedArray = (chartMap) => {
  const sortedMap = new Map([...chartMap.entries()].sort((first, second) => second[1] - first[1]));
  const sortedArray = Array.from(sortedMap.entries()).reduce((acc, chartValue) => {
    const [titles, values] = acc;
    const [title, value] = chartValue;
    return [[...titles, title.toUpperCase()], [...values, value]];
  }, [[], []]);
  return sortedArray;
};

const renderMoneyChart = (moneyCtx, points) => {
  const moneyChartValues = new Map();

  points.forEach((point) => {
    const {type, base_price} = point;

    const typeValue = moneyChartValues.get(type);
    if (!typeValue) {
      moneyChartValues.set(type, base_price);
    } else {
      moneyChartValues.set(type, typeValue + base_price);
    }
  });

  const [types, prices] = getSortedArray(moneyChartValues);

  const priceFormatter = (val) => `€ ${val}`;

  moneyCtx.height = ChartSetting.BAR_HEIGHT * types.length;

  return new Chart(moneyCtx, getChartSettings(types, prices, ChartSetting.TEXT.MONEY, priceFormatter));
};

const renderTypeChart = (typeCtx, points) => {
  const typeChartValues = new Map();

  points.forEach((point) => {
    const {type} = point;

    const typeValue = typeChartValues.get(type);

    if (!typeValue) {
      typeChartValues.set(type, 1);
    } else {
      typeChartValues.set(type, typeValue + 1);
    }
  });

  const [types, counts] = getSortedArray(typeChartValues);

  const countFormatter = (val) => `${val}x`;

  typeCtx.height = ChartSetting.BAR_HEIGHT * types.length;

  return new Chart(typeCtx, getChartSettings(types, counts, ChartSetting.TEXT.TYPE, countFormatter));
};

const renderTimeChart = (timeCtx, points) => {
  const timeChartValues = new Map();

  points.forEach((point) => {
    const {type, date_from, date_to} = point;

    const typeValue = timeChartValues.get(type);

    if (!typeValue) {
      timeChartValues.set(type, date_to - date_from);
    } else {
      timeChartValues.set(type, typeValue + (date_to - date_from));
    }
  });

  const [types, durations] = getSortedArray(timeChartValues);

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

  show() {
    this.getElement().classList.add('hidden');
  }

  hide() {
    this.getElement().classList.remove('hidden');
  }

  _setCharts() {
    const moneyCtx = this.getElement().querySelector('.statistics__chart--money');
    const typeCtx = this.getElement().querySelector('.statistics__chart--transport');
    const timeCtx = this.getElement().querySelector('.statistics__chart--time');

    this._moneyChart = renderMoneyChart(moneyCtx, this._points);
    this._typeChart = renderTypeChart(typeCtx, this._points);
    this._timeChart = renderTimeChart(timeCtx, this._points);
  }
}
