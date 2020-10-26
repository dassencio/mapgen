![Functional tests](https://github.com/dassencio/mapgen/workflows/Functional%20tests/badge.svg)

# Description

`mapgen` is a tool (written in Python 3) which generates interactive maps with
customizable markers. It takes a YAML file containing map settings and marker
data as input and generates an HTML page as output. This page contains all
JavaScript and CSS code it needs inlined into it, so it can be directly opened
in a web browser (without the need for a web server), shared with others (e.g.
via e-mail), or added to an existing webpage through an `<iframe>` element.

Below is an example of what a typical input YAML file looks like:

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
Clicking on a marker will open a popup showing its associated city name and
estimated population.

Here are some more interesting examples:

- Location of SUSE offices: [Input YAML](https://github.com/dassencio/mapgen/tree/master/examples/suse-offices/input.yaml) |
  [Output HTML](https://htmlpreview.github.io/?https://github.com/dassencio/mapgen/blob/master/examples/suse-offices/output.html)

- Largest countries in Western Europe: [Input YAML](https://github.com/dassencio/mapgen/tree/master/examples/largest-west-eu-countries/input.yaml) |
  [Output HTML](https://htmlpreview.github.io/?https://github.com/dassencio/mapgen/blob/master/examples/largest-west-eu-countries/output.html)

- Famous monuments of Paris: [Input YAML](https://github.com/dassencio/mapgen/tree/master/examples/famous-monuments-paris/input.yaml) |
  [Output HTML](https://htmlpreview.github.io/?https://github.com/dassencio/mapgen/blob/master/examples/famous-monuments-paris/output.html)

# License

Except for files from the [Leaflet](https://leafletjs.com/) and
[Leaflet-providers](https://github.com/leaflet-extras/leaflet-providers)
libraries and icons from [Flaticon](https://www.flaticon.com/), all files from
this project are licensed under the GPLv3. See the
[`LICENSE`](https://github.com/dassencio/mapgen/tree/master/LICENSE) file for
more information.

Files from the Leaflet and Leaflet-providers libraries are licensed under the
[2-clause BSD license](https://github.com/Leaflet/Leaflet/blob/master/LICENSE).

Icons from Flaticon were produced by Google, Freepik and Smashicons. Those are
all licensed under the [CC BY 3.0 license](https://creativecommons.org/licenses/by/3.0/).

# Required modules

All Python modules needed by `mapgen` are listed in the
[`requirements.txt`](https://github.com/dassencio/mapgen/tree/master/requirements.txt)
file. You can install them with the following command:

    pip3 install -r requirements.txt

# Usage instructions

For an input file `input.yaml` containing map settings and marker data,
running the following command will generate the desired HTML
page and store it on `output.html`:

    ./mapgen -i input.yaml -o output.html

If you omit `-o output.html` on the command above, the generated HTML will be
printed on the standard output (`stdout`).

# YAML input

## Introduction

Each marker has two possible states: "normal" and "selected". Different icons
can be displayed for a marker depending on whether it is selected or not. This
allows the user to create maps which are more fun to interact with by making
the icon of a selected marker look different from the icons of the
unselected (normal) markers. Only one marker can be selected at a time.

**NOTE**: When running `mapgen`, relative paths to icons files appearing on
the input YAML file will be resolved from the current working directory, not
from the location of the YAML file!

If `popup contents` is defined for a marker, a popup will be shown when it is
selected. Markers with no `popup contents` defined are assumed to be
non-selectable and are therefore always displayed with their normal icons.

The input YAML file is divided into three main sections:

- `default marker settings`: Style settings (e.g. icon dimensions) which are
  applied to all markers by default. These settings can be overridden at the
  definition of each marker.

- `map settings`: Global map settings such as the name of the map tile provider
  as well as external resources to inline into the generated HTML page with the
  intent of modifying the map's style and behavior.

- `markers`: List of markers to be displayed on the map. Each marker must have
  a pair of coordinates specifying its location. A marker is not required
  to have a popup (`popup contents` is an optional attribute).

### Attributes in `default marker settings`:

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
  only affects the icons shown for markers when they are not selected. Has
  higher precedence than `icon dimensions`, i.e., if both `icon dimensions` and
  `normal icon dimensions` are specified, the default dimensions for normal
  icons will be set to those specified in `normal icon dimensions`.

- `selected icon`: Equivalent of `normal icon` for selected icons.

- `selected icon color`: Equivalent of `normal icon color` for selected icons.
  Defaults to `#d30800` (red).

- `selected icon dimensions`: Equivalent of `normal icon dimensions` for
  selected icons.

### Attributes in `map settings`:

- `external css files`: List of CSS files to be inlined into the generated HTML
  page. CSS styles defined in these files will override the default CSS styles
  from `mapgen` (see [`template/mapgen.css`](https://github.com/dassencio/mapgen/tree/master/template/mapgen.css)).

- `external javascript files`: List of JavaScript files to be inlined into the
  generated HTML page. The map can be manipulated through the `map` property of
  the global `mapgen` object (see [`template/mapgen.js`](https://github.com/dassencio/mapgen/tree/master/template/mapgen.js)).

- `show zoom control`: Whether zoom controls (`+`/`-` buttons) should be
  displayed or not. Valid values are `no` and `yes`. Defaults to `yes`.

- `tile provider`: Name associated with the server from which map tiles will be
  fetched. The tile provider name must be among those listed in the
  [Leaflet-providers](https://github.com/leaflet-extras/leaflet-providers)
  project. To preview what the map will look like with a certain provider,
  visit the Leaflet-providers [demo page](https://leaflet-extras.github.io/leaflet-providers/preview/).
  Make sure you do not violate the usage policy of your selected provider as
  that may cause your application to be blocked by it. Defaults to
  `OpenStreetMap.Mapnik`.

- `title`: Title to be displayed when the generated HTML page is opened in a
  web browser.

- `zoom control position`: Location on the map where zoom controls must be
  displayed, if applicable. Valid values are `bottom left`, `bottom right`,
  `top left` and `top right`. Defaults to `top right`.

### Marker entries in `markers`:

All markers must be entered as a list under the `markers` section of the YAML
file. Every marker accepts the same attributes as the ones from
`default marker settings`, but those will only be applied to the marker being
defined, i.e., values for attributes specified on a marker have higher
precedence than those for attributes with the same names specified under
`default marker settings`.

Additional attributes for markers:

- `coordinates`: Marker position on the map expressed as an array of form
  `[latitude, longitude]`. Latitude and longitude values must fall within the
  value ranges `[-90, 90]` and `[-180, 180]` respectively. Every marker
  needs to have `coordinates` defined.

- `popup contents`: HTML contents to be shown on the popup displayed for a
  marker when it is selected.

# Contributors & contact information

Diego Assencio / diego@assencio.com
