import React, { useState } from "react";
import './App.css';
import "./styles.css";

function App() {
  const [error, setError] = useState('');

  const [numRows, setNumRows] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [startNum, setStartNum] = useState(0);
  const [endNum, setEndNum] = useState(0);
  const [accuracy, setAccuracy] = useState(0);

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (event.target.numRows.value < 0) {
      setError('N cant be negative!');
      return;
    }
    else{
      setError('');
    }

    const numRowsValue = parseInt(event.target.numRows.value);
    setNumRows(numRowsValue);

    const startNumValue = parseInt(event.target.startNum.value);
    setStartNum(startNumValue);

    const endNumValue = parseInt(event.target.endNum.value);
    setEndNum(endNumValue);

    const accuracyValue = parseInt(event.target.accuracy.value);
    setAccuracy(accuracyValue);

    function randomNumberInRange(min, max, accuracy) {
      return (Math.random() * (max - min) + min).toFixed(accuracy);
    }

    function getRealAccuracy(accuracy){
      switch (accuracy){
        case 2:
          return 0.01;
        case 3:
          return 0.001  ;
        case 4:
          return 0.0001;
      }
    }

    const calculatefx = (real, decimalPlaces) => {
      const m = mantissa(real).toFixed(decimalPlaces);
      return m * (Math.cos(20 * Math.PI * real) - Math.sin(real));
    };

    const calculategx = (fx, fmin, accuracyValue) => {
      return fx-fmin+accuracyValue;
    };

    const calculatepx = (gx, gxSum) => {
      return gx/gxSum;
    };

    function randomNumberInRange2(min, max) {
      return (Math.random() * (max - min) + min);
    }

    function getRealFromRange(reals, qxs, r){
      for (let i = 0; i < qxs.length; i++) {
        if(i==0){
          if (r>=0 && r<qxs[i])
            return reals[i];
        }
        else{
          if (r>=qxs[i-1] && r < qxs[i])
            return reals[i];
        }
      }
    }

    const mantissa = (real) => (Math.abs(real) % 1);

    const data = [];
    const reals = [];
    const fxs = [];
    const gxs = [];
    const pxs = [];
    const qxs = [];

    const realAccuracy = getRealAccuracy(accuracyValue)
    var gxSum = 0;
    var qx = 0.0;
    var min = 10000;
    for (let i = 0; i < numRowsValue; i++) {
      const real = randomNumberInRange(startNumValue, endNumValue, accuracyValue)
      const fx = calculatefx(real, accuracyValue)

      if (fx < min){
        min = fx;
      }

      reals.push(real)
      fxs.push(fx)
    }

    for (let i = 0; i < numRowsValue; i++) {
      const gx = calculategx(fxs[i], min, realAccuracy)
      gxSum += gx;
      gxs.push(gx)
    }

    for (let i = 0; i < numRowsValue; i++) {
      const px = calculatepx(gxs[i], gxSum)
      qx += px;
      pxs.push(px)
      qxs.push(qx)
    }

    for (let i = 0; i < numRowsValue; i++) {
      const r = randomNumberInRange2(0, 1)
      const ps = getRealFromRange(reals, qxs, r) 

      data.push({
        id: i + 1,
        real: reals[i],
        fx: fxs[i],
        gx: gxs[i],
        px: pxs[i],
        qx: qxs[i],
        r: r,
        ps: ps
      });
    }
    setTableData(data);
  };

  return (
    
    <div>
      <h1><center>Laboratorium 3 - Metody Inteligentnej Optymalizacji</center></h1>
      <form onSubmit={handleFormSubmit} id="form1" noValidate>
        <div class="input-group error">
          <label htmlFor="numRows">N:</label>
          <input type="number" id="numRows" name="numRows"  defaultValue={10}/>
          {error.length > 0 && 
                  <div class="error-message">{error}</div>}
        </div>
        
        <div class="input-group">
        <label htmlFor="startNum">A:</label>
        <input type="number" id="startNum" name="startNum" defaultValue={-4}/>
        </div>


        <div class="input-group">
        <label htmlFor="endNum">B:</label>
        <input type="number" id="endNum" name="endNum" defaultValue={12}/>
        </div>

        <div class="input-group">
          <label htmlFor="accuracy">Accuracy:</label>
          <select id="accuracy" name="accuracy">
            <option value={2}>0.01</option>
            <option value={3} selected>0.001</option>
            <option value={4}>0.0001</option>
          </select>
        </div>
        <br/>
        <button type="submit" id="submit">Generate Table</button>
      </form>
      <br/>
      <br/>
      {numRows > 0 && (
        <table id="table1">
          <thead>
            <tr>
              <th>LP</th>
              <th>x<sup>real</sup></th>
              <th>f(x<sup>real</sup>)</th>
              <th>g(x)</th>
              <th>P(x)</th>
              <th>q(x)</th>
              <th>r</th>
              <th>Populacja po selekcji x<sup>real</sup></th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((rowData, rowIndex) => (
              <tr key={rowData.id}>
                <td>{rowData.id}</td>
                <td>{rowData.real}</td>
                <td>{rowData.fx}</td>
                <td>{rowData.gx}</td>
                <td>{rowData.px}</td>
                <td>{rowData.qx}</td>
                <td>{rowData.r}</td>
                <td>{rowData.ps}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
