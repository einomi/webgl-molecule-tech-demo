import React from 'react';
import {
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Area,
} from 'recharts';

import data from '../../js/chart-data.json';

function Chart() {
  return (
    <AreaChart
      width={800}
      height={400}
      data={data}
      margin={{ top: 5, right: 0, bottom: 5, left: 30 }}
    >
      <CartesianGrid stroke="#14182C" fill="#D4B66615" />
      <XAxis
        dataKey="name"
        stroke="#14182C40"
        tick={{ fill: '#ddd', strokeWidth: 0 }}
      />
      <YAxis
        dataKey="cost"
        tickFormatter={(tick) =>
          `£${new Intl.NumberFormat('en-GB').format(Math.round(tick))}`
        }
        stroke="#14182C40"
        tick={{ fill: '#ddd', strokeWidth: 0 }}
        padding={{ bottom: 30 }}
      />
      <Area
        type="monotone"
        dataKey="cost"
        stroke="#0085FF"
        fill="#6493B660"
        strokeWidth={3}
      />
      <Tooltip />
    </AreaChart>
  );
}

export default Chart;
