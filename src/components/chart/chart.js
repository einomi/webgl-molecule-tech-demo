import React from 'react';
import {
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  ResponsiveContainer,
} from 'recharts';

import data from '../../js/chart-data.json';

function Chart() {
  return (
    <ResponsiveContainer aspect={5 / 3}>
      <AreaChart data={data} margin={{ top: 5, right: 0, bottom: 0, left: 30 }}>
        <CartesianGrid stroke="#14182C" fill="#D4B66615" />
        <XAxis
          dataKey="name"
          stroke="#14182C40"
          tick={{ fill: '#ddd', strokeWidth: 0 }}
        />
        <YAxis
          id="cost"
          dataKey="cost"
          tickFormatter={(tick) =>
            `£${new Intl.NumberFormat('en-GB').format(Math.round(tick))}`
          }
          stroke="#14182C40"
          tick={{ fill: '#ddd', strokeWidth: 0 }}
          scale={'log'}
          domain={[100, 306220955]}
        />
        <YAxis
          yAxisId="moore_law"
          tick={false}
          tickLine={false}
          axisLine={false}
          hide
        />
        <Area
          type="monotone"
          dataKey="cost"
          stroke="#0085FF"
          fill="#6493B660"
          strokeWidth={3}
        />
        <Area
          yAxisId="moore_law"
          dataKey="moore_law"
          stroke="#fff"
          fill="#00000000"
          strokeWidth={3}
        />
        <Tooltip
          contentStyle={{
            background: '#cbcbd9',
            border: 'none',
            borderRadius: '2px',
            color: '#000',
            fontSize: '14px',
            lineHeight: '1em',
            padding: '10px',
            textAlign: 'center',
          }}
          labelStyle={{ color: '#000' }}
          itemStyle={{ color: '#000' }}
          formatter={(value) =>
            `£${new Intl.NumberFormat('en-GB').format(Math.round(value))}`
          }
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default Chart;
