import { createContext, useCallback, useEffect, useState } from "react";

// Socket connection management
const socket = new WebSocket( `ws://${ window.location.hostname }:80/ws` );

export const LayoutContext = createContext( {
  login: false,
  heartbit: false, setHeartbit: () => { },
  vsupply: 0.0, setVsupply: () => { },
  tmcu: 0.0, setTmcu: () => { },
  tsens: 0.0, setTsens: () => { },
  notification: true, setNotification: () => { },
  alerts: {
    tempAlert: '', setTempAlert: () => { },
    modbusAlertCoil1: '', setModbusAlertCoil1: () => { },
    modbusAlertCoil2: '', setModbusAlertCoil2: () => { },
    modbusAlertRate: '', setModbusAlertRate: () => { },
    tempFormAlert: '', setTempFormAlert: () => { },
    currentLimitAlert: '', setCurrentLimitAlert: () => { },
    thresholdAlert: '', setThresholdAlert: () => { }
  },
  sliders: [ 0, 0, 0, 0, 0, 0, 0, 0 ], setSlider: () => { },
  serials: [], setSerials: () => { }, setSerial: () => { },
  checkboxs: [ false, false, false, false, false, false, false, false ], setCheckbox: () => { },
  switchs: [ false, false, false, false, false, false, false, false ], setSwitch: () => { },
  currentLimits: [ 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5 ], setCurrentLimit: () => { },
  inputs: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], setInputs: () => { },
  readings: [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ], setReadings: () => { },
  thresholds: [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ], setThresholds: () => { },
  clickSetThreshold: () => { },
} )

export function LayoutProvider ( props ) {
  const [ login, setLogin ] = useState( false )
  const [ heartbit, setHeartbit ] = useState( false )
  const [ vsupply, setVsupply ] = useState( 0.0 )
  const [ tmcu, setTmcu ] = useState( 0.0 )
  const [ tsens, setTsens ] = useState( 0.0 )
  const [ serials, setSerials ] = useState( [] )
  const [ sliders, setSliders ] = useState( [ 0, 0, 0, 0, 0, 0, 0, 0 ] )
  const [ currentLimits, setCurrentLimits ] = useState( [ 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5 ] )
  const [ inputs, setInputs ] = useState( [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] )
  const [ readings, setReadings ] = useState( [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ] )
  const [ thresholds, setThresholds ] = useState( [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ] )
  const [ switchs, setSwithcs ] = useState( [ false, false, false, false, false, false, false, false ] )
  const [ checkboxs, setCheckboxs ] = useState( [ false, false, false, false, false, false, false, false ] )
  const [ notification, setNotification ] = useState( false )
  const [ tempAlert, setTempAlert ] = useState( '' )
  const [ modbusAlertCoil1, setModbusAlertCoil1 ] = useState( '' )
  const [ modbusAlertCoil2, setModbusAlertCoil2 ] = useState( '' )
  const [ modbusAlertRate, setModbusAlertRate ] = useState( '' )
  const [ tempFormAlert, setTempFormAlert ] = useState( '' )
  const [ currentLimitAlert, setCurrentLimitAlert ] = useState( '' )
  const [ thresholdAlert, setThresholdAlert ] = useState( '' )

  const doHeartbit = () => {setHeartbit( !heartbit )}

  const setSlider = async ( index, value ) => {
    fetch( `http://${ import.meta.env.VITE_IP }:${ import.meta.env.VITE_PORT }/api/outputs/settings`, {
      method: 'POST',
      body: JSON.stringify( { "analog": { "index": index, "value": value } } )
    } ).then( ( () => {
      doHeartbit()
      setSliders( i => i.map( ( v, i ) => i === index ? value : v ) )
    } ) )
  }

  const setCurrentLimit = async ( index, value ) => {
    if ( value >= 0.5 && value <= 3 ) {
      setCurrentLimits( i => i.map( ( v, i ) => i === index ? value : v) )
    }
  }

  const clickSetCurrentLimit = async ( index, value ) => {
    if ( value >= 0.5 && value <= 3 ) {
      await fetch( `http://${ import.meta.env.VITE_IP }:${ import.meta.env.VITE_PORT }/api/outputs/settings`, {
        method: 'POST',
        body: JSON.stringify( { "limit": { "index": index, "value": value } } )
      } ).then( () => { doHeartbit() } )
    }
  }

  const setThreshold = ( index, value ) => {
    if ( value >= 0 && value <= 30 ) {
      setThresholds( i => i.map( ( v, i ) => i === index ? value : v ) )
    }
  }

  const setCheckbox = ( index, value ) => {
    setCheckboxs( i => i.map( ( v, i ) => i === index ? value : v ) )
  }

  const clickSetThreshold = ( index, value ) => {
    if ( value >= 0 && value <= 30 ) {
      return fetch( `http://${ import.meta.env.VITE_IP }:${ import.meta.env.VITE_PORT }/api/inputs/settings`, {
        method: 'POST',
        body: JSON.stringify( { "threshold": { "index": index, "value": value } } )
      } ).then( ( () => doHeartbit() ) )
    }
  }

  const setSwitch = ( index, value ) => {
    fetch( `http://${ import.meta.env.VITE_IP }:${ import.meta.env.VITE_PORT }/api/outputs/settings`, {
      method: 'POST',
      body: JSON.stringify( { "digital": { "index": index, "value": value } } )
    } ).then( ( () => {
      doHeartbit()
      setSwithcs( i => i.map( ( v, i ) => i === index ? value : v ) )
      setSliders( i => i.map( ( v, i ) => i === index ? ( value ? 100 : 0 ) : v ) )
      if ( checkboxs[ index ] || !value ) return;
      setTimeout( () => {
        value = !value
        fetch( `http://${ import.meta.env.VITE_IP }:${ import.meta.env.VITE_PORT }/api/outputs/settings`, {
          method: 'POST',
          body: JSON.stringify( { "digital": { "index": index, "value": value } } )
        } ).then( ( () => {
          doHeartbit()
          setSwithcs( i => i.map( ( v, i ) => i === index ? value : v ) )
          setSliders( i => i.map( ( v, i ) => i === index ? ( value ? 100 : 0 ) : v ) )
        } ) )
      }, 300 )
    } ) )
  }

  const setSerial = async ( message ) => {
    // TODO: hacer la peticion post con los parametros adecuados
    await fetch( `http://${ import.meta.env.VITE_IP }:${ import.meta.env.VITE_PORT }/api/terminal`, {
      method: 'POST',
      body: { terminal: message }
    } ).then( i => i.json() ).then( ( () => {
      doHeartbit()
      setSerials( i => ( [ ...i, `send<:::>${ message }` ] ) )
    } ) )
  }

  socket.onmessage = useCallback( ( evt ) => {
    setHeartbit( !heartbit )
    if ( !evt.data ) return;
    if ( evt.data === 'h' ) return; // Heartbeat ingnored
    // const now = new Date()
    const parsedData = JSON.parse( evt.data );

    if ( parsedData.rx ) {
      setSerials( i => ( [ ...i, `recive<:::>${ parsedData.rx }` ] ) )
    }

    if ( parsedData.tmcu ) setTmcu( parsedData.tmcu )
    if ( parsedData.vsupply ) setVsupply( parsedData.vsupply )
    if ( parsedData.tsens ) setTsens( parsedData.tsens )
    if ( parsedData.di ) setInputs( parsedData.di )
    if ( parsedData.ai ) setReadings( parsedData.ai )
  }, [ heartbit ] );

  const handleSetLogin = ( value ) => {
    window.localStorage.setItem( 'login', value ? 'true' : 'false' )
    setLogin( value )
  }

  useEffect( () => {
    setLogin( window.localStorage.getItem( 'login' ) === 'true' )
    socket.onclose = () => {
      console.log( 'Conexión cerrada. Intentando reconectar en 5 segundos...' );
      setTimeout( () => {
        console.log( '5 segundos...' );
      }, 5000 );
    };
    
    fetch(`http://${import.meta.env.VITE_IP}:${import.meta.env.VITE_PORT}/api/outputs/settings`)
    .then(i => i.json())
    .then((data) => {
      if (data.limits) setCurrentLimits(data.limits);
      if (data.sliders) setSliders(data.sliders);
      if (data.checkboxs) setCheckboxs(data.checkboxs);
      if (data.switchs) setSwithcs(data.switchs);
    });
    fetch( `http://${ import.meta.env.VITE_IP }:${ import.meta.env.VITE_PORT }/api/inputs/settings` ).then( i => i.json() ).then( ( data ) => {
      if ( data.thresholds ) setThresholds( data.thresholds )
    } )
  }, [] );

  useEffect( () => {
    const hasError = currentLimits.find( i => ( i < 0.5 || i > 3 ) )
    if ( hasError ) setCurrentLimitAlert( 'Current range can only be 0.5 to 3A!' )
    else setCurrentLimitAlert( '' )
  }, [ currentLimits ] )

  useEffect( () => {
    const hasError = thresholds.find( i => ( i < 0 || i > 30 ) )
    if ( hasError ) setThresholdAlert( 'Input range can only be 0 to 30V!' )
    else setThresholdAlert( '' )
  }, [ thresholds ] )

  return (
    <LayoutContext.Provider value={ {
      login, setLogin: handleSetLogin,
      heartbit,
      vsupply, setVsupply,
      tmcu, setTmcu,
      tsens, setTsens,
      notification, setNotification,
      alerts: {
        tempAlert, setTempAlert,
        modbusAlertCoil1, setModbusAlertCoil1,
        modbusAlertCoil2, setModbusAlertCoil2,
        modbusAlertRate, setModbusAlertRate,
        tempFormAlert, setTempFormAlert,
        currentLimitAlert, setCurrentLimitAlert,
        thresholdAlert, setThresholdAlert,
      },
      serials, setSerials, setSerial,
      sliders, setSlider,
      checkboxs, setCheckbox,
      switchs, setSwitch,
      currentLimits, setCurrentLimit,
      clickSetCurrentLimit,
      inputs, setInputs,
      readings, setReadings,
      thresholds, setThreshold,
      clickSetThreshold,
    } }>
      { props.children }
    </LayoutContext.Provider>
  )
} 