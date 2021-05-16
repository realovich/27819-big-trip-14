import AbstractView from './abstract';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {leaveUniqueItems, countPointsByType, countPriceByType} from '../utils/statistics';
import {ChartSetting} from '../utils/const';

const getUniquePointTypes = (points) => {
  const pointTypes = points.map((point) => point.type);
  return leaveUniqueItems(pointTypes);
};

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

const renderMoneyChart = (moneyCtx, points) => {
  const uniqueTypes = getUniquePointTypes(points);
  const pricesByTypes = uniqueTypes.map((type) => countPriceByType(points, type));
  const priceFormatter = (val) => `€ ${val}`;

  moneyCtx.height = ChartSetting.BAR_HEIGHT * uniqueTypes.length;

  return new Chart(moneyCtx, getChartSettings(uniqueTypes, pricesByTypes, ChartSetting.TEXT.TYPE, priceFormatter));
};

const renderTypeChart = (typeCtx, points) => {
  const uniqueTypes = getUniquePointTypes(points);
  const pointByTypeCounts = uniqueTypes.map((type) => countPointsByType(points, type));
  const countFormater = (val) => `${val}x`;

  typeCtx.height = ChartSetting.BAR_HEIGHT * uniqueTypes.length;

  return new Chart(typeCtx, getChartSettings(uniqueTypes, pointByTypeCounts, ChartSetting.TEXT.TYPE, countFormater));
};

const renderTimeChart = (timeCtx, points) => {
  //
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
    const timeCtx = this.getElement().querySelector('.statistics__chart--spend');

    this._moneyChart = renderMoneyChart(moneyCtx, this._points);
    this._typeChart = renderTypeChart(typeCtx, this._points);
    this._timeChart = renderTimeChart(timeCtx, this._points);
  }
}
