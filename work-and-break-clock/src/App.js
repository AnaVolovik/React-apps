import React from 'react';
import './App.scss';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breakLength : 0,
      sessionLength: 0,
      timerLabel: '',
      timeLeft: 0,
      isRunning: false,
      intervalId: null
    };
    this.handleOnload = this.handleOnload.bind(this);
    this.formatTime = this.formatTime.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.startStop = this.startStop.bind(this);
  }
  
  componentDidMount() {
    this.handleOnload();
  }
  
  handleOnload() {
    this.setState({
      breakLength : 5,
      sessionLength: 25,
      timerLabel: 'Session',
      timeLeft: 1500,
      isRunning: false,
      intervalId: null
    });
  }
  
  startStop() {
    this.setState((state) => {
      if (state.isRunning) {
        clearInterval(state.intervalId);
        return {
          isRunning: false,
          intervalId: null
        };
      } else {
        const intervalId = setInterval(() => {
          this.setState((prevState) => {
            if (prevState.timeLeft > 0) {
              return { timeLeft: prevState.timeLeft - 1 };
            } else {
              const beepAudio = document.getElementById("beep");
              beepAudio.play();
              clearInterval(prevState.intervalId);
              
              if (prevState.timerLabel === 'Session') {
                this.handleClick({ target: { closest: () => ({ id: 'start_stop' }) } });
                return {
                  isRunning: false,
                  intervalId: null,
                  timerLabel: 'Break',
                  timeLeft: prevState.breakLength * 60
                };
              } else {
                this.handleClick({ target: { closest: () => ({ id: 'start_stop' }) } });
                return {
                  isRunning: false,
                  intervalId: null,
                  timerLabel: 'Session',
                  timeLeft: prevState.sessionLength * 60
                };
              }
            }
          });
        }, 1000);

        return {
          isRunning: true,
          intervalId: intervalId
        };
      }
    });
  }
    
  formatTime(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
  
  handleClick(event) {
    let target = event.target.closest('button');
    const { id } = target;
    
    if (id === 'start_stop') {
      this.startStop();
      return;
    }
    
    if (id === 'reset') {
      const beepAudio = document.getElementById("beep");
      beepAudio.pause();
      beepAudio.currentTime = 0;
      
      clearInterval(this.state.intervalId);
      this.setState({
          isRunning: false,
          intervalId: null,
          breakLength: 5,
          sessionLength: 25,
          timerLabel: 'Session',
          timeLeft: 1500
      });
      return;
    }
    
    this.setState((state) => {
      switch (id) {
        case 'break-increment':
          return { breakLength: state.breakLength < 60 ? state.breakLength + 1 : 60 };
        case 'break-decrement':
          return { breakLength: state.breakLength > 1 ? state.breakLength - 1 : 1 };
        case 'session-increment':
          if (state.sessionLength < 60) {
            const newSessionLength = state.sessionLength + 1;
            return { 
              sessionLength: newSessionLength,
              timeLeft: newSessionLength * 60
            };
          }
          return state;
        case 'session-decrement':
          if (state.sessionLength > 1) {
            const newSessionLength = state.sessionLength - 1;
            return { 
              sessionLength: newSessionLength,
              timeLeft: newSessionLength * 60
            };
          }
          return state;
        default:
          return state;
      }
    });
  }
     
  render() {
    return(
      <div className='app-wrapper'>
        <h1>Work & Break Clock</h1>
        <Clock
          breakLength={this.state.breakLength}
          sessionLength={this.state.sessionLength}
          timerLabel={this.state.timerLabel}
          timeLeft={this.state.timeLeft}
          formatTime={this.formatTime}
          handleClick={this.handleClick}
          startStop={this.startStop}
        />
        <h4>
          <a href='https://codepen.io/ana_volovik'>by Anastasia Volovik</a>
        </h4>
      </div>
    );
  }
}

const Clock = (props) => {
  return(
    <div className='clock'>
      <Controlls
        breakLength={props.breakLength}
        sessionLength={props.sessionLength}
        handleClick={props.handleClick}
      />
      <Timer
        timerLabel={props.timerLabel}
        timeLeft={props.timeLeft}
        formatTime={props.formatTime}
        startStop={props.startStop}
      />
      <audio id="beep" preload="auto">
        <source src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

const Controlls = (props) => {
  return(
    <div className='controlls'>
      <div className='controlls-length'>
        <BreakControlls
          breakLength={props.breakLength}
          handleClick={props.handleClick}
        />
        <SessionControlls
          sessionLength={props.sessionLength}
          handleClick={props.handleClick}
        />
      </div>
      <TimerControlls
        startStop={props.startStop} 
        handleClick={props.handleClick}
      />
    </div>
  );
};

const BreakControlls = (props) => {
  return(
    <div className='controlls-break' id='break-label'>
      <button className='controlls-button' id='break-decrement' onClick={props.handleClick}>
        <i className="fas fa-minus"></i>
      </button>
      Break Length:&nbsp;
      <span className='controlls-number' id='break-length'>{props.breakLength}</span>
      <button className='controlls-button' id='break-increment' onClick={props.handleClick}>
        <i className="fas fa-plus"></i>
      </button>
    </div>
  );
};

const SessionControlls = (props) => {
  return(
    <div className='controlls-session' id='session-label'>
      <button className='controlls-button' id='session-decrement' onClick={props.handleClick}>
        <i className="fas fa-minus"></i>
      </button>
      Session Length:&nbsp;
      <span className='controlls-number' id='session-length'>{props.sessionLength}</span>
      <button className='controlls-button' id='session-increment' onClick={props.handleClick}>
        <i className="fas fa-plus"></i>
      </button>
    </div>
  );
};

const TimerControlls = (props) => {
  return(
    <div className='controlls-timer'>
      <button className='controlls-button' id='start_stop' onClick={props.handleClick}>
        <i className='fas fa-play'></i>
        <i className='fas fa-pause'></i>
      </button>
      <button className='controlls-button' id='reset' onClick={props.handleClick}>
        <i className='fas fa-sync'></i>
      </button>
    </div>
  );
};

const Timer = (props) => {
  return(
    <div className='timer'>
      <div className='timer-label' id='timer-label'>{props.timerLabel}</div>
      <div className='time-left' id='time-left'>{props.formatTime(props.timeLeft)}</div>
    </div>
  );
};

export default App;