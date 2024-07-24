# Auto-Paper-Access (NTU/NUS)

![Demo][demoImg]

A simple but useful script runs on most modern broswers on any platform via Tampermonkey/Userscripts . You can easily access IEEE Xplore, ACM Digital Library, etc without clicking proxy bookmarklet provided by your university.

This script was maintained by [lushl9301](https://github.com/lushl9301) and [koallen](https://github.com/koallen) many years ago, and was brought to my attention as a result of the removal of browser plugin support from the NTU Library in 2024 [^1]. I've made a few updates to make the script usable again and added a PDF fast access feature.

[^1]: https://libguides.ntu.edu.sg/full-text-tools/libgenie

## Usage

1. Install [Tampermonkey](https://tampermonkey.net/) plugin for your web browsers. :tada:For iOS/iPadOS user, the [Userscripts](https://itunes.apple.com/us/app/userscripts/id1463298887) plugin for Safari is also supported.

2. Install this script from [Github Raw](https://github.com/XYSheldon/Auto-Paper-Access/raw/master/auto-paper-access.user.js) by simply click *install*

3. Done! And you can try the following papers from ACM DL and IEEE Xplore. You will notice a button for configuration at top right corner if the domain is supported.

    [Mars: a MapReduce framework on graphics processors](http://dl.acm.org/citation.cfm?id=1454152&CFID=727506701&CFTOKEN=12709622)

    [Multikernel Data Partitioning With Channel on OpenCL-Based FPGAs](http://ieeexplore.ieee.org/document/7857086/)

## :new:IEEE Xplore PDF Fast Access
An option for IEEE Xplore PDF direct jump is available. When access to IEEE Xplore's document/article pages with full text access, this script will automatically redirect to the PDF page. Note that the destination of the jump is a PDF page, which contains PDF elements, not a direct link to a PDF file, therefore the browser will not download the file on its own.

## Supported Universities

* National University of Singapore
* Nanyang Technological University, Singapore[^NTULib]
[^NTULib]: https://libguides.ntu.edu.sg/full-text-tools/libbookmark

## Known Issues

* You can change // @run-at document-body to // @run-at document-start to accelerate access. ~~But the dialog may not pop up sometimes...~~
* `@noframes` is added to avoid iframe load this script (e.g. a button on the IEEE Xplore feedback button)

## Contributor
* [XYSheldon](https://github.com/XYSheldon), Nanyang Technological University, Singapore
### Previously maintained by
* [lushl9301](https://github.com/lushl9301), National University of Singapore
* [koallen](https://github.com/koallen), Nanyang Technological University, Singapore


[demoImg]:/Demo.png
