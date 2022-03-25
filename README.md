# A2J Deps

##### This repo is part of the A2J Author Project which consists of four repos...
##### 1. A2JViewer - https://github.com/CCALI/a2jviewer
##### 2. A2J Author - https://github.com/CCALI/a2jauthor
##### 3. A2J Document Automation Tool - https://github.com/CCALI/a2jdat
##### 4. A2J Dependencies - https://github.com/CCALI/a2jdeps

A2J Deps is a set of shared javascript CanJs 4.x components and utils for [A2J Author](https://github.com/CCALI/a2jauthor), [A2J Viewer](https://github.com/CCALI/a2jviewer), and [A2J DAT](https://github.com/CCALI/a2jdat).

## Installation

Use the npm package manager to install A2J Deps.

```bash
npm install @caliorg/a2jdeps
```

## Usage

In your javascript:

```javascript
import '@caliorg/a2jdeps/alert/'
// or in can-stache
<can-import from="@caliorg/a2jdeps/alert/"/>
```

In your stache file:
```html
  <app-alert open:from="true" alertType:raw="warning" class="demo-notice">
    For demonstration and testing purposes only. Not intended for use by the
    public. This A2J Guided Interview will not generate a form.
  </app-alert>
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[GNU AGPLv3](./LICENSE.md)
