window.jQuery = require("jquery");
window.$ = window.jQuery;
window.d3 = require("d3");
window.Tether = require("tether");
window.bootstrap = require("bootstrap");
window._ = require("underscore");

require("jquery-ui");
require("datatables.net")(window, $);
require("datatables.net")(window, $);
require("datatables.net-select")(window, $);
require("datatables.net-scroller")(window, $);

require("./init/index");
require("./helper/index");
require("./chart/index");
require("./layout/index");