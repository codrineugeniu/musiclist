import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { getArtists } from './services/api';

import {
  TextField,
  Button,
  List
} from '@material-ui/core';

import { ArtistCard } from './components/ArtistCard';
import { SearchResult } from './components/SearchResult';

import './App.css';
import { get } from 'https';

const isEmpty = (str) => str.length === 0;
class App extends Component {
  state = {
    searchTerm: '',
    savedArtists: []
  }

  componentDidMount() {
    const existing = localStorage.getItem('savedArtists')
    if (existing) {
      this.setState({ savedArtists: JSON.parse(existing) })
    }
  }

  onTextChange = (event) => {
    const value = event.target.value;

    this.setState({ searchTerm: value });
  }

  search = async (terms) => {

    const artists = await getArtists(terms);
    this.setState({ artists: artists })
  }

  onSearchClick = () => {
    this.search(this.state.searchTerm);
  }

  clearSearch = () => {
    this.setState({
      searchTerm: '',
      artists: []
    })
  }

  updateArtists = (newArtists) => {
    this.setState({ savedArtists: newArtists })
    localStorage.setItem('savedArtists', JSON.stringify(newArtists));
  }

  deleteArtist = (artist) => {
    const result = this.state.savedArtists.filter(item => item.name !== artist.name);
    this.updateArtists(result);
  }

  onResultClick = (artist) => {
    this.clearSearch();
    const savedArtists = this.state.savedArtists;
    savedArtists.push(artist);
    this.updateArtists(savedArtists);
  }

  render() {
    const results = this.state.artists || [];
    return (
      <div className="App">
        <header className="App-header">
          <AppBar position="static" color="primary">
            <Toolbar className="search-bar">
              <Typography variant="h6" color="inherit">
                Photos
              </Typography>
              <TextField
                placeholder="Search on Last.fm"
                className="search-input"
                onChange={this.onTextChange}
                value={this.state.searchTerm}
              />
              <Button
                onClick={this.onSearchClick}
                variant="contained"
                color="secondary"
                disabled={isEmpty(this.state.searchTerm)}
              >
                Search
              </Button>
              {!isEmpty(this.state.searchTerm) && (
                <Button
                  onClick={this.clearSearch}
                  variant="contained"
                >
                  Clear
                </Button>)
              }
            </Toolbar>
          </AppBar>
        </header>

        <List className="search-results">
          {
            results.map((artist, index) => {
              return <SearchResult key={index} artist={artist} onResultClick={this.onResultClick} />
            })
          }
        </List>
        <div className="artist-container">
          {
            this.state.savedArtists.map((artist, index) => {
              return <ArtistCard artist={artist} key={index} deleteArtist={this.deleteArtist} />
            })
          }
        </div>
      </div>
    );
  }
}

export default App;
