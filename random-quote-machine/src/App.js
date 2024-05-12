import React from 'react';
import './App.scss';

const quotes = [
  {
    quote: 'Do not try to do everything. Do one thing well.',
    author: 'Steve Jobs'
  },
  {
    quote: 'Do what you want, do what you will, do what you have to, do what you think you cannot.',
    author: 'Alice Hoffman'
  },
  {
    quote: 'Life is found in the dance between your deepest desire and your greatest fear.',
    author: 'Tony Robbins'
  },
  {
    quote: 'Do what you can, with what you have, where you are.',
    author: 'Theodore Roosevelt'
  },
  {
    quote: 'Success isn\'t about the end result; it\'s about what you learn along the way.',
    author: 'Vera Wang'
  },
  {
    quote: 'If something burns your soul with purpose and desire, it\'s your duty to be reduced to ashes by it. Any other form of existence will be yet another dull book in the library of life.',
    author: 'Charles Bukowski'
  },
  {
    quote: 'People who say that yesterday was better than today are ultimately devaluing their own existence.',
    author: 'Karl Lagerfeld'
  },
  {
    quote: 'Talent hits a target no one else can hit. Genius hits a target no one else can see.',
    author: 'Arthur Schopenhauer'
  },
  {
    quote: 'I am not in competition with anyone but myself. My goal is to improve myself continuously.',
    author: 'Bill Gates'
  },
  {
    quote: 'I believe the ability to think is blessed. If you can think about a situation, you can deal with it. The big struggle is to keep your head clear enough to think.',
    author: 'Richard Pryor'
  }
];

let currentIndex = 0;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      author: '',
      image: ''
    };
    this.handleOnload = this.handleOnload.bind(this);
    this.handleOnclick = this.handleOnclick.bind(this);
  }

  componentDidMount() {
    this.handleOnload();
  }
  
  getRandomQuoteIndex() {
    return currentIndex = Math.floor(Math.random() * quotes.length);
  }
  
  handleOnload() {
    this.getRandomQuoteIndex();
    const { quote, author} = quotes[currentIndex];
    const image = `./img/${currentIndex}.jpg`;
    this.setState({
      text: quote,
      author: author,
      image: image
    });
  }

  handleOnclick() {
    currentIndex = (currentIndex + 1) % quotes.length;
    const { quote, author} = quotes[currentIndex];
    const image = `./img/${currentIndex}.jpg`;
    this.setState({
      text: quote,
      author: author,
      image: image
    });
  }
  
  render() {
    return (
      <div className='app'>
        <QuoteBox text={this.state.text} author={this.state.author} image={this.state.image} handleOnclick={this.handleOnclick}/>
      </div>
    );
  }
};

const QuoteBox = ({text, author, image, handleOnclick}) => {
  return (
    <div id='quote-box'>
      <i className='fa fa-quote-left quote'> </i>
      <div className='wrapper-text'>
        <Text text={text}/>
        <div className='aboutAuthor'>
          <Author author={author}/>
          <AuthorImg image={image}/>
        </div>
      </div>
      <Buttons handleOnclick={handleOnclick}/>
    </div>
  );
};

const Text = ({text}) => {
  return (
    <p id='text'>{text}</p>
  );
};

const Author = ({author}) => {
  return (
    <p id='author'><span>&mdash;&nbsp;</span>{author}</p>
  );
};

const AuthorImg = ({image}) => {
  return (
    <div className='wrapperImg' style={{backgroundImage: `url(${image})`}}>
      <hr className='line'/>
    </div>
  );
};

const Buttons = ({handleOnclick}) => {
  return (
    <div className='buttons'>
      <Socials/>
      <button className='button button-new-quote' id='new-quote' onClick={handleOnclick}>New quote</button>
    </div>
  );
};

const Socials = ({ text, author }) => {
  const tweetQuote = () => {
    const tweetText = encodeURIComponent(`"${text}" - ${author}`);
    const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
    window.open(tweetUrl, '_blank');
  };

  const tumblrQuote = () => {
    const tumblrText = encodeURIComponent(`${text} - ${author}`);
    const tumblrUrl = `https://www.tumblr.com/widgets/share/tool?posttype=quote&tags=quotes&caption=${tumblrText}&content=${tumblrText}&canonicalUrl=https://example.com`;
    window.open(tumblrUrl, '_blank');
  };

  return (
    <div className='socials'>
      <button className='button button-social' onClick={tweetQuote} title='Tweet me!'>
        <i className='fab fa-twitter'></i>
      </button>
      <button className='button button-social' onClick={tumblrQuote} title='Tumblr me!'>
        <i className='fab fa-tumblr'></i>
      </button>
    </div>
  );
};

export default App;