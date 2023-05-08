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

  var prevChild = null;
  var mutPoints = [];

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (event.target.numRows.value < 0) {
      setError('N cant be negative!');
      return;
    }
    else{
      setError('');
    }

    if (event.target.pk.value < 0 && event.target.pk.value > 1) {
      setError('Pk cant be less then 0 or greater than 1');
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

    const pkValue = event.target.pk.value;
    const pmValue = event.target.pm.value;

    const l = calculateL();

    function randomNumberInRange(min, max, accuracy) {
      return (Math.random() * (max - min) + min).toFixed(accuracy);
    }

    function calculateL(){
      var numberOfSolutions = (endNumValue - startNumValue) * Math.pow(10, accuracyValue) + 1
      var l = 0
      while(true) {
        if(Math.pow(2, l) >= numberOfSolutions) {
          break;
        }
        l++
      }
      return l
    }

    function realToInt(real, l) {
      return Math.ceil((1/(endNumValue - startNumValue)) * (real - startNumValue) * (Math.pow(2, l) - 1));
    }

    function intToBin(xint, l) {
      const bin = xint.toString(2);
      let result = '';
      if (bin.length < l) {
        for (let i = (l-bin.length); i > 0; i--) {
          result += '0';
        }
      }
      result += bin;
      return result;
    }

    function getBn(bin, r1){
      if(r1 <= pkValue){
        return bin;
      }
      else{
        return null;
      }
    }

    function getRealAccuracy(accuracy){
      switch (accuracy){
        case 2:
          return 0.01;
        case 3:
          return 0.001;
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

    function randomNumberInRange3(min, max) {
      return parseInt(Math.random() * (max - min) + min);
    }

    function crossing(bn, pc) {
      if(!prevChild){
        prevChild = bn;
      }
      else{
        makeCrossing(prevChild, bn, pc)
      }
    }

    function makeCrossing(bn, bn1, pc){
      const p1 = bn?.substring(0, bn.length - pc)
      const p2 = bn?.substring(bn.length - pc)
      const p11 = bn1?.substring(0, bn.length - pc)
      const p21 = bn1?.substring(bn.length - pc)
      bn = p1+p21;
      bn1 = p11+p2;
      childs.push(bn)
      childs.push(bn1)
      prevChild = null;
    }

    function makeCrossing1(bn, bn1, pc){
      const p1 = bn?.substring(0, bn.length - pc)
      const p2 = bn?.substring(bn.length - pc)
      const p11 = bn1?.substring(0, bn.length - pc)
      const p21 = bn1?.substring(bn.length - pc)
      bn = p1+p21;
      bn1 = p11+p2;
      childs.push(bn)
      prevChild = null;
    }

    function findMutationPoints(cross){
      var crossList = [...cross];
      let result = '';
      mutPoints = [];
      for (let i = 0; i < crossList.length; i++) {
        const rnd = randomNumberInRange2(0, 1)
        
        if (rnd <= pmValue){
          mutPoints.push(i+1)
          switch (crossList[i]){
            case '1':
              crossList[i] = 0;
              break;
            case '0':
              crossList[i] = 1;
              break;
          }
        }
        result+= crossList[i]
      }
      return result;
    }

    function binToReal(xbin, accuracyValue, l) {
      var xint = parseInt(xbin, 2);
      return ((xint * (endNumValue - startNumValue))/(Math.pow(2, l) - 1) + startNumValue).toFixed(accuracyValue);
    }

    function binToInt(xbin) {
      return parseInt(xbin, 2);
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
    const pss = [];
    const bins = [];
    const bns = [];
    const pcs = [];
    const childs = [];


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

    var counter = 0;
    for (let i = 0; i < numRowsValue; i++) {
      const r = randomNumberInRange2(0, 1)
      const ps = getRealFromRange(reals, qxs, r)
      pss.push(ps) 
      const l = calculateL()
      const int = realToInt(ps, l)
      const bin = intToBin(int, l)
      bins.push(bin)
      const r1 = randomNumberInRange2(0, 1)
      const bn = getBn(bin, r1)
      var pc;
      var prevPc;
      if(bn != null){
        bns.push(bn.toString())
        if(counter%2 == 0){
          pc = randomNumberInRange3(1, l)
          pcs.push(pc)
          prevPc = pc;
        }
        else{
          pcs.push(prevPc);
        }
        counter++;
      }
      else{
        pcs.push(null)
        bns.push(null)
      }
    }

    var lastChildIndex = null;
    for (let i = 0; i < numRowsValue; i++) {
      if(bns[i] != null){
        crossing(bns[i], pcs[i])
        lastChildIndex = i;
      }
    }

    if(prevChild){
      makeCrossing1(prevChild, bns[lastChildIndex], pcs[lastChildIndex])
    }

    counter = 0;
    for (let i = 0; i < numRowsValue; i++) {
      
      if(!bns[i]){
        const mut = findMutationPoints(bins[i])
        const real = binToReal(mut, accuracyValue, l)
        const fx = calculatefx(real, accuracyValue)
        data.push({
          id: i + 1,
          ps: pss[i],
          bin: bins[i],
          bn: bns[i],
          pc: pcs[i],
          child: null,
          cross: bins[i],
          mutPoints: mutPoints,
          mut: mut,
          real: real,
          fx: fx
        });
      }
      else{
        const mut = findMutationPoints(childs[counter])
        const real = binToReal(mut, accuracyValue, l)
        const fx = calculatefx(real, accuracyValue)
        data.push({
          id: i + 1,
          ps: pss[i],
          bin: bins[i],
          bn: bns[i],
          pc: pcs[i],
          child: childs[counter],
          cross: childs[counter],
          mutPoints: mutPoints,
          mut: mut,
          real: real,
          fx: fx
        });
        counter++;
      }
    }
    setTableData(data);
  };

  return ( 
    <div>
      <h1><center>Laboratorium 4 - Metody Inteligentnej Optymalizacji</center></h1>
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

        <div class="input-group">
          <label htmlFor="pk">Pk:</label>
          <input type="number" id="pk" name="pk" min="0.0" max="1.0" defaultValue={0.75}/>
          {error.length > 0 && 
                    <div class="error-message">{error}</div>}
        </div>

        <div class="input-group">
          <label htmlFor="pm">Pm:</label>
          <input type="number" id="pm" name="pm" min="0.0" max="0.01" defaultValue={0.005}/>
          {error.length > 0 && 
                    <div class="error-message">{error}</div>}
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
              <th>Populacja po selekcji x<sup>real</sup></th>
              <th>x<sup>bin</sup></th>
              <th>Populacja rodziców b(n)</th>
              <th>Pc</th>
              <th>Populacja dzieci (bin)</th>
              <th>Populacja po krzyżowaniu</th>
              <th>Punkty mutacji</th>
              <th>Populacja po mutacji</th>
              <th>Populacja po mutacji x<sup>real</sup></th>
              <th>f(x)</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((rowData, rowIndex) => (
              <tr key={rowData.id}>
                <td>{rowData.id}</td>
                <td>{rowData.ps}</td>
                <td>{rowData.bin}</td>
                <td>{rowData.bn}</td>
                <td>{rowData.pc}</td>
                <td>{rowData.child}</td>
                <td>{rowData.cross}</td>
                <td>{rowData.mutPoints.map((item) => 
                               item+" "
                             )}</td>
                <td>{rowData.mut}</td>
                <td>{rowData.real}</td>
                <td>{rowData.fx}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
