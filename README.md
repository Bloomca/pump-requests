# Pump-requests

Let's say we have an endpoint, which receives list of ids as a parameter to check their status (for example, list of favourites). However, we would like to call status of each item individually (think about React component, which will get all needed information for a component). This library does exactly one thing – it allows you to treat such requests as they were requests to check status of a single item. They are added into internal data structures, and each addition triggers debounced timer, so after defined time of silence it will invoke given function, passing list of all ids it collected.

```javascript
import pumpRequests from 'pump-requests';
import api from '../api';

// you can pass this function wherever you want
// if you use redux, you can pass it to the
// middleware
const checkFavourite = pumpRequests(ids => {
  return api.get('/favourites', ids);
  // for instance, { 5: 'some', 10: 'another' }
});

checkFavourite(5).then(val => console.log(val)); // 'some'
checkFavourite(10).then(val => console.log(val)); // 'another'
```

## API

```javascript
import pumpRequest from 'pump-requests';

const checkFavourite = pumpRequest(
  // this function will be invoked with array of parameters,
  // with which `checkFavourite` was called by individual items
  fn: (ids) => api.get(...),
  {
    // debounce time – after which period of silence we will call fn
    // default value is 50
    time: 100,
    
    // function to get information for specific call
    // results – data from fn
    // id – parameter with which you called `checkFavourite`
    //
    // default value is (results, id) => results[id],
    // so, it means you have to pass string as an id, and
    // resolve object from fn with ids as keys
    parseParams: (results, id) => ...
  }
);
```

There is nothing more! The idea for the library was born when I was struggling trying to prefetch different favourites in several places, and they clashed – I feel that treating them as independent single requests with single responsibility is a right way to go.

## License

MIT