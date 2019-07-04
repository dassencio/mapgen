[![Build Status](https://api.travis-ci.com/dassencio/mapgen.svg?branch=master)](https://travis-ci.com/dassencio/mapgen)

# Description

`mapgen` is a tool (written in Python 3) which generates maps with
customizable markers. It takes a YAML file describing the map settings as well
as the marker locations and styles as input and generates an HTML
page as output. This page contains all the necessary JavaScript
and CSS code it needs inlined into it, so it can be directly opened in a browser
without the need for a web server such as Apache or similar. This also means it
can be easily shared with others via e-mail or added to an existing webpage
through an `<iframe>` element.

Here is an example of what a typical input YAML file looks like:

```yaml
map settings:
  title: Largest capital cities of the European Union
markers:
  - coordinates: [51.5073219, -0.1276474]
    popup contents: London, United Kingdom (8.83 million)
  - coordinates: [52.5170365, 13.3888599]
    popup contents: Berlin, Germany (3.75 million)
  - coordinates: [40.4167047, -3.7035825]
    popup contents: Madrid, Spain (3.23 million)
  - coordinates: [41.894802, 12.4853384]
    popup contents: Rome, Italy (2.87 million)
  - coordinates: [48.8566101, 2.3514992]
    popup contents: Paris, France (2.15 million)
```

The resulting page can be seen [here](https://htmlpreview.github.io/?https://github.com/dassencio/mapgen/blob/master/examples/largest-eu-capitals/output.html).
By clicking on a marker, a popup will be displayed showing the city's name as
well as its estimated population.

Here are some more interesting examples:

- Location of SUSE offices: [Input YAML](https://github.com/dassencio/mapgen/tree/master/examples/suse-offices/input.yaml) |
  [Output HTML](https://htmlpreview.github.io/?https://github.com/dassencio/mapgen/blob/master/examples/suse-offices/output.html)

- Largest countries in Western Europe: [Input YAML](https://github.com/dassencio/mapgen/tree/master/examples/largest-west-eu-countries/input.yaml) |
  [Output HTML](https://htmlpreview.github.io/?https://github.com/dassencio/mapgen/blob/master/examples/largest-west-eu-countries/output.html)

# License

Except for [Leaflet](https://leafletjs.com/) files and icons from
[Flaticon](https://www.flaticon.com/), all code from this project is licensed
under the GPLv3. See the [`LICENSE`](https://github.com/dassencio/mapgen/tree/master/LICENSE) file for more information.

Files from the Leaflet project are covered under the
[2-clause BSD license](https://github.com/Leaflet/Leaflet/blob/master/LICENSE).

Icons from Flaticon were produced by Google, Freepik and Smashicons. Those are
all licensed under the [CC BY 3.0 license](https://creativecommons.org/licenses/by/3.0/).

# Required modules

All Python modules needed by `mapgen` are listed on the
[`requirements.txt`](https://github.com/dassencio/mapgen/tree/master/requirements.txt)
file. You can install them with the following command:

    pip3 install -r requirements.txt

# Usage instructions

For an input file `input.yaml` specifying the map settings and the marker data,
running the following command will generate the desired HTML page and store it
on `output.html`:

    ./mapgen -i input.yaml -o output.html

# YAML input

## Introduction

Each marker has two possible states: "normal" and "selected". Different icons
can be displayed for a marker depending on whether it is selected or not. This
allows the user to create maps which are more fun to interact with by making
the icon of a selected marker look different from the icons of the
unselected (normal) markers. Only one marker can be selected at a time.

If `popup contents` are defined for a marker, a popup will be shown when it is
selected. Markers with no `popup contents` defined are assumed to be
non-selectable and are therefore always displayed with their normal icons.

The input YAML file is divided into three main sections:

- `default marker settings`: Style settings (e.g. icon dimensions) which are
  applied to all markers by default. These settings can be overridden at the
  definition of each marker.

- `map settings`: Global map settings such as the language used to display
  labels on the map (e.g. country names) or whether zoom control buttons
  should be displayed or not.

- `markers`: List of markers to be displayed on the map. Each marker must have
  a pair of coordinates specified so it can be drawn on the map. A marker is not
  required to have a popup (`popup contents` is an optional attribute).

## Attributes in `default marker settings`:

- `icon`: Path to an icon file (an image) or the name of a built-in icon to be
  used as the default icon for markers in both "normal" and "selected" states.
  Built-in icons are located in the `template/icons` directory, and their names
  must be given without the `.svg` suffix (e.g. `airplane` or `house`). Defaults
  to `placeholder`.

- `icon color`: Default icon color assigned to all icons of all markers (both
  in "normal" and "selected" states). Applicable only to built-in icons. Any CSS
  color is allowed.

- `icon dimensions`: Default icon dimensions (in pixels) expressed as an array
  of form `[width, height]`. Defaults to `[40, 40]`.

- `normal icon`: Accepts the same values as `icon`, but only affects the icons
  shown for markers when they are not selected. Has higher precedence than
  `icon`, i.e., if both `icon` and `normal icon` are specified, the default
  normal icon will be set to the one specified in `normal icon`.

- `normal icon color`: Accepts the same values as `icon color`, but only affects
  the icons shown for markers when they are not selected. Has higher precedence
  than `icon color`, i.e., if both `icon color` and `normal icon color` are
  specified, the default color for normal icons will be set to the one specified
  in `normal icon color`. Defaults to `#1081e0` (blue).

- `normal icon dimensions`: Accepts the same values as `icon dimensions`, but
  only affects the icons shown for markers when they are not selected. Has higher precedence than `icon dimensions`, i.e., if both `icon dimensions` and
  `normal icon dimensions` are specified, the default dimensions for normal icons
  will be set to the one specified in `normal icon dimensions`.

- `selected icon`: Equivalent of `normal icon` for selected icons.

- `selected icon color`: Equivalent of `normal icon color` for selected icons.
  Defaults to `#d30800` (red).

- `selected icon dimensions`: Equivalent of `normal icon dimensions` for
  selected icons.

## Attributes in `map settings`:

- `language`: Language used to display labels on the map (e.g. country, city
  and street names). Valid values are either `local` to display labels using
  each country's official language or short language codes such as `en`
  for English and `de` for German. Valid language codes are listed in
  [this article](https://meta.wikimedia.org/wiki/List_of_Wikipedias#All_Wikipedias_ordered_by_number_of_articles),
  but not all labels are guaranteed to exist in every available language.

- `show zoom control`: Whether zoom controls (`+`/`-` buttons) should be
  displayed or not. Valid values are `no` and `yes`. Defaults to `no`.

- `title`: Title to be displayed when the generated HTML page is opened in a
  browser.

- `zoom control position`: Location on the map where zoom controls must appear,
  if applicable. Valid values are `bottom left`, `bottom right`, `top left`
  and `top right`. Defaults to `top right`.

## Marker entries in `markers`:

All markers must be entered as a list under the `markers` section of the YAML
file. Every marker accepts the same attributes as the ones from
`default marker settings`, but those will only apply for the marker being
defined, i.e., values for attributes defined on a marker have higher precedence
than values for the attributes with the same names defined under
`default marker settings`.

Additional attributes:

- `coordinates`: Marker position on the map expressed as an array of form
  `[latitude, longitude]`. Latitude and longitude values must fall within the
  value ranges `[-90, 90]` and `[-180, 180]` respectively. Every marker
  needs to have `coordinates` defined.

- `popup contents`: HTML contents to be shown on the popup displayed for a
  marker when it is selected.

# Contributors & contact information

Diego Assencio / diego@assencio.com
