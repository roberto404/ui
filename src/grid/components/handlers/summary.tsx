import React from 'react';
import { useDispatch } from "react-redux";
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';
import simplify from '@1studio/utils/math/simplify';
import { roundDecimal } from '@1studio/utils/math/round';
import formatThousand from '@1studio/utils/string/formatThousand';
import { collectionGroupBy } from '@1studio/utils/array/pivotTable';

import {
  sum,
  avg,
  count,
  countUnique,
  mode,
  median,
  variance,
  stdDev,
  quartiles,
  iqr,
  detectArrayType,
  pivotTable,
} from "@1studio/utils/array";

/* !- Actions */

import { dialog, sidebar } from "../../../layer/actions";

/* !- Components */

import SummaryData from './summaryData';
import Resize from '../../../resize';
import ChartBar from '../../../chart/bar';
import ChartLine from '../../../chart/line';
import ChartBoxPlot from '../../../chart/boxPlot';

/* !- Constants */

import { DATE_FORMAT, ONE_DAY } from '../../../calendar/constants';
const simplifyArgs = [1000, ['', 'E', 'M', 'Mrd']];

/**
 * 
 * @returns { SummaryHandler }
 */
export function useSummaryHandler() {

  const dispatch = useDispatch();

  const SummaryHandler = ({ records, column, data, helper = {}, event }) => {

    if (!column) return;

    const rawData = records.length === 1 ? data : records;
    const values = rawData.map(record => record[column]).filter(i => i);

    const summaryProps = {};

    const arrayType = !isEmpty(helper[column]) ? 'category' : detectArrayType(values);

    switch (arrayType) {

      case 'date':

        const dates = values.map(value => new Date(value).getTime());

        const dateMin = Math.min(...dates);
        const dateMax = Math.max(...dates);

        summaryProps.data = [
          {
            title: 'Időszak',
            value: (dateMax - dateMin) / ONE_DAY + ' nap',
            priority: 1,
          },
          {
            title: 'Darabok',
            value: simplify(count(values), 1000, ['', 'E', 'M', 'Mrd']) + ' db',
            priority: 2,
          },
          {
            title: 'Leggyakoribb',
            value: moment(new Date(mode(dates)[0])).format(DATE_FORMAT),
            priority: 3,
          },
          {
            title: 'Legkorábbi',
            value: moment(dateMin).format(DATE_FORMAT),
          },
          {
            title: 'Legkésőbbi dátum',
            value: moment(dateMax).format(DATE_FORMAT),
          },
        ];

        summaryProps.children = (
          <div>
            <ChartLine
              xGrid={false}
              xAxis={false}
              yAxis={false}
              y2Axis={true}
              data={[
                {
                  id: 's1',
                  label: 'store1',
                  values: [100, 200, 50],
                  xAxis: ['Lorem', 'ipsum', 'dolor'],
                },]}
            />
          </div>
        );

        break;

      case 'numeric':

        const min = Math.min(...values);
        const max = Math.max(...values);
        const quartilesValue = quartiles(values);
        const iqrValue = iqr(values);
        const modeValues = mode(values);


        summaryProps.data = [
          {
            title: 'Összesen',
            value: simplify(sum(values), ...simplifyArgs),
            priority: 1,
          },
          {
            title: 'Darabok',
            value: simplify(count(values), 1000, ['', 'E', 'M', 'Mrd']) + ' db',
            priority: 2,
          },
          {
            title: 'Egyedi darabok',
            value: simplify(countUnique(values), 1000, ['', 'E', 'M', 'Mrd']) + ' db',
          },
          {
            title: 'Átlag',
            value: simplify(avg(values), 1000, ['', 'E', 'M', 'Mrd']),
            priority: 3,
          },
          {
            title: 'Max',
            value: formatThousand(max),
          },
          {
            title: 'Min',
            value: formatThousand(min),
          },
          {
            title: 'Tartomány',
            value: formatThousand(max - min),
          },
          {
            title: 'Módusz',
            value: modeValues.map(value => formatThousand(value)).join(', '),
            caption: 'Legtöbbször előforduló érték',
          },
          {
            title: 'Medián',
            value: formatThousand(roundDecimal(median(values), 100)),
            caption: 'Középső érték',
          },
          {
            title: 'Variancia',
            value: roundDecimal(variance(values), 100),
          },
          {
            title: 'Szórás',
            value: formatThousand(roundDecimal(stdDev(values), 100)),
          },
          {
            title: 'Percentilisek',
            value: Object.entries(quartilesValue).map(([key, value]) => ({
              id: key,
              value
            })),
            caption: 'negyedek (25%, 50%, 75%)'
          },
          {
            title: 'IQR',
            value: formatThousand(roundDecimal(iqrValue, 100)),
            caption: '75%-25% közötti tartomány',
          },
        ];

        const summaries = {
          min,
          max,
          ...quartilesValue,
          qMin: Math.max(min, quartilesValue.Q1 - iqrValue * 1.5),
          qMax: Math.min(max, quartilesValue.Q3 + iqrValue * 1.5),
          mode: modeValues.length < values.length ? modeValues : [],
        };

        summaryProps.children = (
          <Resize height={80} className="mb-4">

            <ChartBoxPlot
              {...summaries}
            />
          </Resize>
        )

        break;

      default:
      case 'categorical':

        const pivot =
          collectionGroupBy(rawData, column)
            .sort((a, b) => b.title - a.title)
            .slice(0, 10);

        const isUniq = pivot[0].title === 1;


        summaryProps.data = [
          {
            title: 'Darabok',
            value: simplify(count(values), 1000, ['', 'E', 'M', 'Mrd']) + ' db',
            priority: 1,
          }
        ];

        if (!isUniq) {

          summaryProps.data.push({
            title: 'Leggyakoribb',
            value: helper[pivot[0].id] ?? pivot[0].id,
            priority: 2,
          },
            {
              title: 'Kategóriánként',
              value: pivot.map(({ id, title }) => ({ id, title: `${title} db • ${Math.round(title / values.length * 100)}%` })),
            },
          );
        }

        const chartData = {
          id: 1,
          values: [],
          xAxis: [],
        };

        pivot.forEach(record => {
          chartData.xAxis.push(helper[record.id] || record.id);
          chartData.values.push(record.title);
        });

        chartData.xAxis.push('');
        chartData.values.push('');

        if (!isUniq) {

          summaryProps.children = (
            <Resize>
              <ChartBar
                data={[chartData]}
              />
            </Resize>
          );
        }

        break;
    }





    console.log('detectArrayType', detectArrayType(values));



    dispatch(sidebar(
      <div className='p-2' style={{ width: 500 }}>
        <SummaryData
          title='Oszlop statisztikai összegzés'
          subTitle='Részletek'
          {...summaryProps}
          helper={helper}
        />
      </div>
    ));
  };

  return { SummaryHandler };
}