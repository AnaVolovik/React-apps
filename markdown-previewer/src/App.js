import React from 'react';
import './App.scss';
import Markdown from 'marked-react';

// Markdown.setOptions({
//   gfm: true,
//   tables: true,
//   breaks: true,
//   pedantic: false,
//   sanitize: true,
//   smartLists: true,
//   smartypants: false,
// })

const data = `
  # Markdown Previewer Handle
  ## This is complete guide on the things offered and rendered on the Markdown.
  ### Anastasia Volovik
  ### Contacts
  * Location: Mogilev, Belarus
  * Email: nastasia.volovik@gmail.com
  * GitHub: [AnaVolovik](https://github.com/AnaVolovik)
  ### About Me
  I am a creative and ambitious girl with a talent for thinking outside the box and coming up with innovative ideas. I have already received additional education in the specialty "Programmer-Web Designer" and eager to be challenged in order to grow and further improve my IT skills. Also I have good interpersonal skills, enabling me to interact with a wide range of people.
  ### Skills
  * HTML, CSS, SASS
  * JavaScript
  * React
  * PHP (Basic)
  * MySQL (Basic)
  * Figma
  * Adobe Photoshop, CorelDraw, Adobe Animate, 3ds Max
  ### Code Example

\`\`\`
function isPrime(num) {
  if (num <= 1) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) {
      return false;
    } 
  }
  return true;
}
\`\`\`

#### Inline code example:

\`let x = 5;\`

  ### Experience ###
  I haven't worked in IT yet and I'm looking for a cool job :)
  ### Education
  #### University:
  * Belarusian-Russian University / Engineering and Economics/ **Commerce Specialist**
  * Institute of Business of the Belarusian State University / WEB design and computer graphics/ **Programmer-Web designer**
  ### Languages
  * Russian - native speaker
  * English - B1 (Intermediate, 61-85% according to [EF SET](https://www.efset.org/quick-check/))
  
  > Do not try to do everything. Do one thing well (Steve Jobs)

  ![freeCodeCamp Logo](https://cdn.freecodecamp.org/testable-projects-fcc/images/fcc_secondary.svg)
  `;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: data
    };
    this.updateText = this.updateText.bind(this);
  }
  
  updateText(text) {
    this.setState({
      text: text
    });
  }
   
  render() {
    return(
      <div className='app-wrapper'>
        <h2>EDITOR:</h2>
        <Editor updateText={this.updateText} initialText={data}/>
        <h2>PREVIEW:</h2>
        <Preview text={this.state.text}/>
        <h4>
          <a href='https://codepen.io/ana_volovik'>by Anastasia Volovik</a>
         </h4>
      </div>
    );
  }
}

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      textarea: props.initialText
    };
    this.getText = this.getText.bind(this);
  }
  
  getText(event) {
    const text = event.target.value;
    this.setState({
      textarea: text
    });
    this.props.updateText(text);
  }
  
  render() {
    return(
      <div className='editor-wrapper'>
        <Textarea getText={this.getText} value={this.state.textarea}/>
      </div>
    );
  }
}

const Textarea = ({getText, value}) => {
  return(
    <textarea id='editor' type='text' onChange={getText} value={value}></textarea>
  );
};


const Preview = (props) => {
  return (
    <div className='preview-wrapper'>
      <Content text={props.text}/>
    </div>
  );
}

const Content = ({ text }) => {
  return (
    <div id='preview'>
      <Markdown>{text}</Markdown>
    </div>
  );
};

export default App;
