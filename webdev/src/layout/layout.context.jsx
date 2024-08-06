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
    currentLimitAlert: '', setCurrentLimitAlert: () => { },
    inputAlert: '', setInputAlert: () => {}
  },
  sliders: [0, 0, 0, 0, 0, 0, 0, 0], setSlider: () => { },
  clickSetInput: () => { },
  currentLimits: [0, 0, 0, 0, 0, 0, 0, 0], setCurrentLimit: () => { },
  checkboxs: [false, false, false, false, false, false, false, false], setCheckbox: () => { },
  switchs: [false, false, false, false, false, false, false, false], setSwitch: () => { },
  inputs: [[[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]], setInput: () => { },
})

export function LayoutProvider(props) {
  const [login, setLogin] = useState(false)
  const [vsupply, setVsupply] = useState(0)
  const [tmcu, setTmcu] = useState(0)
  const [sliders, setSliders] = useState([0, 0, 0, 0, 0, 0, 0, 0])
  const [currentLimits, setCurrentLimits] = useState([0, 0, 0, 0, 0, 0, 0, 0])
  const [inputs, setInputs] = useState([[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]])
  const [switchs, setSwithcs] = useState([false, false, false, false, false, false, false, false])
  const [checkboxs, setCheckboxs] = useState([false, false, false, false, false, false, false, false])

  const [notification, setNotification] = useState(false)

  const [tempAlert, setTempAlert] = useState('')
  const [modbusAlertCoil1, setModbusAlertCoil1] = useState('')
  const [modbusAlertCoil2, setModbusAlertCoil2] = useState('')
  const [modbusAlertRate, setModbusAlertRate] = useState('')
  const [tempFormAlert, setTempFormAlert] = useState('')
  const [currentLimitAlert, setCurrentLimitAlert] = useState('')
  const [inputAlert, setInputAlert] = useState('')

  const setSlider = async (index, value) => {
    fetch(`http://${import.meta.env.VITE_IP}:${import.meta.env.VITE_PORT}/api/outputs`, {
      method: 'POST',
      body: { id: `sliders-${index}`, value }
    }).then(i => i.json()).then((() => {
      setSliders(i => i.map((v, i) => i === index ? value : v))
    }))
  }
  const setCurrentLimit = async (index, value) => {
    if (value >= 500 && value <= 3000) {
      await fetch(`http://${import.meta.env.VITE_IP}:${import.meta.env.VITE_PORT}/api/outputs`, {
        method: 'POST',
        body: { id: `current_limits-${index}`, value }
      }).then(j => j.json())
    }
    setCurrentLimits(i => i.map((v, i) => i === index ? value : v))
  }

  const setInput = (index, innerIndex, value) => {
    setInputs(i => i.map((v, i) => i === index ? (innerIndex === 0 ? [value, v[1]] : [v[0], +value ]) : v))
  }
  const setCheckbox = (index, value) => {
    fetch(`http://${import.meta.env.VITE_IP}:${import.meta.env.VITE_PORT}/api/outputs`, {
      method: 'POST',
      body: { id: `checkboxs-${index}`, value }
    }).then(i => i.json()).then((() => {
      setCheckboxs(i => i.map((v, i) => i === index ? value : v))
    }))
  }

  const clickSetInput = (index, value) => {
    if (value >= 0 && value <= 30)
      return fetch(`http://${import.meta.env.VITE_IP}:${import.meta.env.VITE_PORT}/api/inputs`, {
        method: 'POST',
        body: { id: `digital_thershold-${index}`, value }
      }).then(i => i.json())
  }

  const setSwitch = (index, value) => {
    fetch(`http://${import.meta.env.VITE_IP}:${import.meta.env.VITE_PORT}/api/outputs`, {
      method: 'POST',
      body: { id: `switchs-${index}`, value }
    }).then(i => i.json()).then((() => {
      setSwithcs(i => i.map((v, i) => i === index ? value : v))
      setSliders(i => i.map((v, i) => i === index ? (value ? 100 : 0) : v))
      if (checkboxs[index]) return;
      setTimeout(() => {
        fetch(`http://${import.meta.env.VITE_IP}:${import.meta.env.VITE_PORT}/api/outputs`, {
          method: 'POST',
          body: { id: `switchs-${index}`, value }
        }).then(i => i.json()).then((() => {
          setSwithcs(i => i.map((v, i) => i === index ? false : v))
          setSliders(i => i.map((v, i) => i === index ? 0 : v))
        }))
      }, 500)
    }))
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
    // TODO: Cambiado esto
    fetch(`http://${import.meta.env.VITE_IP}:${import.meta.env.VITE_PORT}/api/outputs`).then(i => i.json()).then((data) => {
      if (data.sliders) setSliders(data.sliders)
      if (data.currentLimits) setCurrentLimits(data.currentLimits)
      if (data.checkboxs) setCheckboxs(data.checkboxs)
      if (data.switchs) setSwithcs(data.switchs)
    })
    fetch(`http://${import.meta.env.VITE_IP}:${import.meta.env.VITE_PORT}/api/inputs`).then(i => i.json()).then((data) => {
      if (data.inputs) setInputs(data.inputs)
    })
  }, []);

  useEffect(() => {
    const hasError = currentLimits.find(i => (i < 500 || i > 3000))
    if (hasError) setCurrentLimitAlert('Current range can only be 0.5 to 3A!')
    else setCurrentLimitAlert('')
  }, [currentLimits])

  useEffect(() => {
    const hasError = inputs.find(i => (i[1] < 0 || i[1] > 30))
    if (hasError) setInputAlert('Input range can only be 0 to 30ma!')
    else setInputAlert('')
  }, [inputs])

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
        currentLimitAlert, setCurrentLimitAlert,
        inputAlert, setInputAlert,
      },
      sliders, setSlider,
      checkboxs, setCheckbox,
      switchs, setSwitch,
      inputs, setInput,
      currentLimits, setCurrentLimit,
      clickSetInput,
    }}>
      {props.children}
    </LayoutContext.Provider>
  )
} 