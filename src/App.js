import React from 'react';
import Particles from 'react-particles-js';
import './App.css';
import Background from './components/Background/Background'; 
import Navigation from './components/Navigation/Navigation'; 
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';

const particleOptions = {
  particles: {
    number: {
      value:10,
      density: {
        enable: true,
        value_area: 80 
      }
    }
  }
}

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signIn',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    password: '',
    entries: 0,
    joined: ''
  }
}

class App extends React.Component {
   
  constructor() {
    super();
    this.state = initialState
  }

  onInputChange = event => {
    this.setState({ input: event.target.value });
  }

  calculateFaceLocation = data => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('input_image');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = box => {
    this.setState({box});
  }

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    
    fetch('http://localhost:3001/rankUrl', {
      method: 'post',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        input: this.state.input
      })
    })
    .then(response => response.json())
    .then(response => {
      if (response) {
        fetch('http://localhost:3001/rank', {
          method: 'put',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, { entries: count}))
        })
        .catch(console.log);
      }
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(error => console.log(error));
  }

  onRouteChange = (route) => {
    if (route === 'signOut') {
      this.setState(initialState);
    } else if (route === 'home') {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route });
  }

  loadUser = userData => {
    this.setState({ user: {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      entries: userData.entries,
      joined: userData.joined
    }})
  }

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <Particles params={particleOptions} className='particles'/>
        <Background />
        <Navigation isSignedIn={isSignedIn} onRouteChange={ this.onRouteChange }/>
        { 
          route === 'home' 
          ? <div>
              <Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries}/>
              <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
              <FaceRecognition box={box} imageUrl={imageUrl}/>
            </div> 
          : (
              route === 'signIn'
              ? <SignIn loadUser={ this.loadUser } onRouteChange={this.onRouteChange}/>
              : <Register loadUser={ this.loadUser } onRouteChange={this.onRouteChange}/>
            )
        }
      </div>
    );
  }
}

export default App;