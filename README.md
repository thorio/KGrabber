# KGrabber

[![Version](https://img.shields.io/github/package-json/v/thorio/kgrabber)](https://github.com/thorio/KGrabber/blob/master/package.json)
[![Github](https://img.shields.io/static/v1?label=source&color=0366D6&message=github&logo=github)](https://github.com/thorio/KGrabber)
[![Build status](https://ci.appveyor.com/api/projects/status/rn596lul9xtxvhy4?svg=true)](https://ci.appveyor.com/project/thorio/kgrabber)
[![Maintainability](https://api.codeclimate.com/v1/badges/689d75aa9039d54574ec/maintainability)](https://codeclimate.com/github/thorio/KGrabber/maintainability)
[![Greasyfork](https://img.shields.io/static/v1?label=distribution&color=750000&message=greasyfork&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAACJ0lEQVRIia3Vv2saYRgH8Mf+BSGUEkopIRyHEjEhhuM4OnSsUmqHjF6NGnB36NgldMmWoSp0sVMNErt0quYHrsG5lHAeTkGO4L0eR5D78e2i4XrGEvUeeIZ7Xng/78v7Pu8RjQPAfYbD4aepVOqVt7ZoTk0OgPb29l7btt0/ODh4vzQwa6BYLH6wbbufz+eXQv756Ha7V4IgbPiRXC73LhCgVCodMsaU3d3ddT+SzWYXQojn+VWe51cfg+zv77+dGzg+Pv40GAyut7e3X0yK5XL5cDgcqjs7Oy/9SCaTmQshANRsNr/ruq5sbW1NIROY47iV0WgEx3H6siwn5z6DVqt1ouu6EovFnk9qlUrls2EYaiKREEzT7GEcjuP0k8mkMPchn52dnTDGlGg0ujap1Wq1L3gger1eZ24AAJ2fn9cZY8rm5uYax3Er3pV7Q1XVq4UAAHRxcVE3DEM1TfOhuQEAj+3ymQOXl5enALRZwO3t7Z+lAADUbrd//AfRBoPB9VIAAGo0Gl8ZY4qmab+Pjo4+WpZ140UYY8pSgD8lSeL9iGEYamAAABJFkbNtu+9FLMu6iUQizwIBAJAgCBs+BK7rat5GXQoAQOl0+g18l8B1XS0ej68HAgCgcT/4b5omSRIfCACAxj+kqZ2IosgFAgCg8TN+j9zd3aFer5efUEBRrVZ/yrIsdzqdX5ZlEQByXdcNAQjKICIiSZL4QqFQCIVCVK1Wv/0F7303fjL1cZIAAAAASUVORK5CYII=)](https://greasyfork.org/en/scripts/383649-kgrabber)

Installing this will add a _KGrabber_ element to the right side of a show's page and _Grab_ buttons to each episode.

![image](images/grabber.png)
![image](images/buttons.png)

## Compatibility

Greasemonkey is _not_ supported.

The script is currently compatible with:

- kissanime.ru
- kimcartoon.to
- kissasian.sh
- kisstvshow.to

If you'd like to add a site, please open a new issue on GitHub.

## Installation and Usage

1. Add the [Tampermonkey](https://tampermonkey.net) extension to your browser
2. Install the script from [GreasyFork](https://greasyfork.org/en/scripts/383649)
3. Open the page you want to get links from
4. Select the server (unavailable servers are grayed out)
5. Enter the _from_ and _to_ episode numbers into the widget to the right and click _Extract Links_ to get the selected episodes
6. Solve any captchas that come up
7. Your links will be shown at the top of the page
