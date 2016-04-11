window.jQuery = require("jquery");
window.$ = window.jQuery;
window.d3 = require("d3");
window.bootstrap = require("bootstrap");
require("jquery-ui");
require("datatables.net")(window, $);
require("datatables.net")(window, $);
require("datatables.net-select")(window, $);

require("./init/index");
require("./helper/index");
require("./chart/index");
require("./layout/index");