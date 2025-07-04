
Guide

This app is designed as a chrome extension but may also work with other browsers.
after downloading and unzipping folder go to- chrome://extensions/
at the top right make sure developer mode is enabled 
click on 'load unpacked' at the top left and upload the Liars_Poker_simple_sim-master folder, or drag and drop folder onto browser.
Extension is ready to use, access via top right, next to the browsers URL.
To lock the extension you can right click extension and open inspect, then minimize developer tools and the extension will remain open.

Alternatively you can open the popup.js file to load the program in browser however it will not feature audio.
To enable audio open the extension folder in terminal (cd path/to/your/Liars_Poker_Sim) and run; python -m http.server 8000
Then enter into browser; http://localhost:8000/popup.html
To run the app on your local server python must be downloaded- https://www.python.org/downloads/


