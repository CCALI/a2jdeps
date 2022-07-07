## A2J Deps Release:
- Change to the `develop` branch if not already on it.
- Do a `git pull` to make sure you are up to date with all changes.
- Make sure you are logged into `npm`. In your terminal type `npm whoami` and be sure you have permissions to do npm releases with that account for this repo.
- Run `npm run release:<semverType>` where `<semverType>` could be either `patch`, `minor`, or `major`. Example, for a bug fix that is not a breaking change, you would run `npm run release:patch`.
- This will execute the release script, running the tests first (a release will not happen with failed tests)
- Once the npm release is successful, do a pull request from `develop` into `production` to keep it in parity with the npm release.
- OPTIONAL -> Update Author, Viewer and/or A2J DAT to this new release as needed. aka `npm install @caliorg/a2jdeps@latest` which will update both the package.json file and the package-lock.json to this latest release version in the respective codebase.