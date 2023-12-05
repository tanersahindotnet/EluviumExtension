# EluviumExtension
Eluvium browser extension is now open source ! Eluvium browser extension is written using the Web API and Angular.

# Contribute
Code contributions are welcome! Please commit any pull requests against the master branch.

Security audits and feedback are welcome. Please open an issue or email us privately if the report is sensitive in nature.

More Info: http://eluvium.info/

# How To Setup

1) npm run start

2) go to: chrome://extensions in the browser and enable 'developer mode'

3) press Load unpacked and target the folder angular/dist

The project is automatically being watched, any changes to the files will recompile the project.

NOTE: changes to the content page and service worker scripts requires you to reload the extension in chrome://extensions

# How To Create a Release

npm run build -- --prod will give you release version

# Angular folder

This folder contains the angular source code. Each feature (popup,options,tab) lives inside its own module and gets lazily loaded.

see: ./angular/src/app/modules

# Chrome folder

This folder contains the content page/service worker scripts.
