import axios from 'axios';

const API_URL = 'http://ws.audioscrobbler.com/2.0/?limit=5&format=json&method=artist.search&api_key=' + process.env.REACT_APP_LASTFM_APPKEY;


export const getArtists = async (terms) => {
  const request = API_URL + '&artist=' + terms;
  const response = await axios.get(request);
  const results = response.data.results;

  const artists = results.artistmatches.artist.map((artist) => {
    const avatarImage = artist.image.find(image => image.size === 'medium');
    const cardImage = artist.image.find(image => image.size === 'large')['#text']
    const imageUrl = avatarImage['#text'];
    return { ...artist, avatar: imageUrl, cardImage }
  });
  return artists
}