import { createContext, useCallback, useEffect, useRef, useState } from "react";

// Socket connection management
const socket = new WebSocket(`ws://${window.location.hostname}:80/ws`);

export const LayoutContext = createContext({
  login: false,
  vsupply: 0, setVsupply: () => { },
  tmcu: 0, setTmcu: () => { },
  notification: true, setNotification: () => { },
  alerts: {
    tempAlert: '', setTempAlert: () => { },
    modbusAlertCoil1: '', setModbusAlertCoil1: () => { },
    modbusAlertCoil2: '', setModbusAlertCoil2: () => { },
    modbusAlertRate: '', setModbusAlertRate: () => { },
    tempFormAlert: '', setTempFormAlert: () => { },
  },
  sliders: [0,0,0,0,0,0,0,0], setSlider: () => { },
  checkboxs: [false,false,false,false,false,false,false,false], setCheckbox: () => {},
  switchs: [false,false,false,false,false,false,false,false], setSwitch: () => {},
  inputs: [[[0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0]]], setInput: () => {},
})

export function LayoutProvider(props) {
  const [login, setLogin] = useState(false)
  const [vsupply, setVsupply] = useState(0)
  const [tmcu, setTmcu] = useState(0)
  const [sliders, setSliders] = useState([0, 0, 0, 0, 0, 0, 0, 0])
  const [inputs, setInputs] = useState([[0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0]])
  const [switchs, setSwithcs] = useState([false,false,false,false,false,false,false,false])
  const [checkboxs, setCheckboxs] = useState([false,false,false,false,false,false,false,false])

  const [notification, setNotification] = useState(false)
  
  const [tempAlert, setTempAlert] = useState('')
  const [modbusAlertCoil1, setModbusAlertCoil1] = useState('')
  const [modbusAlertCoil2, setModbusAlertCoil2] = useState('')
  const [modbusAlertRate, setModbusAlertRate] = useState('')
  const [tempFormAlert, setTempFormAlert] = useState('')

  const setSlider = (index, value) => {
    setSliders(i => i.map((v, i) => i === index ? value : v))
  }
  const setInput = (index, innerIndex, value) => {
    setInputs(i => i.map((v, i) => i === index ? (innerIndex === 0 ? [value, v[1]] :  [v[0], value]) : v))
  }
  const setCheckbox = (index, value) => {
    setCheckboxs(i => i.map((v, i) => i === index ? value : v))
  }

  const setSwitch = (index, value) => {
    setSwithcs(i => i.map((v, i) => i === index ? value : v))
    setSliders(i => i.map((v, i) => i === index ? (value ? 100 : 0) : v))
    if (checkboxs[index]) return;
    setTimeout(() => {
      setSwithcs(i => i.map((v, i) => i === index ? false : v))
      setSliders(i => i.map((v, i) => i === index ? 0 : v))
    }, 500);
  }

  socket.onmessage = useCallback((evt) => {
    if (!evt.data) return;
    if (evt.data === 'h') return; // Heartbeat ingnored
    const now = new Date()
    const parsedData = JSON.parse(evt.data);
    setTmcu(parsedData.tmcu)
    setVsupply(parsedData.vsupply)
  }, []);

  const handleSetLogin = (value) => {
    window.localStorage.setItem('login', value ? 'true' : 'false')
    setLogin(value)
  }

  useEffect(() => {
    setLogin(window.localStorage.getItem('login') === 'true')
    socket.onclose = () => {
      console.log('Conexión cerrada. Intentando reconectar en 5 segundos...');
      setTimeout(() => {
        console.log('5 segundos...');
      }, 5000);
    };
  }, []);

  return (
    <LayoutContext.Provider value={{
      login, setLogin: handleSetLogin,
      vsupply, setVsupply,
      tmcu, setTmcu,
      notification, setNotification,
      alerts: {
        tempAlert, setTempAlert,
        modbusAlertCoil1, setModbusAlertCoil1,
        modbusAlertCoil2, setModbusAlertCoil2,
        modbusAlertRate, setModbusAlertRate,
        tempFormAlert, setTempFormAlert,
      },
      sliders, setSlider,
      checkboxs, setCheckbox,
      switchs, setSwitch,
      inputs, setInput,
    }}>
      {props.children}
    </LayoutContext.Provider>
  )
} 