import './App.css';
import Plot from 'react-plotly.js';
import cdcData from './data.json'
import geoData from './geojson-counties-fips.json'

function roundTo4(num) {
	  return Math.round(num * 10000) / 10000;
}

function App() {
	return (
		<div className="App">
			<div id="myDiv">
				{
					<Plot
						data={[
							{
								type: 'choroplethmapbox',
								locations: Object.keys(cdcData.counties),
								z: Object.values(cdcData.counties).map((value) => {
									if (value.suicideData.deaths === 0) {
										return 0;
									}
									return (value.suicideData.deaths / value.suicideData.population) * 100000;
								}),
								geojson: geoData,
								marker: {
									line: {
										color: 'rgba(0,0,0,0.6)',
										width: 0.05,
									},
								},
								hoverlabel: {
									bgcolor: 'rgb(0,0,0)',
									font: {
										color: 'white',
									},
								},
								hovertemplate: Object.values(cdcData.counties).map((value) => {
									return `<b>
										County: ${value.location.county}<br>
										State: ${value.location.state}<br>
										Suicide Rate: <span style="color:red;">${
											value.suicideData.deaths === 0
												? 'less than ' + roundTo4((10 / value.suicideData.population) * 100)
												: roundTo4((value.suicideData.deaths / value.suicideData.population) * 100)
										}%</span><br>
										Number of Suicide Deaths: <span style="color:red;">${value.suicideData.deaths === 0 ? 'less than 10' : value.suicideData.deaths}</span><br>
										Non-Christian Percent: <span style="color:red;">${roundTo4(
											100 -
												(value.religiousData['trinitarian-christian-attendance'] +
													value.religiousData['non-trinitarian-christian-attendance'])
										)}%</span></b><extra></extra>`;
								}),
								colorbar: {
									title: {
										text: '(2020 Suicide Deaths / Population) * 100000',
										side: 'right',
									},
								},
							},
						]}
						layout={{
							title: '<b>2020 Suicide Data Map Test</b><br>This map illustrates the number of people who died by suicide across the counties of the United States.<br><a href="https://wonder.cdc.gov/ucd-icd10.html" target="_blank" rel="noreferrer">Health Data Source: CDC WONDER</a>, <a href="http://usreligioncensus.org/" target="_blank" rel="noreferrer">Religion Data Source: US Religion Census</a>',
							mapbox: { center: { lon: -98, lat: 38 }, zoom: 2, style: 'open-street-map' },
							width: window.innerWidth * 0.95,
							height: window.innerHeight * 0.95,
						}}
					/>
				}
			</div>
		</div>
	);
}

export default App;
