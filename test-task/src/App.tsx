import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";
import './App.css';

type APRHistory = {
  date: string,
  value: number
}

function App() {
  const [data, setData] = useState<any>(undefined);
  const [error, setError] = useState<any>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [assetDetails, setAssetDetails] = useState<any>(undefined);
  const [chartAssetData, setChartAssetData] = useState<APRHistory[] | undefined>(undefined);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(
          `https://api.multifarm.fi/jay_flamingo_random_6ix_vegas/get_assets?pg=1&tvl_min=50000&sort=tvlStaked&sort_order=desc&farms_tvl_staked_gte=10000000`
        );
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        let actualData = await response.json();
        setData(actualData.data);
      } catch(err: any) {
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }  
    }

    getData()
  }, [])

  useEffect(() => {
    if (data) {
      const asset = data.find((asset: any) => {
        return asset.assetId === "POLYGON_Aave__USDC"
      })
      setAssetDetails(asset);
    }
  }, [data])

  useEffect(() => {
    const date = new Date();
    let datesCollection = []
    if (assetDetails) {
      for (let i = 1; i < 31; i++) {
        const newDate = new Date(date.getTime() + i * 1000 * 60 * 60 * 24);
        datesCollection.push({date: `${newDate.getDate()}/${newDate.getMonth() + 1}/${newDate.getFullYear()}`, value: assetDetails.aprDaily * (Math.random() * (0.120 - 0.0200) + 0.0200)});
      }
      setChartAssetData(datesCollection);
    }
  }, [assetDetails])

  return (
    <div className="container">
      {assetDetails && <p className="asset">
        <a href="https://app.multifarm.fi/farms/ETH_Aave">{assetDetails.farm}</a>
        : {assetDetails.asset}
      </p>}

      {chartAssetData && 
      <div className="chart-container">
        <div className='single-chart'>
          <div className='chart-title-wrapper'>
            <p>Asset APR (y)</p>
          </div>
            <LineChart
              width={600}
              height={500}
              data={chartAssetData}
              margin={{
                top: 16,
                right: 16,
                bottom: 0,
                left: 24
              }}
            
            >
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="date" />
              <YAxis dataKey="value"/>
              <Line
                type="monotone"
                dataKey="value"
                dot={false}
                stroke="#8884d8"
              />
              <Tooltip />
            </LineChart>
        </div>

        <div className='single-chart'>
          <div className='chart-title-wrapper'>
            <p>Asset TVL</p>
          </div>
            <LineChart
              width={600}
              height={500}
              data={chartAssetData}
              margin={{
                top: 16,
                right: 16,
                bottom: 0,
                left: 24
              }}
            >
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="date" />
              <YAxis dataKey="value"/>
              <Line
                type="monotone"
                dataKey="value"
                dot={false}
                stroke="#8884d8"
              />
              <Tooltip />
            </LineChart>
        </div>
      </div>
      }
    </div>
  );
}

export default App;