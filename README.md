# A2J Deps

A2J Deps is a set of shared javascript CanJs 4.x components and utils for A2J Author, A2J Viewer, and A2J DAT.

## Installation

Use the npm package manager to install A2J Deps.

```bash
npm install @caliorg/a2jdeps
```

## Usage

In your javascript:

```javascript
import { audio-player } from '@caliorg/a2jdeps'
```

In your stache file:
```html
  <audio-player
    class="modal-audio"
    sourceUrl:from="normalizePath(scope/mState.fileDataURL, modalContent.audioURL)"
  />
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[GNU AGPLv3](./LICENSE)
