/* eslint-disable camelcase */
import {memo, useMemo} from 'react';

import {Tooltip} from 'antd';

import {ExecutionMetrics} from '@models/metrics';

import {Text} from '@custom-antd';

import Colors, {StatusColors} from '@styles/Colors';

import {BarWrapper, ChartWrapper, MetricsBarChartWrapper, NoData, SvgWrapper} from './MetricsBarChart.styled';

type BarConfig = {
  width: BarChartConfig['barWidth'];
  height: number;
  color: StatusColors;
  tooltipData: any;
};

type BarChartConfig = {
  barWidth: number;
  barMargin: number;
  chartData: ExecutionMetrics[];
};

type MetricsBarChartProps = {
  data?: ExecutionMetrics[];
  medianDurationProportion: number;
};

const Bar: React.FC<BarConfig> = props => {
  const {width, height, color, tooltipData} = props;

  const value = `Duration: ${tooltipData}`;
  return (
    <Tooltip title={value} placement="top">
      <BarWrapper style={{height, background: color}} $width={width} />
    </Tooltip>
  );
};

type ChartProps = {
  chartConfig: BarChartConfig;
  medianDurationProportion: number;
};

const log2 = (value: any) => {
  return Math.log(value) / Math.log(100);
};

const divisionCoef = 1000;

const greatestValue = (values: ExecutionMetrics[]) => {
  return values
    .map(value => Math.log(value.duration_ms / divisionCoef))
    .reduce((acc, cur) => (cur > acc ? cur : acc), -Infinity);
};

const Chart: React.FC<ChartProps> = props => {
  const {chartConfig, medianDurationProportion} = props;

  const {chartData, barWidth} = chartConfig;
  /*
    Division each value by some number makes chart look more proportional
    division by 1000 converts values to seconds
    better would be to divide it by minValue - 1 to make sure that each record is displayed well
  */
  const maxValue = greatestValue(chartData);

  const renderedBarChart = useMemo(() => {
    return chartData.map(barItem => {
      const {duration_ms, status} = barItem;

      const barColor = StatusColors[status];

      /* 
        By default we multiply log value to 150 so value will fit to container
        its constant value is 100px
        medianDurationProportion is a value between 1 and 2
        so multiplier is between 75 and 150 px
        it handles situation when all values are to each other
        and we don't have to display max height for them, only a half
        multiplying by 75 gives this
      */

      const widthInPxMultiplyer = 75 * medianDurationProportion;

      const devidedDuration = duration_ms / divisionCoef;

      // proportion so devidedDuration is related to height the same as maxValue is related to widthInPxMultiplyer
      // which is basically equals to maximum height of container (150 px)
      const height = (Math.log(devidedDuration) * widthInPxMultiplyer) / maxValue;

      const barValue =
        barItem?.duration_ms > 60
          ? `${(barItem?.duration_ms / 60).toFixed()}m`
          : `${(barItem?.duration_ms).toFixed()}s`;

      return (
        <Bar
          width={barWidth}
          height={Math.floor(height)}
          color={barColor}
          tooltipData={status === 'running' ? 'running' : barValue}
        />
      );
    });
  }, [chartData]);

  return <SvgWrapper>{renderedBarChart}</SvgWrapper>;
};

const MetricsBarChart: React.FC<MetricsBarChartProps> = props => {
  const {data = [], medianDurationProportion} = props;

  const filteredData = data
    /* Some old, legacy tests does not have duration_ms field. We get rid of those here */
    .filter(item => item.duration_ms)
    /*
      The executions list is sorted in that way that the most
      recent execution is in the end of the array. We reverse this array
      to have the most recent execution in the very beginning
    */
    .reverse();

  const barChartConfig: BarChartConfig = {
    barWidth: 12,
    barMargin: 6,
    // here you can add some data
    chartData: [
      {
        duration: '1000 s',
        duration_ms: 1000000,
        status: 'failed',
      },
      ...filteredData,
    ],
  };

  const svgWrapperWidth = data.length * (barChartConfig.barMargin + barChartConfig.barWidth) - barChartConfig.barMargin;

  return (
    <MetricsBarChartWrapper>
      {!filteredData || !filteredData.length ? (
        <NoData>
          <Text className="regular big" color={Colors.slate500}>
            No information about metrics
          </Text>
        </NoData>
      ) : (
        <ChartWrapper $svgWrapperWidth={svgWrapperWidth}>
          <Chart chartConfig={barChartConfig} medianDurationProportion={medianDurationProportion} />
        </ChartWrapper>
      )}
    </MetricsBarChartWrapper>
  );
};

export default memo(MetricsBarChart);
