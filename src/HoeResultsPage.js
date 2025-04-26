// HoeResultsPage.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import './HoeResultsPage.css';
import { useNavigate } from 'react-router-dom';

const HoeResultsPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();


    const bucketCapacities = [0.375, 0.75, 1.0, 1.5, 2, 2.5, 3.0, 3.5, 4.0, 5.0]; // Example values

    const rows = bucketCapacities.map((capacity, index) => {

        const maxDepthMap = {
            0.375: 13.5,
            0.75: 18,
            1.0: 21,
            1.5: 20.5,
            2: 21.5,
            2.5: 23,
            3.0: 25,
            3.5: 21.5,
            4.0: 27,
            5.0: 25.5,
        };
        const maxDepth = maxDepthMap[capacity] || 4;
        const depthPercent = (parseFloat(state.depth) / maxDepth) * 100;

        const angle = parseFloat(state.angle);
        const depthInRange = depthPercent >= 30 && depthPercent <= 60;
        const angleInRange = angle >= 30 && angle <= 60;

        // SDC Logic
        let sdc = 1;
        if (angleInRange && depthInRange) {
            sdc = 1;
        } else if (angleInRange && !depthInRange) {
            sdc = 0.8;
        } else if (!angleInRange && depthInRange) {
            sdc = 0.8;
        } else {
            sdc = 0.8 * 0.8;
        }

        //CT
        let ct = 14;
        if (capacity < 1.0) {
            ct = 14;
        } else if (capacity <= 1.5) {
            ct = 15;
        } else if (capacity <= 2.5) {
            ct = 17;
        } else if (capacity <= 3.0) {
            ct = 20;
        } else if (capacity <= 3.5) {
            ct = 22;
        } else if (capacity <= 4.0) {
            ct = 22;
        } else {
            ct = 24;
        }

        const hireCosts = state.hireCosts
        const getHireCostPerDay = (inputCapacity) => {
            for (const { capacity, value } of hireCosts) {
                if (capacity.includes('-')) {
                    const [min, max] = capacity.split('-').map(c => parseFloat(c.trim()));
                    if (inputCapacity >= min && inputCapacity <= max) return value;
                } else if (capacity.includes('<')) {
                    const max = parseFloat(capacity.replace('<', '').trim());
                    if (inputCapacity < max) return value;
                } else {
                    const exact = parseFloat(capacity);
                    if (inputCapacity === exact) return value;
                }
            }
            return 20000;
        };



        console.log(capacity, state.efficiency, state.fillFactor, state.swellFactor, sdc, ct, state.time);
        const productivity = 3600 * capacity * parseFloat(state.efficiency || 1) / 60 * parseFloat(state.fillFactor || 1) * parseFloat(state.swellFactor || 1) * sdc * 0.76 / ct; // simple mock
        const timeRequired = (parseFloat(state.quantity) || 1) / productivity;

        const hireCostPerDay = getHireCostPerDay(capacity);
        const cost = hireCostPerDay * Math.ceil(timeRequired / 8); // Assuming 8 hours of work per day

        return {
            sNo: index + 1,
            bucketCapacity: capacity,
            productivity: productivity.toFixed(2),
            timeRequired: Math.ceil(timeRequired / 8),
            cost: cost.toFixed(0),
        };
    });

    const preferredRows = rows
        .filter(row => parseFloat(row.timeRequired) <= parseFloat(state.time))
        .sort((a, b) => parseFloat(a.cost) - parseFloat(b.cost));

    const resultsData = rows.map(row => ({
        bucketCapacity: row.bucketCapacity,
        productivity: row.productivity,
        timeRequired: row.timeRequired,
        cost: row.cost
    }));

    return (
        <div className={`container ${state.darkMode ? 'dark' : ''}`}>
            <h2 className="results-title">Excavator Bucket Capacity Analysis</h2>

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
                                {/* <th>S.No</th> */}
                                <th>Bucket Capacity (yard³)</th>
                                <th>Productivity (m³/hr)</th>
                                <th>Time Required (days)</th>
                                <th>Cost Required (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {preferredRows.map((row, index) => (
                                <tr key={index}>
                                    {/* <td>{row.sNo}</td> */}
                                    <td>{row.bucketCapacity}</td>
                                    <td>{row.productivity}</td>
                                    <td>{row.timeRequired}</td>
                                    <td>{row.cost}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <div className="buttons-wrapper">
                <button
                    className="go-back-button"
                    onClick={() => navigate('/', { state })}
                >
                    ← Change Input Values
                </button>
                <button
                    className="go-back-button"
                    onClick={() => navigate('/optimise-cost', {
                        state: {
                            ...state, // pass previous input state too
                            resultsData // pass this new results data!
                        }
                    })}
                >
                    → Optimise Cost
                </button>
            </div>


        </div>
    );
};

export default HoeResultsPage;
