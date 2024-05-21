import React from 'react';
import './App.scss';
import { v4 as uuidv4 } from 'uuid';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openedCard: null,
      closedCard: './images/bg/bg.jpg',
      images: [],
      flipped: [],
      keys: [],
      selectedCards: []
    };
    this.handleOnload = this.handleOnload.bind(this);
    this.generateImageArray = this.generateImageArray.bind(this);
    this.shuffleArray = this.shuffleArray.bind(this);
    this.handleImageClick = this.handleImageClick.bind(this);
  }

  componentDidMount() {
    this.handleOnload();
  }

  handleOnload() {
    const images = this.generateImageArray();
    const flipped = new Array(images.length).fill(false);
    const keys = images.map(() => uuidv4());

    this.setState({
      openedCard: null,
      images: images,
      flipped: flipped,
      keys: keys,
      selectedCards: []
    });
  }

  generateImageArray() {
    const images = ['/images/0.jpg', '/images/1.jpg'];
    const doubledImages = [...images, ...images];
    return this.shuffleArray(doubledImages);
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  handleImageClick(key) {
    this.setState(prevState => {
      const index = prevState.keys.indexOf(key);
      const newFlipped = [...prevState.flipped];
      const newSelectedCards = [...prevState.selectedCards];

      if (newFlipped[index] || newSelectedCards.length === 2) {
        return null;
      }

      newFlipped[index] = true;
      newSelectedCards.push(index);

      if (newSelectedCards.length === 2) {
        const [firstIndex, secondIndex] = newSelectedCards;
        if (prevState.images[firstIndex] !== prevState.images[secondIndex]) {
          setTimeout(() => {
            this.setState(prevState => {
              const resetFlipped = [...prevState.flipped];
              resetFlipped[firstIndex] = false;
              resetFlipped[secondIndex] = false;
              return {
                flipped: resetFlipped,
                selectedCards: []
              };
            });
          }, 500);
        } else {
          newSelectedCards.length = 0;
        }
      }

      return {
        flipped: newFlipped,
        selectedCards: newSelectedCards
      };
    });
  }

  render() {
    const { images, flipped, closedCard, keys } = this.state;

    if (images.length === 0) {
      return null;
    }

    return(
      <div className='app'>
        <GameBox 
          images={images}
          flipped={flipped}
          closedCard={closedCard}
          keys={keys}
          onImageClick={this.handleImageClick}
        />
      </div>
    );
  }
}

const GameBox = ({ images, flipped, closedCard, keys, onImageClick }) => {
  return (
    <div className='gamebox'>
      {images.map((image, index) => (
        <div
          key={keys[index]}
          className='gamebox-img'
          style={{
            backgroundImage: flipped[index] ? `url(${image})` : `url(${closedCard})`,
            backgroundSize: 'cover',
            transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transition: 'transform 0.6s'
          }}
          onClick={() => onImageClick(keys[index])}
        ></div>
      ))}
    </div>
  );
};

export default App;