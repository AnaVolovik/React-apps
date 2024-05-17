import React, {useRef, useEffect, useState} from 'react';
import './App.scss';

const padsData = [
  {
    name: 'Heater-1',
    letter: 'Q',
    path: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3'
  },
  {
    name: 'Heater-2',
    letter: 'W',
    path: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3'
  },
  {
    name: 'Heater-3',
    letter: 'E',
    path: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3'
  },
  {
    name: 'Heater-4',
    letter: 'A',
    path: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3'
  },
  {
    name: 'Clap',
    letter: 'S',
    path: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3'
  },
  {
    name: 'Open-HH',
    letter: 'D',
    path: 'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3'
  },
  {
    name: 'Kick-and-Hat',
    letter: 'Z',
    path: 'https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3'
  },
  {
    name: 'Kick',
    letter: 'X',
    path: 'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3'
  },
  {
    name: 'Closed-HH',
    letter: 'C',
    path: 'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3'
  }
];

const playSound = (pad, volume) => {
  const audio = new Audio(pad.path);
  audio.volume = volume;
  audio.play();
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      padsData: padsData,
      displayText: '',
      volume: 0.3,
      currentPad: null
    };
    this.handleOnload = this.handleOnload.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleVolumeChange = this.handleVolumeChange.bind(this);
  }
  
  componentDidMount() {
    this.handleOnload();
    document.addEventListener("keydown", this.handleKeyPress);
  }
  
  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyPress);
  }
  
  handleOnload() {
    this.setState({
      padsData: padsData,
      displayText: '',
      volume: 0.3
    });
  }

  handleKeyPress(event) {
    const keyPressed = event.key.toUpperCase();
    const pad = this.state.padsData.find(pad => pad.letter === keyPressed);
    if (pad) {
      this.setState({ 
        displayText: pad.name,
        currentPad: pad
      });
      playSound(pad, this.state.volume);
    }
  }
  
  handleClick(event) {
    const letterClicked = event.target.innerText;
    const pad = this.state.padsData.find(pad => pad.letter === letterClicked);
    if (pad) {
      playSound(pad, this.state.volume);
      this.setState({ 
        displayText: pad.name,
        currentPad: pad
      });
    }
  }
  
  handleVolumeChange(event) {
    const newVolume = parseFloat(event.target.value);
    this.setState({ volume: newVolume, displayText: "Volume: " + Math.round(newVolume * 100) });
    setTimeout(() => this.setState({ displayText: '' }), 1000);
  }
      
  render() {
    return (
      <div className='App'>
        <DrumMachine
          padsData={this.state.padsData}
          displayText={this.state.displayText}
          volume={this.state.volume}
          handleClick={this.handleClick}
          handleKeyPress={this.handleKeyPress}
          handleVolumeChange={this.handleVolumeChange}
        />
      </div>
    );
  }
};

const DrumMachine = (props) => {
  return(
    <div id='drum-machine'>
      <DrumPads
        padsData={props.padsData}
        handleClick={props.handleClick}
        handleKeyPress={props.handleKeyPress}
      />
      <Controlls
        displayText={props.displayText}
        volume={props.volume}
        handleVolumeChange={props.handleVolumeChange}
      />
    </div>
  );
};

const DrumPads = (props) => {
  const liRefs = useRef([]);
  useEffect(() => {
    if (liRefs.current.length > 0) {
      liRefs.current[0].focus();
    }
  }, []);
  
  return(
    <ul className='drum-pads-wrapper'>
      {props.padsData.map((pad, index) => (
        <li
          className='drum-pad'
          id={pad.name}
          key={pad.name}
          onClick={props.handleClick}
          onKeyPress={props.handleKeyPress}
          tabIndex={0}
          ref={(el) => (liRefs.current[index] = el)}
        >
          <audio className='clip' id={pad.letter} src={pad.path}></audio>
          {pad.letter}
        </li>
      ))}
    </ul>
  );
};

const Controlls = (props) => {
  return(
    <div className='controlls-wrapper'>
      <Display displayText={props.displayText} />
      <Volume
        volume={props.volume}
        handleVolumeChange={props.handleVolumeChange}
      />
    </div>
  );
};

const Display = (props) => {
  return(
    <div id='display'>
      <p>{props.displayText}</p>
    </div>
  );
};

const Volume = (props) => {
  const handleChange = (event) => {
    props.handleVolumeChange(event);
  };
  
  return(
    <div className='volume-wrapper'>
      <input max='1'
        min='0'
        step='0.01'
        type='range'
        value={props.volume !== undefined ? props.volume : 0}
        onChange={(event) => props.handleVolumeChange(event)} 
      />
    </div>
  );
};

export default App;