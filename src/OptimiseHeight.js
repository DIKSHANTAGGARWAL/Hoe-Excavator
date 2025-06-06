// HoeResultsPage.js

import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './OptimiseHeight.css';
import { useNavigate } from 'react-router-dom';

const OptimiseHeight = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const oldEfficiency = parseFloat(state.efficiency) || 1;
  const quantity = parseFloat(state.quantity) || 1;

  const [optimiseHeight, setOptimiseHeight] = useState(null);
  const [optimiseAngle, setOptimiseAngle] = useState(null);
  const [increaseEfficiency, setIncreaseEfficiency] = useState();
  const [newEfficiency, setNewEfficiency] = useState(oldEfficiency);


  let rows = state.resultsData;
  // rows = rows.map(item => {
  //   const originalProductivity = parseFloat(item.productivity)

  //   let newProductivity = originalProductivity;

  //   if (optimiseHeight) {
  //     newProductivity *= 1 / 0.8;
  //   }
  //   if (optimiseAngle) {
  //     newProductivity *= 1 / 0.8;
  //   }
  //   if (increaseEfficiency) {
  //     newProductivity *= newEfficiency / oldEfficiency;
  //   }

  //   const timeRequired = Math.ceil(quantity / newProductivity);
  //   const hireCostPerDay = parseFloat(item.cost) / parseFloat(item.timeRequired); // reverse-calculated
  //   const cost = hireCostPerDay * Math.ceil(timeRequired / 8);

  //   return {
  //     ...item,
  //     productivity: newProductivity.toFixed(2),
  //     timeRequired: Math.ceil(timeRequired / 8),
  //     cost: cost.toFixed(0)
  //   };

  // })

  rows = rows.map(item => {
    const originalProductivity = parseFloat(item.productivity);

    let newProductivity = originalProductivity;

    if (optimiseHeight) {
      newProductivity *= 1 / 0.8;
    }
    if (optimiseAngle) {
      newProductivity *= 1 / 0.8;
    }
    if (increaseEfficiency) {
      newProductivity *= newEfficiency / oldEfficiency;
    }

    const timeRequiredOriginal = Math.ceil(quantity / originalProductivity);
    const timeRequiredOptimised = Math.ceil(quantity / newProductivity);

    const hireCostPerDay = parseFloat(item.cost) / parseFloat(item.timeRequired); // reverse-calculated

    const costOriginal = hireCostPerDay * Math.ceil(timeRequiredOriginal / 8);
    const costOptimised = hireCostPerDay * Math.ceil(timeRequiredOptimised / 8);

    return {
      ...item,
      productivityOriginal: originalProductivity.toFixed(2),
      productivity: newProductivity.toFixed(2),
      timeRequiredOriginal: Math.ceil(timeRequiredOriginal / 8),
      timeRequired: Math.ceil(timeRequiredOptimised / 8),
      costOriginal: costOriginal.toFixed(0),
      cost: costOptimised.toFixed(0)
    };
  });


  const preferredRows = rows
    .filter(row => parseFloat(row.timeRequired) <= parseFloat(state.time))
    .sort((a, b) => parseFloat(a.cost) - parseFloat(b.cost));

  return (
    <div className={`container ${state.darkMode ? 'dark' : ''}`}>
      <h2 className="results-title">Optimised Excavator Bucket Capacity Analysis</h2>

      <div className="input-prompts">
        <div className="input-line">
          <span>Can you optimise height?</span>
          <button
            className={`inline-button ${optimiseHeight === true ? 'active' : ''}`}
            onClick={() => setOptimiseHeight(true)}
          >
            Yes
          </button>
          <button
            className={`inline-button ${optimiseHeight === false ? 'active' : ''}`}
            onClick={() => setOptimiseHeight(false)}
          >
            No
          </button>
        </div>

        <div className="input-line">
          <span>Can you reduce swing angle up to 60°?</span>
          <button
            className={`inline-button ${optimiseAngle === true ? 'active' : ''}`}
            onClick={() => setOptimiseAngle(true)}
          >
            Yes
          </button>
          <button
            className={`inline-button ${optimiseAngle === false ? 'active' : ''}`}
            onClick={() => setOptimiseAngle(false)}
          >
            No
          </button>
        </div>

        <div className="input-line">
          <span>Can you increase efficiency?</span>
          <button
            className={`inline-button ${increaseEfficiency === true ? 'active' : ''}`}
            onClick={() => setIncreaseEfficiency(true)}
          >
            Yes
          </button>
          <button
            className={`inline-button ${increaseEfficiency === false ? 'active' : ''}`}
            onClick={() => setIncreaseEfficiency(false)}
          >
            No
          </button>
          {increaseEfficiency && (
            <input
              type="number"
              className="efficiency-input"
              placeholder="If yes, by how much?"
              value={newEfficiency}
              min={oldEfficiency}
              max={60}
              onChange={e => {
                const value = parseFloat(e.target.value);
                if (value >= oldEfficiency && value <= 60) {
                  setNewEfficiency(value);
                }
              }}
            />
          )}
        </div>
      </div>


      {preferredRows.length === 0 ? (
        <div className="no-results-message">
          It is not possible to complete the work within the required time period with the given parameters.
        </div>
      ) : (
        <div className="results-table-wrapper">
          <h3 className="results-subtitle">Preferred Excavators (Time within limit and Lowest Cost)</h3>
          <table className="results-table preferred">
            <thead>
              <tr>
                <th>Bucket Capacity (yard³)</th>
                <th>Productivity<br /><span style={{ fontWeight: 'normal' }}>(m³/hr)</span></th>
                <th>Optimised Productivity<br /><span style={{ fontWeight: 'normal' }}>(m³/hr)</span></th>
                <th>Time Required<br /><span style={{ fontWeight: 'normal' }}>(days)</span></th>
                <th>Optimised Time<br /><span style={{ fontWeight: 'normal' }}>(days)</span></th>
                <th>Cost<br /><span style={{ fontWeight: 'normal' }}>(₹)</span></th>
                <th>Optimised Cost<br /><span style={{ fontWeight: 'normal' }}>(₹)</span></th>
                <th>Cost<br /><span style={{ fontWeight: 'normal' }}>(₹/m³)</span></th>
                <th>Optimised Cost<br /><span style={{ fontWeight: 'normal' }}>(₹/m³)</span></th>
                
              </tr>
            </thead>
            <tbody>
              {preferredRows.map((row, index) => (
                <tr key={index}>
                  <td>{row.bucketCapacity}</td>
                  <td>{row.productivityOriginal}</td>
                  <td>{row.productivity}</td>
                  <td>{row.timeRequiredOriginal}</td>
                  <td>{row.timeRequired}</td>
                  <td>{row.costOriginal}</td>
                  <td>{row.cost}</td>
                  <td>{row.costOriginal/(parseFloat(state.quantity) || 1)}</td>
                  <td>{row.cost/(parseFloat(state.quantity) || 1)}</td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
      <div className="buttons-wrapper">
        <button
          className="go-back-button"
          onClick={() => navigate('/results', { state })}
        >
          ← Previous Page
        </button>

      </div>


    </div>
  );
};

export default OptimiseHeight;
