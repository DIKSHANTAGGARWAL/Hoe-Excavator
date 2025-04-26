import React, { useEffect, useState } from 'react';
import './HoeExcavatorSelector.css';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';


const HoeExcavatorSelector = () => {
  const [quantity, setQuantity] = useState('');
  const [time, setTime] = useState('');

  const [selectedSoil, setSelectedSoil] = useState('');
  const [swellFactor, setSwellFactor] = useState('');
  const [fillFactor, setFillFactor] = useState('');

  const [angle, setAngle] = useState('');
  const [depth, setDepth] = useState('');

  const [efficiency, setEfficiency] = useState('');

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const [ hireCosts, setHireCosts] = useState([
    { capacity: "< 1", value: 12000 },
    { capacity: "1 - 1.5", value: 15000 },
    { capacity: "1.5 - 2.5", value: 18000 },
    { capacity: "3", value: 22000 },
    { capacity: "3.5", value: 25000 },
    { capacity: "4", value: 32000 },
    { capacity: "5", value: 35000 }
  ]);


  const navigate = useNavigate();

  const location = useLocation();


  useEffect(() => {
    const inputs = localStorage.getItem('hoeExcavatorInputs')
    if (inputs) {
      const { quantity, time, swellFactor, fillFactor, angle, depth, efficiency, darkMode,hireCosts } = JSON.parse(inputs);
      setQuantity(quantity || '');
      setTime(time || '');
      setSwellFactor(swellFactor || '');
      setFillFactor(fillFactor || '');
      setAngle(angle || '');
      setDepth(depth || '');
      setEfficiency(efficiency || '');
      setDarkMode(darkMode || false);
      setHireCosts(hireCosts || [])
    }

  }, [])

  const handleAnalyze = () => {
    if (!quantity || !time || !swellFactor || !angle || !depth || !efficiency) {
      alert('Please fill all fields.');
      return;
    }
    localStorage.setItem('hoeExcavatorInputs', JSON.stringify({
      quantity,
      time,
      swellFactor,
      fillFactor,
      angle,
      depth,
      efficiency,
      darkMode,
      hireCosts
    }))

    navigate('/results', {
      state: {
        quantity,
        time,
        swellFactor,
        fillFactor,
        angle,
        depth,
        efficiency,
        darkMode,
        hireCosts
      },
    });
  };

  const handleClear = () => {
    // Reset all the form values
    setQuantity('');
    setTime('');
    setSwellFactor('');
    setFillFactor('');
    setAngle('');
    setDepth('');
    setEfficiency('');
    setDarkMode(false);
    setHireCosts([{ capacity: "< 1", value: 12000 },
      { capacity: "1 - 1.5", value: 15000 },
      { capacity: "1.5 - 2.5", value: 18000 },
      { capacity: "3", value: 22000 },
      { capacity: "3.5", value: 25000 },
      { capacity: "4", value: 32000 },
      { capacity: "5", value: 35000 }])

    // Remove data from localStorage
    localStorage.removeItem('hoeExcavatorInputs');
  };

  return (
    <div className={`full-container ${darkMode ? 'dark' : ''}`}>
      <motion.h1 className="title" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        Hoe Excavator Selector
      </motion.h1>

      <button className="clear-button" onClick={handleClear}>Clear</button>
      {/* <button className="dark-toggle" onClick={() => setDarkMode(!darkMode)}>
        Toggle {darkMode ? 'Light' : 'Dark'} Mode
      </button> */}

      <div className="form-grid">
        <div className="form-group">
          <label>Total Quantity to be Cut</label>
          <input
            type="number"
            placeholder="In cubic meters"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Total Time Available</label>
          <input
            type="number"
            placeholder="In days"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Soil Type</label>
          <select
            value={swellFactor ? `${swellFactor},${fillFactor}` : ''}
            onChange={(e) => {
              const [swell, fill] = e.target.value.split(',');
              const selectedText = e.target.options[e.target.selectedIndex].text;
              setSwellFactor(swell);
              setFillFactor(fill);
              setSelectedSoil(selectedText);
            }}
          >
            <option value="">Soil Type</option>
            <option value="0.74,1.02">Dry Clay</option>
            <option value="0.74,1.05">Wet Clay</option>
            <option value="0.80,1.0">Dry Earth</option>
            <option value="0.80,1.0">Wet Earth</option>
            <option value="0.83,1.0">Earth & Gravel</option>
            <option value="0.89,1.02">Dry Gravel</option>
            <option value="0.88,1.02">Wet Gravel</option>
            <option value="0.63,1.0">Limestone</option>
            <option value="0.63,0.45">Well Blasted Rock</option>
            <option value="0.63,0.45">Poorly Blasted Rock</option>
            <option value="0.87,1.02">Dry Sand</option>
            <option value="0.87,1.02">Wet Sand</option>
            <option value="0.71,1.0">Shale</option>
          </select>
        </div>

        <div className="form-group">
          <label>Swing Angle</label>
          <input
            type="number"
            placeholder="In degrees (30–90)"
            value={angle}
            onChange={(e) => setAngle(e.target.value)}
            onBlur={() => {
              if (angle && (angle < 30 || angle > 90)) {
                alert('Please enter a value between 30 and 90 degrees');
                setAngle('');
              }
            }}
          />
        </div>

        <div className="form-group">
          <label>Average Depth of Cut</label>
          <input
            type="number"
            placeholder="In feet (5–40)"
            value={depth}
            onChange={(e) => setDepth(e.target.value)}
            onBlur={() => {
              if (depth && (depth < 5 || depth > 40)) {
                alert('Please enter a value between 5 and 40 feet');
                setDepth('');
              }
            }}
          />
        </div>



        <div className="form-group">
          <label>Efficiency</label>
          <input
            type="number"
            placeholder="Per hour (10–60)"
            value={efficiency}
            onChange={(e) => setEfficiency(e.target.value)}
            onBlur={() => {
              if (efficiency && (efficiency < 10 || efficiency > 60)) {
                alert('Please enter a value between 10 and 60');
                setEfficiency('');
              }
            }}
          />
        </div>

        <div className="form-group full-width">
          <div className="cost-table-wrapper">
            <label className="section-heading">Hire Cost Per Day (Editable)</label>
            <div className="cost-table-container">
              <table className="cost-table styled-table">
                <thead>
                  <tr>
                    <th>Bucket Capacity (yard³)</th>
                    <th>Cost per Day (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {hireCosts.map((row, index) => (
                    <tr key={index}>
                      <td>{row.capacity}</td>
                      <td>
                        <input
                          type="number"
                          className="cost-input"
                          value={row.value}
                          onChange={(e) => {
                            const newCosts = [...hireCosts];
                            newCosts[index].value = parseInt(e.target.value) || 0;
                            setHireCosts(newCosts);
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>



        <button onClick={handleAnalyze} className="analyze-button">
          Analyze
        </button>

        {loading && <div className="spinner"></div>}
        {result && !loading && (
          <motion.div
            className="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            Recommended Excavator: {result}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HoeExcavatorSelector;
