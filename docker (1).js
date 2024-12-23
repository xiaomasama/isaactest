/* Copyright (c) 2023 Synology Inc. All rights reserved. */

Ext.ns("SYNO.SDS.Docker.Utils");
SYNO.SDS.Docker.Utils.Helper = {
  containerNameRegex: /^[a-zA-Z0-9][a-zA-Z0-9_.-]+$/,
  containerNameValidator: function (b) {
    var a = SYNO.SDS.Docker.Utils.Helper;
    if (b.length >= 2 && b.length <= 64 && b.match(a.containerNameRegex)) {
      return true;
    }
    return a.T("common", "alphanumeric");
  },
  repositoryNameValidator: function (a) {
    if (
      a.length >= 2 &&
      a.length <= 63 &&
      a.match(/^[a-zA-Z0-9]([a-zA-Z0-9._-]*\/)?[a-zA-Z0-9._-]+$/)
    ) {
      return true;
    }
    return SYNO.SDS.Docker.Utils.Helper.T(
      "common",
      "image_repository_naming_spec"
    );
  },
  tagNameValidator: function (a) {
    if (
      a.length >= 2 &&
      a.length <= 64 &&
      a.match(/^[a-zA-Z0-9][a-zA-Z0-9._-]+$/)
    ) {
      return true;
    }
    return SYNO.SDS.Docker.Utils.Helper.T(
      "common",
      "repository_tag_naming_spec"
    );
  },
  networkNameValidator: function (a) {
    if (a.match(/^[a-zA-Z0-9][a-zA-Z0-9_.-]*$/)) {
      return true;
    }
    return SYNO.SDS.Docker.Utils.Helper.T("network", "naming_rule");
  },
  networkIpv4CIDRValidator: function (a) {
    if (a === "") {
      return true;
    }
    if (
      a.match(
        /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\/([0-9]|[1-2][0-9]|3[0-2]))$/
      )
    ) {
      return true;
    }
    return SYNO.SDS.Docker.Utils.Helper.T("network", "ipv4_cidr_rule");
  },
  networkIpv6CIDRValidator: function (a) {
    if (a === "") {
      return true;
    }
    if (
      a.match(
        /^s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:)))(%.+)?s*(\/([0-9]|[1-9][0-9]|1[0-1][0-9]|12[0-8]))?$/
      )
    ) {
      return true;
    }
    return SYNO.SDS.Docker.Utils.Helper.T("network", "ipv6_cidr_rule");
  },
  T: function (c, a) {
    try {
      return (
        _TT("SYNO.SDS.ContainerManager.Application", c, a) ||
        _T(c, a) ||
        c + ":" + a
      );
    } catch (b) {
      return _T(c, a);
    }
  },
  getRealMemory: (function () {
    var a = _D("mem_default_mb");
    SYNO.API.Request({
      api: "SYNO.Core.System",
      method: "info",
      version: 1,
      callback: function (c, b) {
        if (c) {
          a = b.ram_size;
        }
      },
    });
    return function () {
      return a;
    };
  })(),
  getErrorTemplate: function (a) {
    return this.errorMapping[a] || this.T("error", "error_error_system");
  },
  logError: function (a) {
    this.getError.apply(this, arguments);
  },
  getError: function (d) {
    var c = this.getErrorTemplate(d),
      a = [c].concat(Array.prototype.slice.call(arguments, 1)),
      b = String.format.apply(null, a);
    SYNO.Debug("error[", d, "]: ", b);
    return b;
  },
  mask: function (a, b) {
    if (undefined !== b) {
      a.getEl().mask(b, "syno-ux-mask-info");
    } else {
      a.getEl().mask();
    }
  },
  maskLoading: function (a) {
    a.getEl().mask(_T("common", "loading"), "x-mask-loading");
  },
  maskLoadingOnce: function (b, a) {
    if (a.maskLoaded === undefined) {
      this.maskLoading(b);
      a.maskLoaded = true;
    }
  },
  unmask: function (a) {
    a.getEl().unmask();
  },
  relativeTime: function (c) {
    var b = new Date(c),
      a = new Date();
    if (a < b) {
      c = a.getTime() - 1;
    }
    return Ext.util.Format.relativeTime(c);
  },
  getContainerUpTimeStr: function (b) {
    var d = Math.round(new Date().getTime() / 1000) - b,
      a,
      c;
    if (3600 > d) {
      d = 60 > d ? 60 : d;
      a = Math.floor(d / 60);
      c = String.format("Up for {0} min{1}", a, 1 < a ? "s" : "");
    } else {
      if (86400 > d) {
        a = Math.floor(d / 3600);
        c = String.format("Up for {0} hour{1}", a, 1 < a ? "s" : "");
      } else {
        a = Math.floor(d / 86400);
        c = String.format("Up for {0} day{1}", a, 1 < a ? "s" : "");
      }
    }
    return c;
  },
  shortFileSize: function (b, a) {
    a = a || false;
    if (a) {
      if (b < 1000) {
        return b + " B";
      } else {
        if (b < 1000000) {
          return Math.round(b / 1000) + " KB";
        } else {
          if (b < 1000000000) {
            return Math.round(b / 1000000) + " MB";
          } else {
            if (b < 1000000000000) {
              return Math.round(b / 1000000000) + " GB";
            } else {
              if (b < 1000000000000000) {
                return Math.round(b / 1000000000000) + " TB";
              } else {
                return Math.round(b / 1000000000000000) + " PB";
              }
            }
          }
        }
      }
    } else {
      if (b < 1024) {
        return b + " B";
      } else {
        if (b < 1048576) {
          return Math.round((b * 10) / 1024) / 10 + " KB";
        } else {
          if (b < 1073741824) {
            return Math.round(b / 1048576) + " MB";
          } else {
            if (b < 1099511627776) {
              return Math.round((b * 100) / 1073741824) / 100 + " GB";
            } else {
              if (b < 1125899906842624) {
                return Math.round((b * 100) / 1099511627776) / 100 + " TB";
              } else {
                return Math.round((b * 100) / 1125899906842624) / 100 + " PB";
              }
            }
          }
        }
      }
    }
  },
  shortNum: function (a) {
    if (a < 1000) {
      return a;
    } else {
      if (a < 1000000) {
        return Math.round(a / 1000) + "K";
      } else {
        if (a < 1000000000) {
          return Math.round(a / 1000000) + "M";
        } else {
          if (a < 1000000000000) {
            return Math.round(a / 1000000000) + "G";
          } else {
            if (a < 1000000000000000) {
              return Math.round(a / 1000000000000) + "T";
            } else {
              return Math.round(a / 1000000000000000) + "P";
            }
          }
        }
      }
    }
  },
  getUniqArray: function (a) {
    return a.filter(function (d, c, b) {
      return b.indexOf(d) === c;
    });
  },
  resizePanel: function (b, e) {
    var d = 240;
    var a = e ? 40 : 33;
    var c = d;
    var f = a;
    if (e) {
      b.container.setStyle("padding", "0 0 0 0");
    } else {
      b.container.setStyle("padding", "16px 16px 0 16px");
      c += 32;
      f += 32;
    }
    b.container.setSize(b.appWin.getWidth() - d, b.appWin.getHeight() - a);
    b.setSize(b.appWin.getWidth() - c, b.appWin.getHeight() - f);
    b.doLayout();
  },
};
(function () {
  var a = function (b) {
    return SYNO.SDS.Docker.Utils.Helper.T("error", b);
  };
  SYNO.SDS.Docker.Utils.Helper.errorMapping = {
    WEBAPI_ERR_NOT_ALLOW_DEMO: 116,
    116: SYNO.SDS.Docker.Utils.Helper.T("common", "error_demo"),
    WEBAPI_ERR_DOCKER_FILE_EXIST: 1000,
    1000: a("container_exist"),
    WEBAPI_ERR_CONTAINER_RUNNING: 1001,
    1001: a("error_error_system"),
    WEBAPI_ERR_BROKEN_PROFILE: 1002,
    1002: a("invalid_files_format"),
    WEBAPI_ERR_DOCKER_API_HELPER_FAIL: 1003,
    1003: a("error_error_system"),
    WEBAPI_ERR_DOCKER_API_FAIL_LOG: 1004,
    1004: a("docker_api_fail_log"),
    WEBAPI_ERR_ILLEGAL_FILE: 1005,
    1005: a("invalid_files_format"),
    WEBAPI_ERR_LICENSE_API_TIMEOUT: 1025,
    1025: a("ddsm_license_check_fail"),
    WEBAPI_ERR_LICENSE_API_BAD_URL: 1026,
    1026: a("ddsm_license_check_fail"),
    WEBAPI_ERR_REGISTRY_GET_ERR: 1050,
    1050: a("error_error_system"),
    WEBAPI_ERR_REGISTRY_MANAGER_FAIL: 1051,
    1051: a("error_error_system"),
    WEBAPI_ERR_REGISTRY_REMOTE_FAIL: 1052,
    1052: a("registry_remote_fail"),
    WEBAPI_ERR_REGISTRY_BAD_RESULT: 1053,
    1053: a("registry_bad_result"),
    WEBAPI_DOCKER_SUCCESS: 1200,
    1200: "",
    WEBAPI_ERR_DOCKER_BAD_PARAMETER: 1201,
    1201: a("error_error_system"),
    WEBAPI_ERR_DOCKER_UNKOWN: 1202,
    1202: a("error_error_system"),
    WEBAPI_ERR_CONTAINER_FAIL_ATTACH: 1300,
    1300: a("error_error_system"),
    WEBAPI_ERR_CONTAINER_NOT_EXIST: 1301,
    1301: a("container_not_exist"),
    WEBAPI_ERR_CONTAINER_CONFLICT: 1302,
    1302: a("error_error_system"),
    WEBAPI_ERR_CONTAINER_PORT_CONFLICT: 1303,
    1303: a("container_port_conflict"),
    WEBAPI_ERR_CONTAINER_BAD_CMD_PARAM: 1304,
    1304: a("bad_cmd_param"),
    WEBAPI_ERR_CONTAINER_IMPORT_IMAGE_ONLY: 1305,
    1305: a("error_error_system"),
    WEBAPI_ERR_CONTAINER_NAME_CONFLICT: 1306,
    1306: a("container_name_conflict"),
    WEBAPI_ERR_CONTAINER_NO_CONNECTED_NETWORK: 1307,
    1307: a("container_no_connected_network"),
    WEBAPI_ERR_CONTAINER_CIRCULAR_LINK: 1308,
    1308: a("container_circular_link"),
    WEBAPI_ERR_CONTAINER_NONSUPPORTED_C2_BINDS: 1309,
    1309: a("c2_share_volume_binds"),
    WEBAPI_ERR_CONTAINER_UNKNOWN_CAPABILITY: 1310,
    1310: a("unknown_capability"),
    WEBAPI_ERR_IMAGE_CONFLICT: 1400,
    1400: a("image_delete_depend_error"),
    WEBAPI_ERR_IMAGE_NOT_EXIST: 1401,
    1401: a("image_not_exist"),
    WEBAPI_ERR_IMAGE_CREATE_PARSE_FAIL: 1402,
    1402: a("invalid_files_format"),
    WEBAPI_ERR_IMAGE_LOAD_PARSE_FAIL: 1403,
    1403: a("invalid_files_format"),
    WS_ERR_CLIENT_ATTACH: 1500,
    1500: a("ws_client_attach"),
    WS_ERR_EXEC_END: 1501,
    1501: a("ws_exec_end"),
    WS_ERR_UNKNOWN: 1502,
    1502: a("ws_close"),
    WS_ATTACH_SUCC: 1503,
    1503: "",
    WS_ATTACH_CLIENT: 1504,
    1504: a("term_attach_fail"),
    WS_ATTACH_FAIL_TTY: 1505,
    1505: a("term_attach_fail_tty"),
    WEBAPI_ERR_DDSM_IMPORTING: 1600,
    1600: a("ddsm_importing"),
    WEBAPI_ERR_DDSM_UPDATING: 1601,
    1601: a("ddsm_updating"),
    WEBAPI_ERR_DDSM_RESTORING: 1602,
    1602: a("ddsm_restoring"),
    WEBAPI_ERR_DDSM_DOWNLOAD_FAIL: 1610,
    1610: a("ddsm_download_failed"),
    WEBAPI_ERR_DDSM_NO_RELEASE: 1611,
    1611: a("ddsm_no_release"),
    WEBAPI_ERR_DDSM_IMPORT_BAD_VERSION: 1612,
    1612: a("ddsm_import_bad_version"),
    WEBAPI_ERR_DDSM_IMPORT_BAD_IMAGE: 1613,
    1613: a("ddsm_import_bad_image"),
    WEBAPI_ERR_DDSM_IMPORT_WRONG_IMAGE: 1614,
    1614: a("ddsm_import_wrong_image"),
    WEBAPI_ERR_DDSM_UPDATE_NO_TARGET: 1615,
    1615: a("ddsm_update_no_target"),
    WEBAPI_ERR_DDSM_RESTORE_LOST_CONFIG: 1616,
    1616: a("ddsm_restore_lost_config"),
    WEBAPI_ERR_DDSM_UPDATE_FAILED: 1617,
    1617: a("ddsm_update_failed"),
    WEBAPI_ERR_DDSM_UPDATE_REQUIRED: 1618,
    1618: a("ddsm_update_required"),
    WEBAPI_ERR_DDSM_INCOMPATIBLE_VERSION: 1619,
    1619: a("ddsm_incompatible_version"),
    WEBAPI_ERR_DDSM_NETWORK_CHECK_FAIL: 1650,
    1650: a("network_check_failed"),
    WEBAPI_ERR_DDSM_NETWORK_SETUP_FAIL: 1651,
    1651: a("network_setup_failed"),
    WEBAPI_ERR_DDSM_NETWORK_IP_CONFLICT: 1652,
    1652: _T("tcpip", "tcpip_ip_used"),
    WEBAPI_ERR_DDSM_NETWORK_IFACE_ABNORMAL: 1653,
    1653: a("network_interface_abnormal"),
    WEBAPI_ERR_DDSM_NETWORK_REQUIRE_OVS_MODE: 1654,
    1654: a("require_ovs_network"),
    WEBAPI_ERR_DDSM_SHARE_NOT_EXIST: 1700,
    1700: a("ddsm_share_not_exist"),
    WEBAPI_ERR_DDSM_SHARE_REQUIRE_BTRFS: 1701,
    1701: a("ddsm_share_not_btrfs"),
    WEBAPI_ERR_DDSM_SHARE_ERROR_UNKNOW: 1702,
    1702: a("ddsm_share_abnormal"),
    WEBAPI_ERR_DDSM_SHARE_ENCRYPTED: 1703,
    1703: a("ddsm_share_encrypted"),
    WEBAPI_ERR_DDSM_LICENSE_LIMIT_REACHED: 1720,
    1720: a("ddsm_license_limit_reached"),
    WEBAPI_ERR_NETWORK_NAME_CONFLCT: 1800,
    1800: a("network_exist"),
    WEBAPI_ERR_NETWORK_CONNECT_DISCONNECT_FAIL: 1801,
    1801: a("network_connect_disconnect_fail"),
    WEBAPI_ERR_NETWORK_CREATE_FAIL: 1802,
    1802: a("network_create_fail"),
    WEBAPI_ERR_NETWORK_SUBNET4_DUPLICATE: 1803,
    1803: a("network_ipv4_subnet_duplicate"),
    WEBAPI_ERR_NETWORK_SUBNET6_DUPLICATE: 1804,
    1804: a("network_ipv6_subnet_duplicate"),
    WEBAPI_ERR_NETWORK_GATEWAY4_DUPLICATE: 1805,
    1805: a("network_ipv4_gateway_duplicate"),
    WEBAPI_ERR_NETWORK_GATEWAY6_DUPLICATE: 1806,
    1806: a("network_ipv6_gateway_duplicate"),
    WEBAPI_ERR_NETWORK_GATEWAY4_OUTOFRANGE: 1807,
    1807: a("network_ipv4_gateway_outofrange"),
    WEBAPI_ERR_NETWORK_GATEWAY6_OUTOFRANGE: 1808,
    1808: a("network_ipv6_gateway_outofrange"),
    WEBAPI_ERR_NETWORK_SUBNET_OVERLAP: 1809,
    1809: a("network_subnet_overlap"),
    WEBAPI_CORE_ERR_SHARE_SPACE_NOT_ENOUGH: 3320,
    3320: a("space_not_enough"),
  };
})();
Ext.define("SYNO.SDS.Docker.Container.StatusUtil", {
  singleton: true,
  status: {
    run: "running",
    stop: "stopped",
    updating: "updating",
    restarting: "restarting",
  },
  statusCode: {
    unselected: 1,
    run: 2,
    stop: 4,
    synopackage: 8,
    exporting: 16,
    ddsm: 32,
  },
  stat2StatCode: function (a) {
    var b =
      (a.status === this.status.run) | (a.status === this.status.restarting)
        ? this.statusCode.run
        : this.statusCode.stop;
    if (a.is_package) {
      b |= this.statusCode.synopackage;
    }
    if (a.exporting) {
      b |= this.statusCode.exporting;
    }
    if (a.is_ddsm) {
      b |= this.statusCode.ddsm;
    }
    return b;
  },
});
Ext.define("SYNO.SDS.Docker.Overview.UsageBlocks", {
  extend: "Ext.Container",
  helper: SYNO.SDS.Docker.Utils.Helper,
  constructor: function (a) {
    this.callParent([this.fillConfig(a)]);
  },
  fillConfig: function (a) {
    this.percent = new Ext.BoxComponent({ cls: "docker-percent" });
    this.progressbar = new Ext.ProgressBar({
      cls: "docker-progress",
      animate: true,
    });
    var c = {
      scope: this,
      data: this.onData,
      afterrender: this._onResize,
      resize: this._onResize,
    };
    Ext.apply(c, a.listeners);
    delete a.listeners;
    var b = {
      layout: { type: "vbox", align: "stretch" },
      items: [
        { xtype: "label", cls: "docker-header", html: a.header },
        {
          xtype: "container",
          layout: "hbox",
          cls: "docker-usage",
          items: [
            { xtype: "box", cls: "docker-icon" },
            {
              xtype: "container",
              cls: "docker-right",
              items: [
                {
                  xtype: "container",
                  itemId: "percentWrapper",
                  cls: "docker-percent-wrapper",
                  items: [this.percent],
                },
                this.progressbar,
              ],
            },
            { xtype: "box", cls: "x-clear" },
          ],
        },
      ],
      listeners: c,
    };
    Ext.apply(b, a);
    return b;
  },
  _onResize: function () {
    this.progressbar.setWidth(this.getWidth() - 154);
  },
  sizeNUnit: function (a) {
    return this.helper
      .shortFileSize(a)
      .match(/(.+) (\w+)/)
      .slice(1);
  },
  onData: function (c, e, a) {
    if (e === undefined) {
      this.percent.update("" + c);
      this.progressbar.updateProgress(c * 0.01);
    } else {
      var b = this.sizeNUnit(c),
        d = this.sizeNUnit(this.helper.getRealMemory() * 1024 * 1024),
        f;
      if (a) {
        f = String.format('{0}<div class="docker-unit">{1}</div>', b[0], b[1]);
      } else {
        f = String.format(
          '{0}<div class="docker-unit">{1}</div><span class="docker-ram-total"> / {2}<div class="docker-unit">{3}</div></span>',
          b[0],
          b[1],
          d[0],
          d[1]
        );
      }
      this.percent.update(f);
      this.progressbar.updateProgress(e * 0.01);
    }
  },
});
Ext.define("SYNO.SDS.Docker.Overview.TopGraph", {
  extend: "Ext.Container",
  helper: SYNO.SDS.Docker.Utils.Helper,
  statusUtil: SYNO.SDS.Docker.Container.StatusUtil,
  constructor: function (a) {
    this.callParent([this.fillConfig(a)]);
  },
  fillConfig: function (a) {
    var c = { owner: this, appWin: a.appWin };
    this.usageBlocks = {
      cpu: new SYNO.SDS.Docker.Overview.UsageBlocks(
        Ext.apply(
          {
            type: "cpu",
            columnWidth: ".50",
            header: this.helper.T("overview", "cpu_usage"),
            cls: "docker-block-overview docker-cpu",
          },
          c
        )
      ),
      memory: new SYNO.SDS.Docker.Overview.UsageBlocks(
        Ext.apply(
          {
            type: "memory",
            columnWidth: ".50",
            header: this.helper.T("overview", "ram_usage"),
            cls: "docker-block-overview docker-memory",
          },
          c
        )
      ),
    };
    var b = {
      cls: "syno-sds-docker-overview-usage",
      layout: "column",
      items: [
        this.usageBlocks.cpu,
        { xtype: "syno_displayfield", width: "6px" },
        this.usageBlocks.memory,
        { xtype: "box", cls: "x-clear" },
      ],
      listeners: { scope: this, data: this.onData },
    };
    Ext.apply(b, a);
    return b;
  },
  onData: function (a) {
    this.usageBlocks.cpu.fireEvent("data", a.overview.cpu);
    this.usageBlocks.memory.fireEvent(
      "data",
      a.overview.memory,
      a.overview.memoryPercent
    );
  },
});
Ext.define("SYNO.SDS.Docker.Overview.CardView", {
  extend: "SYNO.ux.FleXcroll.DataView",
  helper: SYNO.SDS.Docker.Utils.Helper,
  constructor: function (a) {
    this.owner = a.owner;
    var b = Ext.apply(
      {
        trackResetOnLoad: false,
        cls: "syno-docker-overview-running",
        customizeEmptyText: this.helper.T("overview", "no_container"),
        itemSelector: ".item-wrap",
        tpl: this.createTpl(),
        listeners: { scope: this, resize: this.onViewResize },
      },
      a
    );
    this.callParent([b]);
    this.mon(this.store, "load", this._onStoreLoad, this);
  },
  createTpl: function () {
    return new Ext.XTemplate(
      '<tpl for=".">',
      '<div data-name={name} class="syno-sds-docker-overview-card">',
      '<div class="syno-sds-docker-overview-card-header">',
      '<div class="syno-sds-docker-overview-card-info">',
      '<h3 ext:qtip="{name}">{name}</h3>',
      '<p ext:qtip="{image}">{image}</p>',
      "<p>{uptime}</p>",
      "</div>",
      "</div>",
      '<div class="syno-sds-docker-overview-card-status">',
      '<div class="docker-cpumem">',
      '<div class="syno-sds-docker-card-info">',
      '<div class="docker-left docker-title">CPU</div>',
      '<div class="docker-right docker-number">{cpu}</div>',
      '<div class="x-clear"></div>',
      "</div>",
      '<div class="syno-sds-docker-card-bar docker-cpu">',
      '<div class="docker-bar-progress docker-cpu" style="width: {cpuPercent}"></div>',
      "</div>",
      "</div>",
      '<div class="docker-cpumem">',
      '<div class="syno-sds-docker-card-info">',
      '<div class="docker-left docker-title">RAM</div>',
      '<div class="docker-right docker-number">{memory}</div>',
      '<div class="x-clear"></div>',
      "</div>",
      '<div class="syno-sds-docker-card-bar docker-memory">',
      '<div class="docker-bar-progress docker-memory" style="width: {memoryPercent}"></div>',
      "</div>",
      "</div>",
      "</div>",
      "</div>",
      "</tpl>",
      '<div class="x-clear"></div>'
    );
  },
  _onStoreLoad: function () {
    this.adjustContainerLayout();
    var b = this.getEl().select(".syno-sds-docker-overview-card"),
      a = this.store;
    b.each(function (d) {
      var g = d.getAttribute("data-name"),
        e = a.getById(g),
        f = d.select(".docker-bar-progress .docker-cpu"),
        h = d.select(".docker-bar-progress .docker-memory"),
        c;
      if (!e.states.isNew) {
        c = e.states.oldRecord;
        f.setWidth(c.cpuPercent);
        h.setWidth(c.memoryPercent);
      }
    });
    setTimeout(function () {
      b.each(function (c) {
        c.addClass("syno-sds-docker-overview-card-float-transition");
        var g = c.getAttribute("data-name"),
          e = "syno-sds-docker-overview-card-bar-transition",
          d = a.getById(g),
          f = c.select(".docker-bar-progress .docker-cpu"),
          h = c.select(".docker-bar-progress .docker-memory");
        if (!d.states.isNew) {
          f.addClass(e).setWidth(d.get("cpuPercent"));
          h.addClass(e).setWidth(d.get("memoryPercent"));
        }
      });
    }, 0);
  },
  onViewResize: function () {
    this.adjustContainerLayout();
  },
  adjustContainerLayout: function () {
    var a = this.getEl().select(".syno-sds-docker-overview-card");
    if (a.elements.length === 0) {
      this.adjustContainerHeight(a, 1);
      return;
    }
    var g = 60;
    var b = this.getWidth() - g;
    var e = a.elements.length;
    var d = a.elements[0].clientWidth;
    var h = 8;
    var f = Math.floor((b + h) / (d + h));
    var c = Math.ceil(e / f);
    var j = 0;
    var i = 0;
    if (f >= e) {
      j = h;
      i = e;
    } else {
      j = (b - f * d) / (f - 1);
      i = f;
    }
    this.adjustMargin(a, i, j);
    this.adjustContainerHeight(a, c);
  },
  adjustMargin: function (a, c, b) {
    a.each(function (e, f, d) {
      d += 1;
      if (d % c === 0) {
        e.setStyle("marginRight", 0);
      } else {
        e.setStyle("marginRight", b + "px");
      }
    });
  },
  adjustContainerHeight: function (a, b) {
    this.ownerCt.ownerCt.ownerCt.setHeight(b * 236 + 86);
    this.ownerCt.setHeight(b * 236);
    this.ownerCt.ownerCt.ownerCt.ownerCt.ownerCt.doLayout();
  },
});
Ext.namespace("SYNO.SDS.Docker.Utils");
SYNO.SDS.Docker.Utils.DockerHub = {
  domain: "registry.hub.docker.com",
  domainRegex: /^(https?:\/\/)?registry.hub.docker.com/,
  repoRegex:
    /^(https:\/\/registry.hub.docker.com)\/(?:[A-Za-z]\/)?([A-Za-z0-9_-]+\/[A-Za-z0-9_.-]+)\/?$/,
  shortname: "Docker Hub",
  isDockerHubShortName: function (a) {
    return this.shortname === a;
  },
  isDockerHub: function (a) {
    return this.domainRegex.test(a);
  },
  formDockerHubUrl: function (a) {
    var c = /^([^\/]*\/)?([^\/]*)$/;
    var b = c.exec(a);
    if (!b) {
      return null;
    }
    return String.format(
      "https://{0}/{1}/{2}/",
      this.domain,
      b[1] ? "r" : "_",
      a
    );
  },
};
Ext.define("SYNO.SDS.Docker.Overview.RunningContainers", {
  extend: "SYNO.ux.Panel",
  helper: SYNO.SDS.Docker.Utils.Helper,
  statusUtil: SYNO.SDS.Docker.Container.StatusUtil,
  dockerHubHelper: SYNO.SDS.Docker.Utils.DockerHub,
  constructor: function (a) {
    this.callParent([this.fillConfig(a)]);
  },
  fillConfig: function (a) {
    this.store = this.createStore(a);
    this.view = this.createView(a);
    var b = {
      store: this.store,
      layout: { type: "fit" },
      items: [this.view],
      listeners: { scope: this, data: this.onData, resize: this.onPanelResize },
    };
    Ext.apply(b, a);
    return b;
  },
  createView: function (a) {
    return new SYNO.SDS.Docker.Overview.CardView({
      plugins: [new SYNO.SDS.Docker.Utils.PreserveStates()],
      panel: this,
      owner: a.owner,
      appWin: a.appWin,
      store: this.store,
    });
  },
  createStore: function (a) {
    return new Ext.data.JsonStore({
      fields: [
        {
          name: "name",
          mapping: "name",
          sortType: function (b) {
            return b.toLowerCase();
          },
        },
        { name: "image", mapping: "image" },
        { name: "cpu", mapping: "cpu" },
        { name: "cpuPercent", mapping: "cpuPercent" },
        { name: "memory", mapping: "memory" },
        { name: "memoryPercent", mapping: "memoryPercent" },
        { name: "uptime", mapping: "up_time" },
        { name: "status", mapping: "status" },
      ],
      autoDestroy: true,
      root: "items",
      idProperty: "name",
      sortInfo: { field: "name", direction: "ASC" },
    });
  },
  loadStore: function (d, e) {
    var a = [],
      c = {},
      b = this.helper.getRealMemory() * 1024 * 1024;
    a = d
      .filter(function (f) {
        return f.status === this.statusUtil.status.run;
      }, this)
      .map(function (f) {
        f.up_time = this.helper.relativeTime(f.up_time * 1000);
        f.image = f.image.replace(this.dockerHubHelper.domain + "/", "");
        return f;
      }, this);
    a.forEach(function (f, g) {
      c[f.name] = g;
    });
    Ext.each(
      e,
      function (f) {
        var g = c[f.name];
        if (undefined !== a[g]) {
          a[g].cpu = f.cpu + "%";
          a[g].cpuPercent = f.cpu + "%";
          a[g].memory = this.helper.shortFileSize(f.memory);
          a[g].memoryPercent =
            Ext.util.Format.round((f.memory * 100) / b, 2) + "%";
        }
      },
      this
    );
    this.store.loadData({ items: a });
  },
  onRowClick: function () {
    var a = this.getSelectionModel().getSelections();
    SYNO.SDS.AppLaunch("SYNO.SDS.Docker.ContainerDetail.Instance", a[0]);
  },
  onData: function (a) {
    this.loadStore(a.containers, a.resources);
  },
  onPanelResize: function () {
    this.view.fireEvent("resize");
  },
});
Ext.define("SYNO.SDS.Docker.Overview.Panel", {
  extend: "SYNO.ux.Panel",
  refreshInterval: 3000,
  helper: SYNO.SDS.Docker.Utils.Helper,
  constructor: function (a) {
    this.callParent([this.fillConfig(a)]);
    this.pollingTask = this.createPollingTask();
  },
  fillConfig: function (a) {
    var c = { owner: this, appWin: a.appWin };
    this.processData = null;
    this.panelMigrater = new SYNO.SDS.VuePanel({
      vueClass: SYNO.SDS.Docker.Panels.Migrater,
      owner: this,
    });
    this.panelGraph = new SYNO.SDS.Docker.Overview.TopGraph(c);
    this.panelRunning = new SYNO.SDS.Docker.Overview.RunningContainers(c);
    this.dataListeners = [this.panelGraph, this.panelRunning];
    var b = {
      border: false,
      autoFlexcroll: true,
      padding: "16px 20px 16px 20px",
      layout: { type: "anchor" },
      items: [
        this.panelMigrater,
        this.panelGraph,
        {
          xtype: "container",
          anchor: "100% - 170",
          layout: { type: "vbox", align: "stretch" },
          autoScroll: false,
          cls: "syno-sds-docker-running-container",
          items: [
            {
              xtype: "label",
              cls: "docker-header",
              html: this.helper.T("overview", "running_container"),
            },
            {
              xtype: "container",
              autoScroll: false,
              cls: "docker-usage",
              items: [this.panelRunning],
            },
          ],
        },
      ],
      listeners: {
        scope: this,
        activate: this.onActivate,
        deactivate: this.onDeactivate,
        resize: this.onPanelResize,
      },
    };
    Ext.apply(b, a);
    return b;
  },
  createPollingTask: function () {
    return this.addWebAPITask({
      scope: this,
      interval: this.refreshInterval,
      compound: {
        stopwhenerror: true,
        params: [
          {
            api: "SYNO.Docker.Container",
            method: "list",
            version: 1,
            params: { limit: -1, offset: 0, type: "all" },
          },
          { api: "SYNO.Docker.Container.Resource", method: "get", version: 1 },
          {
            api: "SYNO.Core.System.Utilization",
            method: "get",
            version: 1,
            type: "current",
            resource: ["cpu", "memory"],
          },
        ],
      },
      callback: function (d, b, c, a) {
        this.helper.unmask(this);
        if (!b.has_fail) {
          this.onData(b);
        } else {
          this.onException(b.result);
        }
      },
    });
  },
  dataPreprocess: function (b) {
    var d = {
        containers: SYNO.API.Response.GetValByAPI(
          b,
          "SYNO.Docker.Container",
          "list"
        ).containers,
        resources: SYNO.API.Response.GetValByAPI(
          b,
          "SYNO.Docker.Container.Resource",
          "get"
        ).resources,
      },
      a = SYNO.API.Response.GetValByAPI(
        b,
        "SYNO.Core.System.Utilization",
        "get"
      ),
      c = a.cpu,
      e = a.memory;
    d.containers = d.containers.filter(function (f) {
      return f.status === SYNO.SDS.Docker.Container.StatusUtil.status.run;
    });
    d.resources = d.resources.map(function (f) {
      f.cpu = Ext.util.Format.round(f.cpu, 2);
      return f;
    });
    d.overview = {
      cpu: c.system_load + c.user_load,
      memory: (e.total_real - e.avail_real - e.cached - e.buffer) * 1024,
      memoryPercent: Ext.util.Format.round(e.real_usage / 100, 2) * 100,
    };
    return d;
  },
  onData: function (a) {
    this.processData = this.dataPreprocess(a);
    Ext.each(
      this.dataListeners,
      function (b) {
        b.fireEvent("data", this.processData);
      },
      this
    );
  },
  onException: function (a) {
    a.forEach(function (b) {
      if (!b.success) {
        this.helper.logError(b.error.code);
      }
    }, this);
  },
  onActivate: function () {
    this.helper.resizePanel(this, true);
    this.getEl().dom.parentNode.style.background = "#F4F8FA";
    this.helper.maskLoadingOnce(this, this);
    this.pollingTask.start(true);
  },
  onDeactivate: function () {
    this.getEl().dom.parentNode.style.background = "";
    this.pollingTask.stop();
  },
  onPanelResize: function () {
    this.panelRunning.fireEvent("resize");
  },
});
Ext.form.VTypes.portWithAutoText = _JSLIBSTR("vtype", "bad_port");
Ext.form.VTypes.portWithAutoMask = /[0-9]/;
Ext.form.VTypes.portWithAutoVal =
  /^([0-9]{0,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/;
Ext.form.VTypes.portWithAuto = function (b) {
  return Ext.form.VTypes.portWithAutoVal.test(b);
};
Ext.define("SYNO.SDS.Docker.EditorGridPanel", {
  extend: "SYNO.ux.EditorGridPanel",
  helper: SYNO.SDS.Docker.Utils.Helper,
  constructor: function () {
    this.callParent(arguments);
    this.colModel.columns.forEach(function (b) {
      var a = b.getCellEditor();
      if (a) {
        a.grid = this;
        this.mon(a, "hide", this.isEditorValid, this);
        this.mon(
          a,
          "specialkey",
          function (d, c) {
            if (c.getCharCode() === c.ENTER) {
              return this.isValid(true);
            }
          },
          this
        );
      }
    }, this);
    this.mon(
      this.store,
      "remove",
      function () {
        this.stopEditing();
      },
      this
    );
    this.mon(
      this.store,
      "add",
      function (b, a, c) {
        this.colModel.columns.forEach(function (e) {
          var d = e.getCellEditor();
          if (d) {
            d.mon(
              d,
              "show",
              function () {
                this.field.clearInvalid();
              },
              null,
              { single: true }
            );
          }
        }, this);
      },
      this
    );
  },
  isEditorValid: function (b) {
    var a = this.view.getCell(b.row, b.col);
    if (false === b.field.isValid()) {
      a.classList.add("x-cell-invalid");
    } else {
      if (a.classList.contains("x-cell-invalid")) {
        a.classList.remove("x-cell-invalid");
      }
    }
  },
  isCellValid: function (c, e) {
    if (!this.colModel.isCellEditable(c, e)) {
      return true;
    }
    var b = this.colModel.getCellEditor(c, e);
    if (!b) {
      return true;
    }
    var a = this.store.getAt(e);
    if (!a) {
      return true;
    }
    var d = this.colModel.getDataIndex(c);
    b.field.setValue(a.data[d]);
    return b.field.isValid(true);
  },
  isValid: function (g) {
    var e = this.colModel.getColumnCount();
    var d = this.store.getCount();
    var b, f;
    var a = true;
    for (b = 0; b < d; b++) {
      for (f = 0; f < e; f++) {
        a = this.isCellValid(f, b);
        if (!a) {
          break;
        }
      }
      if (!a) {
        break;
      }
    }
    if (g && !a) {
      this.startEditing(b, f);
    }
    return a;
  },
  dumpStoreData: function () {
    var a = [];
    this.store.each(function (b) {
      var c = {};
      Ext.apply(c, b.data);
      delete c.dirty;
      a.push(c);
    });
    return a;
  },
  loadStoreData: function (a) {
    this.store.loadData(a);
  },
});
Ext.define("SYNO.SDS.Docker.Container.ProfileUI", {
  extend: Object,
  helper: SYNO.SDS.Docker.Utils.Helper,
  getNameCfg: function (a) {
    return [
      {
        xtype: "syno_textfield",
        name: "name",
        allowBlank: false,
        maxlength: 64,
        fieldLabel: this.helper.T("container", "container_name"),
        validator: this.helper.containerNameValidator,
      },
    ];
  },
  getEditNameCfg: function (a) {
    return [
      {
        xtype: "syno_textfield",
        name: "name",
        maxlength: 64,
        x: -65,
        allowBlank: false,
        readOnly: a && a.is_package,
        fieldLabel: this.helper.T("container", "container_name"),
        validator: this.helper.containerNameValidator,
      },
    ];
  },
  getDsmNameCfg: function (a) {
    return [
      {
        xtype: "syno_textfield",
        fieldLabel: this.helper.T("container", "container_name"),
        name: "name",
        vtype: "netbiosName",
        value: a,
        allowBlank: false,
        minLength: 2,
        maxlength: 15,
      },
    ];
  },
  getNameValue: function (a) {
    var b = a.form;
    var c = {};
    if (b && b.findField("name")) {
      c.name = b.findField("name").getValue();
    }
    return c;
  },
  setNameValue: function (a, c) {
    var b = a.form;
    if (b && b.findField("name") && c.name) {
      b.findField("name").setValue(c.name);
    }
  },
  validateName: function (b, f) {
    var d = b.form;
    var c = true,
      e,
      a;
    if (!d) {
      return c;
    }
    a = d.findField("name");
    e = a.getValue();
    c = a.isValid();
    if (false === c && f) {
      a.focus();
    }
    return c;
  },
  onSelectAutoMapping: function (b, a) {
    var c = [];
    if (
      !b ||
      !b.panel ||
      !b.panel.portGrid ||
      !b.panel.portGrid.store ||
      !b.panel.portGrid.store.getCount()
    ) {
      return;
    }
    if (a) {
      c = b.panel.portGrid.getValues();
      Ext.each(c, function (d) {
        d.host_port = 0;
      });
      b.panel.portGrid.setValues(c);
    } else {
      b.panel.portGrid.startEditing(0, 0);
    }
  },
  getPortCfg: function (a) {
    var b = this.getPortGrid(a);
    return [
      {
        xtype: "syno_displayfield",
        fieldLabel: this.helper.T("container", "port_setting"),
      },
      b,
      {
        xtype: "syno_checkbox",
        name: "enable_publish_all_ports",
        boxLabel: this.helper.T("container", "auto_port_mapping"),
        disabled: a && a.is_package,
        hidden: true,
        panel: this,
        listeners: { check: this.onSelectAutoMapping, scope: this },
      },
    ];
  },
  getPortGrid: function (a) {
    var b = this;
    if (this.portGrid && !this.portGrid.isDestroyed) {
      return this.portGrid;
    }
    this.portGrid = new SYNO.SDS.Docker.EditorGridPanel({
      height: 390,
      clicksToEdit: 1,
      forceValidation: true,
      enableHdMenu: false,
      selModel: new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
          scope: this,
          selectionchange: this.onPortGridSelectionChange,
        },
      }),
      store: new Ext.data.JsonStore({
        autoDestroy: true,
        fields: [
          { name: "host_port", type: "int" },
          { name: "container_port", type: "int" },
          { name: "type", type: "string" },
          { name: "fixed", type: "bool" },
        ],
      }),
      tbar: [
        {
          xtype: "syno_button",
          tooltip: _T("common", "add"),
          text: this.helper.T("common", "add"),
          scope: this,
          handler: function () {
            var d = this.portGrid;
            var c = d.getStore();
            if (c.getCount()) {
              if ("" === c.getAt(0).get("container_port")) {
                return d.startEditing(0, 1);
              }
            }
            var e = new c.recordType({
              dirty: false,
              host_port: 0,
              container_port: "",
              type: "tcp",
            });
            d.stopEditing();
            c.insert(0, e);
            d.startEditing(0, 1);
          },
        },
        {
          xtype: "syno_button",
          itemId: "delete_port",
          tooltip: this.helper.T("common", "delete"),
          text: this.helper.T("common", "delete"),
          scope: this,
          disabled: true,
          handler: function () {
            var d = this.getPortGrid();
            var c = d.getStore();
            if (
              !d.getSelectionModel().getSelected() ||
              d.getSelectionModel().getSelected().data.fixed
            ) {
              return;
            }
            c.remove(d.getSelectionModel().getSelected());
          },
        },
      ],
      colModel: new Ext.grid.ColumnModel({
        defaults: { width: 120, sortable: false },
        columns: [
          {
            header: this.helper.T("container", "local_port"),
            dataIndex: "host_port",
            editor: new SYNO.ux.NumberField({
              vtype: "portWithAuto",
              validator: this.checkPortUnique,
              beforeBlur: function () {
                if (!this.getValue()) {
                  this.setValue(0);
                }
              },
            }),
            renderer: function (c) {
              if (!c) {
                return _T("common", "auto");
              }
              return c;
            },
          },
          {
            header: this.helper.T("container", "container_port"),
            dataIndex: "container_port",
            editor: {
              xtype: "syno_numberfield",
              vtype: "port",
              validator: this.checkPortUnique,
            },
          },
          {
            header: this.helper.T("common", "type"),
            dataIndex: "type",
            editor: new SYNO.ux.ComboBox({
              typeAhead: true,
              triggerAction: "all",
              lazyRender: true,
              mode: "local",
              allowBlank: false,
              store: new Ext.data.ArrayStore({
                fields: ["value", "display"],
                data: [
                  ["tcp", "TCP"],
                  ["udp", "UDP"],
                ],
              }),
              valueField: "value",
              displayField: "display",
            }),
            renderer: function (e, d, c) {
              switch (e) {
                case "tcp":
                  return "TCP";
                case "udp":
                  return "UDP";
                default:
                  return "TCP";
              }
            },
          },
        ],
        isCellEditable: function (e, f) {
          var c = b.portGrid.getStore().getAt(f).data,
            d = b.portGrid.getStore().fields.keys[e];
          if (c.fixed) {
            b.portGrid.getTopToolbar().getComponent("delete_port").disable();
            return false;
          }
          if ("host_port" === d && 0 === c.host_port) {
            if (
              true ===
              b.portGrid.ownerCt
                .getForm()
                .findField("enable_publish_all_ports")
                .getValue()
            ) {
              return false;
            }
          }
          return Ext.grid.ColumnModel.prototype.isCellEditable.call(this, e, f);
        },
      }),
      viewConfig: { markDirty: false },
      listeners: {
        afteredit: function (c) {
          c.record.commit();
        },
        beforeedit: function (c) {
          if ("host_port" != c.field) {
            return;
          }
          if (!c.value) {
            c.record.store.getAt(c.row).data.host_port = "";
          }
        },
      },
    });
    return this.portGrid;
  },
  onPortGridSelectionChange: function (a) {
    var b = a.getSelections();
    this.getPortGrid()
      .getTopToolbar()
      .getComponent("delete_port")
      .setDisabled(b.length === 0);
  },
  getPortValue: function (a) {
    var b = a.form;
    return {
      port_bindings: this.data.use_host_network
        ? []
        : this.getPortGrid().dumpStoreData(),
      enable_publish_all_ports: b
        .findField("enable_publish_all_ports")
        .getValue(),
    };
  },
  setPortValue: function (a, c) {
    var b = a.form;
    if (c.port_bindings && 0 < c.port_bindings.length) {
      this.getPortGrid().loadStoreData(c.port_bindings);
    }
    if (
      b &&
      b.findField("enable_publish_all_ports") &&
      c.enable_publish_all_ports
    ) {
      b.findField("enable_publish_all_ports").setValue(
        c.enable_publish_all_ports
      );
    }
  },
  validatePort: function (a, b) {
    return this.getPortGrid().isValid(b);
  },
  getRestartPolicyCfg: function (b) {
    var a = this.helper.T("wizard", "restart_policy_tip");
    return [
      {
        xtype: "syno_checkbox",
        name: "enable_restart_policy",
        boxLabel: this.helper.T("wizard", "restart_policy"),
        disabled: b && b.is_package,
        listeners: {
          afterrender: function (c) {
            SYNO.ux.AddTip(this.getEl(), a);
          },
        },
      },
    ];
  },
  getHostNetworkCfg: function (a) {
    return [
      {
        xtype: "syno_checkbox",
        name: "use_host_network",
        boxLabel: this.helper.T("network", "network_host"),
        disabled: a && (a.is_package || !a.is_create),
        listeners: { scope: this, check: this.onSelectHostNetwork },
      },
    ];
  },
  onSelectHostNetwork: function (b, a) {
    if (!this.getNetworkGrid().el) {
      return;
    }
    if (a) {
      this.helper.mask(
        this.getNetworkGrid(),
        this.helper.T("network", "host_network_warn")
      );
    } else {
      this.helper.unmask(this.getNetworkGrid());
    }
  },
  getResourceCfg: function (a) {
    var d = {
      value: a.mem_default_mb || this.helper.getRealMemory(),
      minValue: a.mem_min_mb || 4,
      maxValue: a.mem_max_mb || this.helper.getRealMemory(),
    };
    var c = new SYNO.ux.SliderField(
      Ext.apply(
        {
          width: 200,
          increment: 1,
          name: "memory_limit_slider",
          listeners: {
            render: function (f) {
              this.slider.halfThumb = 7;
            },
            valuechange: function (g, f) {
              this.nextSibling().setValue(f);
            },
          },
        },
        d
      )
    );
    var e = new SYNO.ux.NumberField(
      Ext.apply(
        {
          width: 70,
          name: "memory_limit",
          enableKeyEvents: true,
          listeners: {
            keyup: function (g, f) {
              b.delay(300);
            },
          },
        },
        d
      )
    );
    var b = new Ext.util.DelayedTask(function () {
      this.previousSibling().setValue(this.getValue());
    }, e);
    return [
      {
        xtype: "syno_checkbox",
        name: "enable_resource_limit",
        boxLabel: this.helper.T("container", "resource_limit"),
        disabled: a && a.is_package,
      },
      {
        xtype: "syno_compositefield",
        fieldLabel: this.helper.T("container", "cpu_priority"),
        name: "cpu_composite",
        indent: 1,
        disabled: a && a.is_package,
        items: [
          {
            xtype: "syno_radio",
            name: "cpu_priority",
            inputValue: 10,
            boxLabel: this.helper.T("container", "low"),
          },
          {
            xtype: "syno_radio",
            name: "cpu_priority",
            inputValue: 50,
            boxLabel: this.helper.T("container", "med"),
            checked: true,
          },
          {
            xtype: "syno_radio",
            name: "cpu_priority",
            inputValue: 90,
            boxLabel: this.helper.T("container", "high"),
          },
        ],
      },
      {
        xtype: "syno_compositefield",
        fieldLabel: this.helper.T("container", "memory_limit"),
        indent: 1,
        name: "mem_composite",
        disabled: a && a.is_package,
        items: [c, e, { xtype: "syno_displayfield", value: "MB" }],
      },
    ];
  },
  getRestartPolicyValue: function (a) {
    var b = a.form;
    var c = { enable_restart_policy: false };
    if (b && b.findField("enable_restart_policy")) {
      c.enable_restart_policy = b.findField("enable_restart_policy").getValue();
    }
    return c;
  },
  setRestartPolicyValue: function (a, c) {
    var b = a.form;
    if (b && b.findField("enable_restart_policy")) {
      b.findField("enable_restart_policy").setValue(c.enable_restart_policy);
    }
  },
  getResourceValue: function (b) {
    var c = b.form,
      a = { cpu_priority: 0, memory_limit: 0 };
    if (c.findField("enable_resource_limit").getValue()) {
      a.cpu_priority = c.findField("cpu_priority").getGroupValue();
      a.memory_limit = c.findField("memory_limit").getValue() * 1024 * 1024;
    }
    return a;
  },
  setResourceValue: function (a, c) {
    var b = a.form;
    if (!c.memory_limit) {
      b.findField("memory_limit_slider").slider.syncThumb();
      return;
    }
    if (c.memory_limit) {
      c.memory_limit_slider = c.memory_limit = c.memory_limit / 1024 / 1024;
    }
    b.setValues({ enable_resource_limit: true });
    b.setValues(c);
  },
  enableResourceGroup: function (b) {
    var a;
    a = new SYNO.ux.Utils.EnableCheckGroup(b.form, "enable_resource_limit", [
      "cpu_composite",
      "mem_composite",
    ]);
  },
  validateResource: function (a, c) {
    var b = a.form;
    return b.findField("memory_limit").isValid();
  },
  getShortcutCfg: function (a) {
    var b = function (c) {
      var d = new RegExp("^(http|https)://.+", "i");
      if (!d.test(c)) {
        return _JSLIBSTR("extlang", "urlText");
      }
      return true;
    };
    return [
      {
        xtype: "syno_checkbox",
        name: "enable_shortcut",
        boxLabel: this.helper.T("container", "create_shortcut"),
        disabled: a && a.is_package,
      },
      {
        xtype: "syno_radio",
        indent: 1,
        boxLabel: this.helper.T("container", "status_page"),
        name: "shortcut_type",
        inputValue: "status",
        checked: true,
        disabled: a && a.is_package,
      },
      {
        xtype: "syno_compositefield",
        indent: 1,
        hideLabel: true,
        disabled: a && a.is_package,
        items: [
          {
            xtype: "syno_radio",
            name: "shortcut_type",
            inputValue: "web",
            boxLabel: this.helper.T("container", "web_page"),
          },
          {
            xtype: "syno_textfield",
            indent: 1,
            name: "web_page_url",
            allowBlank: false,
            width: 261,
            validator: b,
            value: location.protocol + "//" + location.hostname,
          },
        ],
      },
    ];
  },
  enableShortcutGroup: function (b) {
    var a, c;
    a = new SYNO.ux.Utils.EnableCheckGroup(b.form, "enable_shortcut", [
      "shortcut_type",
      "web_page_url",
    ]);
    c = new SYNO.ux.Utils.EnableRadioGroup(b.form, "shortcut_type", {
      web: ["web_page_url"],
    });
  },
  getShortcutValue: function (b) {
    var c = b.form;
    var a = { enable_shortcut: false };
    if (c && c.findField("enable_shortcut").getValue()) {
      a = {
        enable_shortcut: true,
        enable_status_page:
          "status" === c.findField("shortcut_type").getGroupValue(),
        enable_web_page: "web" === c.findField("shortcut_type").getGroupValue(),
      };
    }
    if (a.enable_web_page) {
      a.web_page_url = c.findField("web_page_url").getValue();
    }
    return { shortcut: a };
  },
  setShortcutValue: function (b, d) {
    var c = b.form;
    if (d) {
      var a = {
        enable_shortcut: d.enable_shortcut,
        shortcut_type: d.enable_web_page ? "web" : "status",
      };
      if (d.web_page_url) {
        a.web_page_url = d.web_page_url;
      }
      c.setValues(a);
    }
  },
  validateShortcut: function (b, d) {
    var c = b.form;
    var a = c.findField("enable_shortcut").getValue();
    if (!a) {
      return true;
    }
    if ("web" === c.findField("shortcut_type").getGroupValue()) {
      return c.findField("web_page_url").isValid();
    }
    return true;
  },
  getVolumeGrid: function (a) {
    var b = this;
    if (this.volumeGrid && !this.volumeGrid.isDestroyed) {
      return this.volumeGrid;
    }
    var c = new SYNO.ux.EnableColumn({
      header: this.helper.T("container", "read_only"),
      dataIndex: "read_only",
      enableFastSelectAll: true,
      menuDisabled: true,
      sortable: false,
      width: 120,
      resizable: true,
      align: "center",
      tooltip: this.helper.T("container", "read_only"),
      isIgnore: function (e, d) {
        if (d.data.fixed) {
          return true;
        }
        return false;
      },
    });
    this.volumeGrid = new SYNO.SDS.Docker.EditorGridPanel({
      height: 180,
      enableHdMenu: false,
      clicksToEdit: 1,
      forceValidation: true,
      itemId: "volume_grid",
      selModel: new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
          scope: this,
          selectionchange: this.onVolGridSelectionChange,
        },
      }),
      store: new Ext.data.JsonStore({
        autoDestroy: true,
        fields: [
          { name: "host_volume_file", type: "string" },
          { name: "mount_point", type: "string" },
          { name: "read_only", type: "bool" },
          { name: "fixed", type: "bool" },
        ],
      }),
      tbar: [
        {
          xtype: "syno_button",
          tooltip: this.helper.T("container", "add_file"),
          itemId: "add_file",
          text: this.helper.T("container", "add_file"),
          scope: this,
          handler: function () {
            this.onAddMount("file");
          },
        },
        {
          xtype: "syno_button",
          tooltip: this.helper.T("container", "add_folder"),
          itemId: "add_folder",
          text: this.helper.T("container", "add_folder"),
          scope: this,
          handler: function () {
            this.onAddMount("folder");
          },
        },
        "->",
        {
          xtype: "syno_button",
          tooltip: this.helper.T("common", "delete"),
          itemId: "delete_mount",
          btnStyle: "red",
          text: this.helper.T("common", "delete"),
          disabled: true,
          scope: this,
          handler: function () {
            var e = this.getVolumeGrid();
            var d = e.getStore();
            if (
              !e.getSelectionModel().getSelected() ||
              e.getSelectionModel().getSelected().data.fixed
            ) {
              return;
            }
            d.remove(e.getSelectionModel().getSelected());
          },
        },
      ],
      plugins: [c],
      colModel: new Ext.grid.ColumnModel({
        defaults: { sortable: false },
        columns: [
          {
            header: this.helper.T("container", "file_folder"),
            width: 160,
            dataIndex: "host_volume_file",
            renderer: function (d) {
              return d.startsWith("/") ? d.slice(1) : d;
            },
          },
          {
            header: this.helper.T("container", "mount_path"),
            width: 160,
            dataIndex: "mount_point",
            editor: {
              xtype: "syno_textfield",
              validator: this.linuxPathValidator,
              validator2: this.checkColumUnique,
            },
          },
          c,
        ],
        isCellEditable: function (e, f) {
          var d = b.volumeGrid.getStore().getAt(f).data;
          if (d.fixed) {
            b.volumeGrid.getTopToolbar().getComponent("delete_mount").disable();
            return false;
          }
          return Ext.grid.ColumnModel.prototype.isCellEditable.call(this, e, f);
        },
      }),
      viewConfig: { markDirty: false },
      listeners: {
        afteredit: function (d) {
          d.record.commit();
        },
      },
    });
    return this.volumeGrid;
  },
  onVolGridSelectionChange: function (a) {
    var b = a.getSelections();
    this.getVolumeGrid()
      .getTopToolbar()
      .getComponent("delete_mount")
      .setDisabled(b.length === 0);
  },
  onAddMount: function (d) {
    var c = this.getVolumeGrid();
    var a = c.getStore();
    var e = { type: "open" };
    if (a.getCount()) {
      if (false === c.isCellValid(1, 0)) {
        return c.startEditing(0, 1);
      }
    }
    if ("folder" === d) {
      e.type = "chooseDir";
    }
    var b = new SYNO.SDS.Utils.FileChooser.Chooser({
      owner: this.ownerCt,
      usage: e,
      title: _T("common", "add"),
      folderToolbar: true,
      gotoPath: "/docker",
      treeFilter: function (g, f) {
        if (f && f.spath === "/home") {
          return false;
        }
        return true;
      },
      listeners: {
        scope: this,
        choose: function (k, j, g) {
          var i = this.getVolumeGrid();
          var h = i.getStore();
          var f = h.recordType;
          var l = new f({
            dirty: false,
            host_volume_file: j.path,
            mount_point: "",
            read_only: false,
          });
          i.stopEditing();
          h.insert(0, l);
          i.startEditing(0, 1);
          k.close();
        },
      },
    });
    b.open();
  },
  linuxPathValidator: function (b) {
    for (var a = 0; a < b.length; a++) {
      if ("\\" === b.charAt(a)) {
        return false;
      }
    }
    if (b.charAt(0) != "/") {
      return false;
    }
    if (b.charAt(0) == "/" && b.charAt(1) == "/") {
      return false;
    }
    if (0 === b.length || 1024 < b.length) {
      return false;
    }
    if (this.validator2) {
      return this.validator2.call(this, b);
    }
    return true;
  },
  getVolumeValue: function (b) {
    var a = this.getVolumeGrid()
      .dumpStoreData()
      .map(function (c) {
        c.type = c.read_only ? "ro" : "rw";
        delete c.read_only;
        return c;
      });
    return { volume_bindings: a };
  },
  setVolumeValue: function (b, c) {
    if (c && c.volume_bindings && 0 < c.volume_bindings.length) {
      var a = c.volume_bindings.map(function (e) {
        var d = Object.assign({}, e);
        d.read_only = d.type == "ro";
        delete d.type;
        return d;
      });
      this.getVolumeGrid().loadStoreData(a);
    }
  },
  validateVolume: function (a, b) {
    return this.getVolumeGrid().isValid(b);
  },
  getLinkCfg: function (a) {
    var b = this.getLinkGrid(a);
    return [
      {
        xtype: "syno_compositefield",
        fieldLabel: this.helper.T("container", "link_setting"),
        itemId: "link_bindings",
        items: [b],
      },
    ];
  },
  getLinkGrid: function (a) {
    var c = this;
    if (this.linkGrid && !this.linkGrid.isDestroyed) {
      return this.linkGrid;
    }
    var b = new SYNO.API.JsonStore({
      api: "SYNO.Docker.Container",
      version: 1,
      method: "list",
      baseParams: { limit: -1, offset: 0 },
      autoDestroy: true,
      root: "containers",
      totalProperty: "total",
      fields: ["name"],
      appWindow: this,
      autoLoad: true,
      listeners: {
        scope: this,
        load: function (e, d, f) {
          e.remove(
            d.find(function (g) {
              return g.data.name === this.containerId;
            }, this)
          );
        },
      },
    });
    this.linkGrid = new SYNO.SDS.Docker.EditorGridPanel({
      itemId: "link_grid",
      height: 180,
      enableHdMenu: false,
      clicksToEdit: 1,
      forceValidation: true,
      selModel: new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
          scope: this,
          selectionchange: this.onLinkGridSelectionChange,
        },
      }),
      store: new Ext.data.JsonStore({
        autoDestroy: true,
        fields: [
          { name: "link_container", type: "string" },
          { name: "alias", type: "string" },
          { name: "fixed", type: "bool" },
        ],
      }),
      tbar: [
        {
          xtype: "syno_button",
          tooltip: _T("common", "add"),
          text: this.helper.T("common", "add"),
          scope: this,
          handler: function () {
            var g = this.getLinkGrid();
            var e = g.getStore();
            var d = e.recordType;
            var f = g.colModel.getColumnAt(0).editor.store;
            if (0 === f.getCount()) {
              return this.ownerCt
                .getMsgBox()
                .alert("", this.helper.T("container", "no_other_container"));
            }
            if (e.getCount()) {
              if ("" === e.getAt(0).get("link_container")) {
                return g.startEditing(0, 0);
              }
              if ("" === e.getAt(0).get("alias")) {
                return g.startEditing(0, 1);
              }
            }
            var h = new d({ dirty: false, link_container: "", alias: "" });
            g.stopEditing();
            e.insert(0, h);
            g.startEditing(0, 0);
          },
        },
        {
          xtype: "syno_button",
          itemId: "delete_link",
          tooltip: _T("common", "delete"),
          text: this.helper.T("common", "delete"),
          disabled: true,
          scope: this,
          handler: function () {
            var e = this.getLinkGrid();
            var d = e.getStore();
            if (
              !e.getSelectionModel().getSelected() ||
              e.getSelectionModel().getSelected().data.fixed
            ) {
              return;
            }
            d.remove(e.getSelectionModel().getSelected());
          },
        },
      ],
      colModel: new Ext.grid.ColumnModel({
        defaults: { sortable: false },
        columns: [
          {
            header: this.helper.T("container", "container_name"),
            dataIndex: "link_container",
            editor: new SYNO.ux.ComboBox({
              forceSelection: true,
              typeAhead: true,
              triggerAction: "all",
              lazyRender: true,
              store: b,
              valueField: "name",
              displayField: "name",
              allowBlank: false,
              listeners: {
                scope: this,
                focus: {
                  fn: function (d) {
                    d.onTriggerClick();
                  },
                  buffer: 100,
                },
                select: function (g, d, e) {
                  var f = this.getLinkGrid();
                  if (0 !== g.gridEditor.row) {
                    return;
                  }
                  f.startEditing(0, 1);
                },
              },
            }),
          },
          {
            header: this.helper.T("common", "alias"),
            dataIndex: "alias",
            editor: {
              xtype: "syno_textfield",
              allowBlank: false,
              validator: this.checkColumUnique,
            },
          },
        ],
        isCellEditable: function (e, f) {
          var d = c.linkGrid.getStore().getAt(f).data;
          if (d.fixed) {
            c.linkGrid.getTopToolbar().getComponent("delete_link").disable();
            return false;
          }
          return Ext.grid.ColumnModel.prototype.isCellEditable.call(this, e, f);
        },
      }),
      viewConfig: { markDirty: false },
      listeners: {
        afteredit: function (d) {
          d.record.commit();
        },
      },
    });
    return this.linkGrid;
  },
  onLinkGridSelectionChange: function (a) {
    var b = a.getSelections();
    this.getLinkGrid()
      .getTopToolbar()
      .getComponent("delete_link")
      .setDisabled(b.length === 0);
  },
  getLinkValue: function (a) {
    return { links: this.getLinkGrid().dumpStoreData() };
  },
  setLinkValue: function (a, b) {
    if (b && b.links) {
      this.getLinkGrid().loadStoreData(b.links);
    }
  },
  validateLink: function (a, b) {
    return this.getLinkGrid().isValid(b);
  },
  getEnvCfg: function (a) {
    var b = [];
    b.push(this.getEnvGrid(a));
    b.push(this.getCmdTextArea(a));
    return b;
  },
  getCmdTextArea: function (b) {
    var c =
      b &&
      b.data &&
      b.data.entrypoint_default &&
      0 < b.data.entrypoint_default.length;
    var a = b && b.data && b.data.cmd_default && 0 < b.data.cmd_default.length;
    var d = a ? b.data.cmd_default : this.helper.T("image", "cmd_area_msg");
    return [
      {
        xtype: "syno_fieldset",
        title: this.helper.T("common", "command"),
        hidden: true !== b.is_create,
        items: [
          {
            xtype: "syno_displayfield",
            name: "entrypoint",
            fieldLabel: this.helper.T("container", "entrypoint"),
            value: c ? b.data.entrypoint_default : "-",
          },
          {
            xtype: "syno_textfield",
            name: "cmd",
            fieldLabel: this.helper.T("container", "command"),
            anchor: "100%",
            emptyText: d,
            hasDefaultCmd: a,
            hasDefaultEntrypoint: c,
            validator: function (e) {
              return (
                this.hasDefaultEntrypoint ||
                (this.hasDefaultCmd && Ext.isEmpty(e)) ||
                !Ext.isEmpty(e.trim())
              );
            },
            disabled: b && b.is_package,
            listeners: {
              blur: function () {
                this.emptyText = this.readOnly ? " " : d;
                this.applyEmptyText();
              },
              focus: function () {
                this.emptyText = " ";
                this.applyEmptyText();
              },
              keydown: function (f, h, g) {
                if (h.keyCode === h.ENTER || h.keyCode === 186) {
                  h.preventDefault();
                }
              },
            },
          },
        ],
      },
    ];
  },
  getCapabilityCfg: function (b, a) {
    return [
      {
        xtype: "syno_checkbox",
        name: "privileged",
        boxLabel: this.helper.T("container", "use_high_privilege"),
        disabled: b && b.is_package,
        itemId: "privileged",
        listeners: {
          scope: this,
          focus: function (c) {
            if (!c.checked) {
              a.getMsgBox().confirm(
                "",
                this.helper.T("container", "privilege_warning"),
                function (d) {
                  if ("no" === d) {
                    var e = this.is_create
                      ? this.getStep("first_step").form.findField("privileged")
                      : this.getComponent("privileged");
                    e.setValue("no");
                  }
                },
                a
              );
            }
          },
          check: function (c, d) {
            if (d) {
              this.capbilitiesButton.disable();
            } else {
              this.capbilitiesButton.enable();
            }
          },
        },
      },
    ];
  },
  getCapabilityValue: function (a) {
    var b = a.form;
    var c = { privileged: false };
    if (b.findField("privileged")) {
      c.privileged = b.findField("privileged").getValue();
    }
    return c;
  },
  setCapabilityValue: function (a, c) {
    var b = a.form;
    if (b && b.findField("privileged") && c && Ext.isDefined(c.privileged)) {
      b.findField("privileged").setValue(c.privileged);
    }
  },
  getEnvGrid: function (a) {
    var b = this;
    if (this.envGrid && !this.envGrid.isDestroyed) {
      return this.envGrid;
    }
    this.envGrid = new SYNO.SDS.Docker.EditorGridPanel({
      itemId: "env_grid",
      height: true === a.is_create ? 270 : 390,
      enableHdMenu: false,
      clicksToEdit: 1,
      forceValidation: true,
      selModel: new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
          scope: this,
          selectionchange: this.onEnvGridSelectionChange,
        },
      }),
      store: new Ext.data.JsonStore({
        autoDestroy: true,
        fields: [
          { name: "key", type: "string" },
          { name: "value", type: "string" },
          { name: "fixed", type: "bool" },
        ],
      }),
      tbar: [
        {
          xtype: "syno_button",
          tooltip: _T("common", "add"),
          text: this.helper.T("common", "add"),
          scope: this,
          handler: function () {
            var e = this.getEnvGrid();
            var d = e.getStore();
            var c = d.recordType;
            if (d.getCount()) {
              if ("" === d.getAt(0).get("key")) {
                return e.startEditing(0, 0);
              }
            }
            var f = new c({ dirty: false, key: "", value: "" });
            e.stopEditing();
            d.insert(0, f);
            e.startEditing(0, 0);
          },
        },
        {
          xtype: "syno_button",
          itemId: "delete_env",
          tooltip: _T("common", "delete"),
          text: this.helper.T("common", "delete"),
          disabled: true,
          scope: this,
          handler: function () {
            var d = this.getEnvGrid();
            var c = d.getStore();
            if (
              !d.getSelectionModel().getSelected() ||
              d.getSelectionModel().getSelected().data.fixed
            ) {
              return;
            }
            c.remove(d.getSelectionModel().getSelected());
          },
        },
      ],
      colModel: new Ext.grid.ColumnModel({
        defaults: { sortable: false },
        columns: [
          {
            header: this.helper.T("container", "header_variable"),
            dataIndex: "key",
            editor: {
              xtype: "syno_textfield",
              allowBlank: false,
              validator: this.checkColumUnique,
            },
          },
          {
            header: this.helper.T("container", "header_value"),
            dataIndex: "value",
            editor: { xtype: "syno_textfield" },
          },
        ],
        isCellEditable: function (d, e) {
          var c = b.envGrid.getStore().getAt(e).data;
          if (c.fixed) {
            b.envGrid.getTopToolbar().getComponent("delete_env").disable();
            return false;
          }
          return Ext.grid.ColumnModel.prototype.isCellEditable.call(this, d, e);
        },
      }),
      viewConfig: { markDirty: false },
      listeners: {
        afteredit: function (c) {
          c.record.commit();
        },
      },
    });
    return this.envGrid;
  },
  onEnvGridSelectionChange: function (a) {
    var b = a.getSelections();
    this.getEnvGrid()
      .getTopToolbar()
      .getComponent("delete_env")
      .setDisabled(b.length === 0);
  },
  getEnvValue: function (a) {
    var b = a.form;
    var c = {
      cmd: b.findField("cmd").getValue(),
      env_variables: this.getEnvGrid().dumpStoreData(),
    };
    return c;
  },
  setEnvValue: function (a, c) {
    var b = a.form;
    if (c && c.env_variables) {
      this.getEnvGrid().loadStoreData(c.env_variables);
    }
    if (b && b.findField("cmd") && c && c.cmd) {
      b.findField("cmd").setValue(c.cmd);
    }
  },
  validateEnv: function (a, b) {
    return (
      this.getEnvGrid().isValid(b) &&
      (true !== this.is_create || a.form.findField("cmd").isValid())
    );
  },
  getNetworkGrid: function (a) {
    var b = this;
    if (this.networkGrid && !this.networkGrid.isDestroyed) {
      return this.networkGrid;
    }
    this.containerStore = new SYNO.API.JsonStore({
      autoDestroy: true,
      root: "containers",
      totalProperty: "total",
      fields: ["name"],
      appWindow: this,
      sortInfo: { field: "name", direction: "ASC" },
    });
    this.sendWebAPI({
      api: "SYNO.Docker.Network",
      method: "list_container",
      version: 1,
      scope: this,
      params: { limit: -1, offset: 0 },
      callback: function (f, d, e, c) {
        this.containerStore.loadData(d);
        this.defaultStore = d.containers;
      },
    });
    this.networkGrid = new SYNO.SDS.Docker.EditorGridPanel({
      itemId: "network_grid",
      height: 180,
      enableHdMenu: false,
      clicksToEdit: 1,
      forceValidation: true,
      selModel: new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
          scope: this,
          selectionchange: this.onNetGridSelectionChange,
        },
      }),
      store: new Ext.data.JsonStore({
        autoDestroy: true,
        fields: [
          { name: "container", type: "string" },
          { name: "fixed", type: "bool" },
        ],
      }),
      tbar: [
        {
          xtype: "syno_button",
          tooltip: _T("common", "add"),
          text: this.helper.T("common", "add"),
          scope: this,
          handler: function () {
            var e = this.getNetworkGrid();
            var d = e.getStore();
            var c = d.recordType;
            if (d.data.items.length >= this.defaultStore.length) {
              return this.getMsgBox().alert(
                "",
                this.helper.T("network", "no_available_container")
              );
            }
            if (d.getCount()) {
              if ("" === d.getAt(0).get("container")) {
                return e.startEditing(0, 0);
              }
            }
            var f = new c({ dirty: false, container: "" });
            e.stopEditing();
            d.insert(0, f);
            e.startEditing(0, 0);
          },
        },
        {
          xtype: "syno_button",
          itemId: "delete_network",
          tooltip: _T("common", "delete"),
          text: this.helper.T("common", "delete"),
          disabled: true,
          scope: this,
          handler: function () {
            var d = this.getNetworkGrid();
            var c = d.getStore();
            if (
              !d.getSelectionModel().getSelected() ||
              d.getSelectionModel().getSelected().data.fixed
            ) {
              return;
            }
            c.remove(d.getSelectionModel().getSelected());
          },
        },
      ],
      colModel: new Ext.grid.ColumnModel({
        defaults: { sortable: false },
        columns: [
          {
            header: this.helper.T("container", "container_name"),
            dataIndex: "container",
            editor: new SYNO.ux.ComboBox({
              forceSelection: true,
              typeAhead: true,
              triggerAction: "all",
              lazyRender: true,
              store: this.containerStore,
              valueField: "name",
              displayField: "name",
              allowBlank: false,
              listeners: {
                scope: this,
                focus: {
                  fn: function (k) {
                    var f = this.getNetworkGridValue(this);
                    var d = this.defaultStore;
                    var h = [];
                    for (var g = 0; g < d.length; g++) {
                      var c = false;
                      for (var e = 0; e < f.network.length; e++) {
                        if (d[g].name === f.network[e].container) {
                          c = true;
                          break;
                        }
                      }
                      if (!c) {
                        h.push(d[g]);
                      }
                    }
                    k.onTriggerClick();
                    this.containerStore.loadData({ containers: h });
                  },
                  buffer: 100,
                },
                select: function (f, c, d) {
                  var e = this.getNetworkGrid();
                  if (0 !== f.gridEditor.row) {
                    return;
                  }
                  e.startEditing(0, 0);
                },
              },
            }),
          },
        ],
        isCellEditable: function (d, e) {
          var c = b.networkGrid.getStore().getAt(e).data;
          if (c.fixed) {
            b.networkGrid
              .getTopToolbar()
              .getComponent("delete_network")
              .disable();
            return false;
          }
          return Ext.grid.ColumnModel.prototype.isCellEditable.call(this, d, e);
        },
      }),
      viewConfig: { markDirty: false },
      listeners: {
        afteredit: function (c) {
          c.record.commit();
        },
        beforeedit: function (c) {
          if (c.value !== "") {
            return false;
          }
        },
      },
    });
    return this.networkGrid;
  },
  onNetGridSelectionChange: function (a) {
    var b = a.getSelections();
    this.getNetworkGrid()
      .getTopToolbar()
      .getComponent("delete_network")
      .setDisabled(b.length === 0);
  },
  getNetworkGridValue: function (a) {
    return { network: a.getNetworkGrid().dumpStoreData() };
  },
  setNetworkGridValue: function (a, b) {
    if (b) {
      a.getNetworkGrid().loadStoreData(b);
    }
  },
  getDockerNetworkCfg: function (a) {
    return [this.getDockerNetworkGrid(a), this.getHostNetworkCfg(a)];
  },
  getDockerNetworkGrid: function (a) {
    var b = this;
    if (this.networkGrid && !this.networkGrid.isDestroyed) {
      return this.networkGrid;
    }
    this.networkStore = new SYNO.API.JsonStore({
      autoDestroy: true,
      root: "network",
      totalProperty: "total",
      fields: ["name", "driver"],
      appWindow: this,
      sortInfo: { field: "name", direction: "ASC" },
    });
    this.sendWebAPI({
      api: "SYNO.Docker.Network",
      method: "list",
      version: 1,
      scope: this,
      callback: function (f, d, e, c) {
        d.network.remove(
          d.network.find(function (g) {
            return g.name === "host";
          }, this)
        );
        this.networkStore.loadData(d);
        this.defaultStore = d.network;
      },
    });
    this.networkGrid = new SYNO.SDS.Docker.EditorGridPanel({
      itemId: "network_grid",
      height: 350,
      enableHdMenu: false,
      clicksToEdit: 1,
      forceValidation: true,
      selModel: new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
          scope: this,
          selectionchange: this.onDockerNetGridSelectionChange,
        },
      }),
      store: new Ext.data.JsonStore({
        autoDestroy: true,
        fields: [
          { name: "name", type: "string" },
          { name: "driver", type: "string" },
        ],
      }),
      tbar: [
        {
          xtype: "syno_button",
          tooltip: _T("common", "add"),
          text: this.helper.T("common", "add"),
          scope: this,
          handler: function () {
            var e = this.getNetworkGrid();
            var d = e.getStore();
            var c = d.recordType;
            if (d.data.items.length >= this.defaultStore.length) {
              return this.ownerCt
                .getMsgBox()
                .alert("", this.helper.T("network", "no_available_network"));
            }
            if (d.getCount()) {
              if ("" === d.getAt(0).get("name")) {
                return e.startEditing(0, 0);
              }
            }
            var f = new c({ dirty: false, name: "" });
            e.stopEditing();
            d.insert(0, f);
            e.startEditing(0, 0);
          },
        },
        {
          xtype: "syno_button",
          itemId: "delete_network",
          tooltip: _T("common", "delete"),
          text: this.helper.T("common", "delete"),
          disabled: true,
          scope: this,
          handler: function () {
            var d = this.getNetworkGrid();
            var c = d.getStore();
            if (
              !d.getSelectionModel().getSelected() ||
              d.getSelectionModel().getSelected().data.fixed
            ) {
              return;
            }
            if (c.data.items.length <= 1) {
              return this.ownerCt
                .getMsgBox()
                .alert("", this.helper.T("network", "remove_warn"));
            }
            c.remove(d.getSelectionModel().getSelected());
          },
        },
      ],
      colModel: new Ext.grid.ColumnModel({
        defaults: { sortable: false },
        columns: [
          {
            header: this.helper.T("network", "name"),
            dataIndex: "name",
            editor: new SYNO.ux.ComboBox({
              forceSelection: true,
              typeAhead: true,
              triggerAction: "all",
              lazyRender: true,
              store: this.networkStore,
              valueField: "name",
              displayField: "name",
              allowBlank: false,
              listeners: {
                scope: this,
                focus: {
                  fn: function (k) {
                    var f = this.getDockerNetworkValue(
                      this.items.get("network")
                    );
                    var d = this.defaultStore;
                    var h = [];
                    for (var g = 0; g < d.length; g++) {
                      var c = false;
                      for (var e = 0; e < f.network.length; e++) {
                        if (d[g].name === f.network[e].name) {
                          c = true;
                          break;
                        }
                      }
                      if (!c) {
                        h.push(d[g]);
                      }
                    }
                    k.onTriggerClick();
                    this.networkStore.loadData({ network: h });
                  },
                  buffer: 100,
                },
                select: function (f, c, d) {
                  var e = this.getNetworkGrid();
                  if (0 !== f.gridEditor.row) {
                    return;
                  }
                  e.startEditing(0, 0);
                },
              },
            }),
          },
        ],
        isCellEditable: function (d, e) {
          var c = b.networkGrid.getStore().getAt(e).data;
          if (c.fixed) {
            b.networkGrid
              .getTopToolbar()
              .getComponent("delete_network")
              .disable();
            return false;
          }
          return Ext.grid.ColumnModel.prototype.isCellEditable.call(this, d, e);
        },
      }),
      viewConfig: { markDirty: false },
      listeners: {
        afteredit: function (c) {
          c.record.commit();
        },
        beforeedit: function (c) {
          if (c.value !== "") {
            return false;
          }
        },
      },
    });
    return this.networkGrid;
  },
  onDockerNetGridSelectionChange: function (a) {
    var b = a.getSelections();
    this.getDockerNetworkGrid()
      .getTopToolbar()
      .getComponent("delete_network")
      .setDisabled(b.length === 0);
  },
  getDockerNetworkValue: function (a) {
    var b = a.form;
    return {
      network: this.getDockerNetworkGrid().dumpStoreData(),
      use_host_network: b.findField("use_host_network").getValue(),
    };
  },
  setDockerNetworkValue: function (a, c) {
    var b = a.form;
    if (c && c.network) {
      this.getDockerNetworkGrid().loadStoreData(c.network);
    }
    if (b && b.findField("use_host_network") && c.use_host_network) {
      b.findField("use_host_network").setValue(c.use_host_network);
    }
  },
  getSummaryGrid: function (a) {
    if (this.summaryGrid && !this.summaryGrid.isDestroyed) {
      return this.summaryGrid;
    }
    this.summaryGrid = new SYNO.ux.GridPanel(
      Ext.apply(
        {
          border: false,
          itemId: "summary_grid",
          stripeRows: true,
          columns: [
            {
              header: _T("status", "header_item"),
              width: 100,
              sortable: false,
              dataIndex: "name",
              renderer: function (c, b) {
                b.attr = 'ext:qtip="' + Ext.util.Format.htmlEncode(c) + '"';
                return c;
              },
            },
            {
              header: _T("status", "header_value"),
              width: 220,
              sortable: false,
              dataIndex: "value",
              renderer: function (c, b) {
                b.attr = 'ext:qtip="' + Ext.util.Format.htmlEncode(c) + '"';
                return c;
              },
            },
          ],
          store: new Ext.data.ArrayStore({
            fields: ["name", "value"],
            idIndex: 0,
            autoLoad: false,
          }),
        },
        a
      )
    );
    return this.summaryGrid;
  },
  loadSummaryGrid: function (g) {
    var d = this.getSummaryGrid();
    var k = {
      10: this.helper.T("container", "low"),
      50: this.helper.T("container", "med"),
      90: this.helper.T("container", "high"),
    };
    var j = { tcp: "TCP", udp: "UDP" };
    var c = { ro: "Yes", rw: "No" };
    var b = {
      privileged: this.helper.T("container", "privilege_setting"),
      name: this.helper.T("container", "container_name"),
      cpu_priority: this.helper.T("container", "cpu_priority"),
      memory_limit: this.helper.T("container", "memory_limit"),
      shortcut: _T("desktop", "shortcut"),
      entrypoint_default:
        this.helper.T("container", "entrypoint") +
        " (" +
        _T("common", "default") +
        ")",
      cmd: this.helper.T("container", "command"),
      cmd_default:
        this.helper.T("container", "command") +
        " (" +
        _T("common", "default") +
        ")",
      port_bindings: this.helper.T("container", "port_setting"),
      volume_bindings: this.helper.T("common", "volume"),
      network: _T("controlpanel", "leaf_lan"),
      links: this.helper.T("wizard", "links"),
      env_variables: this.helper.T("container", "env_variables"),
      enable_restart_policy: this.helper.T("wizard", "restart_policy"),
      use_host_network: this.helper.T("network", "network_host"),
      capabilities: this.helper.T("wizard", "capabilities"),
    };
    var e = [];
    Object.keys(b).forEach(function (o) {
      if (g.hasOwnProperty(o)) {
        var r = g[o];
        if (
          o === "port_bindings" &&
          (!Ext.isEmpty(r) || g.enable_publish_all_ports) &&
          !g.use_host_network
        ) {
          r = r.map(function (s) {
            var t = Object.assign({}, s);
            t.type = j[s.type];
            return t;
          });
          Ext.each(r, function (s) {
            if (0 === s.host_port) {
              s.host_port = _T("common", "auto");
            }
          });
          if (g.enable_publish_all_ports) {
            r.push({
              host_port: "32768-61000",
              container_port: this.helper.T("container", "any_ports"),
              type: "-",
            });
          }
          r = this.renderValueByTable(
            r,
            [
              this.helper.T("container", "local_port"),
              this.helper.T("container", "container_port"),
              this.helper.T("common", "type"),
            ],
            ["host_port", "container_port", "type"]
          );
        } else {
          if (o === "volume_bindings" && !Ext.isEmpty(r)) {
            r = r.map(function (s) {
              var t = Object.assign({}, s);
              t.type = c[s.type];
              return t;
            });
            r = this.renderValueByTable(
              r,
              [
                this.helper.T("container", "file_folder"),
                this.helper.T("container", "mount_path"),
                this.helper.T("container", "read_only"),
              ],
              ["host_volume_file", "mount_point", "type"]
            );
          } else {
            if (o === "network" && !Ext.isEmpty(r)) {
              var p = [];
              r.forEach(function (s) {
                p.push(s.name);
              });
              r = p.sort().join(", ");
            } else {
              if (o === "links" && !Ext.isEmpty(r) && !g.use_host_network) {
                var i =
                  g.network
                    .map(function (s) {
                      return s.name;
                    })
                    .indexOf("bridge") > -1;
                if (!i) {
                  return;
                }
                r = this.renderValueByTable(
                  r,
                  [
                    this.helper.T("container", "container_name"),
                    this.helper.T("common", "alias"),
                  ],
                  ["link_container", "alias"]
                );
              } else {
                if (o === "env_variables" && !Ext.isEmpty(r)) {
                  r = this.renderValueByTable(
                    r,
                    [
                      this.helper.T("container", "header_variable"),
                      this.helper.T("container", "header_value"),
                    ],
                    ["key", "value"]
                  );
                } else {
                  if (o === "image") {
                    return;
                  } else {
                    if (o === "name") {
                      r = Ext.util.Format.htmlEncode(r);
                    } else {
                      if (o === "cpu_priority") {
                        r = k[r] || this.helper.T("container", "auto");
                      } else {
                        if (o === "memory_limit") {
                          r =
                            0 === r
                              ? this.helper.T("container", "no_limit")
                              : Ext.util.Format.fileSize(r);
                        } else {
                          if (o === "shortcut") {
                            var q = "";
                            if (!r || !r.enable_shortcut) {
                              return;
                            }
                            if (r.enable_status_page) {
                              q = this.helper.T("container", "status_page");
                            }
                            if (r.enable_web_page) {
                              q += 0 === q.length ? "" : ",&nbsp;";
                              q += this.helper.T("container", "web_page");
                              if (!Ext.isEmpty(r.web_page_url)) {
                                q +=
                                  "(" +
                                  Ext.util.Format.htmlEncode(r.web_page_url) +
                                  ")";
                              }
                            }
                            r = q;
                          } else {
                            if (o === "entrypoint_default" && !Ext.isEmpty(r)) {
                            } else {
                              if (o === "cmd" && !Ext.isEmpty(r)) {
                              } else {
                                if (o === "cmd_default" && !Ext.isEmpty(r)) {
                                  if (
                                    g.hasOwnProperty("cmd") &&
                                    !Ext.isEmpty(g.cmd)
                                  ) {
                                    return;
                                  }
                                } else {
                                  if (o === "privileged" && !Ext.isEmpty(r)) {
                                    if (!r) {
                                      return;
                                    }
                                    r = this.helper.T(
                                      "container",
                                      "use_high_privilege"
                                    );
                                  } else {
                                    if (
                                      o === "enable_restart_policy" ||
                                      o === "use_host_network"
                                    ) {
                                      if (!r) {
                                        return;
                                      }
                                      r = _T("common", "yes");
                                    } else {
                                      return;
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        e.push([b[o], r]);
      }
    }, this);
    var l = g.CapAdd || [];
    var a = g.CapDrop || [];
    if (l.length > 0 || a.length > 0) {
      var h = Math.max(l.length, a.length);
      var n = [];
      for (var f = 0; f < h; f++) {
        n.push({ CapAdd: l[f] || "", CapDrop: a[f] || "" });
      }
      var m = this.renderValueByTable(
        n,
        [
          this.helper.T("wizard", "cap_add"),
          this.helper.T("wizard", "cap_drop"),
        ],
        ["CapAdd", "CapDrop"]
      );
      e.push([b.capabilities, m]);
    }
    d.store.loadData(e);
  },
  renderValueByTable: function (f, g, e, a) {
    var d,
      b,
      c = "";
    if (!Ext.isArray(e) || !Ext.isArray(g)) {
      return c;
    }
    c += '<table class="cell-table-view"><tbody>';
    c += "<tr>";
    for (d = 0; d < g.length; d++) {
      c += "<th>" + g[d] + "</th>";
    }
    c += "</tr>";
    for (d = 0; d < f.length; d++) {
      c += "<tr>";
      for (b = 0; b < g.length; b++) {
        c += '<td ext:qtip="' + f[d][e[b]] + '">' + f[d][e[b]] + "</td>";
      }
      c += "</tr>";
    }
    c += "</tbody></table>";
    return c;
  },
  checkColumUnique: function (e) {
    var a = this.gridEditor.grid.getStore(),
      b = a.fields.keys[this.gridEditor.col],
      d,
      c = 0;
    for (d = 0; d < a.data.length; d++) {
      if (e == a.data.itemAt(d).get(b)) {
        c++;
      }
      if (c == 2) {
        break;
      }
    }
    if (d !== a.data.length) {
      return SYNO.SDS.Docker.Utils.Helper.T("container", "already_existed");
    }
    return true;
  },
  checkPortUnique: function (g) {
    var a = this.gridEditor.grid.getStore(),
      c = a.fields.keys[this.gridEditor.col],
      b = "type",
      f,
      e = { tcp: 0, udp: 0 };
    if ("host_port" === c && "0" === g) {
      return true;
    }
    for (f = 0; f < a.data.length; f++) {
      var d = a.data.itemAt(f).get(b);
      if (g == a.data.itemAt(f).get(c)) {
        e[d]++;
      }
      if (e[d] == 2) {
        return SYNO.SDS.Docker.Utils.Helper.T("container", "already_existed");
      }
    }
    return true;
  },
  getErrorMsg: function (a, b) {
    var c;
    if (this.helper.errorMapping.WEBAPI_ERR_DOCKER_FILE_EXIST === a.code) {
      c = this.helper.getError(a.code, b.profile.name);
    } else {
      if (
        this.helper.errorMapping.WEBAPI_ERR_CONTAINER_UNKNOWN_CAPABILITY ===
        a.code
      ) {
        var d = /"(.+)"/g.exec(a.errors.errors)[1];
        c = this.helper.getError(a.code, d);
      } else {
        if (a.errors !== undefined && a.errors.errors) {
          c = this.helper.getError(a.code, a.errors.errors);
        } else {
          c = this.helper.getError(a.code);
        }
      }
    }
    return c;
  },
});
Ext.ns("SYNO.SDS.Docker.Image");
Ext.define("SYNO.SDS.Docker.Image.AdvanceTab", {
  extend: "SYNO.ux.FormPanel",
  helper: SYNO.SDS.Docker.Utils.Helper,
  constructor: function (a) {
    Ext.apply(this, new SYNO.SDS.Docker.Container.ProfileUI());
    this.data = {};
    this.callParent([this.fillConfig(a)]);
    this.mon(
      this,
      "afterlayout",
      function () {
        this.enableGroup();
        this.setProfile(a.data);
      },
      this,
      { single: true }
    );
  },
  enableGroup: function () {
    this.enableShortcutGroup(this);
  },
  fillConfig: function (a) {
    var b = [];
    b = b.concat(this.getRestartPolicyCfg(a));
    b = b.concat(this.getShortcutCfg(a));
    var c = Ext.apply(
      {
        title: this.helper.T("wizard", "advance_setting"),
        itemId: "adv",
        items: b,
      },
      a
    );
    return c;
  },
  getProfile: function () {
    var a = {};
    Ext.apply(a, this.getShortcutValue(this));
    Ext.apply(a, this.getRestartPolicyValue(this));
    return a;
  },
  setProfile: function (a) {
    Ext.apply(this.data, a);
    this.setShortcutValue(this, this.shortcut);
    this.setRestartPolicyValue(this, this.data);
  },
  validateProfile: function () {
    return this.validate(this.validateShortcut);
  },
  validate: function (a) {
    var b = a.call(this, this, false);
    if (false === b) {
      this.owner.panel.activate(this);
      a.call(this, this, true);
      this.owner.setStatusError({
        text: _T("common", "forminvalid"),
        clear: true,
      });
    }
    return b;
  },
});
Ext.define("SYNO.SDS.Docker.Image.WizardAdvance", {
  extend: "SYNO.SDS.ModalWindow",
  helper: SYNO.SDS.Docker.Utils.Helper,
  constructor: function (a) {
    this.callParent([this.fillConfig(a)]);
    if (true === a.is_create) {
      this.adv = new SYNO.SDS.Docker.Image.AdvanceTab({
        data: a.data,
        shortcut: a.shortcut,
        owner: a.owner,
        is_package: a.is_package,
        is_create: a.is_create,
      });
      this.panel.insert(0, this.adv);
      this.panel.setActiveTab(0);
    }
    if (a && (a.is_package || !a.is_create)) {
      this.panel.hideTabStripItem("network");
    }
  },
  fillConfig: function (a) {
    var b = {
      width: 650,
      height: 550,
      owner: a.owner,
      closable: true,
      layout: "fit",
      title: this.helper.T("wizard", "advance_setting_title"),
      buttons: [
        {
          xtype: "syno_button",
          btnStyle: "grey",
          text: this.helper.T("common", "cancel"),
          scope: this,
          handler: this.cancelHandler,
        },
        {
          xtype: "syno_button",
          btnStyle: "blue",
          text: this.helper.T("common", "apply"),
          scope: this,
          handler: this.applyHandler,
        },
      ],
      items: [(this.panel = this.initPanel(a))],
    };
    Ext.apply(b, a);
    return b;
  },
  initPanel: function (a) {
    return new SYNO.SDS.Docker.Image.WizardAdvancePanel(a);
  },
  applyHandler: function () {
    if (false === this.panel.validateProfile()) {
      return;
    }
    if (true === this.is_create) {
      if (false === this.adv.validateProfile()) {
        return;
      }
    }
    this.owner.refreshData(this.panel.getProfile());
    if (true === this.is_create) {
      this.owner.refreshData(this.adv.getProfile());
    }
    this.close();
  },
  cancelHandler: function () {
    this.close();
  },
});
Ext.define("SYNO.SDS.Docker.Image.WizardAdvancePanel", {
  extend: "SYNO.ux.TabPanel",
  constructor: function (a) {
    Ext.apply(this, new SYNO.SDS.Docker.Container.ProfileUI());
    this.data = {};
    this.callParent([this.fillConfig(a)]);
    this.mon(this, "afterrender", function () {
      this.setProfile();
    });
  },
  fillConfig: function (b) {
    var a = this.getPortCfg(b);
    a.shift();
    var c = {
      activeTab: 0,
      cls: "syno-sds-docker-profile",
      items: [
        {
          title: this.helper.T("common", "volume"),
          itemId: "volume",
          xtype: "syno_formpanel",
          layout: "fit",
          items: [this.getVolumeGrid(b)],
          listeners: {
            scope: this,
            activate: function () {
              this.getVolumeGrid().getView().refresh();
            },
          },
        },
        {
          title: this.helper.T("common", "network"),
          itemId: "network",
          xtype: "syno_formpanel",
          items: [this.getDockerNetworkCfg(b)],
          listeners: {
            scope: this,
            activate: function () {
              this.getDockerNetworkGrid().getView().refresh();
              if (
                this.getDockerNetworkValue(this.items.get("network"))
                  .use_host_network
              ) {
                this.helper.mask(
                  this.getDockerNetworkGrid(),
                  this.helper.T("network", "host_network_warn")
                );
              } else {
                this.helper.unmask(this.getDockerNetworkGrid());
              }
            },
          },
        },
        {
          title: this.helper.T("container", "port_setting"),
          itemId: "port",
          xtype: "syno_formpanel",
          layout: "fit",
          items: [a],
          listeners: {
            scope: this,
            activate: function () {
              this.getPortGrid().getView().refresh();
              if (
                this.getDockerNetworkValue(this.items.get("network"))
                  .use_host_network
              ) {
                this.helper.mask(
                  this.getPortGrid(),
                  this.helper.T("network", "host_port_warn")
                );
              } else {
                this.helper.unmask(this.getPortGrid());
              }
            },
          },
        },
        {
          title: this.helper.T("wizard", "links"),
          itemId: "links",
          xtype: "syno_formpanel",
          layout: "fit",
          items: [this.getLinkGrid(b)],
          listeners: {
            scope: this,
            activate: function () {
              var f = this.getDockerNetworkValue(
                this.items.get("network")
              ).network;
              var e = this.getDockerNetworkValue(
                this.items.get("network")
              ).use_host_network;
              var d = true;
              this.getLinkGrid().getView().refresh();
              if (!e) {
                d =
                  f
                    .map(function (g) {
                      return g.name;
                    })
                    .indexOf("bridge") < 0;
              }
              if (d) {
                this.helper.mask(
                  this.getLinkGrid(),
                  this.helper.T("network", "link_warn")
                );
              } else {
                this.helper.unmask(this.getLinkGrid());
              }
            },
          },
        },
        {
          title: this.helper.T("wizard", "environment"),
          itemId: "environment",
          xtype: "syno_formpanel",
          items: this.getEnvCfg(b),
          listeners: {
            scope: this,
            activate: function () {
              this.getEnvGrid().getView().refresh();
            },
          },
        },
      ],
    };
    Ext.apply(c, b);
    return c;
  },
  getProfile: function () {
    var a = {};
    Ext.apply(a, this.getVolumeValue(this.items.get("volume")));
    Ext.apply(a, this.getDockerNetworkValue(this.items.get("network")));
    Ext.apply(a, this.getPortValue(this.items.get("port")));
    Ext.apply(a, this.getLinkValue(this.items.get("links")));
    Ext.apply(a, this.getEnvValue(this.items.get("environment")));
    return a;
  },
  setProfile: function (a) {
    Ext.apply(this.data, a);
    this.setVolumeValue(this.items.get("volume"), this.data);
    this.setDockerNetworkValue(this.items.get("network"), this.data);
    this.setPortValue(this.items.get("port"), this.data);
    this.setLinkValue(this.items.get("links"), this.data);
    this.setEnvValue(this.items.get("environment"), this.data);
  },
  validateProfile: function () {
    return (
      this.validate(this.items.get("volume"), this.validateVolume) &&
      this.validate(this.items.get("port"), this.validatePort) &&
      this.validate(this.items.get("links"), this.validateLink) &&
      this.validate(this.items.get("environment"), this.validateEnv)
    );
  },
  validate: function (a, b) {
    var c = b.call(this, a, false);
    if (false === c) {
      this.activate(a);
      b.call(this, a, true);
      this.ownerCt.setStatusError({
        text: _T("common", "forminvalid"),
        clear: true,
      });
    }
    return c;
  },
});
Ext.define("SYNO.SDS.Docker.Container.BasicProfile", {
  extend: "SYNO.ux.FormPanel",
  helper: SYNO.SDS.Docker.Utils.Helper,
  constructor: function (a) {
    Ext.apply(this, new SYNO.SDS.Docker.Container.ProfileUI());
    this.owner = a.owner;
    this.data = {};
    this.callParent([this.fillConfig(a)]);
    if (!a.is_package) {
      this.mon(this, "afterlayout", this.enableGroup, this, { single: true });
    }
  },
  enableGroup: function () {
    this.enableResourceGroup(this);
  },
  fillConfig: function (a) {
    Ext.apply(a, { mem_max_mb: this.helper.getRealMemory() });
    var b = [];
    b = b.concat(this.getEditNameCfg(a));
    b.push({ xtype: "syno_displayfield" });
    b = b.concat(this.getCapabilityCfg(a, this.owner));
    b = b.concat(this.getCapabilitiesCfg());
    b = b.concat(this.getResourceCfg(a));
    b = b.concat(this.getRestartPolicyCfg(a));
    var c = Ext.apply(
      {
        title: this.helper.T("helptoc", "general_settings"),
        itemId: "basic",
        items: b,
      },
      a
    );
    return c;
  },
  getProfile: function () {
    var a = {};
    Ext.apply(a, this.getRestartPolicyValue(this));
    Ext.apply(a, this.getResourceValue(this));
    Ext.apply(a, this.getCapabilityValue(this));
    a.CapAdd = this.data.CapAdd || null;
    a.CapDrop = this.data.CapDrop || null;
    return a;
  },
  setProfile: function (a) {
    Ext.apply(this.data, a);
    this.setResourceValue(this, this.data);
    this.setRestartPolicyValue(this, this.data);
    this.setCapabilityValue(this, this.data);
    this.setNameValue(this, this.data);
    this.data.CapAdd = a.CapAdd || null;
    this.data.CapDrop = a.CapDrop || null;
  },
  validateProfile: function () {
    return (
      this.validate(this.validateResource) && this.validate(this.validateName)
    );
  },
  validate: function (a) {
    var b = a.call(this, this, false);
    if (false === b) {
      this.owner.panel.activate(this);
      a.call(this, this, true);
      this.owner.setStatusError({
        text: _T("common", "forminvalid"),
        clear: true,
      });
    }
    return b;
  },
  getCapabilitiesCfg: function () {
    var a = this.helper.T("container", "custom_capabilities_tip");
    this.capbilitiesButton = new SYNO.ux.Button({
      xtype: "syno_button",
      text: this.helper.T("container", "custom_capabilities"),
      indent: 1,
      scope: this,
      handler: this.openCapabilitiesWindow,
      listeners: {
        afterrender: function (b) {
          setTimeout(
            function () {
              var c = SYNO.ux.AddTip(this.getEl(), a);
              this.capbilitiesButtonTip = Ext.getCmp(c.id);
            }.bind(this),
            0
          );
        },
        enable: function () {
          this.capbilitiesButtonTip.enable();
        },
        disable: function () {
          this.capbilitiesButtonTip.disable();
        },
      },
    });
    return this.capbilitiesButton;
  },
  openCapabilitiesWindow: function () {
    var a = this.owner.openVueWindow(
      "SYNO.SDS.Docker.Modals.EditCapabilities",
      {
        containerId: this.owner.containerId,
        defaultCapAdd: this.data.CapAdd || [],
        defaultCapDrop: this.data.CapDrop || [],
      }
    ).window;
    a.$on(
      "close",
      function (b) {
        this.owner.loadContainerProfile(
          function () {
            this.setProfile({ privileged: false });
          }.bind(this)
        );
      }.bind(this)
    );
  },
});
Ext.define("SYNO.SDS.Docker.Container.Editor", {
  extend: "SYNO.SDS.Docker.Image.WizardAdvance",
  helper: SYNO.SDS.Docker.Utils.Helper,
  constructor: function (a) {
    this.callParent([a]);
    this.insertBasicFormPanel(a);
    this.panel.setActiveTab(0);
    this.mon(this, "show", function () {
      this.loadContainerProfile();
    });
  },
  loadContainerProfile: function (a) {
    this.setStatusBusy({ text: _T("common", "loading") });
    this.sendWebAPI({
      scope: this,
      api: "SYNO.Docker.Container",
      method: "get",
      version: 1,
      params: { name: this.containerId },
      callback: function (e, c, d, b) {
        this.panel.get("environment").form.findField("cmd").setReadOnly(true);
        if (e && c && c.profile) {
          this.setProfile(c.profile);
          if (a) {
            a();
          }
        } else {
          this.getMsgBox().alert("", _T("common", "error_system"));
        }
        this.clearStatusBusy();
      },
    });
  },
  isProfileDirty: function () {
    var a = this.getProfile();
    return Ext.encode(this.origProfile) !== Ext.encode(a);
  },
  setProfile: function (a) {
    if (a.volume_bindings) {
      this.bindAbsolutePathConfig = a.volume_bindings.filter(function (b) {
        return b.hasOwnProperty("host_absolute_path");
      });
      a.volume_bindings = a.volume_bindings.filter(function (b) {
        return b.hasOwnProperty("host_volume_file");
      });
    }
    this.panel.setProfile(a);
    this.basic.setProfile(a);
    this.origProfile = this.getProfile();
    this.panel.get("environment").form.findField("cmd").emptyText = " ";
    this.panel.get("environment").form.findField("cmd").applyEmptyText();
  },
  mergeAbsolutePathMountsConfig: function (a) {
    if (this.bindAbsolutePathConfig && this.bindAbsolutePathConfig.length) {
      a.volume_bindings = a.volume_bindings.concat(this.bindAbsolutePathConfig);
    }
  },
  getProfile: function () {
    var a = {};
    Ext.apply(a, this.panel.getProfile());
    Ext.apply(a, this.basic.getProfile());
    return a;
  },
  applyHandler: function () {
    var a;
    var b = this.basic.form.findField("name").getValue();
    if (false === this.validateProfile()) {
      return;
    }
    if (false === this.isProfileDirty() && b === this.containerId) {
      this.cancelHandler();
      return;
    }
    this.setStatusBusy({ text: _T("common", "loading") });
    this.parent.maskRow(this.containerId);
    a = this.getProfile();
    this.mergeAbsolutePathMountsConfig(a);
    a = Object.assign({}, a, {
      CapAdd: a.privileged ? [] : a.CapAdd,
      CapDrop: a.privileged ? [] : a.CapDrop,
    });
    this.sendWebAPI({
      scope: this,
      api: "SYNO.Docker.Container",
      method: "set",
      version: 1,
      params: { name: this.containerId, edit_name: b, profile: a },
      callback: function (f, d, e, c) {
        this.clearStatusBusy();
        this.parent.unmaskRow(this.containerId);
        if (f) {
          this.close();
        } else {
          if (
            this.helper.errorMapping.WEBAPI_ERR_CONTAINER_PORT_CONFLICT ===
            d.code
          ) {
            this.panel.setActiveTab("port");
          } else {
            if (
              this.helper.errorMapping.WEBAPI_ERR_CONTAINER_CIRCULAR_LINK ===
              d.code
            ) {
              this.panel.setActiveTab("links");
              this.getMsgBox().alert(
                "",
                this.helper.getError(
                  d.code,
                  d.errors.circular_link_criminal.bold(),
                  d.errors.errors.bold()
                )
              );
              return;
            } else {
              if (
                this.helper.errorMapping
                  .WEBAPI_ERR_CONTAINER_UNKNOWN_CAPABILITY === d.code
              ) {
                this.getMsgBox().alert(
                  "",
                  this.panel.getErrorMsg(d, e),
                  function () {
                    this.basic.openCapabilitiesWindow();
                  },
                  this
                );
                return;
              }
            }
          }
          this.getMsgBox().alert(
            "",
            this.helper.getError(d.code, d.errors.errors)
          );
        }
      },
    });
  },
  insertBasicFormPanel: function (a) {
    this.basic = new SYNO.SDS.Docker.Container.BasicProfile({
      owner: this,
      is_package: a.is_package,
    });
    this.panel.insert(0, this.basic);
  },
  validateProfile: function () {
    return this.panel.validateProfile() && this.basic.validateProfile();
  },
});
Ext.define("SYNO.SDS.Docker.Container.Toolbar", {
  extend: "SYNO.ux.Toolbar",
  statusUtil: SYNO.SDS.Docker.Container.StatusUtil,
  helper: SYNO.SDS.Docker.Utils.Helper,
  constructor: function (a) {
    this.callParent([this.fillConfig(a)]);
  },
  fillConfig: function (a) {
    var d = this.statusUtil.statusCode;
    var c = {
      actions: {
        start: new Ext.Action({
          itemId: "start",
          text: this.helper.T("container", "start"),
          scope: a.owner,
          enableStatus: d.stop,
          disableStatus: d.synopackage | d.ddsm,
          handler: a.owner.btnStart,
        }),
        stop: new Ext.Action({
          itemId: "stop",
          text: this.helper.T("container", "stop"),
          scope: a.owner,
          enableStatus: d.run,
          disableStatus: d.synopackage | d.ddsm,
          handler: a.owner.btnStop,
        }),
        restart: new Ext.Action({
          itemId: "restart",
          text: this.helper.T("container", "restart"),
          scope: a.owner,
          enableStatus: d.run,
          disableStatus: d.synopackage | d.ddsm,
          handler: a.owner.btnRestart,
        }),
        fstop: new Ext.Action({
          itemId: "fstop",
          text: this.helper.T("container", "force_stop"),
          scope: a.owner,
          enableStatus: d.run,
          disableStatus: d.synopackage | d.ddsm,
          handler: a.owner.btnFstop,
        }),
        reset: new Ext.Action({
          itemId: "reset",
          text: this.helper.T("container", "clear"),
          scope: a.owner,
          enableStatus: d.stop,
          disableStatus: d.synopackage | d.exporting | d.ddsm,
          handler: a.owner.btnReset,
        }),
        delete: new Ext.Action({
          itemId: "delete",
          text: this.helper.T("container", "delete"),
          scope: a.owner,
          enableStatus: d.stop,
          disableStatus: d.synopackage | d.exporting,
          handler: a.owner.btnDelete,
        }),
      },
      setting: {
        duplicate: new Ext.Action({
          itemId: "duplicate",
          text: this.helper.T("container", "duplicate"),
          scope: a.owner,
          enableStatus: d.run | d.stop,
          disableStatus: d.synopackage | d.exporting | d.ddsm,
          handler: a.owner.btnDuplicate,
          denyMultiple: true,
        }),
        import: new Ext.Action({
          disabled: false,
          itemId: "import",
          text: this.helper.T("container", "import"),
          scope: a.owner,
          enableStatus: d.unselected | d.run | d.stop,
          handler: a.owner.btnImport,
        }),
        export: new Ext.Action({
          itemId: "export",
          text: this.helper.T("container", "export"),
          scope: a.owner,
          enableStatus: d.run | d.stop,
          disableStatus: d.synopackage | d.exporting | d.ddsm,
          handler: a.owner.btnExport,
          denyMultiple: true,
        }),
        shortcut: new Ext.Action({
          itemId: "shortcut",
          text: this.helper.T("container", "create_shortcut"),
          menu: new SYNO.ux.Menu({
            items: [
              new Ext.Action({
                itemId: "status-shortcut",
                text: this.helper.T("container", "status_page"),
                scope: a.owner,
                handler: a.owner.btnCreateStatusShortcut,
              }),
              new Ext.Action({
                itemId: "url-shortcut",
                text: this.helper.T("container", "web_page"),
                scope: a.owner,
                handler: a.owner.btnCreateUrlShortCut,
              }),
            ],
          }),
          enableStatus: d.run | d.stop,
          disableStatus: d.exporting | d.ddsm,
          denyMultiple: true,
        }),
      },
    };
    var e = {
      create: new Ext.Action({
        itemId: "create",
        text: this.helper.T("common", "create"),
        scope: a.owner,
        disabled: false,
        enableStatus: d.unselected | d.run | d.stop,
        handler: a.owner.btnCreate,
      }),
      details: new Ext.Action({
        itemId: "details",
        text: this.helper.T("container", "detail"),
        scope: a.owner,
        enableStatus: d.run | d.stop,
        disableStatus: d.ddsm,
        handler: a.owner.btnDetails,
        denyMultiple: true,
      }),
      edit: new Ext.Action({
        itemId: "edit",
        text: this.helper.T("container", "edit"),
        scope: a.owner,
        enableStatus: d.stop,
        disableStatus: d.exporting | d.ddsm,
        handler: a.owner.btnEdit,
        denyMultiple: true,
      }),
      actions: new Ext.Action({
        itemId: "actions",
        text: this.helper.T("container", "action"),
        menu: new Ext.menu.Menu({ items: Object.values(c.actions) }),
        enableStatus: d.run | d.stop,
        disableStatus: d.synopackage,
      }),
      setting: new Ext.Action({
        disabled: false,
        itemId: "setting",
        text: this.helper.T("common", "common_settings"),
        menu: new Ext.menu.Menu({
          defaults: { disabled: true },
          items: Object.values(c.setting),
        }),
        enableStatus: d.unselected | d.run | d.stop,
      }),
    };
    var g = { align: "->" };
    var f = {
      findField: new SYNO.ux.TextFilter({
        itemId: "search",
        width: 200,
        localFilter: true,
        localFilterField: ["name"],
        blOr: true,
        store: a.store,
        enableStatus: 255,
      }),
    };
    this.actionGroup = new SYNO.ux.Utils.ActionGroup(
      Object.values(e)
        .concat(Object.values(f))
        .concat(Object.values(c.actions))
        .concat(Object.values(c.setting))
    );
    this.actionGroupToplevel = new SYNO.ux.Utils.ActionGroup(Object.values(e));
    var b = {
      defaults: { disabled: true },
      items: Object.values(e).concat(Object.values(g)).concat(Object.values(f)),
    };
    Ext.apply(b, a);
    return b;
  },
});
Ext.define("SYNO.SDS.Docker.Container.ListView", {
  extend: "SYNO.ux.ExpandableListView",
  helper: SYNO.SDS.Docker.Utils.Helper,
  statusUtil: SYNO.SDS.Docker.Container.StatusUtil,
  constructor: function (a) {
    var b = Ext.apply(
      {
        cls: "syno-docker-containerlist",
        customizeEmptyText: String.format(
          "<div>{0}</div>{1}",
          this.helper.T("container", "containers_empty_text"),
          '<div id="docker-containers-empty-create-button"></div>'
        ),
      },
      a
    );
    this.callParent([b]);
    this.addTplRenderer();
    this.mon(this.store, "load", this._onStoreLoad, this);
  },
  createTpl: function () {
    return new Ext.XTemplate(
      '<tpl for=".">',
      '<div data-name="{name}" class="item-wrap {cls}">',
      '<div class="item-summary">',
      '<div class="docker-titlewrap">',
      '<div ext:qtip="{name}" class="item-title">{name}</div>',
      '<div ext:qtip="{image}" class="item-status">{image}</div>',
      "</div>",
      '<div class="docker-status-block">',
      '<div class="docker-status-state-block">',
      '<div class="{[ this.getStatusClass(values) ]}">',
      "{[ this.getStatusTitleText(values) ]}",
      "</div>",
      '<div class="docker-status-block-desc" ext:qtip="{[ this.getStatusDescText(values) ]}">',
      "{[ this.getStatusDescText(values) ]}",
      "</div>",
      "</div>",
      '<div class="docker-cpu-ram-block">',
      '<tpl if="this.isRunning(values)">',
      '<div style="--percent: {[ values.cpu ]}" class="docker-cpu-ram-row" ext:qtip="{[ this.getCpuRamTip(values) ]}">',
      '<div class="docker-cpu-ram-title">CPU</div>',
      '<div class="{[ this.getCpuBarClass(values) ]}"></div>',
      "</div>",
      '<div style="--percent: {[ values.memoryPercent ]}" class="docker-cpu-ram-row" ext:qtip="{[ this.getCpuRamTip(values) ]}">',
      '<div class="docker-cpu-ram-title">RAM</div>',
      '<div class="{[ this.getRamBarClass(values) ]}"></div>',
      "</div>",
      "</tpl>",
      "</div>",
      '<div class="docker-link-block">',
      '<tpl if="portals && portals.length">',
      '<div class="docker-link-icon"></div>',
      "</tpl>",
      "</div>",
      "</div>",
      '<div class="docker-viewport" draggable="false">',
      '<div class="docker-switch {[ this.getSwitchClass(values) ]}" ext:wtip="{[ this.getDisabledSwitchWhiteTip(values) ]}"></div>',
      '<div class="docker-switch-btn {[ this.getSwitchBtnClass(values) ]}" ext:wtip="{[ this.getDisabledSwitchWhiteTip(values) ]}"></div>',
      "</div>",
      '<div class="x-clear"></div>',
      "</div>",
      "</div>",
      "</tpl>",
      '<div class="x-clear"></div>'
    );
  },
  addTplRenderer: function () {
    var a = this.tpl,
      b = this;
    a._T = b.helper.T;
    a.hasError = function (c) {
      return !!this.getError(c);
    };
    a.getError = function (c) {
      return c.State && c.State.Error;
    };
    a.isRunning = function (c) {
      return b.isRunning(c);
    };
    a.getStatusTitleText = function (c) {
      if (c.exporting) {
        return this._T("container", "exporting");
      }
      if (this.hasError(c)) {
        return this._T("container", "fail_to_run");
      }
      return this._T("container", "status_" + c.status);
    };
    a.getStatusDescText = function (c) {
      if (c.status === SYNO.SDS.Docker.Container.StatusUtil.status.run) {
        return c.up_time;
      }
      if (this.hasError(c)) {
        return this.getError(c);
      }
      return "";
    };
    a.getStatusClass = function (c) {
      var d = "docker-status-block-title ";
      if (b.isRunning(c)) {
        return d + "info";
      }
      if (this.hasError(c)) {
        return d + "error";
      }
      return d;
    };
    a.getCpuBarClass = function (c) {
      return "docker-cpu-bar " + this.getCpuRamlevelClass(c.cpu);
    };
    a.getRamBarClass = function (c) {
      return "docker-ram-bar " + this.getCpuRamlevelClass(c.memoryPercent);
    };
    a.getCpuRamlevelClass = function (c) {
      var d = parseInt(c, 10);
      if (d >= 90) {
        return "danger";
      }
      if (d >= 80) {
        return "warning";
      }
      return "";
    };
    a.getCpuRamTip = function (c) {
      return String.format("CPU: {0} / RAM: {1}", c.cpu, c.memory);
    };
    a.getDisabledSwitchWhiteTip = function (c) {
      if (c.is_ddsm) {
        return b.helper.T("ddsm", "vdsm_migration");
      }
      if (c.is_package) {
        return b.helper.T("container", "package_deny_operation");
      }
    };
    a.getSwitchClass = function (c) {
      return b.isRunning(c) ? "docker-switch-on" : "";
    };
    a.getSwitchBtnClass = function (c) {
      return b.isRunning(c) ? "docker-switch-btn-on" : "";
    };
  },
  isRunning: function (b) {
    var a = b.switchStatus ? b.switchStatus : b.status;
    return (
      a === SYNO.SDS.Docker.Container.StatusUtil.status.run ||
      a === SYNO.SDS.Docker.Container.StatusUtil.status.restarting
    );
  },
  _onStoreLoad: function () {
    this.getEl()
      .select(".item-wrap")
      .each(function (a, f, d) {
        var e = a.getAttribute("data-name"),
          b = this.store.getById(e);
        this.progressbarAnimation(a, b);
        this.bindSwitchClick(a, b, d);
        this.bindPortalClick(a, b, d);
      }, this);
  },
  onUpdate: function (c, a, b) {
    if (b === "commit") {
      this.store.each(function (d) {
        d.data.cls = d.data.cls.replace("syno-ux-expandable-add", "");
        d.data.cls = d.data.cls.replace("syno-ux-expandable-remove", "");
      });
    }
    this.callParent(arguments);
    if (b === "commit") {
      this._onStoreLoad();
    }
  },
  progressbarAnimation: function (b, d) {
    var e = b.select(".docker-cpu .docker-bar-progress"),
      f = b.select(".docker-memory .docker-bar-progress"),
      c = "docker-progressbar-transition",
      a;
    if (!d.states.isNew) {
      a = d.states.oldRecord;
      e.setWidth(a.cpu);
      f.setWidth(a.memoryPercent);
      setTimeout(
        (function (h, i, g) {
          return function () {
            h.addClass(c).setWidth(g.get("cpu"));
            i.addClass(c).setWidth(g.get("memoryPercent"));
          };
        })(e, f, d),
        0
      );
    }
  },
  bindPortalClick: function (a, b, d) {
    var e = a.select(".docker-link-icon");
    var c = b.get("portals");
    if (!e || !c) {
      return;
    }
    this.mun(e, "click");
    this.mon(
      e,
      "click",
      function (g, f) {
        if (c.length === 1) {
          window.open(c[0], "_blank");
        } else {
          this.owner.view.select(d);
          var h = new SYNO.ux.Menu({
            autoDestroy: true,
            items: c.map(function (i) {
              return {
                itemId: i,
                text: i,
                href: i,
                hrefTarget: "_blank",
                scope: this,
              };
            }),
          });
          h.showAt(g.getXY());
        }
      },
      this
    );
  },
  bindSwitchClick: function (a, b, d) {
    var c = a.select(".docker-viewport");
    if (b.get("is_package") === true || b.get("is_ddsm") === true) {
      c.addClass("docker-mask");
      return;
    }
    this.mun(c, "click");
    this.mon(
      c,
      "click",
      function (g, f) {
        this.owner.view.select(d);
        if (
          b.get("status") === this.statusUtil.status.run ||
          b.get("status") === this.statusUtil.status.restarting
        ) {
          this.owner.btnStop();
        } else {
          this.owner.btnStart();
        }
      },
      this
    );
  },
  toggleBtnAnimation: function (f, b) {
    var a = this.owner.store.getById(f),
      g = this.owner.view.getNode(a),
      d = Ext.get(g).select(".docker-switch"),
      c = Ext.get(g).select(".docker-switch-btn"),
      e = Ext.get(g).select(".docker-status .item-title");
    if (b) {
      d.addClass("docker-switch-on");
      c.addClass("docker-switch-btn-on");
      e.addClass("item-title-on");
    } else {
      d.removeClass("docker-switch-on");
      c.removeClass("docker-switch-btn-on");
      e.removeClass("item-title-on");
    }
  },
  refresh: function () {
    this.callParent(arguments);
    this.renderEmptyCreateBtn();
  },
  renderEmptyCreateBtn: function () {
    if (this.emptyCreateBtn) {
      this.emptyCreateBtn.destroy();
    }
    this.emptyCreateBtn = new SYNO.ux.Button({
      renderTo: this.el.child("#docker-containers-empty-create-button"),
      btnStyle: "blue",
      text: this.helper.T("common", "create"),
      scope: this.owner,
      handler: this.owner.btnCreate,
    });
  },
});
Ext.namespace("SYNO.SDS.Docker.Utils");
Ext.define("SYNO.SDS.Docker.Utils.FileChooser", {
  extend: "SYNO.SDS.Utils.FileChooser.Chooser",
  helper: SYNO.SDS.Docker.Utils.Helper,
  constructor: function (a) {
    this.callParent([
      Ext.apply(
        {
          minHeight: 500,
          minWidth: 700,
          scope: this,
          superuser: true,
          title: this.helper.T("common", "choose_file"),
          treeFilter: function (c, b) {
            if (b && b.spath === "/home") {
              return false;
            }
            return true;
          },
        },
        a
      ),
    ]);
    this.cardview = this.findBy(function (b) {
      return b.getItemId() === "cardview";
    })[0];
    this.mon(this, "choose", this.onChoose, this);
  },
  initTreeConfig: function (a) {
    var c = this.callParent([a]);
    var b = [];
    b.push({
      cls: "root_node",
      text: _T("filebrowser", "filetable_upload"),
      draggable: false,
      allowDrop: false,
      expanded: false,
      allowChildren: false,
      expandable: false,
      leaf: true,
      id: "upload_from_computer",
    });
    c.root.attributes.children = b.concat(c.root.attributes.children);
    return c;
  },
  onTreeSelectionChange: function (b, a) {
    if ("upload_from_computer" === a.id) {
      this.cardview.layout.setActiveItem("form");
      return;
    }
    this.cardview.layout.setActiveItem("grid");
    this.callParent(arguments);
  },
  initFormConfig: function (a) {
    this.fileUploadButton = new SYNO.ux.FileButton({
      fieldLabel: this.helper.T("common", "file"),
      name: "filename",
    });
    this.formpanel = new SYNO.SDS.Utils.FormPanel({
      itemId: "form",
      webapi: a.webapi.uploader,
      fileUpload: true,
      trackResetOnLoad: true,
      frame: false,
      border: false,
      labelWidth: 125,
      style: { padding: "3px 10px 0px 16px" },
      items: [
        {
          xtype: "syno_fieldset",
          title: _T("itunes", "itunes_path"),
          items: [this.fileUploadButton],
        },
      ],
    });
    return this.formpanel;
  },
  initGridConfig: function (a) {
    var b = this.callParent([a]);
    var d = this.initFormConfig(a);
    var c = {
      itemId: "cardview",
      layout: "card",
      region: "center",
      border: false,
      activeItem: 0,
      items: [b, d],
    };
    return c;
  },
  applyHandler: function () {
    if (this.grid.isVisible()) {
      this.callParent(arguments);
      return;
    }
    this.getProgressInstance();
    this.formpanel
      .getForm()
      .submit({
        clientValidation: false,
        progress: this.onProgrss,
        scope: this,
        callback: this.onUploadCallback,
      });
  },
  getProgressInstance: function () {
    if (!this.progress || !this.progress.isVisible()) {
      this.progress = this.getMsgBox().progress(
        "",
        this.helper.T("common", "status_uploading"),
        ""
      );
    }
    return this.progress;
  },
  onProgress: function (a) {},
  onChoose: function (b, a) {
    b.close();
    this.sendWebAPI(
      Ext.apply(
        { params: { path: a.path }, scope: b, callback: b.onChooseCallback },
        b.webapi.chooser
      )
    );
  },
  onUploadCallback: function (d, a, c, b) {
    this.getProgressInstance().updateProgress(1);
    this.getProgressInstance().close();
    this.close();
    if (this.callback) {
      this.callback.call(this.scope || {}, d, a, c, b);
    }
  },
  onChooseCallback: function (d, a, c, b) {
    if (this.callback) {
      this.callback.call(this.scope, d, a, c, b);
    }
  },
});
Ext.define("SYNO.SDS.Docker.Container.FileChooser", {
  extend: "SYNO.SDS.Docker.Utils.FileChooser",
  helper: SYNO.SDS.Docker.Utils.Helper,
  constructor: function (a) {
    this.name_setting = {
      create_container: false,
      import_image: false,
      file_name: "",
      container: "",
      repository: "",
      tag: "",
    };
    this.callParent([
      Ext.apply(
        {
          webapi: {
            uploader: {
              api: "SYNO.Docker.Container.Profile",
              method: "upload",
              version: 1,
            },
            chooser: {
              api: "SYNO.Docker.Container.Profile",
              method: "import",
              version: 1,
            },
          },
        },
        a
      ),
    ]);
    this.mon(
      this.formpanel.getForm(),
      "beforeaction",
      function (c, d) {
        var b = c.items.items[0].getValue();
        if (!b.match(/\.json$/)) {
          c.webapi.api = "SYNO.Docker.Container";
        }
        return true;
      },
      this
    );
  },
  validateContainerName: function (a, c) {
    var b = false;
    if (!c) {
      return false;
    }
    if (!a || !a.total || !a.containers || !a.containers.length) {
      return true;
    }
    Ext.each(
      a.containers,
      function (d) {
        if (d.name && d.name === c) {
          b = true;
          return false;
        }
      },
      this
    );
    return !b;
  },
  validateImageName: function (d, a, c) {
    var b = false;
    if (!a || !c) {
      return false;
    }
    if (!d || !d.total || !d.images || !d.images.length) {
      return true;
    }
    Ext.each(
      d.images,
      function (e) {
        if (e.repository && e.repository === a && e.tags) {
          Ext.each(
            e.tags,
            function (f) {
              if (f === c) {
                b = true;
                return false;
              }
            },
            this
          );
        }
        return !b;
      },
      this
    );
    return !b;
  },
  onApplyNameSetting: function (b) {
    var a = [];
    if (this.formpanel.isVisible()) {
      if (!this.fileUploadButton.getValue()) {
        this.getMsgBox().alert(
          "",
          _T("service", "service_file_nofileselected_tip")
        );
        return;
      }
    }
    if (this.name_setting.create_container) {
      a.push({
        api: "SYNO.Docker.Container",
        method: "list",
        version: 1,
        params: { limit: -1, offset: 0, type: "all" },
      });
    }
    if (this.name_setting.import_image) {
      a.push({
        api: "SYNO.Docker.Image",
        method: "list",
        version: 1,
        params: { limit: -1, offset: 0, show_dsm: false },
      });
    }
    this.sendWebAPI({
      compound: { stopwhenerror: true, params: a },
      scope: this,
      callback: function (l, h, i, c) {
        var g,
          e,
          m,
          j = "",
          k = "",
          f = "",
          d = b;
        if (l && !h.has_fail) {
          if (this.name_setting.create_container) {
            g = SYNO.API.Response.GetValByAPI(
              h,
              "SYNO.Docker.Container",
              "list"
            );
            j = this.grid.isVisible()
              ? this.name_setting.container
              : this.formpanel.form.findField("container_name").getValue();
            m = this.grid.isVisible()
              ? d.getComponent("setting_form").getForm()
              : d.formpanel.form;
            if (!m.isValid()) {
              return;
            }
            if (!this.validateContainerName(g, j)) {
              d.getMsgBox().alert(
                "",
                this.helper.getError(
                  this.helper.errorMapping.WEBAPI_ERR_DOCKER_FILE_EXIST,
                  j
                ),
                function () {
                  if (this.grid.isVisible()) {
                    d.getComponent("setting_form")
                      .getForm()
                      .findField("container_name")
                      .focus();
                  } else {
                    d.formpanel.form.findField("container_name").focus();
                  }
                },
                this
              );
              return;
            }
          }
          if (this.name_setting.import_image) {
            e = SYNO.API.Response.GetValByAPI(h, "SYNO.Docker.Image", "list");
            k = this.grid.isVisible()
              ? this.name_setting.repository
              : this.formpanel.form.findField("repo_name").getValue();
            f = this.grid.isVisible()
              ? this.name_setting.tag
              : this.formpanel.form.findField("repo_tag").getValue();
            m = this.grid.isVisible()
              ? d.getComponent("setting_form").getForm()
              : d.formpanel.form;
            if (!m.isValid()) {
              return;
            }
            if (!this.validateImageName(e, k, f)) {
              d.getMsgBox().alert(
                "",
                String.format(
                  this.helper.T("common", "already_existed"),
                  k + ":" + f
                ),
                function () {
                  if (this.grid.isVisible()) {
                    d.getComponent("setting_form")
                      .getForm()
                      .findField("repo_name")
                      .focus();
                  } else {
                    d.formpanel.form.findField("repo_name").focus();
                  }
                },
                this
              );
              return;
            }
          }
        }
        if (this.formpanel.isVisible()) {
          this.applyUpload();
          return;
        }
        d.close();
        this.applySelectFile();
      },
    });
  },
  applyUpload: function () {
    this.getProgressInstance();
    this.formpanel
      .getForm()
      .submit({
        clientValidation: false,
        progress: this.onProgrss,
        scope: this,
        callback: this.onUploadCallback,
      });
  },
  applySelectFile: function () {
    var c = this,
      a = this.grid.selModel.getSelected().data.path,
      b = { path: a };
    c.close();
    if (!a.match(/\.json$/)) {
      c.webapi.chooser.api = "SYNO.Docker.Container";
    }
    if (this.name_setting.create_container) {
      b.container = this.name_setting.container;
    }
    if (this.name_setting.import_image) {
      b.repository = this.name_setting.repository;
      b.tag = this.name_setting.tag;
    }
    this.sendWebAPI(
      Ext.apply(
        { params: b, scope: c, callback: c.onChooseCallback },
        c.webapi.chooser
      )
    );
  },
  switchFormSettingStatus: function (c) {
    var f = this.formpanel.form.findField("container_name"),
      e = this.formpanel.form.findField("repo_name"),
      b = this.formpanel.form.findField("repo_tag"),
      d = new Date(),
      a = "" + d.getFullYear() + (d.getMonth() + 1) + d.getDate();
    if (!c) {
      this.formpanel.getComponent("import_settings").disable();
      f.disable();
      e.disable();
      b.disable();
      f.reset();
      e.reset();
      b.reset();
      return;
    }
    this.formpanel.getComponent("import_settings").enable();
    if (this.name_setting.create_container) {
      f.enable();
      f.setValue(this.name_setting.file_name);
    } else {
      f.disable();
      f.reset();
    }
    if (this.name_setting.import_image) {
      e.enable();
      b.enable();
      e.setValue(this.name_setting.file_name);
      b.setValue(a);
    } else {
      e.disable();
      b.disable();
      e.reset();
      b.reset();
    }
  },
  updateImportType: function (a) {
    var b = "";
    this.name_setting = {
      create_container: false,
      import_image: false,
      file_name: "",
      container: "",
      repository: "",
      tag: "",
    };
    if (!a) {
      return;
    }
    b = a.substring(a.lastIndexOf("/") + 1);
    b = b.substring(a.lastIndexOf("\\") + 1);
    if (b.match(/\.json$/)) {
      this.name_setting.create_container = true;
      this.name_setting.import_image = false;
    } else {
      if (b.match(/\.syno\.txz$/)) {
        this.name_setting.create_container = true;
        this.name_setting.import_image = true;
      } else {
        this.name_setting.create_container = false;
        this.name_setting.import_image = true;
      }
    }
    this.name_setting.file_name = b.substring(0, b.indexOf("."));
  },
  applyHandler: function () {
    if (this.grid.isVisible()) {
      this.callParent(arguments);
      return;
    }
    this.onApplyNameSetting(this);
    return;
  },
  initFormConfig: function (a) {
    this.fileUploadButton = new SYNO.ux.FileButton({
      fieldLabel: this.helper.T("common", "file"),
      name: "filename",
      listeners: {
        scope: this,
        afterrender: function () {
          this.fileUploadButton.el.on("change", this.onFileUploadChange, this);
        },
        beforedestroy: function () {
          this.fileUploadButton.el.un("change", this.onFileUploadChange, this);
        },
      },
    });
    this.formpanel = new SYNO.SDS.Utils.FormPanel({
      itemId: "form",
      webapi: a.webapi.uploader,
      fileUpload: true,
      trackResetOnLoad: true,
      frame: false,
      border: false,
      labelWidth: 125,
      style: { padding: "3px 10px 0px 16px" },
      items: [
        {
          xtype: "syno_fieldset",
          title: _T("itunes", "itunes_path"),
          items: [this.fileUploadButton],
        },
        {
          xtype: "syno_fieldset",
          itemId: "import_settings",
          title: _T("common", "common_settings"),
          items: [
            {
              xtype: "syno_textfield",
              name: "container",
              fieldLabel: this.helper.T("container", "container_name"),
              validator: this.helper.containerNameValidator,
              itemId: "container_name",
              maxlength: 64,
              allowBlank: false,
            },
            {
              xtype: "syno_textfield",
              name: "repository",
              fieldLabel: this.helper.T("common", "repository"),
              validator: this.helper.repositoryNameValidator,
              itemId: "repo_name",
              maxlength: 63,
              allowBlank: false,
            },
            {
              xtype: "syno_textfield",
              name: "tag",
              fieldLabel: this.helper.T("common", "tag"),
              validator: this.helper.tagNameValidator,
              itemId: "repo_tag",
              maxlength: 64,
              allowBlank: false,
            },
          ],
        },
      ],
      listeners: { scope: this, activate: this.onFormActivate },
    });
    return this.formpanel;
  },
  onFormActivate: function () {
    this.onFileUploadChange();
  },
  onFileUploadChange: function () {
    var a = this.fileUploadButton.getValue();
    this.updateImportType(a);
    if (a === "") {
      this.switchFormSettingStatus(false);
    } else {
      this.switchFormSettingStatus(true);
    }
  },
  onChoose: function (c, a) {
    this.updateImportType(a.path);
    var b = new SYNO.SDS.Docker.Container.NameSettings({ owner: this });
    b.open();
    this.helper.maskLoading(this.panel);
  },
});
Ext.define("SYNO.SDS.Docker.Container.NameSettings", {
  extend: "SYNO.SDS.ModalWindow",
  constructor: function (a) {
    var b = this.fillConfig(a);
    this.callParent([b]);
  },
  fillConfig: function (b) {
    var f = new Date(),
      a = "" + f.getFullYear() + (f.getMonth() + 1) + f.getDate(),
      e = b.owner.name_setting.file_name ? b.owner.name_setting.file_name : "",
      d = b.owner.name_setting.create_container
        ? [
            {
              xtype: "syno_textfield",
              fieldLabel: b.owner.helper.T("container", "container_name"),
              validator: b.owner.helper.containerNameValidator,
              itemId: "container_name",
              maxlength: 64,
              value: e,
              allowBlank: false,
            },
          ]
        : [];
    if (b.owner.name_setting.import_image) {
      d = d.concat([
        {
          xtype: "syno_textfield",
          fieldLabel: b.owner.helper.T("common", "repository"),
          validator: b.owner.helper.repositoryNameValidator,
          itemId: "repo_name",
          value: e,
          maxlength: 63,
          allowBlank: false,
        },
        {
          xtype: "syno_textfield",
          fieldLabel: b.owner.helper.T("common", "tag"),
          validator: b.owner.helper.tagNameValidator,
          itemId: "repo_tag",
          value: a,
          maxlength: 64,
          allowBlank: false,
        },
      ]);
    }
    var c = {
      title: _T("common", "common_settings"),
      width: 450,
      height:
        150 +
        (b.owner.name_setting.create_container ? 30 : 0) +
        (b.owner.name_setting.import_image ? 60 : 0),
      resizable: false,
      buttons: [
        {
          xtype: "syno_button",
          text: _T("common", "alt_cancel"),
          scope: this,
          handler: this.close,
        },
        {
          xtype: "syno_button",
          text: _T("common", "alt_apply"),
          btnStyle: "blue",
          scope: this,
          handler: this.confirmName,
        },
      ],
      items: [{ xtype: "syno_formpanel", itemId: "setting_form", items: d }],
    };
    Ext.apply(c, b);
    return c;
  },
  confirmName: function () {
    var a = this.getComponent("setting_form").getForm();
    if (this.owner.name_setting.create_container) {
      this.owner.name_setting.container = a
        .findField("container_name")
        .getValue();
    }
    if (this.owner.name_setting.import_image) {
      this.owner.name_setting.repository = a.findField("repo_name").getValue();
      this.owner.name_setting.tag = a.findField("repo_tag").getValue();
    }
    this.owner.onApplyNameSetting(this);
  },
});
Ext.define("SYNO.SDS.Docker.Container.ExportContainerWizard", {
  extend: "SYNO.SDS.ModalWindow",
  helper: SYNO.SDS.Docker.Utils.Helper,
  constructor: function (a) {
    this.callParent([this.fillConfig(a)]);
  },
  fillConfig: function (a) {
    this.formPanel = this.createFormPanel(a);
    var b = {
      title: this.helper.T("container", "export"),
      width: 550,
      height: 500,
      layout: "fit",
      buttons: [
        {
          xtype: "syno_button",
          text: this.helper.T("common", "cancel"),
          scope: this,
          handler: this.onCancel,
        },
        {
          xtype: "syno_button",
          btnStyle: "blue",
          text: this.helper.T("common", "export"),
          scope: this,
          handler: this.onConfirm,
        },
      ],
      items: [this.formPanel],
    };
    Ext.apply(b, a);
    return b;
  },
  createFormPanel: function (a) {
    return new SYNO.ux.FormPanel({
      items: [
        {
          xtype: "syno_fieldset",
          title: this.helper.T("container", "export_type"),
          items: [
            {
              itemId: "config",
              xtype: "syno_radio",
              name: "export_type",
              value: "config",
              boxLabel: this.helper.T("container", "container_settings"),
              checked: true,
            },
            {
              xtype: "syno_displayfield",
              indent: 1,
              value: this.helper.T("container", "container_settings_desc"),
            },
            {
              itemId: "container",
              xtype: "syno_radio",
              name: "export_type",
              value: "container",
              boxLabel: this.helper.T(
                "container",
                "container_settings_container"
              ),
              listeners: { scope: this, check: this.onContainerChecked },
            },
            {
              xtype: "syno_displayfield",
              indent: 1,
              value: this.helper.T(
                "container",
                "container_settings_container_desc"
              ),
            },
          ],
        },
        (this.exportTargetField = new SYNO.ux.FieldSet({
          title: this.helper.T("container", "export_target"),
          items: [
            {
              itemId: "volume",
              xtype: "syno_radio",
              name: "export_target",
              value: "volume",
              boxLabel: this.helper.T("container", "export_to_diskstation"),
              checked: true,
              listeners: { scope: this, check: this.onVolumeChecked },
            },
            (this.fileChooseField = new SYNO.ux.CompositeField({
              hideLabel: true,
              indent: 1,
              items: [
                {
                  itemId: "file_btn",
                  xtype: "syno_button",
                  hideLabel: true,
                  text: this.helper.T("mediaservice", "root_directory_path"),
                  scope: this,
                  handler: this.onPathChoose,
                },
                {
                  itemId: "volume_path",
                  xtype: "syno_textfield",
                  name: "volume_path",
                  value: "",
                  hideLabel: true,
                  disabled: true,
                },
              ],
            })),
            {
              itemId: "local",
              xtype: "syno_radio",
              name: "export_target",
              value: "local",
              boxLabel: this.helper.T("container", "export_to_local"),
            },
          ],
        })),
      ],
    });
  },
  onVolumeChecked: function (a, b) {
    if (b) {
      this.fileChooseField.innerCt.getComponent("file_btn").enable();
    } else {
      this.fileChooseField.innerCt.getComponent("file_btn").disable();
    }
  },
  onContainerChecked: function (a, b) {
    if (b) {
      this.exportTargetField.getComponent("volume").setValue(true);
      this.exportTargetField.getComponent("local").disable();
    } else {
      this.exportTargetField.getComponent("local").enable();
    }
  },
  onPathChoose: function () {
    var a = this.fileChooseField.innerCt.getComponent("volume_path");
    var b = new SYNO.SDS.Utils.FileChooser.Chooser({
      owner: this,
      title: _T("common", "add"),
      folderToolbar: true,
      usage: { type: "chooseDir" },
      gotoPath: "/docker",
      treeFilter: function (d, c) {
        if (c && c.spath === "/home") {
          return false;
        }
        return true;
      },
      listeners: {
        scope: this,
        choose: function (e, d, c) {
          a.setValue(d.path);
          e.close();
        },
      },
    });
    b.open();
  },
  onConfirm: function () {
    var a = this.fileChooseField.innerCt.getComponent("volume_path"),
      c = this.formPanel.getForm().getValues(),
      b = {
        api:
          c.export_type === "config"
            ? "SYNO.Docker.Container.Profile"
            : "SYNO.Docker.Container",
        method: "export",
        version: 1,
        params: { name: this.containerName },
      };
    if (c.export_target === "volume") {
      if (a.getValue().length === 0) {
        this.setStatusError({
          text: this.helper.T("service", "warning_select_dest"),
          clear: true,
        });
        return;
      }
      b.params.path = a.getValue();
      this.helper.maskLoading(this);
      this.sendWebAPI(
        Ext.apply(
          {
            scope: this,
            callback: function (e, d) {
              this.helper.unmask(this);
              if (!e) {
                this.owner
                  .getMsgBox()
                  .alert(
                    "",
                    this.helper.getError(
                      d.code,
                      this.helper.shortFileSize(d.errors.minSize)
                    )
                  );
              } else {
                this.close();
              }
            },
          },
          b
        )
      );
    } else {
      this.downloadWebAPI({
        webapi: b,
        scope: this,
        callback: function (d, e, g, f) {
          this.owner.getMsgBox().alert("", this.helper.getError(f.code));
        },
      });
      this.close();
    }
  },
  onCancel: function () {
    this.close();
  },
});
Ext.define("SYNO.SDS.Docker.Utils.Shortcut", {
  extend: "Ext.util.Observable",
  helper: SYNO.SDS.Docker.Utils.Helper,
  clsName: "",
  constructor: function (a) {
    Ext.apply(this, a);
    this.addEvents("exception");
  },
  getClsName: function () {
    return this.clsName;
  },
  getInstanceAPI: function (a) {
    return {};
  },
  getInstancesListAPI: function () {
    return {};
  },
  getIconitemsName: function (a) {
    return "";
  },
  getIconParam: function (a) {
    return {};
  },
  getIconLaunchParms: function (a) {
    return {};
  },
  getIconConfig: function (a, b) {
    return {};
  },
  create: function (c, b) {
    var d = this.getIconParam(c);
    var a = this.getIconConfig(c.name, d);
    Ext.apply(a, { launchParams: this.getIconLaunchParms(d) });
    Ext.apply(a, b);
    SYNO.SDS.Desktop.addLaunchItem(a, -1, { saveState: true });
  },
  createStatusShortcut: function (a) {
    return this.create(a);
  },
  createUrlShortcut: function (b, a) {
    return this.create(b, { type: "url", url: a });
  },
});
Ext.define("SYNO.SDS.Docker.Container.Shortcut", {
  extend: "SYNO.SDS.Docker.Utils.Shortcut",
  constructor: function (a) {
    var b = { clsName: "SYNO.SDS.Docker.ContainerDetail.Instance" };
    Ext.apply(b, a);
    this.callParent([b]);
  },
  getInstanceAPI: function (a) {
    return {
      api: "SYNO.Docker.Container",
      method: "get",
      version: 1,
      params: { name: a },
    };
  },
  getInstancesListAPI: function () {
    return {
      api: "SYNO.Docker.Container",
      method: "list",
      version: 1,
      params: { offset: 0, limit: -1 },
    };
  },
  getIconParam: function (a) {
    return { data: { name: a.name } };
  },
  getIconLaunchParms: function (b) {
    var a = {};
    a[this.helper.T("shortcut", "open_status")] = b;
    return a;
  },
  getIconConfig: function (a, b) {
    return {
      className: this.getClsName(),
      icon: "images/docker_shortcut_{0}.png",
      isModule: true,
      moduleTitle: a,
      param: b,
    };
  },
  getIconitemsName: function (a) {
    return a.param.data.name;
  },
});
Ext.define("SYNO.SDS.Docker.Utils.PreserveStates", {
  extend: Object,
  constructor: function (a) {
    Ext.apply(this, a);
    this.cachedStoreData = {};
  },
  init: function (a) {
    this.dataview = a;
    var b = a.store;
    this.cacheStoreData(b);
    a.mon(b, "load", this.onStoreLoad, this);
    a.mon(b, "update", this.onStoreUpdate, this);
  },
  onStoreLoad: function (a) {
    a.each(function (b) {
      b.states = b.states || {};
      b.states.isNew = this.isNew(b);
      b.states.oldRecord = this.cachedStoreData[b.id]
        ? this.cachedStoreData[b.id].data
        : {};
    }, this);
    this.cacheStoreData(a);
  },
  onStoreUpdate: function (c, a, b) {
    if (b === Ext.data.Record.COMMIT) {
      this.cachedStoreData[a.id] = a;
    }
  },
  cacheStoreData: function (a) {
    this.cachedStoreData = {};
    a.each(function (b) {
      this.cachedStoreData[b.id] = b;
    }, this);
  },
  isNew: function (a) {
    return this.cachedStoreData[a.id] === undefined;
  },
});
Ext.define("SYNO.SDS.Docker.Container.DuplicateDialog", {
  extend: "SYNO.SDS.ModalWindow",
  helper: SYNO.SDS.Docker.Utils.Helper,
  constructor: function (a) {
    this.callParent([this.fillConfig(a)]);
  },
  fillConfig: function (a) {
    this.formPanel = this.createFormPanel(a);
    var b = {
      title: this.helper.T("container", "new_name"),
      width: 450,
      height: 220,
      minHeight: 220,
      buttons: [
        {
          xtype: "syno_button",
          text: this.helper.T("common", "cancel"),
          scope: this,
          handler: this.onCancel,
        },
        {
          xtype: "syno_button",
          btnStyle: "blue",
          text: this.helper.T("common", "apply"),
          scope: this,
          handler: this.onConfirm,
        },
      ],
      items: [this.formPanel],
    };
    Ext.apply(b, a);
    return b;
  },
  createFormPanel: function (a) {
    return new SYNO.ux.FormPanel({
      padding: 0,
      items: [
        {
          xtype: "syno_textfield",
          allowBlank: false,
          minlength: 2,
          maxlength: 64,
          name: "newname",
          fieldLabel: this.helper.T("container", "container_name"),
          validator: this.helper.containerNameValidator,
          value: a.nameDefault,
        },
        {
          xtype: "syno_displayfield",
          htmlEncode: false,
          value: String.format(
            '<span class="syno-ux-note">' +
              _T("common", "note") +
              _T("common", "colon") +
              "</span>" +
              this.helper.T("container", "duplicate_warn")
          ),
        },
      ],
    });
  },
  onConfirm: function () {
    var a = this.formPanel.form.findField("newname");
    var b = this.scope.store.data.keys;
    if (-1 !== b.indexOf(a.value)) {
      this.getMsgBox().alert(
        "",
        String.format(this.helper.T("common", "already_existed"), a.value)
      );
      return;
    }
    if (a.isValid()) {
      this.sendAPI.call(this.scope, a.value);
      this.close();
    }
  },
  onCancel: function () {
    this.close();
  },
});
Ext.define("SYNO.SDS.Docker.UrlShortcutDialog", {
  extend: "SYNO.SDS.ModalWindow",
  helper: SYNO.SDS.Docker.Utils.Helper,
  constructor: function (b) {
    Ext.apply(this, b || {});
    var a = this.createPanel();
    var c = {
      owner: this.owner,
      width: 500,
      height: 180,
      shadow: true,
      collapsible: false,
      resizable: false,
      autoScroll: false,
      constrainHeader: true,
      closeAction: "closeHandler",
      plain: true,
      title: this.helper.T("container", "create_shortcut"),
      layout: "fit",
      items: a,
      buttons: [
        {
          text: this.helper.T("common", "common_cancel"),
          scope: this,
          handler: this.closeHandler,
        },
        {
          btnStyle: "blue",
          text: this.helper.T("common", "common_submit"),
          scope: this,
          handler: this.onSubmit,
        },
      ],
      listeners: {
        afterlayout: { fn: this.onAfterLayout, scope: this, single: true },
      },
    };
    this.addEvents({ callback: true });
    this.callParent([c]);
  },
  createPanel: function () {
    var c = function (d) {
      var e = new RegExp("^(http|https)://.+", "i");
      if (!e.test(d)) {
        return _JSLIBSTR("extlang", "urlText");
      }
      return true;
    };
    var b = {
      labelWidth: 75,
      labelAlign: "top",
      trackResetOnLoad: true,
      waitMsgTarget: true,
      border: false,
      bodyStyle: "padding: 0 4px",
      autoFlexcroll: false,
      items: [
        {
          xtype: "syno_textfield",
          itemId: "url",
          fieldLabel: this.helper.T("container", "create_urlshortcut_label"),
          name: "url",
          maxlength: 255,
          anchor: "100%",
          enableKeyEvents: true,
          validator: c,
          value: location.protocol + "//" + location.hostname,
          listeners: {
            keypress: function (d, f) {
              if (f.getKey() === Ext.EventObject.ENTER) {
                this.onSubmit();
              }
            },
            buffer: 100,
            scope: this,
          },
        },
      ],
      listeners: { actionfailed: this.onActionFailed, scope: this },
    };
    var a = new SYNO.ux.FormPanel(b);
    this.panel = a;
    return a;
  },
  onAfterLayout: function () {
    this.focusEl = this.panel.form.findField("url");
    this.center();
  },
  onActionFailed: function () {
    this.closeHandler();
  },
  onShow: function () {
    this.el.center(this.owner.el);
    this.callParent(arguments);
  },
  callbackHandler: function () {
    this.fireEvent("callback");
  },
  closeHandler: function () {
    if (!this.panel.form.isDirty()) {
      this.close();
      return;
    }
    this.getMsgBox().confirm(
      "",
      this.helper.T("common", "confirm_lostchange"),
      function (a) {
        if ("yes" == a) {
          this.callbackHandler();
        } else {
          this.close();
        }
      },
      this
    );
  },
  onSubmit: function () {
    if (!this.panel || !this.panel.form.findField("url")) {
      this.closeHandler();
      return;
    }
    if (!this.panel.form.isValid()) {
      return;
    }
    var a = this.panel.form.findField("url").getValue();
    this.url = Ext.util.Format.trim(a);
    this.callbackHandler();
  },
});
Ext.define("SYNO.SDS.Docker.Container.Panel", {
  extend: "SYNO.ux.Panel",
  refreshInterval: 3000,
  dataViewAnimationDuration: 700,
  opacity: 0.5,
  helper: SYNO.SDS.Docker.Utils.Helper,
  statusUtil: SYNO.SDS.Docker.Container.StatusUtil,
  constructor: function (a) {
    this.callParent([this.fillConfig(a)]);
    this.pollingTask = this.createPollingTask();
  },
  fillConfig: function (a) {
    this.ignoreDeactivate = false;
    this.shortcutHelper = new SYNO.SDS.Docker.Container.Shortcut({
      owner: this,
    });
    this.runningIds = {};
    this.portals = [];
    this.mapContainerIdToServicePortals = {};
    this.store = this.createStore(a);
    this.view = this.createView(a);
    this.tbar = new SYNO.SDS.Docker.Container.Toolbar({
      owner: this,
      appWin: a.appWin,
      store: this.store,
    });
    this.actionGroup = this.tbar.actionGroup;
    this.actionGroupToplevel = this.tbar.actionGroupToplevel;
    this.actionGroup.dict.search.enable();
    this.restartTask = new Ext.util.DelayedTask(function () {
      this.pollingTask.restart(true);
    }, this);
    var b = Ext.apply(
      {
        tbar: this.tbar,
        layout: "fit",
        items: [this.view],
        listeners: {
          scope: this,
          activate: this.onActivate,
          deactivate: this.onDeactivate,
        },
      },
      a
    );
    return b;
  },
  createView: function (a) {
    return new SYNO.SDS.Docker.Container.ListView({
      appWin: a.appWin,
      owner: this,
      store: this.store,
      itemSelector: ".item-wrap",
      trackResetOnLoad: false,
      plugins: [
        new SYNO.SDS.Docker.Utils.PreserveStates(),
        new SYNO.ux.DataViewAnimation({
          duration: this.dataViewAnimationDuration,
        }),
        new SYNO.ux.DataViewMask({ opacity: this.opacity }),
      ],
      listeners: {
        scope: this,
        beforeselect: this.onBeforeSelect,
        selectionchange: this.onSelectionChange,
        contextmenu: this.onRowContextMenu,
        dblclick: this.btnDetails,
      },
    });
  },
  createStore: function (a) {
    var b = this;
    return new Ext.data.JsonStore({
      autoDestroy: true,
      root: "items",
      idProperty: "name",
      fields: [
        {
          name: "status",
          sortType: function (c) {
            return c === b.statusUtil.status.run
              ? 0
              : c == b.statusUtil.status.stop
              ? 1
              : 2;
          },
        },
        { name: "image" },
        {
          name: "name",
          sortType: function (c) {
            return c.toLowerCase();
          },
        },
        { name: "image" },
        { name: "cpu" },
        { name: "memory" },
        { name: "memoryPercent" },
        { name: "up_time" },
        { name: "sortIndex" },
        { name: "is_package" },
        { name: "exporting" },
        { name: "is_ddsm" },
        { name: "State" },
        { name: "portals" },
      ],
      hasMultiSort: true,
      multiSortInfo: {
        sorters: [{ field: "name", direction: "ASC" }],
        direction: "ASC",
      },
      listeners: { scope: this, datachanged: this.onStoreDataChanged },
    });
  },
  createPollingTask: function () {
    return this.addWebAPITask({
      scope: this,
      interval: this.refreshInterval,
      compound: {
        stopwhenerror: true,
        params: [
          {
            api: "SYNO.Docker.Container",
            method: "list",
            version: 1,
            params: { limit: -1, offset: 0, type: "all" },
          },
          { api: "SYNO.Docker.Container.Resource", method: "get", version: 1 },
        ],
      },
      callback: function (d, b, c, a) {
        this.helper.unmask(this.view);
        if (!b.has_fail) {
          this.loadData(b.result);
        } else {
          this.onException(b.result);
        }
      },
    });
  },
  loadPortalLink: function () {
    if (
      !SYNO.SDS.StatusNotifier.isAppEnabled("SYNO.SDS.WebStation.Application")
    ) {
      return false;
    }
    this.sendWebAPI({
      appWindow: this.appWin,
      api: "SYNO.WebStation.WebService.Portal",
      method: "list",
      version: 1,
      scope: this,
      callback: function (b, a) {
        if (!b) {
          return;
        }
        this.portals = (a && a.portals) || [];
        this.mapContainerIdToServicePortals = this.portals.reduce(function (
          d,
          c
        ) {
          if (!c.service.startsWith("Docker")) {
            return d;
          }
          var e = c.service.split("-")[1];
          if (!e) {
            return d;
          }
          var f = SYNO.SDS.WebStation.Util.genPortalLink(c);
          if (!f) {
            return d;
          }
          if (!d[e]) {
            d[e] = [];
          }
          d[e].push({ service: c.service, link: f });
          return d;
        },
        {});
      },
    });
  },
  loadData: function (a) {
    var e = a[0].data.containers,
      f = a[1].data.resources,
      b = [],
      d = {},
      c = this.actionGroup.dict.search.getValue();
    b = e.map(function (g) {
      var h = (g.services || []).reduce(function (k, j) {
        k[j.service] = true;
        return k;
      }, {});
      g.portals = g.enable_service_portal
        ? (this.mapContainerIdToServicePortals[g.id] || [])
            .filter(function (j) {
              return h[j.service];
            })
            .map(function (j) {
              return j.link;
            })
        : [];
      g.up_time = this.helper.getContainerUpTimeStr(g.up_time);
      var i = g.image.match(/^([^\/]*\.[^\/]*)\/(.*)/);
      if (i) {
        g.image = i[2];
      }
      return g;
    }, this);
    Ext.each(
      b,
      function (g, h) {
        d[g.name] = h;
      },
      this
    );
    Ext.each(
      f,
      function (g) {
        var h = d[g.name];
        if (undefined !== b[h]) {
          b[h].cpu = Ext.util.Format.round(g.cpu, 2) + "%";
          b[h].memory = this.helper.shortFileSize(g.memory);
          b[h].memoryPercent = g.memoryPercent + "%";
        }
      },
      this
    );
    this.tbar.setVisibilityMode(Ext.Element.DISPLAY);
    if (b.length > 0) {
      this.tbar.show();
    } else {
      this.tbar.hide();
    }
    this.store.loadData({ items: b });
    this.actionGroup.dict.search.setValue(c);
    this.actionGroup.dict.search.filter();
    setTimeout(
      function () {
        this.view.autoUpdateScrollbar();
      }.createDelegate(this),
      this.dataViewAnimationDuration
    );
  },
  getSelections: function () {
    return this.view.getSelectedRecords();
  },
  onStoreDataChanged: function (a) {
    var b = Object.keys(this.runningIds);
    Ext.each(
      b,
      function (c) {
        if (!a.getById(c)) {
          this.enableSelection(c);
        }
      },
      this
    );
  },
  maskRow: function (a) {
    this.view.maskItem(a);
    this.disableSelection(a);
  },
  unmaskRow: function (b) {
    this.enableSelection(b);
    try {
      this.view.unmaskItem(b);
    } catch (a) {
      SYNO.Debug(a);
    }
  },
  API: function (a) {
    var b = this.getSelections();
    Ext.each(
      b,
      function (d) {
        var c = {
          appWindow: this.appWin,
          api: a.api || "SYNO.Docker.Container",
          method: a.method,
          version: 1,
          params: { name: d.data.name },
          scope: this,
          callback: this.onAPICallback({
            selection: d,
            delayRestart: a.delayRestart,
            blockUnmask: a.blockUnmask === undefined ? false : a.blockUnmask,
            userCallback: Ext.isFunction(a.callback) ? a.callback : Ext.emptyFn,
          }),
        };
        if (undefined !== a.params) {
          Ext.apply(c.params, a.params);
        }
        this.sendWebAPI(c);
        if (!a.blockMask) {
          this.maskRow(d.id);
        }
      },
      this
    );
  },
  onAPICallback: function (a) {
    return function (e, c) {
      if (!e || !a.blockUnmask) {
        this.unmaskRow(a.selection.id);
      }
      if (!e) {
        var d = SYNO.SDS.Docker.Utils.Helper.errorMapping;
        var b = c.errors && c.errors.errors ? c.errors.errors : "";
        if (d.WEBAPI_ERR_CONTAINER_CIRCULAR_LINK === c.code) {
          this.getMsgBox().alert(
            "",
            this.helper.getError(
              c.code,
              c.errors.circular_link_criminal.bold(),
              b.bold()
            )
          );
          return;
        }
        if (d.WEBAPI_ERR_CONTAINER_NONSUPPORTED_C2_BINDS === c.code) {
          this.getMsgBox().alert(
            "",
            this.helper.getError(
              c.code,
              c.errors.c2_share_criminal.bold(),
              b.bold()
            )
          );
          return;
        }
        this.getMsgBox().alert("alert", this.helper.getError(c.code, b));
      } else {
        this.pollingTask.stop();
        a.userCallback.call(this, c, a.selection.id);
        if (a.delayRestart) {
          this.restartTask.delay(1000);
        } else {
          this.restartTask.delay(100);
        }
      }
    };
  },
  disableSelection: function (a) {
    this.view.clearSelections();
    this.runningIds[a] = true;
  },
  enableSelection: function (a) {
    delete this.runningIds[a];
  },
  btnStart: function (a, b) {
    this.API({
      method: "start",
      delayRestart: true,
      callback: function (c, e) {
        var d = this.store.getById(e);
        d.beginEdit();
        d.set("cpu", Ext.util.Format.round(c.cpu, 2) + "%");
        d.set("memory", this.helper.shortFileSize(c.memory));
        d.set("memoryPercent", c.memoryPercent + "%");
        d.set(
          "up_time",
          this.helper.getContainerUpTimeStr(new Date().getTime() - 1)
        );
        d.set("status", this.statusUtil.status.run);
        d.set("switchStatus", this.statusUtil.status.stop);
        d.commit();
        this.view.toggleBtnAnimation(e, true);
        if (c.start_dependent_container === true) {
          var f = c.dependent_container.join(", ");
          this.getMsgBox().alert(
            "",
            String.format(
              this.helper.T("container", "started_depend_containers"),
              f
            )
          );
        }
      },
    });
  },
  btnStop: function (a, b) {
    this.API({
      method: "stop",
      delayRestart: true,
      callback: function (c, e) {
        var d = this.store.getById(e);
        d.beginEdit();
        d.set("cpu", "0%");
        d.set("memoryPercent", "0%");
        d.set("status", this.statusUtil.status.stop);
        d.set("switchStatus", this.statusUtil.status.run);
        d.commit();
        this.view.toggleBtnAnimation(e, false);
      },
    });
  },
  btnRestart: function (a, b) {
    this.API({
      method: "restart",
      delayRestart: true,
      callback: function (c, e) {
        var d = this.store.getById(e);
        d.beginEdit();
        d.set("cpu", Ext.util.Format.round(c.cpu, 2) + "%");
        d.set("memory", this.helper.shortFileSize(c.memory));
        d.set("memoryPercent", c.memoryPercent + "%");
        d.set(
          "up_time",
          this.helper.getContainerUpTimeStr(new Date().getTime() - 1)
        );
        d.set("status", this.statusUtil.status.run);
        d.commit();
      },
    });
  },
  btnFstop: function (a, c) {
    var b = this;
    this.getMsgBox().confirm(
      "confirm",
      this.helper.T("container", "force_stop_confirm"),
      function (d) {
        if (d === "yes") {
          b.API({
            method: "signal",
            params: { signal: 9 },
            delayRestart: true,
            callback: function (e, g) {
              var f = this.store.getById(g);
              f.beginEdit();
              f.set("status", "stopped");
              f.commit();
            },
          });
        }
      }
    );
  },
  btnReset: function (b, d) {
    var c = this,
      e = this.getSelections()
        .map(function (f) {
          return String.format("<b>{0}</b>", f.data.name);
        })
        .join(", "),
      a = String.format(
        "{0}<br>{1}",
        String.format(
          this.helper.T("container", "clear_confirm"),
          this.getSelections().length
        ),
        e
      );
    this.getMsgBox().confirm("confirm", a, function (f) {
      if (f === "yes") {
        c.API({
          method: "delete",
          params: { force: false, preserve_profile: true },
        });
      }
    });
  },
  btnDelete: function (a, d) {
    var c = this,
      e = this.getSelections()
        .map(function (f) {
          return String.format("<b>{0}</b>", f.data.name);
        })
        .join(", "),
      b = String.format(
        "{0}<br>{1}",
        String.format(
          this.helper.T("container", "delete_confirm"),
          this.getSelections().length
        ),
        e
      );
    this.getMsgBox().confirmDelete("confirm", b, function (f) {
      if (f === "yes") {
        c.API({
          blockUnmask: true,
          method: "delete",
          params: { force: false, preserve_profile: false },
        });
      }
    });
  },
  btnDuplicate: function (b, e) {
    var d = this.getSelections(),
      c = d[0],
      a = new SYNO.SDS.Docker.Container.DuplicateDialog({
        owner: this.appWin,
        nameDefault: c.data.name + "-copy",
        scope: this,
        sendAPI: function (f) {
          this.API({
            blockMask: true,
            blockUnmask: true,
            api: "SYNO.Docker.Container.Profile",
            method: "duplicate",
            params: { new_name: f },
          });
        },
      });
    a.open();
  },
  btnEdit: function (a, b) {
    var c = this.getSelections()[0].id;
    this.ignoreDeactivate = true;
    this.appWin.openVueWindow("SYNO.SDS.Docker.Modals.EditContainer", {
      containerIdOrName: c,
    });
  },
  btnImport: function (b, c) {
    var a = new SYNO.SDS.Docker.Container.FileChooser({
      owner: this.appWin,
      panel: this,
      scope: this,
      callback: function (k, h, g, d) {
        this.helper.unmask(this);
        this.pollingTask.restart(true);
        var l = this.helper.errorMapping;
        var e = "";
        if (k) {
          var f = h.conflict_port;
          if (f === undefined || f.length === 0) {
            return;
          }
          if (f.length === 1) {
            e = String.format(
              this.helper.T("error", "remap_container_conflict_port"),
              f[0]
            );
          } else {
            e = String.format(
              this.helper.T("error", "remap_container_conflict_ports"),
              f.join(", ")
            );
          }
          this.getMsgBox().alert("", e);
          return;
        } else {
          var i = h.errors ? h.errors.errors : "";
          if (
            l.WEBAPI_ERR_IMAGE_CREATE_PARSE_FAIL === h.code ||
            l.WEBAPI_ERR_BROKEN_PROFILE === h.code ||
            l.WEBAPI_ERR_ILLEGAL_FILE === h.code ||
            l.WEBAPI_ERR_DOCKER_API_FAIL_LOG === h.code ||
            l.WEBAPI_ERR_DOCKER_UNKOWN === h.code
          ) {
            var j = "";
            if (g && g.path) {
              j = g.path.substr(g.path.lastIndexOf("/") + 1);
            } else {
              if (h.errors && h.errors.filename) {
                j = h.errors.filename;
              }
            }
            i = "<b>" + j + "</b>";
          }
          if (l.WEBAPI_ERR_CONTAINER_IMPORT_IMAGE_ONLY === h.code) {
            e = this.helper.T("notification", "import_image");
          } else {
            if (l.WEBAPI_ERR_DOCKER_API_FAIL_LOG === h.code) {
              e = String.format(
                this.helper.T("error", "import_failed_with_log"),
                i
              );
            } else {
              if (l.WEBAPI_ERR_DOCKER_UNKOWN === h.code) {
                e = String.format(this.helper.T("error", "import_failed"), i);
              } else {
                e = this.helper.getError(h.code, i);
              }
            }
          }
          this.getMsgBox().alert("", e);
          return;
        }
      },
    });
    a.show();
  },
  btnExport: function (a, b) {
    var d = this.getSelections()[0].id;
    var c = new SYNO.SDS.Docker.Container.ExportContainerWizard({
      owner: this.appWin,
      containerName: d,
    });
    c.open();
  },
  btnCreate: function (a, c) {
    var b = this.appWin.openVueWindow(
      "SYNO.SDS.Docker.Wizards.CreateContainer"
    ).window;
    b.$on(
      "close",
      function (d) {
        if (d.payload && d.payload.switchToRegistryPage) {
          this.appWin.selectPage("SYNO.SDS.Docker.Registry.Panel");
        }
      }.bind(this)
    );
  },
  btnDetails: function (a, c) {
    var b = this.getSelections();
    if (b.length !== 1 || b[0].data.is_ddsm === true) {
      return;
    }
    SYNO.SDS.AppLaunch("SYNO.SDS.Docker.ContainerDetail.Instance", b[0], true);
  },
  btnCreateStatusShortcut: function (a, c) {
    var b = this.getSelections()[0];
    if (typeof b === "undefined") {
      return;
    }
    this.shortcutHelper.createStatusShortcut(b.json);
  },
  btnCreateUrlShortCut: function (c, e) {
    var d = this.getSelections()[0];
    if (typeof d === "undefined") {
      return;
    }
    var a = this.shortcutHelper;
    var b = new SYNO.SDS.Docker.UrlShortcutDialog({ owner: this.appWin });
    b.mon(b, "callback", function () {
      a.createUrlShortcut(d.json, this.url);
      this.close();
    });
    b.show();
  },
  getMsgBox: function () {
    this.ignoreDeactivate = true;
    return this.appWin.getMsgBox();
  },
  onBeforeSelect: function (d, c, b) {
    var a = this.view.getRecord(c).id;
    if (this.runningIds[a]) {
      return false;
    }
    return true;
  },
  onSelectionChange: function () {
    var b = this.getSelections(),
      a;
    this.actionGroup.disableAll();
    switch (b.length) {
      case 0:
        this.onSelection(this.statusUtil.statusCode.unselected);
        break;
      case 1:
        a = b[0].data.status;
        this.onSelection(this.statusUtil.stat2StatCode(b[0].data));
        break;
      default:
        this.onSelectionMultiple(b);
    }
  },
  onSelection: function (b) {
    var a = this.actionGroup;
    Ext.each(a.getArray(), function (d) {
      var c = d.initialConfig.enableStatus & b,
        e =
          d.initialConfig.disableStatus !== undefined &&
          d.initialConfig.disableStatus & b;
      if (c && !e) {
        d.enable();
      }
    });
  },
  onSelectionMultiple: function (a) {
    var b = a.reduce(
      function (d, e) {
        var c = this.statusUtil.stat2StatCode(e.data);
        if (d.indexOf(c) == -1) {
          d.push(c);
        }
        return d;
      }.createDelegate(this),
      []
    );
    Ext.each(this.actionGroup.getArray(), function (c) {
      var d = b.reduce(function (g, f) {
        var e = c.initialConfig.enableStatus & f,
          h =
            c.initialConfig.disableStatus !== undefined &&
            c.initialConfig.disableStatus & f;
        return g && e && !h && !c.initialConfig.denyMultiple;
      }, true);
      if (d) {
        c.enable();
      }
    });
  },
  onRowContextMenu: function (b, f, c, d) {
    this.view.select(f);
    var a = this.actionGroupToplevel.getArray().filter(function (g) {
        return !g.initialConfig.disabled;
      }),
      e = new SYNO.ux.Menu({ autoDestroy: true, items: a });
    e.showAt(d.getXY());
    d.preventDefault();
  },
  onException: function (a) {
    Ext.each(
      a,
      function (b) {
        if (!b.success) {
          this.helper.logError(b.error.code);
        }
      },
      this
    );
  },
  onActivate: function () {
    this.helper.resizePanel(this);
    if (!this.ignoreDeactivate) {
      this.helper.maskLoadingOnce(this.view, this);
      this.pollingTask.start(true);
    }
    this.loadPortalLink();
    this.ignoreDeactivate = false;
  },
  onDeactivate: function () {
    if (!this.ignoreDeactivate) {
      this.portals = [];
      this.pollingTask.stop();
    }
  },
});
Ext.define("SYNO.SDS.Docker.Registry.TagDialog", {
  extend: "SYNO.SDS.ModalWindow",
  helper: SYNO.SDS.Docker.Utils.Helper,
  constructor: function (a) {
    this.callParent([this.fillConfig(a)]);
  },
  fillConfig: function (a) {
    this.store = this.createTagStore(a);
    this.formPanel = this.createFormPanel(a);
    var b = {
      title: this.helper.T("registry", "choose_tag"),
      width: 450,
      height: 170,
      buttons: [
        {
          xtype: "syno_button",
          text: this.helper.T("common", "cancel"),
          scope: this,
          handler: this.onCancel,
        },
        {
          xtype: "syno_button",
          btnStyle: "blue",
          text: this.helper.T("common", "choose"),
          scope: this,
          handler: this.onChoose,
        },
      ],
      items: [this.formPanel],
      listeners: {
        scope: this,
        beforeshow: { single: true, fn: this.onBeforeShow },
      },
      scope: this,
    };
    Ext.apply(b, a);
    return b;
  },
  createTagStore: function (a) {
    return new SYNO.API.JsonStore({
      appWindow: a.owner,
      autoDestroy: true,
      fields: [{ name: "tag", mapping: "tag" }],
      api: "SYNO.Docker.Registry",
      method: "tags",
      version: 1,
      scope: this,
      baseParams: a.query,
      timeout: 5 * 60,
      listeners: {
        scope: this,
        load: this.onLoad,
        exception: this.onException,
      },
    });
  },
  createFormPanel: function (a) {
    return new SYNO.ux.FormPanel({
      padding: 0,
      items: [
        {
          xtype: "syno_combobox",
          typeAhead: true,
          forceSelection: true,
          allowBlank: false,
          triggerAction: "all",
          displayField: "tag",
          name: "tag",
          store: this.store,
          fieldLabel: this.helper.T("registry", "choose_tag_instruction"),
        },
      ],
    });
  },
  onChoose: function (a) {
    this.chooseHandler.call(
      this.scope,
      this.query,
      this.formPanel.getForm().getValues().tag
    );
    this.close();
  },
  onCancel: function (a) {
    this.close();
  },
  onBeforeShow: function () {
    this.store.load();
    return false;
  },
  onLoad: function (a) {
    if (this.owner._isVue ? this.owner._isDestroyed : this.owner.isDestroyed) {
      this.close();
      return;
    }
    if (_S("demo_mode")) {
      this.owner
        .getMsgBox()
        .alert(
          this.helper.T("error", "error_error"),
          this.helper.T("registry", "demo_cannot_download")
        );
      this.close();
      return;
    }
    if (this.store.data.length === 0) {
      this.owner
        .getMsgBox()
        .alert(
          this.helper.T("error", "error_error"),
          this.helper.T("error", "image_no_tag")
        );
      this.close();
      return;
    }
    this.formPanel.getForm().setValues(this.store.getAt(0).data);
    if (this.store.data.length === 1) {
      this.onChoose();
    } else {
      this.show();
    }
  },
  onException: function (d, a, e, b, c) {
    if (true === c.isTimeout) {
      this.owner
        .getMsgBox()
        .alert("", this.helper.T("error", "session_expired"));
    } else {
      this.owner
        .getMsgBox()
        .alert(
          this.helper.T("error", "error_error"),
          this.helper.getError(c.code)
        );
    }
    this.close();
  },
});
Ext.define("SYNO.SDS.Docker.Image.AddFromUrlDialog", {
  extend: "SYNO.SDS.ModalWindow",
  helper: SYNO.SDS.Docker.Utils.Helper,
  dockerHubHelper: SYNO.SDS.Docker.Utils.DockerHub,
  constructor: function (a) {
    this.callParent([this.fillConfig(a)]);
  },
  fillConfig: function (a) {
    this.formPanel = this.createFormPanel();
    var b = {
      title: this.helper.T("image", "add_from_url"),
      layout: "fit",
      width: 460,
      height: 370,
      items: [this.formPanel],
      buttons: [
        {
          xtype: "syno_button",
          text: this.helper.T("common", "cancel"),
          scope: this,
          handler: this.onCancelClick,
        },
        {
          xtype: "syno_button",
          btnStyle: "blue",
          text: this.helper.T("common", "add"),
          scope: this,
          handler: this.onAddClick,
        },
      ],
    };
    Ext.apply(b, a);
    return b;
  },
  createFormPanel: function () {
    var b = new SYNO.ux.FieldSet({
      title: this.helper.T("registry", "url"),
      collapsible: false,
      items: [
        {
          xtype: "syno_textfield",
          name: "url",
          allowBlank: false,
          fieldLabel: this.helper.T("image", "image_url_instruction"),
        },
      ],
    });
    var a = new SYNO.ux.FieldSet({
      title: this.helper.T("common", "optional"),
      collapsible: false,
      items: [
        {
          xtype: "syno_textfield",
          name: "username",
          fieldLabel: this.helper.T("registry", "username_optional"),
        },
        {
          xtype: "syno_textfield",
          name: "password",
          textType: "password",
          fieldLabel: this.helper.T("registry", "password_optional"),
        },
        {
          xtype: "syno_checkbox",
          name: "enable_trust_SSC",
          boxLabel: this.helper.T("registry", "trust_ssc"),
        },
      ],
    });
    return new SYNO.ux.FormPanel({ items: [b, a] });
  },
  onAddClick: function () {
    if (!this.formPanel.getForm().isValid()) {
      return;
    }
    var c = this.formPanel.getForm().getValues();
    var b = null;
    c.enable_trust_SSC = c.enable_trust_SSC == "true";
    if (0 === c.url.indexOf("https://hub.docker.com")) {
      c.url = c.url.replace(
        "https://hub.docker.com",
        "https://registry.hub.docker.com"
      );
    }
    if ((b = c.url.match(this.dockerHubHelper.repoRegex))) {
      c.url = b[1];
      c.repo = b[2].replace(/^_\//, "");
    } else {
      if (
        Ext.form.VTypes.url(c.url) &&
        (b = c.url.match(
          /(.*)v1\/repositories\/([A-Za-z0-9_-]+\/?[A-Za-z0-9_-]*)\/?$/
        ))
      ) {
        c.url = b[1];
        c.repo = b[2];
      } else {
        if ((b = c.url.match(/^([A-Za-z0-9_-]+\/?[A-Za-z0-9_-]*)\/?$/))) {
          c.url = "https://" + this.dockerHubHelper.domain;
          c.repo = b[1];
        } else {
          if (
            (b = c.url.match(
              /^((?:https?:\/\/)?[^\/]*)\/([A-Za-z0-9_-]+\/?[A-Za-z0-9_-]*)\/?$/
            ))
          ) {
            c.url = /^http/.test(b[1]) ? b[1] : "http://" + b[1];
            c.repo = b[2];
          } else {
            this.owner
              .getMsgBox()
              .alert(
                this.helper.T("error", "error_error"),
                String.format(
                  this.helper.T("image", "invalid_registry_url"),
                  c.url
                )
              );
            return;
          }
        }
      }
    }
    this.helper.maskLoading(this);
    var a = new SYNO.SDS.Docker.Registry.TagDialog({
      owner: this,
      query: c,
      scope: this,
      chooseHandler: this.onTagChoose,
    });
    this.waitPullImage = false;
    this.mon(a, "close", this.onTagDialogClose, this);
    a.open();
  },
  onCancelClick: function () {
    this.close();
  },
  onTagChoose: function (c, a) {
    var b = this.formPanel.getForm().getValues();
    var d = {
      tag: a,
      repository: c.repo,
      registry: c.url,
      username: b.username,
      password: b.password,
    };
    this.sendWebAPI({
      api: "SYNO.Docker.Image",
      method: "pull_start",
      version: 1,
      scope: this,
      callback: this.onPullImageCallback,
      params: d,
    });
    this.waitPullImage = true;
  },
  onTagDialogClose: function () {
    if (!this.waitPullImage) {
      this.helper.unmask(this);
    }
  },
  onPullImageCallback: function (c, b, a) {
    if (!c) {
      this.owner
        .getMsgBox()
        .alert(
          this.helper.T("error", "error_error"),
          b.errors || this.helper.T("error", "error_error_system")
        );
      this.helper.unmask(this);
      return;
    }
    this.close();
  },
});
Ext.define("SYNO.SDS.Docker.Image.AddFromFileDialog", {
  extend: "SYNO.SDS.Docker.Utils.FileChooser",
  helper: SYNO.SDS.Docker.Utils.Helper,
  constructor: function (a) {
    this.callParent([
      Ext.apply(
        {
          webapi: {
            uploader: {
              api: "SYNO.Docker.Image",
              method: "upload",
              version: 1,
            },
            chooser: { api: "SYNO.Docker.Image", method: "import", version: 1 },
          },
          listeners: {
            scope: this,
            close: function () {
              if (!a.imagePanel._isVue) {
                a.imagePanel.focus();
              }
            },
          },
        },
        a
      ),
    ]);
    this.mon(this, "choose", this._onChoose, this);
  },
  callback: function (f, a, e, c) {
    if (!this.imagePanel._isVue) {
      this.helper.unmask(this.imagePanel);
    }
    if (!f) {
      var b = "";
      if (1403 === a.code || 1004 === a.code || 1202 === a.code) {
        var g = "";
        if (e && e.path) {
          g = e.path.substr(e.path.lastIndexOf("/") + 1);
        } else {
          if (a.errors && a.errors.filename) {
            g = a.errors.filename;
          }
        }
        b = "<b>" + g + "</b>";
      }
      var d = "";
      if (1004 === a.code) {
        d = String.format(this.helper.T("error", "import_failed_with_log"), b);
      } else {
        if (1202 === a.code) {
          d = String.format(this.helper.T("error", "import_failed"), b);
        } else {
          d = this.helper.getError(a.code, b);
        }
      }
      if (this.imagePanel._isVue) {
        this.imagePanel
          .getMsgBox({ width: "auto" })
          .alert("", d, {}, { isHtmlContent: true });
      } else {
        this.imagePanel.appWin.getMsgBox().alert("", d);
      }
    }
  },
  applyHandler: function () {
    if (this.grid.isVisible()) {
      this.callParent(arguments);
      return;
    }
    var a = this.fileUploadButton.getValue();
    if (!a) {
      this.getMsgBox().alert(
        "",
        _T("service", "service_file_nofileselected_tip")
      );
      return;
    }
    this.callParent(arguments);
    return;
  },
  _onChoose: function () {
    if (!this.imagePanel._isVue) {
      this.helper.maskLoading(this.imagePanel);
    }
  },
});
Ext.namespace("SYNO.SDS.Docker.Utils");
SYNO.SDS.Docker.Utils.AliyunHub = {
  shortname: "Aliyun Hub",
  domain: "dev.aliyun.com",
  linkUrl: "dev.aliyun.com/detail.html?&repoId=",
  repoDomainSuffix: "aliyuncs.com",
  isAliyunHubShortName: function (a) {
    return this.shortname === a;
  },
  isAliyunHub: function (a) {
    return "https://" + this.domain === a;
  },
  isAliyunRelated: function (a) {
    return -1 === a.indexOf(this.repoDomainSuffix) ? false : true;
  },
  toAliyunUrl: function (b) {
    var a = b.split(this.repoDomainSuffix);
    return this.domain + a[1];
  },
  formAliyunHubUrl: function (a) {
    if (!a || 0 === a.length) {
      return null;
    }
    return String.format("https://{0}{1}", this.linkUrl, a);
  },
};
Ext.define("SYNO.SDS.Docker.Image.Wizard", {
  extend: "SYNO.SDS.Wizard.ModalWindow",
  helper: SYNO.SDS.Docker.Utils.Helper,
  aliyunHubHelper: SYNO.SDS.Docker.Utils.AliyunHub,
  constructor: function (a) {
    Ext.apply(this, new SYNO.SDS.Docker.Container.ProfileUI());
    this.data = { image: a.image, network: [{ name: "bridge" }] };
    this.shortcut = {};
    this.owner = a.owner;
    this.is_create = true;
    this.callParent([this.fillConfig(a)]);
    this.fillDefaultSettings(a);
    if (a.default_name) {
      this.getStep("first_step")
        .form.findField("name")
        .setValue(a.default_name);
    } else {
      this.getStep("first_step").form.findField("name").focus(true, 350);
    }
  },
  fillConfig: function (b) {
    this.shortcutHelper = new SYNO.SDS.Docker.Container.Shortcut({
      owner: this,
    });
    var c = [];
    var f = "";
    var e = b.image;
    if (this.aliyunHubHelper.isAliyunRelated(e)) {
      var a = e.split("aliyuncs.com/");
      e = a[1];
    }
    f = e.split(":")[0] + "(" + e.split(":")[1] + ")";
    c = c.concat([
      this.getFirstStep({
        itemId: "first_step",
        nextId: "summary_step",
        image_config: b.image_config,
      }),
      this.getSummaryStep({ itemId: "summary_step" }),
    ]);
    var d = {
      cls: "syno-sds-docker-profile",
      title: String.format(
        this.helper.T("wizard", "create_container_imageinfo"),
        f
      ),
      width: 700,
      height: 500,
      steps: c,
    };
    Ext.apply(d, b);
    return d;
  },
  getFirstStep: function (a) {
    var b = [];
    Ext.apply(a, { mem_max_mb: this.helper.getRealMemory() });
    b = b.concat(this.getNameCfg());
    b.push({ xtype: "syno_displayfield" });
    b = b.concat(this.getCapabilityCfg(a, this));
    b = b.concat(this.getCapabilitiesCfg());
    b = b.concat(this.getResourceCfg(a));
    b.push({ xtype: "syno_displayfield" });
    b = b.concat([
      {
        xtype: "syno_button",
        text: this.helper.T("wizard", "advance_setting"),
        scope: this,
        handler: this.getAdvanceWindow,
      },
    ]);
    var c = Ext.apply(
      {
        headline: this.helper.T("helptoc", "general_settings"),
        xtype: "syno_formpanel",
        border: false,
        items: b,
        padding: "24px 0 0 0",
        activate: function () {
          var d = this.owner.refreshData();
          this.owner.setNameValue(this, d);
          this.owner.enableResourceGroup(this);
          this.owner.setResourceValue(this, d);
        },
        getNext: function () {
          if (
            false === this.owner.validateName(this, true) ||
            false === this.owner.validateResource(this)
          ) {
            this.owner.setStatusError({ text: _T("common", "forminvalid") });
            return false;
          }
          if (
            !this.owner.data.entrypoint_default &&
            ((!this.owner.data.cmd_default && !this.owner.data.cmd) ||
              (this.owner.data.cmd && Ext.isEmpty(this.owner.data.cmd.trim())))
          ) {
            var d = this.owner.getAdvanceWindow();
            var e = d.panel.items.get("environment").form;
            d.panel.setActiveTab("environment");
            e.findField("cmd").focus();
            return false;
          }
          return this.nextId;
        },
      },
      a
    );
    return c;
  },
  getSummaryStep: function (a) {
    var b = [];
    b = b.concat([
      this.getSummaryGrid({ enableHdMenu: false, anchor: "100% 92%" }),
      {
        xtype: "syno_checkbox",
        anchor: "100% 8%",
        boxLabel: this.helper.T("wizard", "run_immediately"),
        checked: true,
        name: "is_run_instantly",
      },
    ]);
    var c = Ext.apply(
      {
        xtype: "syno_formpanel",
        headline: this.helper.T("wizard", "summary"),
        items: b,
        layout: "anchor",
        padding: "16px 0 0 0",
        height: 330,
        activate: function () {
          var d = this.owner.refreshData();
          d = Object.assign({}, d, {
            CapAdd: d.privileged ? null : d.CapAdd,
            CapDrop: d.privileged ? null : d.CapDrop,
          });
          this.owner.loadSummaryGrid(d);
        },
        getNext: function () {
          var d = this.owner.refreshData();
          d = Object.assign({}, d, {
            CapAdd: d.privileged ? [] : d.CapAdd,
            CapDrop: d.privileged ? [] : d.CapDrop,
          });
          var e = {
            profile: d,
            is_run_instantly: this.form
              .findField("is_run_instantly")
              .getValue(),
          };
          this.owner.helper.mask(
            this.owner,
            this.owner.helper.T("wizard", "applying")
          );
          this.sendWebAPI({
            api: "SYNO.Docker.Container",
            method: "create",
            version: 1,
            params: e,
            scope: this,
            callback: function (k, g, i) {
              this.owner.getEl().unmask();
              var h = SYNO.SDS.Docker.Utils.Helper.errorMapping;
              var j;
              if (k) {
                if (
                  g &&
                  true === g.start_dependent_container &&
                  g.dependent_container
                ) {
                  j = this.owner.helper.T(
                    "container",
                    "started_depend_containers"
                  );
                  j = String.format(j, g.dependent_container.join(", "));
                  this.owner.getMsgBox().alert(
                    "",
                    j,
                    function () {
                      this.owner.close();
                    },
                    this
                  );
                } else {
                  this.owner.close();
                }
                var f = this.owner.shortcut;
                if (f && f.enable_shortcut) {
                  if (f.enable_status_page) {
                    this.owner.shortcutHelper.createStatusShortcut(e.profile);
                  }
                  if (f.enable_web_page) {
                    this.owner.shortcutHelper.createUrlShortcut(
                      e.profile,
                      f.web_page_url
                    );
                  }
                }
                return;
              }
              j = this.owner.getErrorMsg(g, i);
              if (h.WEBAPI_ERR_DOCKER_API_FAIL_LOG === g.code) {
                this.owner.owner.getMsgBox().alert("", j);
                this.owner.close();
                return;
              }
              if (h.WEBAPI_ERR_CONTAINER_CIRCULAR_LINK === g.code) {
                j = this.owner.helper.getError(
                  g.code,
                  g.errors.circular_link_criminal.bold(),
                  g.errors.errors.bold()
                );
              }
              this.owner.getMsgBox().alert(
                "",
                j,
                function (m) {
                  var n = this.wizard.getStep("first_step");
                  var l;
                  if (h.WEBAPI_ERR_CONTAINER_PORT_CONFLICT === this.resp.code) {
                    l = this.wizard.getAdvanceWindow();
                    l.panel.setActiveTab("port");
                  }
                  if (
                    h.WEBAPI_ERR_DOCKER_FILE_EXIST === this.resp.code ||
                    h.WEBAPI_ERR_DOCKER_UNKOWN === this.resp.code
                  ) {
                    n.mon(
                      n,
                      "activate",
                      function (o) {
                        o.form.findField("name").focus(true);
                      },
                      this,
                      { single: true }
                    );
                    this.wizard.goBack();
                  }
                  if (h.WEBAPI_ERR_CONTAINER_CIRCULAR_LINK === this.resp.code) {
                    l = this.wizard.getAdvanceWindow();
                    l.panel.setActiveTab("links");
                  }
                  if (
                    h.WEBAPI_ERR_CONTAINER_UNKNOWN_CAPABILITY === this.resp.code
                  ) {
                    this.wizard.openCapabilitiesWindow();
                  }
                },
                { wizard: this.owner, resp: g },
                g
              );
            },
          });
          return false;
        },
      },
      a
    );
    return c;
  },
  getAdvanceWindow: function () {
    var a = new SYNO.SDS.Docker.Image.WizardAdvance({
      data: this.data,
      shortcut: this.shortcut,
      image_config: this.image_config,
      is_create: true,
      owner: this,
    });
    a.open();
    a.mon(
      a,
      "close",
      function () {
        this.getStep("summary_step").activate();
      },
      this
    );
    return a;
  },
  getCapabilitiesCfg: function () {
    var a = this.helper.T("container", "custom_capabilities_tip");
    this.capbilitiesButton = new SYNO.ux.Button({
      xtype: "syno_button",
      text: this.helper.T("container", "custom_capabilities"),
      indent: 1,
      scope: this,
      handler: this.openCapabilitiesWindow,
      listeners: {
        afterrender: function (b) {
          setTimeout(
            function () {
              var c = SYNO.ux.AddTip(this.getEl(), a);
              this.capbilitiesButtonTip = Ext.getCmp(c.id);
            }.bind(this),
            0
          );
        },
        enable: function () {
          this.capbilitiesButtonTip.enable();
        },
        disable: function () {
          this.capbilitiesButtonTip.disable();
        },
      },
    });
    return this.capbilitiesButton;
  },
  openCapabilitiesWindow: function () {
    var a = this.openVueWindow("SYNO.SDS.Docker.Modals.Capabilities", {
      defaultCapAdd: this.data.CapAdd || [],
      defaultCapDrop: this.data.CapDrop || [],
    }).window;
    a.$on(
      "close",
      function (b) {
        this.data.CapAdd = (b.payload && b.payload.CapAdd) || this.data.CapAdd;
        this.data.CapDrop =
          (b.payload && b.payload.CapDrop) || this.data.CapDrop;
      }.bind(this)
    );
  },
  refreshData: function (c) {
    var b = this.getStep("first_step");
    Ext.apply(this.data, this.getNameValue(b));
    Ext.apply(this.data, this.getResourceValue(b));
    Ext.apply(this.data, this.getCapabilityValue(b));
    if (c) {
      if (c.shortcut) {
        var a = c.shortcut;
        delete c.shortcut;
        Ext.apply(this.shortcut, a);
      }
      Ext.apply(this.data, c);
      this.setNameValue(b, this.data);
      this.enableResourceGroup(b);
      this.setResourceValue(b, this.data);
      this.setCapabilityValue(b, this.data);
    }
    return this.data;
  },
  getSteps: function (a) {
    return this.items.itemAt(0).items.get(a);
  },
  fillDefaultSettings: function (b) {
    if (!b || !b.image_config) {
      return;
    }
    if (b.image_config.ports && 0 < b.image_config.ports.length) {
      var a = [];
      Ext.each(b.image_config.ports, function (c) {
        a.push({
          host_port: 0,
          container_port: parseInt(c.port, 10),
          type: c.protocol,
          fixed: false,
        });
      });
      this.data.port_bindings = a;
    }
    if (b.image_config.env && 0 < b.image_config.env.length) {
      this.data.env_variables = b.image_config.env;
    }
    if (b.image_config.cmd && 0 < b.image_config.cmd.length) {
      this.data.cmd_default = b.image_config.cmd.join(" ");
    }
    if (b.image_config.entrypoint && 0 < b.image_config.entrypoint.length) {
      this.data.entrypoint_default = b.image_config.entrypoint.join(" ");
    }
  },
});
Ext.define("SYNO.SDS.Docker.Image.ListView", {
  extend: "SYNO.ux.ExpandableListView",
  helper: SYNO.SDS.Docker.Utils.Helper,
  dockerHubHelper: SYNO.SDS.Docker.Utils.DockerHub,
  aliyunHubHelper: SYNO.SDS.Docker.Utils.AliyunHub,
  constructor: function (a) {
    var b = Ext.apply(
      {
        trackResetOnLoad: false,
        itemSelector: ".item-wrap",
        cls: "syno-sds-docker-image-list",
        customizeEmptyText: this.helper.T("image", "image_empty"),
      },
      a
    );
    this.callParent([b]);
    this.addTplRenderer();
  },
  createTpl: function () {
    return new Ext.XTemplate(
      '<tpl for=".">',
      '<div class="item-wrap {cls}">',
      '<div class="item-summary docker-image-summary">',
      "<div>",
      "{[this.genRepositroy(values)]}",
      "{[this.genRegistry(values)]}",
      "</div>",
      "</div>",
      '<div class="item-detail" ext:qtip="{description}">{description}</div>',
      '<div class="item-info-link">',
      "{[this.genLink(values)]}",
      "</div>",
      '<div class="x-clear"></div>',
      "</div>",
      "</tpl>"
    );
  },
  addTplRenderer: function () {
    var a = this.tpl;
    var b = this;
    a.genRepositroy = function (e) {
      var g = e.fixd_repository ? e.fixd_repository : e.repository;
      var d = e.registry;
      var h = e.created
        ? "<div class='item-vsize'>" + e.virtual_size + "</div>"
        : "<div class='item-vsize item-downloading' ext:qtip='" +
          b.helper.T("image", "downloading_text") +
          "'>" +
          e.virtual_size +
          "</div>";
      if (d && d.length !== 0) {
        g = g.substr(d.length + 1);
      }
      var f = [e.tag];
      if (e.tags) {
        f = e.tags;
      }
      var c = String.format(
        '<p class="item-action">{0}</p>',
        e.exporting ? b.helper.T("container", "exporting") : ""
      );
      return String.format(
        '<div class="item-title"> <h ext:qtip={0}>{0}:{1}</h> {2}{3}</div>',
        g,
        f.join(" | "),
        h,
        c
      );
    };
    a.genRegistry = function (d) {
      var c = d.registry;
      var f = null;
      if (b.aliyunHubHelper.isAliyunRelated(c)) {
        c = b.aliyunHubHelper.toAliyunUrl(c);
      }
      if (b.owner.registryMap && (f = b.owner.registryMap[c])) {
        c = f;
      }
      var e = b.helper.T("common", "registry") + ": " + c;
      return String.format(
        '<div class="item-status" ext:qtip="{0}">{0}</div>',
        e
      );
    };
    a.genLink = function (d) {
      var e = d.fixd_repository ? d.fixd_repository : d.repository;
      var c = d.registry;
      var f = "";
      if (c && c.length !== 0) {
        e = e.substr(c.length + 1);
      }
      if (b.dockerHubHelper.isDockerHub(d.registry)) {
        f = String.format(
          '<a class="item-link" href="{0}" target="blank"></a>',
          b.dockerHubHelper.formDockerHubUrl(e)
        );
      } else {
        if (b.aliyunHubHelper.isAliyunRelated(d.registry) && d.aliyunRepoId) {
          f = String.format(
            '<a class="item-link" href="{0}" target="blank"></a>',
            b.aliyunHubHelper.formAliyunHubUrl(d.aliyunRepoId)
          );
        }
      }
      return f;
    };
  },
});
Ext.ns("SYNO.SDS.Docker.Image");
Ext.define("SYNO.SDS.Docker.Image.Panel", {
  helper: SYNO.SDS.Docker.Utils.Helper,
  aliyunHubHelper: SYNO.SDS.Docker.Utils.AliyunHub,
  extend: "SYNO.ux.Panel",
  refreshInterval: 3000,
  constructor: function (a) {
    this.callParent([this.fillConfig(a)]);
  },
  fillConfig: function (a) {
    this.store = this.createStore();
    this.actionGroup = this.createActionGroup();
    this.tbar = this.createTBar();
    this.listView = this.createListView(a);
    this.isSkipPullListEvent = true;
    this.isSkipExportListEvent = true;
    this.sortMapper = {
      mapping: {},
      mappingDefault: 10000,
      get: function (c) {
        return undefined !== this.mapping[c]
          ? this.mapping[c]
          : this.mappingDefault;
      },
      set: function (c, d) {
        this.mapping[c] = d;
        return this;
      },
      clear: function () {
        delete this.mapping;
        this.mapping = {};
        return this;
      },
    };
    var b = {
      title: this.helper.T("common", "image"),
      tbar: this.tbar,
      layout: "fit",
      items: [this.listView],
      listeners: {
        scope: this,
        beforerender: this.onBeforeRender,
        activate: this.onActivate,
        deactivate: this.onDeactivate,
        pullList: this.onPullList,
      },
    };
    Ext.apply(b, a);
    return b;
  },
  createTBar: function () {
    return new SYNO.ux.Toolbar({
      defaultType: "syno_button",
      items: [this.actionGroup.getArray()],
    });
  },
  createActionGroup: function (b) {
    var a = new SYNO.ux.Menu({
      items: [
        {
          text: this.helper.T("image", "add_from_url"),
          itemId: "add_url",
          scope: this,
          handler: this.onAddFromUrl,
        },
        {
          text: this.helper.T("image", "add_from_file"),
          itemId: "add_file",
          scope: this,
          handler: this.onAddFromFile,
        },
      ],
    });
    return new SYNO.ux.Utils.ActionGroup([
      new Ext.Action({
        text: this.helper.T("image", "launch"),
        itemId: "launch",
        disabled: true,
        scope: this,
        handler: this.onLaunch,
      }),
      new Ext.Action({
        text: this.helper.T("common", "add"),
        itemId: "add",
        menu: a,
      }),
      new Ext.Action({
        text: this.helper.T("common", "delete"),
        itemId: "delete",
        disabled: true,
        scope: this,
        handler: this.onDelete,
      }),
      new Ext.Action({
        text: this.helper.T("common", "export"),
        itemId: "export",
        disabled: true,
        scope: this,
        handler: this.onExport,
      }),
    ]);
  },
  createStore: function (b) {
    var a = [
      "id",
      "registry",
      "repository",
      "tag",
      "created",
      "size",
      "virtual_size",
      "description",
      "sort_index",
      "tags",
      "fixd_repository",
      "exporting",
      "aliyunRepoId",
    ];
    return new Ext.data.JsonStore({
      autoDestroy: true,
      idProperty: "",
      root: "images",
      fields: a,
      sortInfo: { field: "repository", direction: "ASC" },
      hasMultiSort: true,
      multiSortInfo: {
        sorters: [
          { field: "sort_index", direction: "ASC" },
          { field: "repository" },
          { field: "tag" },
        ],
        direction: "ASC",
      },
    });
  },
  createListView: function (a) {
    return new SYNO.SDS.Docker.Image.ListView({
      panel: this,
      owner: this,
      store: this.store,
      listeners: {
        scope: this,
        selectionchange: this.onSelectionChange,
        dblclick: this.onRowDblClick,
      },
    });
  },
  onBeforeRender: function () {
    this.pollingTask = this.addWebAPITask({
      scope: this,
      interval: this.refreshInterval,
      compound: {
        stopwhenerror: true,
        params: [
          {
            api: "SYNO.Docker.Image",
            method: "list",
            version: 1,
            params: { limit: -1, offset: 0, show_dsm: false },
          },
          {
            api: "SYNO.Docker.Registry",
            method: "get",
            version: 1,
            params: { limit: -1, offset: 0 },
          },
        ],
      },
      callback: function (d, b, c, a) {
        this.helper.unmask(this.listView);
        if (!b.has_fail && b.result && b.result.length == 2) {
          this.loadData(b.result[0].data, b.result[1].data);
        } else {
          this.onException(b.result);
        }
      },
    });
    this.imageExportListPollingTask = this.addTask({
      scope: this,
      interval: this.refreshInterval,
      run: this.imageExportListPolling,
    });
  },
  requestDownloadStatus: function (a) {
    var b = a.map(function (c) {
      return {
        api: "SYNO.Docker.Image",
        method: "pull_status",
        version: 1,
        params: { task_id: c },
      };
    });
    this.sendWebAPI({
      compound: { stopwhenerror: false, params: b },
      scope: this,
      callback: function (g, e, f, d) {
        var c = false;
        this.downloadingImages = e.result
          .map(function (h) {
            if (!h.success) {
              this.helper.logError(h.error.code);
              return undefined;
            }
            if (Ext.isDefined(h.data) && h.data.finished === 1) {
              return undefined;
            }
            if (!h.data || h.data.repository === undefined) {
              c = true;
              return undefined;
            }
            return {
              repository: h.data.repository,
              tag: h.data.tag,
              virtual_size: this.helper.shortFileSize(
                parseInt(h.data.downloaded * 1024 * 1024, 10)
              ),
            };
          }, this)
          .filter(function (h) {
            return h !== undefined;
          });
        this.startPollingTaskOnce(c);
      },
    });
  },
  startPollingTaskOnce: function (a) {
    if (a) {
      this.helper.maskLoading(this.listView);
      return;
    }
    if (!this.isStartPollingTask) {
      this.isStartPollingTask = true;
      this.pollingTask.start(true);
    }
  },
  initImagePullPolling: function () {
    this.downloadingImages = [];
    this.isSkipPullListEvent = false;
    this.isStartPollingTask = false;
    this.appWin.triggerImagePullListPolling();
  },
  initImageExportPolling: function () {
    this.isSkipExportListEvent = false;
    this.imageExportListPollingTask.start(true);
  },
  imageExportListPolling: function () {
    if (this.isSkipExportListEvent) {
      return;
    }
    this.pollList({
      task_id_prefix: "SYNO_DOCKER_IMAGE_EXPORT",
      extra_group_tasks: ["admin"],
      scope: this,
      callback: function (d, b, c, a) {
        if (!d || !Ext.isArray(b.admin)) {
          this.isSkipExportListEvent = true;
          return;
        }
        this.requestExportStatus(b.admin);
      },
    });
  },
  requestExportStatus: function (a) {
    var b = a.map(function (c) {
      return {
        api: "SYNO.Docker.Image",
        method: "pull_status",
        version: 1,
        params: { task_id: c },
      };
    });
    this.sendWebAPI({
      compound: { stopwhenerror: false, mode: "parallel", params: b },
      scope: this,
      callback: function (f, d, e, c) {
        this.exportingImages = d.result
          .map(function (g) {
            if (!g.success) {
              this.helper.logError(g.error.code);
              return null;
            }
            if (Ext.isDefined(g.data) && g.data.finished === true) {
              return null;
            }
            if (
              !Ext.isDefined(g.data) ||
              g.data.repository === undefined ||
              g.data.tag === undefined
            ) {
              return null;
            }
            return { repository: g.data.repository, tag: g.data.tag };
          }, this)
          .filter(function (g) {
            return g !== null;
          });
      },
    });
  },
  destroyImagePullPolling: function () {
    this.downloadingImages = null;
    this.isSkipPullListEvent = true;
    this.isStartPollingTask = false;
    this.pollingTask.stop();
  },
  destroyImageExportPolling: function () {
    this.isSkipExportListEvent = true;
    this.imageExportListPollingTask.stop();
  },
  loadData: function (c, b) {
    if (!c || !b) {
      return;
    }
    this.registryMap = b.registries.reduce(function (e, d) {
      e[d.url.replace(/https?:\/\//, "")] = d.name;
      return e;
    }, {});
    if (this.downloadingImages) {
      c.images = c.images.concat(
        this.downloadingImages.filter(function (f) {
          var e = false;
          var d = f.repository.replace("docker.io/", "");
          c.images.forEach(function (g) {
            if (g.repository === d && g.tags.indexOf(f.tag) !== -1) {
              e = true;
              return false;
            }
          });
          return !e;
        })
      );
    }
    for (var a = 0; a < c.images.length; a++) {
      c.images[a].exporting = false;
    }
    if (this.exportingImages && this.exportingImages.length > 0) {
      Ext.each(this.exportingImages, function (e) {
        for (var d = 0; d < c.images.length; d++) {
          var f = c.images[d];
          if (
            e.repository === f.repository &&
            Ext.isArray(f.tags) &&
            -1 !== f.tags.indexOf(e.tag)
          ) {
            c.images[d].exporting = true;
            break;
          }
        }
      });
    }
    if (c.images.length !== 0) {
      c.images = c.images
        .map(function (f) {
          if (f.created) {
            f.created = this.helper.relativeTime(f.created * 1000);
            f.virtual_size = this.helper.shortFileSize(f.virtual_size, true);
          }
          if (f.tags) {
            f.tags = f.tags.sort();
            var d = f.tags.length;
            f.tag = f.tags[d - 1];
          }
          var e = f.repository.match(/^([^\/]*\.[^\/]*)\/(.*)/);
          if (e) {
            if ("docker.io" === e[1]) {
              f.fixd_repository = "registry.hub.docker.com/" + e[2];
              f.registry = "registry.hub.docker.com";
            } else {
              f.registry = e[1];
            }
          } else {
            f.fixd_repository = "registry.hub.docker.com/" + f.repository;
            f.registry = "registry.hub.docker.com";
          }
          f.sort_index = this.sortMapper.get(f.repository + ":" + f.tag);
          return f;
        }, this)
        .filter(function (d) {
          return d.repository != "<none>";
        });
    }
    this.store.loadData(c);
    this.store.each(function (d, e) {
      this.sortMapper.set(d.get("repository") + ":" + d.get("tag"), e);
    }, this);
  },
  doDelete: function () {
    var a = this.listView.getSelectedRecords();
    if (a.length === 0) {
      return;
    }
    this.helper.maskLoading(this.listView);
    this.destroyImagePullPolling();
    this.destroyImageExportPolling();
    this.sendWebAPI({
      api: "SYNO.Docker.Image",
      method: "delete",
      version: 1,
      scope: this,
      callback: function (e, b, c) {
        if (!e) {
          this.appWin.getMsgBox().alert("alert", this.helper.getError(b.code));
        } else {
          var d = "";
          Object.keys(b.image_objects).forEach(function (f) {
            var g = b.image_objects[f];
            Object.keys(g).forEach(function (h) {
              var i = g[h];
              if (this.helper.errorMapping.WEBAPI_DOCKER_SUCCESS === i.error) {
                return;
              }
              d +=
                this.helper.getError(
                  i.error,
                  "<b>" + f + ":" + h + "</b>",
                  "<b>" + i.containers.join(", ") + "</b>"
                ) + "<br />";
            }, this);
          }, this);
          if (d !== "") {
            this.appWin.getMsgBox().alert("alert", d);
          }
        }
        this.initImageExportPolling();
        this.initImagePullPolling();
      },
      params: {
        images: a.map(function (b) {
          return b.data;
        }),
      },
    });
    this.listView.clearSelections();
  },
  onException: function (a) {
    a.forEach(function (b) {
      if (!b.success) {
        this.helper.logError(b.error.code);
      }
    }, this);
  },
  onPullList: function (b, a) {
    if (this.isSkipPullListEvent) {
      return;
    }
    if (!b || !Ext.isArray(a.admin)) {
      this.downloadingImages = [];
      this.startPollingTaskOnce();
      return;
    }
    this.requestDownloadStatus(a.admin);
  },
  onActivate: function () {
    this.helper.resizePanel(this);
    this.helper.maskLoadingOnce(this.listView, this);
    this.initImagePullPolling();
    this.initImageExportPolling();
  },
  onDeactivate: function () {
    this.destroyImagePullPolling();
    this.destroyImageExportPolling();
    this.appWin.imagePullListPollingTask.stop();
    this.sortMapper.clear();
  },
  onAddFromUrl: function (b) {
    var a = new SYNO.SDS.Docker.Image.AddFromUrlDialog({ owner: this.appWin });
    a.open();
  },
  onAddFromFile: function (b) {
    var a = new SYNO.SDS.Docker.Image.AddFromFileDialog({
      owner: this.appWin,
      imagePanel: this,
    });
    a.open();
  },
  onDelete: function () {
    var d = this;
    var c = this.listView.getSelectedRecords();
    if (c.length === 0) {
      return;
    }
    var b = c.map(function (e) {
      return String.format("<b>{0}:{1}</b>", e.data.repository, e.data.tag);
    });
    var a =
      String.format(this.helper.T("image", "delete_confirm"), c.length) +
      "<br>" +
      b.join("<br>");
    this.appWin.getMsgBox().confirmDelete("confirm", a, function (e) {
      if (e === "yes") {
        d.doDelete();
      }
    });
  },
  onExport: function () {
    var a = this.listView.getSelectedRecords();
    if (a.length === 0) {
      return;
    }
    this.exportDialog = new SYNO.SDS.Utils.FileChooser.Chooser({
      owner: this.appWin,
      title: _T("mediaservice", "select_folder"),
      folderToolbar: true,
      usage: { type: "chooseDir" },
      gotoPath: "/docker",
      treeFilter: function (c, b) {
        if (
          b &&
          (b.spath === "/home" ||
            b.spath === "/surveillance" ||
            b.mountType === "iso")
        ) {
          return false;
        }
        return true;
      },
      listeners: {
        scope: this,
        choose: function (d, c, b) {
          this.doExport(c.path);
        },
      },
    });
    this.exportDialog.open();
  },
  doExport: function (c) {
    var b = this.listView.getSelectedRecords();
    if (b.length !== 1) {
      return;
    }
    var a = b[0].data;
    if (c.length === 0) {
      this.exportDialog
        .getMsgBox()
        .alert("", _T("service", "warning_select_dest"));
      return;
    }
    this.helper.maskLoading(this.exportDialog);
    this.sendWebAPI({
      api: "SYNO.Docker.Image",
      method: "export",
      version: 1,
      params: { repo: a.repository, tag: a.tag, path: c },
      scope: this,
      callback: function (e, d) {
        this.helper.unmask(this.exportDialog);
        if (!e) {
          this.exportDialog
            .getMsgBox()
            .alert(
              "",
              this.helper.getError(
                d.code,
                this.helper.shortFileSize(d.errors.minSize)
              )
            );
        } else {
          this.exportingImages = this.exportingImages
            ? this.exportingImages
            : [];
          this.exportingImages.push({ repository: a.repository, tag: a.tag });
          this.exportDialog.close();
          delete this.exportDialog;
        }
      },
    });
  },
  onLaunch: function () {
    this.doLaunch();
  },
  doLaunch: function () {
    var a = this.listView.getSelectedRecords()[0];
    if (!a) {
      return;
    }
    var b = a.data.repository;
    if (a.data.tag) {
      b += ":" + a.data.tag;
    }
    this.appWin.openVueWindow("SYNO.SDS.Docker.Wizards.CreateContainer", {
      image: b,
    });
  },
  onSelectionChange: function (d) {
    var a = this.listView.getSelectedRecords();
    var b = a.filter(function (e) {
      return !e.data.created;
    });
    var c = a.filter(function (e) {
      return e.data.exporting;
    });
    if (b.length !== 0) {
      this.actionGroup.disable("delete");
      this.actionGroup.disable("launch");
      this.actionGroup.disable("export");
      return;
    }
    if (c.length !== 0) {
      this.actionGroup.disable("delete");
      if (a.length === 1) {
        this.actionGroup.enable("launch");
      } else {
        this.actionGroup.disable("launch");
      }
      this.actionGroup.disable("export");
      return;
    }
    switch (a.length) {
      case 0:
        this.actionGroup.disable("delete");
        this.actionGroup.disable("launch");
        this.actionGroup.disable("export");
        break;
      case 1:
        this.actionGroup.enable("delete");
        this.actionGroup.enable("launch");
        this.actionGroup.enable("export");
        break;
      default:
        this.actionGroup.enable("delete");
        this.actionGroup.disable("launch");
        this.actionGroup.disable("export");
    }
  },
  onRowDblClick: function () {
    var a = this.listView.getSelectedRecords()[0];
    if (!a || !a.data.created) {
      return;
    }
    this.onLaunch();
  },
});
Ext.define("SYNO.SDS.Docker.Registry.EditRegistryDialog", {
  extend: "SYNO.SDS.ModalWindow",
  helper: SYNO.SDS.Docker.Utils.Helper,
  dockerHubHelper: SYNO.SDS.Docker.Utils.DockerHub,
  fakePwd: 12345678,
  constructor: function (a) {
    this.callParent([this.fillConfig(a)]);
    this.mon(this, "afterlayout", this.createEnableGroup, this, {
      single: true,
    });
  },
  fillConfig: function (a) {
    this.formPanel = this.createFormPanel(a);
    var b = {
      title: this.helper.T("registry", "edit_registry"),
      layout: "fit",
      width: 500,
      height: 470,
      items: [this.formPanel],
      buttons: [
        {
          xtype: "syno_button",
          text: this.helper.T("common", "cancel"),
          scope: this,
          handler: this.onCancel,
        },
        {
          xtype: "syno_button",
          btnStyle: "blue",
          text: this.helper.T("registry", "confirm"),
          scope: this,
          handler: this.onConfirm,
        },
      ],
      listeners: {
        scope: this,
        afterrender: { single: true, fn: this.onAfterRender },
      },
    };
    Ext.apply(b, a);
    return b;
  },
  createFormPanel: function (a) {
    var c =
      a.record &&
      a.record.data &&
      this.dockerHubHelper.isDockerHubShortName(a.record.data.name)
        ? true
        : false;
    var d = new SYNO.ux.FieldSet({
      title: this.helper.T("registry", "site_info"),
      collapsible: false,
      items: [
        {
          xtype: "syno_textfield",
          name: "name",
          allowBlank: false,
          fieldLabel: this.helper.T("registry", "registry_name"),
          readOnly: c,
          validator: this.validateRegistryName.createDelegate(this),
        },
        {
          xtype: "syno_textfield",
          allowBlank: false,
          name: "url",
          vtype: "url",
          readOnly: c,
          fieldLabel: this.helper.T("registry", "registry_url"),
        },
        {
          xtype: "syno_checkbox",
          name: "enable_registry_mirror",
          boxLabel: this.helper.T("registry", "enable_registry_mirror"),
          hidden: !c,
        },
        {
          xtype: "syno_textfield",
          allowBlank: false,
          indent: 1,
          name: "mirror_url",
          vtype: "url",
          fieldLabel: this.helper.T("registry", "mirror_url"),
          hidden: !c,
        },
        {
          xtype: "syno_checkbox",
          name: "enable_trust_SSC",
          boxLabel: this.helper.T("registry", "trust_ssc"),
        },
      ],
    });
    var b = new SYNO.ux.FieldSet({
      title: this.helper.T("registry", "login_info"),
      collapsible: false,
      hidden: c,
      items: [
        {
          xtype: "syno_textfield",
          name: "username",
          fieldLabel: this.helper.T("registry", "username_optional"),
        },
        {
          xtype: "syno_textfield",
          textType: "password",
          name: "password",
          fieldLabel: this.helper.T("registry", "password_optional"),
          listeners: { scope: this, focus: this.onPasswordFocus },
        },
      ],
    });
    return new SYNO.ux.FormPanel({ trackResetOnLoad: true, items: [d, b] });
  },
  validateRegistryName: function (a) {
    if (this.record && this.record.data.name == a) {
      return true;
    }
    if (this.store.findExact("name", a) != -1) {
      return this.helper.T("registry", "conflict_name");
    }
    return true;
  },
  sliceLastSlashOfURL: function (a) {
    var b;
    for (b = a.length - 1; b >= 0, a[b] == "/"; b--) {}
    return a.slice(0, b + 1);
  },
  sendCreateAPI: function () {
    var a = this.formPanel.getForm().getValues();
    a.url = this.sliceLastSlashOfURL(a.url);
    a.enable_trust_SSC = a.enable_trust_SSC == "true";
    this.sendWebAPI({
      appWindow: this.owner,
      api: "SYNO.Docker.Registry",
      method: "create",
      version: 1,
      scope: this,
      callback: this.onRequestCallback,
      params: a,
    });
  },
  sendSetAPI: function (a) {
    var b = this.formPanel.getForm().getValues();
    b.url = this.sliceLastSlashOfURL(b.url);
    b.handle_mirror = a;
    b.enable_registry_mirror = b.enable_registry_mirror === "true";
    if (b.enable_registry_mirror) {
      b.mirror_url = this.sliceLastSlashOfURL(b.mirror_url);
    }
    b.enable_trust_SSC = b.enable_trust_SSC == "true";
    b.oldname = this.record.data.name;
    b.password =
      b.password == this.fakePwd && !this.isPwdEdited ? "" : b.password;
    this.sendWebAPI({
      api: "SYNO.Docker.Registry",
      method: "set",
      version: 1,
      scope: this,
      callback: this.onRequestCallback,
      params: b,
    });
  },
  sendListContAPI: function () {
    this.sendWebAPI({
      api: "SYNO.Docker.Container",
      method: "list",
      version: 1,
      params: { limit: -1, offset: 0, type: "all" },
      scope: this,
      callback: function (f, d, c) {
        var b = [];
        var a = [];
        if (!f) {
          this.getMsgBox().alert(
            this.helper.T("error", "error_error"),
            this.helper.getError(d.code)
          );
          return;
        }
        Ext.each(
          d.containers,
          function (g) {
            if ("running" === g.status) {
              a.push(g);
            }
            if (g.is_package && "running" === g.status) {
              b.push(g);
            }
          },
          this
        );
        if (!a.length) {
          this.sendSetAPI(true);
          this.helper.maskLoading(this);
          return;
        }
        if (!b.length) {
          this.getMsgBox().confirm(
            "",
            this.helper.T("registry", "restart_confirm"),
            function (g) {
              if ("yes" === g) {
                this.sendSetAPI(true);
                this.helper.maskLoading(this);
                return;
              }
            },
            this
          );
        } else {
          var e = "";
          Ext.each(
            b,
            function (g) {
              e += "<br>" + g.name;
            },
            this
          );
          this.getMsgBox().alert(
            "",
            this.helper.T("registry", "stop_pkg_container") + e
          );
        }
        return;
      },
    });
  },
  createEnableGroup: function () {
    var a;
    a = new SYNO.ux.Utils.EnableCheckGroup(
      this.formPanel.getForm(),
      "enable_registry_mirror",
      ["mirror_url"]
    );
  },
  onAfterRender: function () {
    if (this.record) {
      this.record.data.password = this.fakePwd;
      this.formPanel.getForm().setValues(this.record.data);
    }
  },
  onPasswordFocus: function (a) {
    a.setValue(null);
    this.isPwdEdited = true;
  },
  onConfirm: function (c) {
    if (!this.formPanel.getForm().isValid()) {
      return false;
    }
    if (!this.record) {
      this.helper.maskLoading(this);
      this.sendCreateAPI();
      return true;
    }
    if (!this.dockerHubHelper.isDockerHubShortName(this.record.data.name)) {
      this.helper.maskLoading(this);
      this.sendSetAPI(false);
      return true;
    }
    var a = this.formPanel.getForm().findField("enable_registry_mirror");
    var b = this.formPanel.getForm().findField("mirror_url");
    if ((a.isValid() && a.isDirty()) || (b.isValid() && b.isDirty())) {
      this.helper.maskLoading(this);
      this.sendListContAPI();
      return true;
    } else {
      this.helper.maskLoading(this);
      this.sendSetAPI(false);
      return true;
    }
  },
  onCancel: function () {
    this.close();
  },
  onRequestCallback: function (c, b, a) {
    if (!c) {
      this.owner
        .getMsgBox()
        .alert(
          this.helper.T("error", "error_error"),
          this.helper.getError(b.code)
        );
    }
    this.close();
    this.store.load();
  },
});
Ext.define("SYNO.SDS.Docker.Registry.SettingDialog", {
  extend: "SYNO.SDS.ModalWindow",
  helper: SYNO.SDS.Docker.Utils.Helper,
  dockerHubHelper: SYNO.SDS.Docker.Utils.DockerHub,
  aliyunHubHelper: SYNO.SDS.Docker.Utils.AliyunHub,
  constructor: function (a) {
    this.callParent([this.fillConfig(a)]);
  },
  fillConfig: function (a) {
    this.actionGroup = this.createActionGroup();
    this.store = this.createStore(a);
    this.gridPanel = this.createGridPanel(a);
    var b = {
      title: this.helper.T("registry", "registry_setting"),
      layout: "fit",
      width: 500,
      height: 500,
      buttons: [
        {
          xtype: "syno_button",
          text: this.helper.T("common", "close"),
          scope: this,
          handler: this.close,
        },
      ],
      items: [this.gridPanel],
      listeners: { scope: this, show: { single: true, fn: this.onShow } },
    };
    Ext.apply(b, a);
    return b;
  },
  createActionGroup: function () {
    return new SYNO.ux.Utils.ActionGroup([
      new Ext.Action({
        text: this.helper.T("common", "add"),
        itemId: "add",
        scope: this,
        handler: this.onAddClick,
      }),
      new Ext.Action({
        text: this.helper.T("common", "alt_edit"),
        itemId: "edit",
        scope: this,
        handler: this.onEditClick,
      }),
      new Ext.Action({
        text: this.helper.T("common", "delete"),
        itemId: "delete",
        scope: this,
        handler: this.onDeleteClick,
      }),
      new Ext.Action({
        text: this.helper.T("registry", "use"),
        itemId: "use",
        scope: this,
        handler: this.onUseClick,
      }),
    ]);
  },
  createTBar: function () {
    return new SYNO.ux.Toolbar({
      defaultType: "syno_button",
      items: [this.actionGroup.getArray()],
    });
  },
  createStore: function (a) {
    return new SYNO.API.JsonStore({
      autoDestroy: true,
      appWindow: a.owner,
      fields: [
        { name: "name", mapping: "name" },
        { name: "url", mapping: "url" },
        { name: "enable_registry_mirror", mapping: "enable_registry_mirror" },
        { name: "mirror_url", mapping: "mirror_url" },
        { name: "enable_trust_SSC", mapping: "enable_trust_SSC" },
        { name: "username", mapping: "username" },
        { name: "using", defaultValue: "" },
      ],
      api: "SYNO.Docker.Registry",
      method: "get",
      version: 1,
      scope: this,
      root: "registries",
      baseParams: { offset: 0, limit: -1 },
      listeners: {
        scope: this,
        load: this.onLoad,
        beforeload: this.onBeforeLoad,
        exception: this.onException,
      },
    });
  },
  createGridPanel: function (a) {
    var b = new Ext.grid.ColumnModel({
      defaults: { sortable: true },
      columns: [
        {
          header: this.helper.T("common", "repository"),
          dataIndex: "name",
          width: 30,
        },
        {
          header: this.helper.T("registry", "url"),
          dataIndex: "url",
          width: 60,
        },
        {
          header: this.helper.T("registry", "using"),
          dataIndex: "using",
          scope: this,
          width: 20,
          renderer: function (c) {
            if (c === "*") {
              return '<div class="syno-sds-docker-registry-enabled"></div>';
            }
            return c;
          },
        },
      ],
    });
    return new SYNO.ux.GridPanel({
      tbar: this.createTBar(),
      cm: b,
      height: 400,
      ds: this.store,
      enableHdMenu: false,
      selModel: new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: { scope: this, selectionchange: this.onSelectionChange },
      }),
    });
  },
  openEditDialog: function (a) {
    var b = new SYNO.SDS.Docker.Registry.EditRegistryDialog({
      owner: this,
      store: this.store,
      record: a,
    });
    b.open();
  },
  sendDeleteAPI: function (a) {
    this.sendWebAPI({
      api: "SYNO.Docker.Registry",
      method: "delete",
      version: 1,
      scope: this,
      callback: this.onRequestCallback,
      params: { name: a.data.name },
    });
  },
  sendUsingAPI: function (a) {
    this.sendWebAPI({
      api: "SYNO.Docker.Registry",
      method: "using",
      version: 1,
      scope: this,
      callback: this.onRequestCallback,
      params: { name: a.data.name },
    });
  },
  onShow: function (a) {
    this.store.load();
  },
  onAddClick: function (a, b) {
    this.openEditDialog();
  },
  onEditClick: function (a, b) {
    this.openEditDialog(this.gridPanel.getSelectionModel().getSelected());
  },
  onDeleteClick: function (b) {
    var a = this.gridPanel.getSelectionModel().getSelected();
    if (!a) {
      return;
    }
    this.sendDeleteAPI(a);
    this.helper.maskLoading(this);
  },
  onUseClick: function (b) {
    var a = this.gridPanel.getSelectionModel().getSelected();
    if (!a) {
      return;
    }
    if (a.data.using !== "") {
      return;
    }
    this.sendUsingAPI(a);
    this.helper.mask(this);
    this.searchPanel.resetSearch();
    this.searchPanel.setUsingRegistry(a.data.name);
  },
  onLoad: function (e) {
    var a = this.store.find("name", this.store.reader.jsonData.using);
    var b = this.store.getAt(a);
    var d = this;
    var c = function () {
      d.actionGroup.disable("edit");
      d.actionGroup.disable("delete");
      d.helper.unmask(d);
    };
    if (b) {
      b.set("using", "*");
      b.commit();
      c();
      return;
    }
    this.getMsgBox().alert(
      this.helper.T("error", "error_error"),
      this.helper.T("error", "error_error_system"),
      c,
      this
    );
  },
  onBeforeLoad: function (a) {
    this.helper.maskLoading(this);
  },
  onException: function (d, a, e, b, c) {
    this.helper.unmask(this);
    this.owner
      .getMsgBox()
      .alert(
        this.helper.T("error", "error_error"),
        this.helper.getError(c.code)
      );
    this.close();
  },
  onSelectionChange: function (b) {
    var c = b.getSelected();
    var d, a;
    if (!c) {
      this.actionGroup.disable("edit");
      this.actionGroup.disable("delete");
      return;
    }
    d = b.getSelected().data.name;
    a = b.getSelected().data.url;
    if (this.dockerHubHelper.isDockerHubShortName(d)) {
      this.actionGroup.enable("edit");
      this.actionGroup.disable("delete");
    } else {
      if (
        this.aliyunHubHelper.isAliyunHubShortName(d) &&
        this.aliyunHubHelper.isAliyunHub(a)
      ) {
        this.actionGroup.disable("edit");
        this.actionGroup.disable("delete");
      } else {
        this.actionGroup.enable("edit");
        this.actionGroup.enable("delete");
      }
    }
  },
  onRequestCallback: function (c, b, a) {
    if (!c) {
      this.owner
        .getMsgBox()
        .alert(
          this.helper.T("error", "error_error"),
          this.helper.getError(b.code)
        );
    }
    this.helper.unmask(this);
    this.store.load();
    this.helper.mask(this.searchPanel);
    this.searchPanel.beforeSearch = true;
    this.searchPanel.fetchUsingRegistry();
    this.helper.unmask(this.searchPanel);
  },
});
Ext.define("SYNO.SDS.Docker.Registry.ListView", {
  extend: "SYNO.ux.ExpandableListView",
  helper: SYNO.SDS.Docker.Utils.Helper,
  dockerHubHelper: SYNO.SDS.Docker.Utils.DockerHub,
  aliyunHubHelper: SYNO.SDS.Docker.Utils.AliyunHub,
  constructor: function (a) {
    var b = Ext.apply({ cls: "syno-sds-docker-registry-list" }, a);
    this.callParent([b]);
    this.addTplRenderer();
  },
  createTpl: function () {
    return new Ext.XTemplate(
      '<tpl for=".">',
      '<div class="item-wrap {cls}">',
      '<div class="item-info-summary">',
      '<div class="item-summary docker-registry-summary">',
      "{[this.genRepository(values)]}",
      "</div>",
      '<div class="item-detail" ext:qtip="{description}">{description}</div>',
      "</div>",
      '<div class="item-info-link">',
      "{[this.genLink(values)]}",
      "</div>",
      '<div class="x-clear"></div>',
      "</div>",
      "</tpl>"
    );
  },
  addTplRenderer: function () {
    var a = this.tpl;
    var b = this;
    a.genRepository = function (c) {
      var e = "";
      var h = "";
      var d = String.format(
        '<div class="item-repo" ext:qtip="{0}">{0}</div>',
        c.repo
      );
      if (
        b.dockerHubHelper.isDockerHub(c.registry) ||
        b.aliyunHubHelper.isAliyunHub(c.registry)
      ) {
        var g = b.dockerHubHelper.isDockerHub(c.registry)
          ? b.helper.T("registry", "star_count")
          : b.helper.T("registry", "download_times");
        var f = b.helper.shortNum(c.star_count);
        h =
          '<div class="item-count-star" ext:qtip="' +
          g +
          '"></div><div class="item-count" ext:qtip="' +
          g +
          '">' +
          f +
          "</div>";
      }
      e = c.is_official
        ? '<div class="item-official" ext:qtip="' +
          b.helper.T("registry", "official_image") +
          '"></div>'
        : "";
      return String.format(
        '<div class="item-title" ext:qtip="{0}">{1}{2}{3}</div>',
        c.repo,
        d,
        e,
        h
      );
    };
    a.genLink = function (c) {
      var d = "";
      if (b.dockerHubHelper.isDockerHub(c.registry)) {
        d = String.format(
          '<a class="item-link" href="{0}" target="blank"></a>',
          b.dockerHubHelper.formDockerHubUrl(c.repo)
        );
      } else {
        if (b.aliyunHubHelper.isAliyunHub(c.registry)) {
          d = String.format(
            '<a class="item-link" href="{0}" target="blank"></a>',
            b.aliyunHubHelper.formAliyunHubUrl(c.aliInfo.repoId)
          );
        }
      }
      return d;
    };
  },
});
Ext.define("SYNO.SDS.Docker.Registry.Panel", {
  extend: "SYNO.ux.Panel",
  helper: SYNO.SDS.Docker.Utils.Helper,
  dockerHubHelper: SYNO.SDS.Docker.Utils.DockerHub,
  pageSize: 50,
  bbarMargin: 10,
  constructor: function (a) {
    this.beforeSearch = true;
    this.callParent([this.fillConfig(a)]);
  },
  fillConfig: function (a) {
    this.imageStore = this.createImageStore(a);
    this.listView = this.createListView(a);
    this.blankPanel = this.createBlankPanel(a);
    this.tbar = this.createTBar();
    this.bbar = this.createBBar();
    var b = {
      title: this.helper.T("common", "registry"),
      bbar: this.bbar,
      tbar: this.tbar,
      items: [this.blankPanel, this.listView],
      listeners: {
        scope: this,
        activate: this.onActivate,
        resize: this.onPanelResize,
        afterrender: this.onAfterRender,
      },
    };
    Ext.apply(b, a);
    return b;
  },
  createImageStore: function (a) {
    return new SYNO.API.JsonStore({
      appWindow: a.appWin,
      autoDestroy: true,
      fields: [
        { name: "repo", mapping: "name" },
        { name: "description", mapping: "description" },
        { name: "tag", defaultValue: "latest" },
        { name: "is_automated", mapping: "is_automated" },
        { name: "is_official", mapping: "is_official" },
        { name: "star_count", mapping: "star_count" },
        { name: "registry", mapping: "registry" },
        { name: "aliInfo", mapping: "aliInfo" },
      ],
      api: "SYNO.Docker.Registry",
      method: "search",
      version: 1,
      root: "data",
      scope: this,
      listeners: {
        scope: this,
        beforeload: this.onStoreBeforeLoad,
        load: this.onStoreLoad,
        exception: this.onStoreException,
      },
    });
  },
  createTBar: function () {
    this.downloadBtn = new SYNO.ux.Button({
      text: this.helper.T("backup", "download"),
      scope: this,
      disabled: true,
      handler: this.onChoose,
    });
    var a = new SYNO.ux.Button({
      text: this.helper.T("common", "common_settings"),
      scope: this,
      handler: this.onSetting,
    });
    this.searchFilter = new SYNO.ux.TextFilter({
      width: 200,
      itemId: "search",
      name: "q",
      emptyText: "",
      listeners: {
        scope: this,
        keydown: this.onSearchKeyDown,
        keyup: this.onSearchKeyUp,
      },
    });
    return new SYNO.ux.Toolbar({
      style: "padding-bottom: 8px; border-bottom: 1px solid #D7E1EB",
      items: [this.downloadBtn, a, "->", this.searchFilter],
    });
  },
  createBlankPanel: function (a) {
    return new SYNO.ux.Panel({
      cls: "syno-sds-docker-registry-blank",
      html: ["<p>", this.helper.T("registry", "registry_empty"), "</p>"].join(
        ""
      ),
      hidden: true,
    });
  },
  createListView: function (a) {
    return new SYNO.SDS.Docker.Registry.ListView({
      panel: this,
      owner: this,
      store: this.imageStore,
      multiSelect: false,
      singleSelect: true,
      itemSelector: ".item-wrap",
      listeners: {
        scope: this,
        contextmenu: this.onRowContextMenu,
        selectionchange: this.onRowSelectionChange,
        dblclick: this.onRowDblClick,
      },
    });
  },
  createBBar: function () {
    return new SYNO.ux.PagingToolbar({
      store: this.imageStore,
      pageSize: this.pageSize,
      displayInfo: true,
      style: "margin-bottom: " + this.bbarMargin + "px;",
    });
  },
  searchFinal: function () {
    this.searchRequest = null;
    this.searchFilter.enable();
    this.helper.unmask(this.listView);
  },
  resetSearch: function () {
    this.bbar.hide();
    this.imageStore.loadData({ data: [] });
    this.blankPanel.hide();
  },
  fetchUsingRegistry: function () {
    this.sendWebAPI({
      api: "SYNO.Docker.Registry",
      method: "get",
      version: 1,
      scope: this,
      callback: function (c, b, a) {
        if (c) {
          this.setUsingRegistry(b.using);
        } else {
          this.setUsingRegistry("");
        }
        if (this.beforeSearch) {
          this.onSearchClick();
          this.beforeSearch = false;
        }
      },
      params: { limit: -1, offset: 0 },
    });
  },
  setUsingRegistry: function (a) {
    if (this.dockerHubHelper.isDockerHubShortName(a)) {
      this.isSearchDockerHub = true;
      this.searchFilter.emptyText = this.helper.T(
        "registry",
        "search_hub_empty"
      );
    } else {
      this.isSearchDockerHub = false;
      this.searchFilter.emptyText = this.helper.T("registry", "search_empty");
    }
    this.onSearchKeyUp();
  },
  onSearchClick: function (b) {
    var a;
    if (this.isSearchDockerHub) {
      a = this.beforeSearch ? "official" : this.searchFilter.getValue();
    } else {
      a = this.beforeSearch ? "" : this.searchFilter.getValue();
    }
    if (this.isSearchDockerHub && 0 === a.trim().length) {
      this.appWin
        .getMsgBox()
        .alert(
          this.helper.T("error", "error_error"),
          this.helper.T("registry", "search_empty_error")
        );
      return;
    }
    this.resetSearch();
    this.helper.maskLoading(this.listView);
    var c = { offset: 0, limit: this.pageSize, page_size: this.pageSize, q: a };
    this.searchRequest = this.sendWebAPI({
      api: "SYNO.Docker.Registry",
      method: "search",
      version: 1,
      scope: this,
      callback: this.onSearchCallback,
      params: c,
    });
    this.searchFilter.disable();
  },
  onSearchKeyDown: function (c, b) {
    var a = this.searchFilter.getValue();
    if (
      b.getCharCode() == b.ENTER &&
      !this.searchRequest &&
      (!this.isSearchDockerHub || a !== "")
    ) {
      this.onSearchClick();
    }
  },
  onSearchKeyUp: function () {
    var a = this.searchFilter.getValue();
    if (a === "") {
      this.searchFilter.applyEmptyText();
    }
  },
  onSearchCallback: function (c, b, a) {
    this.searchFinal();
    if (!c) {
      this.appWin
        .getMsgBox()
        .alert(
          this.helper.T("error", "error_error"),
          this.helper.getError(b.code)
        );
      return;
    }
    if (!b.total) {
      this.resetSearch();
      this.blankPanel.show();
      return;
    }
    this.imageStore.loadData(b);
    this.oldQuery = { q: a.q };
    this.bbar.show();
  },
  onDetail: function (c) {
    var a = this.listView.getSelectedRecords()[0];
    if (!a) {
      return;
    }
    var b = this.dockerHubHelper.formDockerHubUrl(a.data.repo);
    if (b) {
      window.open(b);
    }
  },
  onChoose: function (c) {
    var b = this.listView.getSelectedRecords()[0];
    if (!b) {
      return;
    }
    var a = new SYNO.SDS.Docker.Registry.TagDialog({
      owner: this.appWin,
      query: { repo: b.data.repo, aliInfo: b.data.aliInfo },
      scope: this,
      chooseHandler: this.onTagChoose,
    });
    this.waitPullImage = false;
    this.mon(a, "close", this.onTagDialogClose, this);
    this.helper.maskLoading(this);
    a.open();
  },
  onTagChoose: function (b, a) {
    var c = { tag: a, repository: b.repo };
    if (b.aliInfo) {
      c.aliInfo = b.aliInfo;
    }
    this.sendWebAPI({
      api: "SYNO.Docker.Image",
      method: "pull_start",
      version: 1,
      scope: this,
      callback: this.onTagChooseCallback,
      params: c,
    });
    this.waitPullImage = true;
  },
  onTagDialogClose: function () {
    if (!this.waitPullImage) {
      this.helper.unmask(this);
    }
  },
  onTagChooseCallback: function (c, b, a) {
    this.helper.unmask(this);
    if (!c) {
      this.appWin
        .getMsgBox()
        .alert(
          this.helper.T("error", "error_error"),
          this.helper.getError(b.code)
        );
      return;
    }
    this.appWin.triggerImagePullListPolling();
  },
  onRowDblClick: function (a) {
    this.onChoose();
  },
  onAfterRender: function () {
    this.bbar.hide();
    this.fetchUsingRegistry();
  },
  onActivate: function () {
    this.helper.resizePanel(this);
  },
  onPanelResize: function (e, d, a) {
    var c = this.tbar.getSize();
    c.width = d;
    this.tbar.setSize(c);
    var b = this.listView.getSize();
    var f = { width: d, height: a - c.height - 28 - this.bbarMargin };
    this.listView.setSize(f);
    this.listView.fireEvent(
      "resize",
      this.listView,
      f.width,
      f.height,
      b.width,
      b.height
    );
    this.blankPanel.setSize(f);
    this.blankPanel.fireEvent(
      "resize",
      this.blankPanel,
      f.width,
      f.height,
      b.width,
      b.height
    );
  },
  onSetting: function (b) {
    var a = new SYNO.SDS.Docker.Registry.SettingDialog({
      owner: this.appWin,
      searchPanel: this,
    });
    a.open();
  },
  onStoreBeforeLoad: function (a, b) {
    if (this.oldQuery) {
      b.params.q = this.oldQuery.q;
    }
    this.helper.maskLoading(this.listView);
  },
  onStoreLoad: function () {
    this.helper.unmask(this.listView);
  },
  onStoreException: function (d, a, e, b, c) {
    this.appWin
      .getMsgBox()
      .alert(
        this.helper.T("error", "error_error"),
        this.helper.getError(c.code)
      );
    this.helper.unmask(this.listView);
  },
  onRowContextMenu: function (c, g, d, e) {
    this.listView.select(g);
    var a = this.listView.getSelectedRecords()[0];
    var b = [
      {
        text: this.helper.T("registry", "image_download"),
        itemId: "choose",
        scope: this,
        handler: this.onChoose,
      },
    ];
    if (this.dockerHubHelper.isDockerHub(a.data.registry)) {
      b.push({
        text: this.helper.T("registry", "open_docker_hub_page"),
        itemId: "detail",
        scope: this,
        handler: this.onDetail,
      });
    }
    var f = new SYNO.ux.Menu({ autoDestroy: true, items: b });
    f.showAt(e.getXY());
  },
  onRowSelectionChange: function (b, a) {
    if (a.length === 0) {
      this.downloadBtn.disable();
    } else {
      this.downloadBtn.enable();
    }
  },
});
Ext.define("SYNO.SDS.Docker.Network.ListView", {
  extend: "SYNO.ux.ExpandableListView",
  helper: SYNO.SDS.Docker.Utils.Helper,
  constructor: function (a) {
    var c = this,
      b;
    b = { cls: "syno-docker-network-list", innerTpl: c.getInnerTpl() };
    c.callParent([Ext.apply(b, a)]);
    c.addTplRenderer();
  },
  createTpl: function (a) {
    var c = this,
      b = a.toggleWrapCls || c.toggleWrapCls;
    return new Ext.XTemplate(
      '<tpl for=".">',
      '<div data-name="{name}" class="item-wrap {cls}">',
      '<div class="item-summary">',
      '<div class="item-icon {[this.networkConnectionGet(values.driver, values.containers)]}"></div>',
      '<div class="docker-network-title">',
      '<div ext:qtip="{name}" class="item-title">{name}</div>',
      '<div ext:qtip="{[this.containerParse(values.containers)]}" class="item-status {[this.networkStatusGet(values.containers)]}">',
      "{[this.networkStatusStringGet(values.containers)]}",
      "</div>",
      "</div>",
      c.innerTpl
        ? '<div class="' + b + '"><div class="item-toggle-img"></div></div>'
        : "",
      "</div>",
      '<div class="item-detail" style="display:none">',
      c.innerTpl ? c.innerTpl.html : "",
      "</div>",
      "</div>",
      "</tpl>",
      '<div class="x-clear"></div>'
    );
  },
  getInnerTpl: function () {
    var b = function (c) {
      return c + _T("common", "colon");
    };
    var a = function (d, c) {
      return String.format(
        '<dt class="docker-network-prop docker-network-title">{0}</dt><dt class="docker-network-prop docker-network-prop-name">{1}</dt>',
        b(d),
        c
      );
    };
    return new Ext.XTemplate(
      '<tpl for=".">',
      '<div class="x-clear"></div>',
      "<dl>",
      a(this.helper.T("network", "driver"), "{driver}"),
      "</dl>",
      '<div class="x-clear"></div>',
      "<dl>",
      "<tpl if=\"values.subnet!==''\">",
      a(_T("firewall", "firewall_source_network"), "{subnet}"),
      "</tpl>",
      "</dl>",
      '<div class="x-clear"></div>',
      "<dl>",
      "<tpl if=\"values.iprange!==''\">",
      a(this.helper.T("network", "iprange"), "{iprange}"),
      "</tpl>",
      "</dl>",
      '<div class="x-clear"></div>',
      "<dl>",
      "<tpl if=\"values.gateway!==''\">",
      a(_T("network", "route_gateway"), "{gateway}"),
      "</tpl>",
      "</dl>",
      '<div class="x-clear"></div>',
      "<dl>",
      '<tpl if="values.enable_ipv6===true">',
      a(
        "IPv6 " + _T("firewall", "firewall_source_network"),
        "{[this.ipv6SubnetRenderer(values.ipv6_subnet)]}"
      ),
      "</tpl>",
      "</dl>",
      '<div class="x-clear"></div>',
      "<dl>",
      "<tpl if=\"values.enable_ipv6===true && values.ipv6_iprange!==''\">",
      a("IPv6 " + this.helper.T("network", "iprange"), "{ipv6_iprange}"),
      "</tpl>",
      "</dl>",
      '<div class="x-clear"></div>',
      "<dl>",
      '<tpl if="values.enable_ipv6===true">',
      a(
        "IPv6 " + _T("network", "route_gateway"),
        "{[this.ipv6GatewayRenderer(values.ipv6_gateway)]}"
      ),
      "</tpl>",
      "</dl>",
      '<div class="x-clear"></div>',
      "<dl>",
      '<tpl if="values.enable_ipv6===false">',
      a("IPv6", this.helper.T("network", "disabled")),
      "</tpl>",
      "</dl>",
      '<div class="x-clear"></div>',
      "<dl>",
      '<tpl if="values.disable_masquerade==true">',
      a(this.helper.T("network", "ip_masquerade"), _T("common", "close")),
      "</tpl>",
      "</dl>",
      '<div class="x-clear"></div>',
      "<dl>",
      a(
        this.helper.T("common", "container"),
        "{[this.containerParse(values.containers)]}"
      ),
      "</dl>",
      '<div class="x-clear"></div>',
      "</tpl>"
    );
  },
  addTplRenderer: function () {
    var a = this.tpl;
    var b = this;
    a.containerParse = function (c) {
      if (!c || c.length === 0) {
        return "-";
      } else {
        return c.sort().join(", ");
      }
    };
    a.networkConnectionGet = function (d, c) {
      if (c.length <= 0) {
        return d + "-disconnect";
      } else {
        return d;
      }
    };
    a.networkStatusGet = function (c) {
      if (c.length <= 0) {
        return "disconnect";
      } else {
        return "connect";
      }
    };
    a.networkStatusStringGet = function (c) {
      if (c.length <= 0) {
        return b.helper.T("network", "no_connected_container");
      } else {
        return String.format(
          b.helper.T("network", "connected_container"),
          c.length
        );
      }
    };
    a.ipv6GatewayRenderer = function (c) {
      return Ext.isEmpty(c) ? this.helper.T("container", "auto") : c;
    };
    a.ipv6SubnetRenderer = function (c) {
      return Ext.isEmpty(c) ? this.helper.T("container", "auto") : c;
    };
  },
});
Ext.define("SYNO.SDS.Docker.Network.CreateDialog", {
  extend: "SYNO.SDS.ModalWindow",
  helper: SYNO.SDS.Docker.Utils.Helper,
  constructor: function (a) {
    this.callParent([this.fillConfig(a)]);
    this.mon(this, "afterlayout", this.createEnableGroup, this, {
      single: true,
    });
  },
  fillConfig: function (a) {
    this.formPanel = this.createFormPanel();
    var b = {
      title: this.helper.T("network", "create"),
      layout: "fit",
      width: 490,
      height: 536,
      items: [this.formPanel],
      buttons: [
        {
          xtype: "syno_button",
          text: this.helper.T("common", "cancel"),
          scope: this,
          handler: this.onCancelClick,
        },
        {
          xtype: "syno_button",
          btnStyle: "blue",
          text: this.helper.T("common", "add"),
          scope: this,
          handler: this.onAddClick,
        },
      ],
    };
    Ext.apply(b, a);
    return b;
  },
  createFormPanel: function () {
    return new SYNO.ux.FormPanel({
      padding: 0,
      items: [
        {
          xtype: "syno_textfield",
          name: "name",
          allowBlank: false,
          minLength: 1,
          maxLength: 64,
          fieldLabel: this.helper.T("network", "name"),
          validator: this.helper.networkNameValidator,
        },
        {
          xtype: "syno_checkbox",
          boxLabel: this.helper.T("network", "enable_ipv4"),
          name: "enable_ipv4",
          checked: true,
          listeners: {
            scope: this,
            check: function () {
              this.formPanel.form.findField("enable_ipv4").reset();
            },
          },
        },
        {
          xtype: "syno_radio",
          boxLabel: this.helper.T("network", "auto_configure"),
          name: "auto",
          checked: true,
          indent: 1,
          inputValue: "true",
        },
        {
          xtype: "syno_radio",
          boxLabel: _T("tcpip", "tcpip_manual"),
          name: "auto",
          indent: 1,
          inputValue: "false",
        },
        {
          xtype: "syno_textfield",
          fieldLabel: _T("firewall", "firewall_source_network"),
          name: "subnet",
          indent: 2,
          allowBlank: false,
          maxlength: 18,
          validator: this.helper.networkIpv4CIDRValidator,
        },
        {
          xtype: "syno_textfield",
          fieldLabel: this.helper.T("network", "iprange"),
          name: "iprange",
          indent: 2,
          allowBlank: true,
          maxlength: 18,
          validator: this.helper.networkIpv4CIDRValidator,
        },
        {
          xtype: "syno_textfield",
          fieldLabel: _T("network", "route_gateway"),
          name: "gateway",
          indent: 2,
          allowBlank: false,
          maxlength: 15,
          vtype: "v4ip",
        },
        {
          xtype: "syno_checkbox",
          boxLabel: this.helper.T("network", "enable_ipv6"),
          name: "enable_ipv6",
        },
        {
          xtype: "syno_textfield",
          fieldLabel: _T("firewall", "firewall_source_network"),
          name: "ipv6_subnet",
          indent: 2,
          allowBlank: false,
          maxlength: 50,
          validator: this.helper.networkIpv6CIDRValidator,
        },
        {
          xtype: "syno_textfield",
          fieldLabel: this.helper.T("network", "iprange"),
          name: "ipv6_iprange",
          indent: 2,
          allowBlank: true,
          maxlength: 50,
          validator: this.helper.networkIpv6CIDRValidator,
        },
        {
          xtype: "syno_textfield",
          fieldLabel: _T("network", "route_gateway"),
          name: "ipv6_gateway",
          indent: 2,
          allowBlank: false,
          maxlength: 50,
          vtype: "v6ip",
        },
        {
          xtype: "syno_checkbox",
          boxLabel: this.helper.T("network", "disable_ip_masquerade"),
          name: "disable_masquerade",
        },
      ],
    });
  },
  onAddClick: function () {
    var a = this.formPanel.getForm().getValues();
    a.disable_masquerade = a.disable_masquerade === "true";
    a.enable_ipv6 = a.enable_ipv6 === "true";
    if (!this.formPanel.getForm().isValid()) {
      return;
    }
    this.helper.maskLoading(this);
    this.sendWebAPI({
      api: "SYNO.Docker.Network",
      method: "create",
      version: 1,
      scope: this,
      callback: this.onCreateNetworkCallback,
      params: a,
    });
  },
  onCancelClick: function () {
    this.close();
  },
  onCreateNetworkCallback: function (e, c, d, b) {
    if (!e) {
      var a;
      if (1803 === c.code || 1804 === c.code) {
        a = c.errors.conflictNet;
      } else {
        if (1805 === c.code || 1807 === c.code) {
          a = d.gateway;
        } else {
          if (1806 === c.code || 1808 === c.code) {
            a = d.ipv6_gateway;
          } else {
            a = d.name;
          }
        }
      }
      this.getMsgBox().alert("", this.helper.getError(c.code, a.bold()));
      this.helper.unmask(this);
      return;
    }
    this.close();
  },
  createEnableGroup: function () {
    var a, b;
    a = new SYNO.ux.Utils.EnableRadioGroup(this.formPanel.getForm(), "auto", {
      false: ["subnet", "iprange", "gateway"],
    });
    b = new SYNO.ux.Utils.EnableCheckGroup(
      this.formPanel.getForm(),
      "enable_ipv6",
      ["ipv6_subnet", "ipv6_iprange", "ipv6_gateway"]
    );
  },
});
Ext.define("SYNO.SDS.Docker.Network.EditDialog", {
  extend: "SYNO.SDS.ModalWindow",
  helper: SYNO.SDS.Docker.Utils.Helper,
  constructor: function (a) {
    Ext.apply(this, new SYNO.SDS.Docker.Container.ProfileUI());
    this.callParent([this.fillConfig(a)]);
    this.mon(this, "afterlayout", this.getNetwork, this, { single: true });
  },
  fillConfig: function (a) {
    var b = {
      layout: "fit",
      width: 460,
      height: 420,
      items: [this.getNetworkGrid(a)],
      buttons: [
        {
          xtype: "syno_button",
          text: this.helper.T("common", "cancel"),
          scope: this,
          handler: this.onCancel,
        },
        {
          xtype: "syno_button",
          btnStyle: "blue",
          text: this.helper.T("common", "apply"),
          scope: this,
          handler: this.onApply,
        },
      ],
    };
    Ext.apply(b, a);
    return b;
  },
  onCancel: function () {
    this.close();
  },
  onApply: function () {
    var c = {};
    var b = [];
    Ext.apply(c, this.getNetworkGridValue(this));
    for (var a = 0; a < c.network.length; a++) {
      b.push(c.network[a].container);
    }
    this.helper.maskLoading(this);
    this.sendWebAPI({
      api: "SYNO.Docker.Network",
      method: "set",
      version: 1,
      scope: this,
      callback: this.onEditNetworkCallback,
      params: {
        networkName: this.networkName,
        containers: this.helper.getUniqArray(b),
      },
    });
  },
  onEditNetworkCallback: function (f, c, e, b) {
    if (!f) {
      var d = this.helper.getError(c.code, e.networkName);
      var a = [];
      Ext.each(c.errors.add_failed, function (g) {
        a.push(g.container || "");
      });
      Ext.each(c.errors.remove_failed, function (g) {
        a.push(g.container || "");
      });
      d += "<br>" + a.join("<br>");
      this.owner.getMsgBox().alert("", d);
      this.getNetwork();
      this.helper.unmask(this);
      return;
    }
    this.close();
  },
  getNetwork: function () {
    this.helper.maskLoading(this);
    this.sendWebAPI({
      api: "SYNO.Docker.Network",
      method: "get",
      version: 1,
      scope: this,
      callback: this.onGetNetworkCallback,
      params: { networkName: this.networkName },
    });
  },
  onGetNetworkCallback: function (h, f, g, c) {
    if (!h) {
      this.owner
        .getMsgBox()
        .alert("", this.helper.getError(f.code, g.networkName));
      this.helper.unmask(this);
      return;
    } else {
      var d = [];
      var b = f.containers.sort();
      for (var a = 0; a < b.length; a++) {
        var e = { container: b[a] };
        d.push(e);
      }
      this.setNetworkGridValue(this, d);
      this.helper.unmask(this);
    }
  },
});
Ext.ns("SYNO.SDS.Docker.Network");
Ext.define("SYNO.SDS.Docker.Network.Panel", {
  helper: SYNO.SDS.Docker.Utils.Helper,
  extend: "SYNO.ux.Panel",
  refreshInterval: 3000,
  constructor: function (a) {
    this.callParent([this.fillConfig(a)]);
  },
  fillConfig: function (a) {
    this.store = this.createStore();
    this.actionGroup = this.createActionGroup();
    this.tbar = this.createTBar();
    this.listView = this.createListView(a);
    var b = {
      title: this.helper.T("common", "network"),
      tbar: this.tbar,
      layout: "fit",
      items: [this.listView],
      listeners: { scope: this, activate: this.onActivate },
    };
    Ext.apply(b, a);
    return b;
  },
  createTBar: function () {
    return new SYNO.ux.Toolbar({
      defaultType: "syno_button",
      items: [this.actionGroup.getArray()],
    });
  },
  createActionGroup: function (a) {
    return new SYNO.ux.Utils.ActionGroup([
      new Ext.Action({
        text: this.helper.T("common", "add"),
        itemId: "add",
        scope: this,
        handler: this.onCreateNetwork,
      }),
      new Ext.Action({
        text: _T("network", "network_manage"),
        itemId: "manage",
        disabled: true,
        scope: this,
        handler: this.onEditNetwork,
      }),
      new Ext.Action({
        text: this.helper.T("common", "delete"),
        itemId: "delete",
        disabled: true,
        scope: this,
        handler: this.onDeleteNetwork,
      }),
    ]);
  },
  createStore: function (b) {
    var a = [
      "id",
      "driver",
      "name",
      "subnet",
      "iprange",
      "gateway",
      "containers",
      "enable_ipv6",
      "ipv6_subnet",
      "ipv6_iprange",
      "ipv6_gateway",
      "disable_masquerade",
    ];
    return new Ext.data.JsonStore({
      appWindow: this.appWin,
      root: "network",
      fields: a,
      hasMultiSort: true,
      multiSortInfo: {
        sorters: [{ field: "driver" }, { field: "name" }],
        direction: "ASC",
      },
    });
  },
  createListView: function (a) {
    return new SYNO.SDS.Docker.Network.ListView({
      panel: this,
      owner: this,
      store: this.store,
      trackResetOnLoad: false,
      listeners: { scope: this, selectionchange: this.onSelectionChange },
    });
  },
  listNetwork: function () {
    this.helper.maskLoadingOnce(this.listView, this);
    this.sendWebAPI({
      api: "SYNO.Docker.Network",
      method: "list",
      version: 1,
      scope: this,
      callback: function (d, b, c, a) {
        this.helper.unmask(this.listView);
        if (d) {
          this.store.loadData(b);
        } else {
          this.getMsgBox().alert(
            "",
            this.helper.getError(b.code, b.errors.errors)
          );
          this.onException(b.result);
        }
      },
    });
  },
  onActivate: function () {
    this.helper.resizePanel(this);
    this.listNetwork();
  },
  onException: function (a) {
    a.forEach(function (b) {
      if (!b.success) {
        this.helper.logError(b.error.code);
      }
    }, this);
  },
  onCreateNetwork: function () {
    var a = new SYNO.SDS.Docker.Network.CreateDialog({ owner: this.appWin });
    a.open();
  },
  onEditNetwork: function () {
    var a = this.getSelections()[0].data.name;
    var b = new SYNO.SDS.Docker.Network.EditDialog({
      networkName: a,
      title: _T("network", "network_manage") + " - " + a,
      owner: this.appWin,
    });
    b.open();
  },
  onDeleteNetwork: function () {
    var c = this;
    var b = this.listView.getSelectedRecords();
    if (b.length === 0) {
      return;
    }
    var d = b.map(function (e) {
      return String.format("<b>{0}</b>", e.data.name);
    });
    var a =
      String.format(this.helper.T("network", "delete_confirm"), b.length) +
      "<br>" +
      d.join("<br>");
    this.appWin.getMsgBox().confirmDelete("confirm", a, function (e) {
      if (e === "yes") {
        c.doDeleteNetwork();
      }
    });
  },
  doDeleteNetwork: function () {
    var a = this.listView.getSelectedRecords();
    if (a.length === 0) {
      return;
    }
    this.helper.maskLoading(this);
    this.sendWebAPI({
      compound: {
        stopwhenerror: false,
        mode: "sequential",
        params: [
          {
            api: "SYNO.Docker.Network",
            method: "remove",
            version: 1,
            params: {
              networks: a.map(function (b) {
                return b.data;
              }),
            },
          },
          { api: "SYNO.Docker.Network", method: "list", version: 1 },
        ],
      },
      scope: this,
      callback: function (i, g, h, f) {
        var d = {},
          e = {},
          c = [],
          b;
        if (!g.has_fail) {
          d = SYNO.API.Response.GetValByAPI(g, "SYNO.Docker.Network", "remove");
          e = SYNO.API.Response.GetValByAPI(g, "SYNO.Docker.Network", "list");
          if (d.failed.length > 0) {
            Ext.each(d.failed, function (j) {
              c.push(j.network || "");
            });
            b = c.join(", ");
            this.appWin
              .getMsgBox()
              .alert(
                "",
                String.format(
                  this.helper.T("error", "network_remove_failed"),
                  b
                )
              );
          }
          this.store.loadData(e);
        }
        this.helper.unmask(this);
      },
    });
  },
  onSelectionChange: function () {
    var b = this.listView.getSelectedRecords();
    var c = false;
    var g = [];
    var f = this.store.data.items;
    var a = false;
    var e, d;
    if (b.length > 0) {
      g = b.map(function (h) {
        return h.data;
      });
    }
    for (e = 0; e < g.length; e++) {
      if (g[e].name === "bridge" || g[e].name === "host") {
        c = true;
        break;
      }
    }
    for (e = 0; e < g.length; e++) {
      for (d = 0; d < f.length; d++) {
        if (g[e].name !== f[d].data.name) {
          continue;
        }
        if (f[d].data.containers.length > 0) {
          a = true;
        }
        break;
      }
      if (a) {
        break;
      }
    }
    if (g.length > 0 && !c && !a) {
      this.actionGroup.enable("delete");
    } else {
      this.actionGroup.disable("delete");
    }
    if (g.length == 1 && g[0].driver !== "host") {
      this.actionGroup.enable("manage");
    } else {
      this.actionGroup.disable("manage");
    }
  },
  getSelections: function () {
    return this.listView.getSelectedRecords();
  },
});
Ext.define("SYNO.SDS.Docker.Log.Panel", {
  extend: "SYNO.ux.GridPanel",
  helper: SYNO.SDS.Docker.Utils.Helper,
  pageSize: 1000,
  constructor: function (a) {
    this.callParent([this.fillConfig(a)]);
  },
  fillConfig: function (a) {
    this.store = this.createStore(a);
    this.toolBar = this.createTBar();
    this.bottomBar = this.createBBar();
    var b = {
      store: this.store,
      enableHdMenu: false,
      colModel: this.createColumnModel(),
      tbar: this.toolBar,
      bbar: this.bottomBar,
      autoExpandColumn: true,
      viewConfig: { trackResetOnLoad: false },
      listeners: { scope: this, activate: this.onActivate },
    };
    Ext.apply(b, a);
    return b;
  },
  createStore: function (a) {
    return new SYNO.API.JsonStore({
      autoDestroy: true,
      appWindow: a.appWin,
      api: "SYNO.Docker.Log",
      method: "list",
      version: 1,
      root: "logs",
      remoteSort: true,
      paramNames: { start: "offset", sort: "sort_by", dir: "sort_dir" },
      fields: [
        { name: "event" },
        { name: "level" },
        { name: "log_type" },
        { name: "time" },
        { name: "user" },
      ],
      sortInfo: { field: "time", direction: "DESC" },
      listeners: {
        scope: this,
        exception: this.onStoreLoadException,
        beforeload: this.onBeforeStoreLoad,
        load: this.onStoreLoad,
      },
    });
  },
  createTBar: function () {
    var a = new SYNO.ux.Menu({
      items: [
        {
          text: this.helper.T("log", "html_type"),
          itemId: "export_html",
          scope: this,
          handler: this.btnExportHTML,
        },
        {
          text: this.helper.T("log", "csv_type"),
          itemId: "export_csv",
          scope: this,
          handler: this.btnExportCSV,
        },
      ],
    });
    return new SYNO.ux.Toolbar({
      items: [
        new Ext.Action({
          itemId: "clear",
          text: this.helper.T("log", "btn_clear"),
          scope: this,
          handler: this.btnClear,
        }),
        new SYNO.ux.SplitButton({
          itemId: "export",
          text: this.helper.T("log", "btn_export"),
          scope: this,
          handler: this.btnExportHTML,
          menu: a,
        }),
        "->",
        {
          xtype: "syno_combobox",
          itemId: "level",
          displayField: "display",
          valueField: "value",
          store: new Ext.data.ArrayStore({
            fields: ["value", "display"],
            data: [
              ["", this.helper.T("log", "log_all")],
              ["information", this.helper.T("log", "info_level")],
              ["warning", this.helper.T("log", "warn_level")],
              ["error", this.helper.T("log", "error_level")],
            ],
          }),
          value: "",
          listeners: { scope: this, select: this.onChangeLevel },
        },
        { xtype: "syno_displayfield", width: 6 },
        {
          xtype: "syno_textfilter",
          itemId: "filter",
          enumAction: "load",
          queryAction: "load",
          store: this.store,
          pageSize: this.pageSize,
          queryParam: "filter_content",
          queryDelay: 300,
        },
      ],
    });
  },
  createBBar: function () {
    return new SYNO.ux.PagingToolbar({
      store: this.store,
      pageSize: this.pageSize,
      displayInfo: true,
    });
  },
  createColumnModel: function () {
    return new Ext.grid.ColumnModel({
      columns: [
        {
          header: this.helper.T("log", "log_time"),
          dataIndex: "time",
          sortable: true,
          width: 50,
          renderer: function (a) {
            return SYNO.SDS.DateTimeFormatter(new Date(a), {
              type: "datetimesec",
            });
          },
        },
        {
          header: this.helper.T("log", "log_type"),
          dataIndex: "level",
          sortable: true,
          width: 30,
          renderer: function (a) {
            switch (a) {
              case "err":
                return "<span class='red-status'>Error</span>";
              case "warn":
                return "<span class='orange-status'>Warning</span>";
              case "info":
                return "<span class='color-font-tier1'>Information</span>";
              default:
                return a;
            }
          },
        },
        {
          header: this.helper.T("log", "log_account"),
          dataIndex: "user",
          sortable: true,
          width: 20,
        },
        {
          header: this.helper.T("log", "log_action"),
          dataIndex: "event",
          sortable: false,
          width: 120,
          renderer: function (e, b, a, h, d, c) {
            var g = Ext.util.Format.htmlEncode(e);
            var f = Ext.util.Format.htmlEncode(g);
            return String.format(
              '<div class="{0}" ext:qtip="{1}">{2}</div>',
              SYNO.SDS.Utils.SelectableCLS,
              f,
              g
            );
          },
        },
      ],
    });
  },
  btnClear: function () {
    var a = this;
    this.appWin
      .getMsgBox()
      .confirm("confirm", this.helper.T("log", "log_cfrm_clear"), function (b) {
        if (b === "yes") {
          a.sendWebAPI({
            api: "SYNO.Docker.Log",
            version: 1,
            scope: a,
            method: "clear",
            callback: function (d, c) {
              if (d) {
                this.refreshStore();
              } else {
                this.appWin.getMsgBox().alert("", this.helper.getError(c.code));
              }
            },
          });
        }
      });
  },
  btnExportHTML: function () {
    this.btnExport("html");
  },
  btnExportCSV: function () {
    this.btnExport("csv");
  },
  btnExport: function (a) {
    this.downloadWebAPI({
      webapi: {
        version: 1,
        api: "SYNO.Docker.Log",
        method: "export",
        params: {
          format: a,
          loglevel: this.toolBar.get("level").value,
          filter_content: this.toolBar.get("filter").value,
          datefrom: 0,
          dateto: 0,
        },
      },
      scope: this,
      callback: function (b, c, e, d) {
        this.appWin.getMsgBox().alert("alert", this.helper.getError(d.code));
      },
    });
  },
  refreshStore: function () {
    this.bottomBar.doRefresh();
    this.helper.maskLoadingOnce(this, this);
  },
  onActivate: function () {
    this.helper.resizePanel(this);
    this.refreshStore();
  },
  onBeforeStoreLoad: function (a, b) {
    Ext.apply(b.params, {
      loglevel: this.toolBar.get("level").value,
      filter_content: this.toolBar.get("filter").value,
      datefrom: 0,
      dateto: 0,
    });
  },
  onStoreLoad: function () {
    this.helper.unmask(this);
  },
  onStoreLoadException: function (b, e, c, d, a) {
    this.appWin.getMsgBox().alert("alert", this.helper.getError(a.code));
  },
  onChangeLevel: function () {
    this.refreshStore();
  },
});
Ext.define("SYNO.SDS.Docker.Utils.WelcomeDialog", {
  extend: "SYNO.SDS.ModalWindow",
  helper: SYNO.SDS.Docker.Utils.Helper,
  constructor: function (a) {
    this.callParent([this.fillConfig(a)]);
    this.mon(this, "beforeshow", this.onBeforeShow, this);
  },
  fillConfig: function (a) {
    SYNO.Assert(a.userSettingKey !== undefined);
    this.userSettingKey = "WelcomDialog-" + a.userSettingKey;
    var b = {
      title: "",
      layout: "fit",
      width: 550,
      height: 350,
      useStatusBar: false,
      footerStyle: "padding: 0 0 20px 0",
      fbar: {
        buttonAlign: "center",
        items: [
          {
            xtype: "syno_button",
            text: this.helper.T("common", "ok"),
            scope: this,
            handler: function () {
              this.close();
            },
          },
        ],
      },
      items: [
        {
          xtype: "syno_panel",
          style: "padding: 16px 20px 0 20px",
          layout: "border",
          items: [
            {
              xtype: "syno_panel",
              region: "center",
              layout: "fit",
              items: a.items,
            },
            {
              xtype: "syno_panel",
              region: "south",
              layout: "fit",
              height: 40,
              items: [
                {
                  xtype: "syno_checkbox",
                  boxLabel: this.helper.T("common", "dont_alert_again"),
                  listeners: { scope: this, check: this.onChecked },
                },
              ],
            },
          ],
        },
      ],
    };
    delete a.userSettingKey;
    delete a.items;
    Ext.apply(b, a);
    return b;
  },
  onBeforeShow: function () {
    if (this.appWin.appInstance.getUserSettings(this.userSettingKey)) {
      this.close.defer(100, this);
      return false;
    }
  },
  onChecked: function (a, b) {
    this.appWin.appInstance.setUserSettings(this.userSettingKey, b);
  },
});
Ext.define("SYNO.SDS.Docker.Application", {
  extend: "SYNO.SDS.AppInstance",
  appWindowName: "SYNO.SDS.Docker.MainWindow",
});
Ext.define("SYNO.SDS.Docker.MainWindow", {
  extend: "SYNO.SDS.PageListAppWindow",
  defaultWinSize: { width: 988, height: 566 },
  helper: SYNO.SDS.Docker.Utils.Helper,
  refreshInterval: 5000,
  constructor: function (a) {
    this.callParent([this.fillConfig(a)]);
  },
  fillConfig: function (a) {
    var b = [
      {
        text: this.helper.T("common", "overview"),
        iconCls: "icon-summary",
        fn: "SYNO.SDS.Docker.Overview.Panel",
      },
      {
        text: this.helper.T("common", "container"),
        iconCls: "icon-container",
        fn: "SYNO.SDS.Docker.Container.Panel",
      },
    ];
    b.push(
      {
        text: this.helper.T("common", "registry"),
        iconCls: "icon-registry",
        fn: "SYNO.SDS.Docker.Registry.Panel",
      },
      {
        text: this.helper.T("common", "image"),
        iconCls: "icon-image",
        fn: "SYNO.SDS.Docker.Image.Panel",
      },
      {
        text: this.helper.T("common", "network"),
        iconCls: "icon-docker-network",
        fn: "SYNO.SDS.Docker.Network.Panel",
      },
      {
        text: this.helper.T("container_detail", "log"),
        iconCls: "icon-log",
        fn: "SYNO.SDS.Docker.Log.Panel",
      }
    );
    var c = {
      width: this.defaultWinSize.width,
      height: this.defaultWinSize.height,
      minWidth: this.defaultWinSize.width,
      minHeight: this.defaultWinSize.height,
      cls: "syno-sds-docker",
      activePage: "SYNO.SDS.Docker.Overview.Panel",
      listItems: b,
      listeners: {
        scope: this,
        afterrender: { single: true, fn: this.onAfterRender },
      },
    };
    Ext.apply(c, a);
    return c;
  },
  createPage: function (b) {
    var c = Ext.getClassByName(b);
    var a = new c({ appWin: this });
    a.itemId = b;
    return a;
  },
  imagePullListPolling: function () {
    this.pollList({
      task_id_prefix: "SYNO_DOCKER_IMAGE_PULL",
      extra_group_tasks: ["admin"],
      scope: this,
      callback: function (d, b, c, a) {
        if (!d || !Ext.isArray(b.admin)) {
          this.clearNotification("SYNO.SDS.Docker.Image.Panel");
        } else {
          this.setNotification("SYNO.SDS.Docker.Image.Panel", b.admin.length);
        }
        if (
          this.activePage &&
          this.activePage.itemId === "SYNO.SDS.Docker.Image.Panel"
        ) {
          this.activePage.fireEvent("pullList", d, b);
        }
        if (!b.admin) {
          this.imagePullListPollingTask.stop();
        }
      },
    });
  },
  triggerImagePullListPolling: function () {
    this.imagePullListPollingTask.restart(true);
  },
  onActivate: function () {
    this.callParent(arguments);
    if (this.activePage && Ext.isFunction(this.activePage.fireEvent)) {
      this.activePage.fireEvent("activate", this.activePage);
    }
  },
  onDeactivate: function () {
    this.callParent(arguments);
    this.imagePullListPollingTask.stop();
    if (this.activePage && Ext.isFunction(this.activePage.fireEvent)) {
      this.activePage.fireEvent("deactivate", this.activePage);
    }
  },
  onAfterRender: function () {
    this.imagePullListPollingTask = this.addTask({
      scope: this,
      interval: this.refreshInterval,
      run: this.imagePullListPolling,
    });
    var b = Ext.id();
    var a = new SYNO.SDS.Docker.Utils.WelcomeDialog({
      cls: "docker-welcome-help",
      owner: this,
      appWin: this,
      height: 380,
      closable: true,
      userSettingKey: "welcome",
      title: this.helper.T("common", "welcome_to_docker"),
      items: [
        {
          xtype: "box",
          html: String.format(this.helper.T("common", "welcome_desc"), b),
          listeners: {
            scope: this,
            afterrender: function () {
              Ext.get(b).on("click", this.onClickHelp, this);
            },
          },
        },
      ],
      fbar: {
        buttonAlign: "center",
        items: [
          {
            cls: "syno-ux-button-blue",
            xtype: "syno_button",
            text: this.helper.T("common", "welcome_open_help"),
            scope: this,
            handler: function () {
              a.close();
              this.onClickHelp();
            },
          },
        ],
      },
      listeners: {
        scope: this,
        close: function () {
          this.pageList.selectModule(this.activePage);
          this.launchPage(this.activePage);
        },
      },
    });
    a.open();
  },
});
Ext.define("SYNO.SDS.Docker.Utils.Socket", {
  extend: Object,
  constructor: function (b, a) {
    if (a) {
      this._socket = new WebSocket(b, a);
    } else {
      this._socket = new WebSocket(b);
    }
    this._handlers = {};
    this._open = this._open.bind(this);
    this._message = this._message.bind(this);
    this._close = this._close.bind(this);
    this._socket.addEventListener("open", this._open);
    this._socket.addEventListener("message", this._message);
    this._socket.addEventListener("close", this._close);
    Object.defineProperties(this, {
      connecting: {
        get: function () {
          return this._socket.readyState === 0;
        },
      },
      connected: {
        get: function () {
          return this._socket.readyState === 1;
        },
      },
      disconnecting: {
        get: function () {
          return this._socket.readyState === 2;
        },
      },
      disconnected: {
        get: function () {
          return this._socket.readyState === 3;
        },
      },
    });
  },
  _open: function (a) {
    this._apply("connect", [a]);
  },
  _message: function (b) {
    var a = JSON.parse(b.data);
    this._apply(a[0], a.slice(1));
  },
  _close: function (a) {
    this._apply("disconnect", [a]);
    this._handlers = null;
    this._open = null;
    this._message = null;
    this._close = null;
  },
  _apply: function (b, a) {
    if (!this._handlers[b]) {
      return;
    }
    for (var c = 0; c < this._handlers[b].length; ++c) {
      this._handlers[b][c].apply(this, a);
    }
  },
  on: function (a, b) {
    if (!this._handlers[a]) {
      this._handlers[a] = [];
    }
    this._handlers[a].push(b);
  },
  emit: function () {
    var a = Array.prototype.map.call(arguments, function (b) {
      return b;
    });
    if (this.connected) {
      this._socket.send(Ext.encode(a));
    }
  },
  destroy: function () {
    this._socket.close();
  },
});
SYNO.SDS.Docker.Utils.Socket.browserSupported = function () {
  return typeof window.WebSocket !== "undefined";
};
Ext.define("SYNO.SDS.Docker.ContainerDetail.TermSocket", {
  extend: "SYNO.SDS.Docker.Utils.Socket",
  constructor: function (a) {
    var b = window.location.protocol === "http:" ? "ws://" : "wss://";
    this.callParent([
      [
        b,
        window.location.hostname,
        ":",
        window.location.port,
        "/docker/ws",
      ].join(""),
    ]);
    this.role = a ? "monitor" : "terminal";
  },
  enter: function (a) {
    this.container = a;
    this.emit("enter", a, this.role);
  },
  attach: function (a, b) {
    b = b || false;
    this.tty_id = a;
    this.emit("attach", this.tty_id, b);
  },
});
Ext.define("SYNO.SDS.Docker.Utils.SearchField", {
  extend: "SYNO.ux.SearchField",
  filter: function () {
    var b = this.getValue();
    var a = this.baseParams || {};
    if (!this.store) {
      return;
    }
    if (this.localFilter === true) {
      if (b) {
        this.store.filter(this.localFilterField, b, true);
      } else {
        this.store.clearFilter(false);
      }
      return;
    }
    Ext.apply(a, { start: 0, limit: this.pageSize });
    if (b) {
      a.action = this.queryAction;
      a[this.queryParam] = b;
    } else {
      a.action = this.enumAction;
    }
    this.store.load({ params: a });
  },
});
Ext.define("SYNO.SDS.Docker.ContainerDetail.PanelLogs", {
  extend: "SYNO.ux.Panel",
  pageSize: 1000,
  helper: SYNO.SDS.Docker.Utils.Helper,
  constructor: function (a) {
    this.callParent([this.fillConfig(a)]);
  },
  fillConfig: function (a) {
    this.nodeMap = {};
    this.focusDocId = null;
    this.stores = this.createStores(a);
    this.toolBar = this.createTbar();
    this.treePanel = this.createTreePanel();
    this.gridPanels = this.createGridPanels(this.stores);
    this.gridPanelWrapper = this.createGridPanelWrapper(this.gridPanels);
    var b = {
      title: this.helper.T("container_detail", "log"),
      cls: "docker-container-log-panel",
      tbar: this.toolBar,
      layout: "border",
      border: false,
      items: [this.treePanel, this.gridPanelWrapper],
      listeners: {
        scope: this,
        containerchange: this.onContainerChange,
        afterrender: this.onAfterRender,
        activate: this.onActivate,
      },
    };
    Ext.apply(b, a);
    return b;
  },
  createStores: function (b) {
    var c = {
      appWindow: b.appWin,
      autoDestroy: true,
      root: "logs",
      idProperty: "docid",
      fields: [
        {
          name: "docid",
          mapping: "docid",
          sortType: function (d) {
            return parseInt(d, 10);
          },
        },
        { name: "time", mapping: "created" },
        { name: "logs", mapping: "text" },
        { name: "stream", mapping: "stream" },
      ],
      sortInfo: { field: "docid", direction: "ASC" },
    };
    var a = {
      log: new SYNO.API.JsonStore(
        Ext.apply(
          {
            api: "SYNO.Docker.Container.Log",
            method: "get",
            version: 1,
            listeners: {
              scope: this,
              exception: this.onException,
              beforeload: this.onBeforeLogStoreLoad,
              load: this.onLogStoreLoad,
            },
          },
          c
        )
      ),
      search: new SYNO.API.JsonStore(
        Ext.apply(
          {
            api: "SYNO.Docker.Container.Log",
            method: "search",
            version: 1,
            listeners: {
              scope: this,
              exception: this.onException,
              beforeload: this.onBeforeSearchStoreLoad,
              load: this.onStoreLoad,
            },
          },
          c
        )
      ),
    };
    return a;
  },
  createTbar: function () {
    return new SYNO.ux.Toolbar({
      items: [
        {
          xtype: "syno_splitbutton",
          text: this.helper.T("common", "export"),
          menu: {
            xtype: "menu",
            items: [
              {
                text: this.helper.T("log", "html_type"),
                scope: this,
                handler: this.exportHTML,
              },
              {
                text: this.helper.T("log", "csv_type"),
                scope: this,
                handler: this.exportCSV,
              },
            ],
          },
          scope: this,
          handler: this.exportHTML,
        },
        "->",
        {
          xtype: "syno_textfilter",
          itemId: "filter",
          enumAction: "load",
          queryAction: "load",
          store: this.stores.search,
          pageSize: this.pageSize,
          queryParam: "filter",
          queryDelay: 300,
          baseParams: { name: "" },
          onTriggerClick: function () {
            if (this.getValue()) {
              this.setValue("");
            }
            this.focus(false, 200);
          },
        },
      ],
    });
  },
  createGridPanelWrapper: function (a) {
    return new SYNO.ux.Panel({
      region: "center",
      layout: "card",
      activeItem: 1,
      cls: "docker-container-log-logpanel",
      defaults: { border: false },
      items: [a.search, a.log],
    });
  },
  createGridPanels: function (a) {
    return {
      search: new SYNO.ux.GridPanel({
        store: a.search,
        enableHdMenu: true,
        colModel: this.createColumnModel(true),
        bbar: this.createBBar(this.stores.search),
        autoExpandColumn: true,
        view: this.createView(),
      }),
      log: new SYNO.ux.GridPanel({
        store: a.log,
        enableHdMenu: true,
        colModel: this.createColumnModel(),
        bbar: this.createBBar(this.stores.log),
        autoExpandColumn: true,
        view: this.createView(),
      }),
    };
  },
  createBBar: function (a) {
    return new SYNO.ux.PagingToolbar({
      store: a,
      pageSize: this.pageSize,
      displayInfo: true,
    });
  },
  createColumnModel: function (a) {
    var b = [
      {
        id: "time",
        header: this.helper.T("helptoc", "time"),
        dataIndex: "time",
        width: 20,
        renderer: function (h, e, d, i, g, f) {
          return SYNO.SDS.DateTimeFormatter(new Date(h), { type: "timesec" });
        },
      },
      {
        header: this.helper.T("container_detail", "log"),
        dataIndex: "logs",
        width: 120,
        renderer: function (i, d, g, h, k, j) {
          var l = i.replace(
            /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
            ""
          );
          var e = Ext.util.Format.htmlEncode(l);
          var f = Ext.util.Format.htmlEncode(e);
          return String.format(
            '<pre class="{0}" ext:qtip="{1}">{2}</pre>',
            SYNO.SDS.Utils.SelectableCLS,
            f,
            e
          );
        },
      },
      {
        header: this.helper.T("common", "stream"),
        dataIndex: "stream",
        width: 20,
      },
    ];
    if (a) {
      var c = this;
      b.push({
        header: this.helper.T("welcome", "welcome_go"),
        dataIndex: "docid",
        width: 20,
        renderer: function (h, e, d, i, g, f) {
          return String.format(
            "<div class='docker-container-log-goto' data-docid='{0}' ext:qtip='{1}'></div>",
            h,
            c.helper.T("welcome", "welcome_go")
          );
        },
        listeners: {
          scope: this,
          click: function (f, e, h, g) {
            var d = e.store.getAt(h);
            this.onClickSearchGoto(d);
          },
        },
      });
      Ext.apply(b[0], {
        width: 40,
        renderer: function (h, e, d, i, g, f) {
          return SYNO.SDS.DateTimeFormatter(new Date(h));
        },
      });
    }
    return new Ext.grid.ColumnModel({ defaultSortable: false, columns: b });
  },
  createView: function () {
    return new SYNO.ux.FleXcroll.grid.BufferView({
      rowHeight: 24,
      borderHeight: 1,
      owner: this,
      trackResetOnLoad: false,
    });
  },
  createTreePanel: function () {
    return new SYNO.ux.TreePanel({
      itemId: "tree",
      cls: "docker-container-log-treepanel",
      width: 200,
      bodyStyle: "padding: 0px 20px 0px 0px",
      region: "west",
      border: false,
      collapsable: true,
      split: true,
      useArrows: true,
      rootVisible: false,
      root: new Ext.tree.TreeNode(),
      selModel: new Ext.tree.DefaultSelectionModel({
        listeners: {
          scope: this,
          selectionchange: {
            fn: this.onTreeSelectionChange,
            scope: this,
            buffer: 100,
          },
          beforeselect: this.onBeforeTreeSelectionChange,
        },
      }),
    });
  },
  reloadTreePanel: function () {
    this.helper.mask(this);
    this.sendWebAPI({
      api: "SYNO.Docker.Container.Log",
      method: "get_date_list",
      version: 1,
      params: { name: this.getContainerName() },
      scope: this,
      callback: function (c, a) {
        if (!c) {
          this.onException(a);
        } else {
          if (a.dates.length > 0) {
            var b = this.parseTreeNode(a.dates);
            this.createTreeNode(b);
            this.selectFirstTreeNode();
            this.helper.unmask(this);
          } else {
            this.helper.mask(this, this.helper.T("common", "no_log"));
          }
        }
      },
    });
  },
  parseTreeNode: function (c) {
    var b = c.map(function (d) {
        return d.match(/\d+-\d+/)[0];
      }),
      a = {};
    b = this.helper.getUniqArray(b);
    c.forEach(function (d) {
      var e = d.match(/^\d+-\d+/)[0],
        f = d.match(/\d+-\d+$/)[0];
      if (a[e] === undefined) {
        a[e] = { text: e, children: [] };
      }
      a[e].children.push({ text: f, date: d, leaf: true });
    });
    return [
      {
        id: "docker-container-log-search-node",
        text: "Search Result",
        leaf: true,
        hidden: true,
      },
    ].concat(
      b.map(function (d) {
        return a[d];
      })
    );
  },
  createTreeNode: function (c) {
    this.nodeMap = {};
    var b = this,
      a = function (g) {
        var e = Ext.apply({}, g);
        delete e.children;
        var f = new Ext.tree.TreeNode(e);
        if (g.children !== undefined && g.children.length > 0) {
          Ext.each(g.children, function (h) {
            f.appendChild(a(h));
          });
        } else {
          b.nodeMap[e.date] = f;
        }
        return f;
      },
      d = a({ expanded: true, children: c });
    this.treePanel.setRootNode(d);
  },
  isContainerChanged: function () {
    var a = this.containerName;
    this.containerName = this.appWin.getContainerName();
    return a !== this.containerName;
  },
  exportHTML: function () {
    this.exportLog("html");
  },
  exportCSV: function () {
    this.exportLog("csv");
  },
  exportLog: function (a) {
    this.downloadWebAPI({
      webapi: {
        version: 1,
        api: "SYNO.Docker.Container.Log",
        method: "export",
        params: { format: a, name: this.getContainerName() },
      },
    });
  },
  changeGrid: function (a) {
    var b = a === "log" ? 1 : 0;
    this.gridPanelWrapper.layout.setActiveItem(b);
  },
  gotoLogDate: function (a) {
    this.curDate = a;
    this.changeGrid("log");
    this.stores.log.load();
  },
  selectFirstTreeNode: function () {
    try {
      var a = this.treePanel.root.childNodes[1].childNodes[0];
      this.treePanel.selectPath(a.getPath());
    } catch (b) {
      SYNO.debug(b);
    }
  },
  selectFocusRow: function () {
    if (this.focusDocId === null) {
      this.scrollToBottom();
    } else {
      var a = this.stores.log.indexOfId(this.focusDocId);
      if (a !== -1) {
        this.gridPanels.log.selModel.selectRow(a);
        this.gridPanels.log.view.focusRow(a);
      }
      this.focusDocId = null;
    }
  },
  showSearchNode: function () {
    this.treePanel.root.childNodes[0].getUI().show();
    this.treePanel.root.childNodes[0].select();
  },
  getContainerName: function () {
    return this.appWin.getContainerName();
  },
  scrollToBottom: function () {
    this.gridPanels.log.view.ensureVisible(
      this.stores.log.getCount() - 1,
      0,
      false
    );
  },
  onClickSearchGoto: function (a) {
    var b = new Date(a.get("time")).format("Y-m-d");
    this.focusDocId = a.get("docid");
    this.toolBar.get("filter").setValue("");
    this.treePanel.selectPath(this.nodeMap[b].getPath());
  },
  onBeforeLogStoreLoad: function (a, b) {
    this.helper.mask(this.gridPanelWrapper);
    b.params = Ext.apply(
      {
        limit: this.pageSize,
        date: this.curDate,
        offset: 0,
        name: this.getContainerName(),
        sort_dir: "ASC",
      },
      b.params
    );
  },
  onBeforeSearchStoreLoad: function (a, b) {
    if (this.toolBar.get("filter").value.length === 0) {
      return false;
    }
    this.helper.mask(this.gridPanelWrapper);
    this.showSearchNode();
    b.params = Ext.apply(
      {
        limit: this.pageSize,
        date: this.curDate,
        offset: 0,
        name: this.getContainerName(),
        q: this.toolBar.get("filter").value,
        sort_dir: "ASC",
      },
      b.params
    );
  },
  onStoreLoad: function (a) {
    this.helper.unmask(this.gridPanelWrapper);
  },
  onLogStoreLoad: function () {
    this.onStoreLoad.apply(this, arguments);
    this.selectFocusRow();
  },
  onException: function (a) {
    this.appWin.getMsgBox().alert("alert", this.helper.getError(a.code));
  },
  onContainerChange: function () {
    this.toolBar.get("filter").baseParams.name = this.getContainerName();
    this.reloadTreePanel();
  },
  onBeforeTreeSelectionChange: function (a, b, c) {
    if (b.isLeaf() === false) {
      return false;
    }
  },
  onTreeSelectionChange: function (a, b) {
    if (b.isLeaf() === false) {
      return false;
    }
    if (b.attributes.date !== undefined) {
      this.gotoLogDate(b.attributes.date);
    } else {
      this.changeGrid("search");
    }
  },
  onAfterRender: function () {
    this.onContainerChange();
  },
  onActivate: function () {
    if (this.isContainerChanged()) {
      this.onContainerChange();
    }
    if (this.curDate) {
      this.stores.log.load();
    }
  },
});
Ext.define("SYNO.SDS.Docker.Container.Detail.UsageBlocks", {
  extend: "Ext.Container",
  helper: SYNO.SDS.Docker.Utils.Helper,
  constructor: function (a) {
    this.callParent([this.fillConfig(a)]);
  },
  fillConfig: function (a) {
    this.percent = new Ext.BoxComponent({ cls: "docker-percent" });
    this.progressbar = new Ext.ProgressBar({
      cls: "docker-progress",
      animate: true,
    });
    var c = {
      scope: this,
      data: this.onData,
      afterrender: this._onResize,
      resize: this._onResize,
    };
    Ext.apply(c, a.listeners);
    delete a.listeners;
    var b = {
      items: [
        { xtype: "box", cls: "docker-icon" },
        {
          xtype: "container",
          cls: "docker-right",
          itemId: "rightContents",
          items: [
            { xtype: "box", cls: "docker-header", html: a.header },
            {
              xtype: "container",
              itemId: "percentWrapper",
              cls: "docker-percent-wrapper",
              items: [this.percent],
            },
            this.progressbar,
          ],
        },
        { xtype: "box", cls: "x-clear" },
      ],
      listeners: c,
    };
    Ext.apply(b, a);
    return b;
  },
  _onResize: function () {
    this.getComponent("rightContents").setWidth(
      this.getWidth() - 50 - 100 - 16
    );
  },
  sizeNUnit: function (a) {
    return this.helper
      .shortFileSize(a)
      .match(/(.+) (\w+)/)
      .slice(1);
  },
  onData: function (c, e, a) {
    if (e === undefined) {
      this.percent.update("" + c);
      this.progressbar.updateProgress(c * 0.01);
    } else {
      var b = this.sizeNUnit(c),
        d = this.sizeNUnit(this.helper.getRealMemory() * 1024 * 1024),
        f;
      if (a) {
        f = String.format('{0}<div class="docker-unit">{1}</div>', b[0], b[1]);
      } else {
        f = String.format(
          '{0}<div class="docker-unit">{1}</div><span class="docker-ram-total"> / {2}<div class="docker-unit">{3}</div></span>',
          b[0],
          b[1],
          d[0],
          d[1]
        );
      }
      this.percent.update(f);
      this.progressbar.updateProgress(e * 0.01);
    }
  },
});
Ext.define("SYNO.SDS.Docker.ContainerDetail.PanelOverview", {
  extend: "SYNO.ux.Panel",
  statusUtil: SYNO.SDS.Docker.Container.StatusUtil,
  helper: SYNO.SDS.Docker.Utils.Helper,
  procDefault: { cpu: 0, memory: 0, memoryPercent: 0 },
  cpuPriorityMap: {
    0: SYNO.SDS.Docker.Utils.Helper.T("container", "med"),
    10: SYNO.SDS.Docker.Utils.Helper.T("container", "low"),
    50: SYNO.SDS.Docker.Utils.Helper.T("container", "med"),
    90: SYNO.SDS.Docker.Utils.Helper.T("container", "high"),
  },
  constructor: function (a) {
    this.callParent([this.fillConfig(a)]);
  },
  fillConfig: function (a) {
    this.lastIsRunning = null;
    this.tbar = new SYNO.SDS.Docker.ContainerDetail.Toolbar({
      owner: this,
      panel: a.owner,
      appWin: a.appWin,
    });
    this.actionGroup = this.tbar.getActionGroup();
    this.stores = this.createStores();
    this.grids = this.createGridPanels();
    this.panels = this.createPanels(a);
    var b = {
      cls: "syno-sds-docker-container-overview",
      tbar: this.tbar,
      title: this.helper.T("container_detail", "overview"),
      layout: "border",
      items: [this.panels.top, this.panels.bottom],
      listeners: {
        scope: this,
        infoready: this.onInfoReady,
        infochange: this.onInfoChange,
        procdata: this.onProcData,
        procexception: this.onProcException,
      },
    };
    Ext.apply(b, a);
    return b;
  },
  createStores: function () {
    return {
      general: new Ext.data.ArrayStore({
        autoDestroy: true,
        fields: ["key", "value"],
        idIndex: 0,
        autoLoad: false,
      }),
      port: new Ext.data.JsonStore({
        root: "port_bindings",
        autoDestroy: true,
        fields: [
          { name: "container_port", type: "int" },
          { name: "host_port", type: "int" },
          { name: "type" },
        ],
      }),
      volume: new Ext.data.JsonStore({
        root: "volume_bindings",
        autoDestroy: true,
        fields: [
          { name: "host_volume_file" },
          { name: "mount_point" },
          { name: "type" },
        ],
      }),
      links: new Ext.data.JsonStore({
        root: "links",
        autoDestroy: true,
        fields: [{ name: "link_container" }, { name: "alias" }],
      }),
      network: new Ext.data.JsonStore({
        root: "network",
        autoDestroy: true,
        fields: [{ name: "name" }, { name: "driver" }],
      }),
      env: new Ext.data.JsonStore({
        root: "env_variables",
        autoDestroy: true,
        fields: [{ name: "key" }, { name: "value" }],
      }),
    };
  },
  createGridPanels: function () {
    var a = {
      enableHdMenu: false,
      trackMouseOver: false,
      layout: "fit",
      disableSelection: true,
    };
    return {
      general: new SYNO.ux.GridPanel(
        Ext.apply(
          {
            cls: "docker-container-grid-keyval",
            title: this.helper.T("log", "general"),
            hideHeaders: true,
            store: this.stores.general,
            colModel: new Ext.grid.ColumnModel({
              columns: [
                {
                  dataIndex: "key",
                  renderer: function (f, c, b, g, e, d) {
                    return f + _T("common", "colon");
                  },
                },
                {
                  dataIndex: "value",
                  renderer: function (f, c, b, g, e, d) {
                    if (
                      SYNO.SDS.Docker.Utils.Helper.T(
                        "container_detail",
                        "command"
                      ) === b.data.key
                    ) {
                      c.attr =
                        'ext:qtip="' + Ext.util.Format.htmlEncode(f) + '"';
                    }
                    return f;
                  },
                },
              ],
            }),
          },
          a
        )
      ),
      port: new SYNO.ux.GridPanel(
        Ext.apply(
          {
            title: this.helper.T("container", "port_setting"),
            store: this.stores.port,
            colModel: new Ext.grid.ColumnModel({
              columns: [
                {
                  header: this.helper.T("container", "local_port"),
                  dataIndex: "host_port",
                  renderer: function (b) {
                    if (b === 0) {
                      return _T("common", "auto");
                    }
                    return b;
                  },
                },
                {
                  header: this.helper.T("container", "container_port"),
                  dataIndex: "container_port",
                },
                { header: this.helper.T("common", "type"), dataIndex: "type" },
              ],
            }),
          },
          a
        )
      ),
      volume: new SYNO.ux.GridPanel(
        Ext.apply(
          {
            title: this.helper.T("common", "volume"),
            store: this.stores.volume,
            colModel: new Ext.grid.ColumnModel({
              columns: [
                {
                  header: this.helper.T("container", "file_folder"),
                  dataIndex: "host_volume_file",
                  renderer: function (c) {
                    var b = c.startsWith("/") ? c.slice(1) : c;
                    return String.format(
                      '<div ext:qtip="{0}">{1}</div>',
                      Ext.util.Format.htmlEncode(b),
                      b
                    );
                  },
                },
                {
                  header: this.helper.T("container", "mount_path"),
                  dataIndex: "mount_point",
                  renderer: function (f, c, b, g, e, d) {
                    c.attr = 'ext:qtip="' + Ext.util.Format.htmlEncode(f) + '"';
                    return f;
                  },
                },
                { header: this.helper.T("common", "type"), dataIndex: "type" },
              ],
            }),
          },
          a
        )
      ),
      links: new SYNO.ux.GridPanel(
        Ext.apply(
          {
            title: this.helper.T("wizard", "links"),
            store: this.stores.links,
            colModel: new Ext.grid.ColumnModel({
              columns: [
                {
                  header: this.helper.T("container", "container_name"),
                  dataIndex: "link_container",
                },
                {
                  header: this.helper.T("common", "alias"),
                  dataIndex: "alias",
                },
              ],
            }),
          },
          a
        )
      ),
      network: new SYNO.ux.GridPanel(
        Ext.apply(
          {
            title: this.helper.T("common", "network"),
            store: this.stores.network,
            colModel: new Ext.grid.ColumnModel({
              columns: [
                { header: this.helper.T("network", "name"), dataIndex: "name" },
                {
                  header: this.helper.T("network", "driver"),
                  dataIndex: "driver",
                },
              ],
            }),
          },
          a
        )
      ),
      env: new SYNO.ux.GridPanel(
        Ext.apply(
          {
            cls: "docker-container-grid-keyval",
            title: this.helper.T("container", "env_variables"),
            store: this.stores.env,
            hideHeaders: true,
            colModel: new Ext.grid.ColumnModel({
              columns: [
                {
                  dataIndex: "key",
                  renderer: function (f, c, b, g, e, d) {
                    c.attr = 'ext:qtip="' + Ext.util.Format.htmlEncode(f) + '"';
                    return f + _T("common", "colon");
                  },
                },
                {
                  dataIndex: "value",
                  renderer: function (f, c, b, g, e, d) {
                    c.attr = 'ext:qtip="' + Ext.util.Format.htmlEncode(f) + '"';
                    return f;
                  },
                },
              ],
            }),
          },
          a
        )
      ),
    };
  },
  createPanels: function (a) {
    var c = { owner: this, appWin: a.appWin },
      b = {},
      e = this;
    var d = function () {
      this.getComponent("rightContents").setWidth(
        this.getWidth() - 72 - 30 - 14
      );
    };
    b.cpu = new SYNO.SDS.Docker.Container.Detail.UsageBlocks(
      Ext.apply(
        {
          flex: 1,
          type: "cpu",
          header: this.helper.T("overview", "cpu_usage"),
          cls: "docker-block docker-cpu",
          listeners: { resize: d },
        },
        c
      )
    );
    b.memory = new SYNO.SDS.Docker.Container.Detail.UsageBlocks(
      Ext.apply(
        {
          flex: 1,
          type: "memory",
          header: this.helper.T("overview", "ram_usage"),
          cls: "docker-block docker-memory",
          listeners: { resize: d },
        },
        c
      )
    );
    b.top = new SYNO.ux.Panel({
      region: "north",
      title: "Title",
      height: 234,
      header: true,
      border: false,
      setStatus: function (f) {
        var g = this.header;
        if (g.child("div")) {
          g.child("div").remove();
        }
        g.createChild({
          tag: "div",
          cls: "docker-container-overview-label",
          html: e.helper.T("container", "status" + f),
        });
      },
      cls: "docker-container-top",
      layout: "hbox",
      layoutConfig: { align: "stretch" },
      items: [
        {
          flex: 1,
          xtype: "syno_panel",
          layout: "fit",
          items: [this.grids.general],
        },
        {
          flex: 1,
          xtype: "syno_panel",
          layout: "vbox",
          layoutConfig: { align: "stretch" },
          items: [b.cpu, b.memory],
        },
      ],
    });
    b.bottom = new SYNO.ux.Panel({
      region: "center",
      border: false,
      cls: "docker-container-bottom",
      layout: "hbox",
      layoutConfig: { align: "stretch" },
      items: [
        {
          xtype: "syno_tabpanel",
          cls: "docker-container-bottom-left",
          flex: 1,
          activeTab: 0,
          items: [
            this.grids.port,
            this.grids.volume,
            this.grids.links,
            this.grids.network,
          ],
        },
        {
          xtype: "syno_panel",
          header: true,
          cls: "docker-container-bottom-right",
          flex: 1,
          title: this.helper.T("container", "env_variables"),
          layout: "fit",
          items: [this.grids.env],
        },
      ],
    });
    return b;
  },
  renderProc: function (a) {
    this.panels.cpu.fireEvent("data", a.cpu);
    this.panels.memory.fireEvent("data", a.memory, a.memoryPercent, true);
  },
  renderInfo: function () {
    var e = this,
      d = this.owner.getDockerInfo().details,
      a = this.owner.getDockerInfo().profile,
      f = [],
      h = "port,volume,links,network,env".split(",").map(function (j) {
        return e.stores[j];
      });
    if (d.NetworkSettings && d.NetworkSettings.Ports) {
      Object.keys(d.NetworkSettings.Ports).forEach(function (k) {
        var l = d.NetworkSettings.Ports[k];
        if (k === null || l === null) {
          return;
        }
        var j = k.split("/"),
          m = {};
        m.container_port = parseInt(j[0], 10);
        m.host_port = parseInt(l[0].HostPort, 10);
        m.type = j[1];
        f.push(m);
      });
      if (f.length) {
        a.port_bindings = f;
      }
    }
    if (a.volume_bindings) {
      a.volume_bindings = a.volume_bindings.filter(function (j) {
        return j.hasOwnProperty("host_volume_file");
      });
    }
    Ext.each(
      h,
      function (j) {
        j.loadData(a);
      },
      this
    );
    var b =
      a.shortcut.enable_shortcut === false
        ? this.helper.T("common", "disabled")
        : a.shortcut.enable_status_page === true
        ? this.helper.T("container", "status_page")
        : String.format(
            "{0}: {1}",
            this.helper.T("container", "web_page"),
            a.shortcut.web_page_url
          );
    var c = this.cpuPriorityMap[a.cpu_priority];
    var g =
      a.memory_limit === 0
        ? this.helper.T("container", "auto")
        : Ext.util.Format.fileSize(a.memory_limit);
    var i = [
      [
        this.helper.T("common", "up_time"),
        this.helper.relativeTime(parseInt(d.up_time, 10) * 1000),
      ],
      [this.helper.T("common", "desktop_shortcut"), b],
      [this.helper.T("container", "cpu_priority"), c],
      [this.helper.T("container", "memory_limit"), g],
      [this.helper.T("container_detail", "command"), d.exe_cmd],
    ];
    if (!this.owner.isRunning()) {
      i = i.slice(1);
    }
    this.stores.general.loadData(i);
    this.procDefault.memory = d.memory;
    this.procDefault.memoryPercent = d.memoryPercent;
    this.panels.top.setTitle(this.appWin.getContainerName());
    this.panels.top.setStatus(this.owner.isRunning() ? "Running" : "Stopped");
  },
  onInfoReady: function () {
    this.helper.mask(this);
  },
  onInfoChange: function () {
    var c = this.owner.isRunning(),
      a = this.actionGroup,
      b = this.owner.getDockerInfo(),
      d = { status: b.details.status, is_package: b.profile.is_package };
    if (this.lastIsRunning !== c) {
      this.lastIsRunning = c;
      a.disableAll();
      Ext.each(
        a.getArray(),
        function (f) {
          var g = this.statusUtil.stat2StatCode(d),
            e = f.initialConfig.enableStatus & g,
            h =
              f.initialConfig.disableStatus !== undefined &&
              f.initialConfig.disableStatus & g;
          if (e && !h) {
            f.enable();
          }
        },
        this
      );
      if (c === false) {
        this.renderProc(this.procDefault);
      }
    }
    this.helper.unmask(this);
    this.renderInfo();
  },
  onProcData: function (a) {
    var b = a.processes.reduce(function (c, d) {
      c.cpu += d.cpu;
      return c;
    }, Ext.apply({}, this.procDefault));
    b.cpu = Ext.util.Format.round(b.cpu, 2);
    b.memory = this.procDefault.memory;
    b.memoryPercent = Ext.util.Format.round(this.procDefault.memoryPercent, 2);
    this.renderProc(b);
  },
  onProcException: function (a) {
    this.helper.logError(a.code);
  },
});
Ext.define("SYNO.SDS.Docker.ContainerDetail.PanelProc", {
  extend: "SYNO.ux.GridPanel",
  helper: SYNO.SDS.Docker.Utils.Helper,
  constructor: function (a) {
    this.callParent([this.fillConfig(a)]);
  },
  fillConfig: function (b) {
    this.store = this.createStore(b);
    var a = new Ext.grid.ColumnModel({
      defaults: { width: 120, sortable: true },
      columns: [
        { header: this.helper.T("container_detail", "pid"), dataIndex: "pid" },
        { header: this.helper.T("common", "command"), dataIndex: "command" },
        { header: this.helper.T("container_detail", "cpu"), dataIndex: "cpu" },
        {
          header: this.helper.T("container_detail", "memory"),
          dataIndex: "memory",
          renderer: function (d) {
            return Ext.util.Format.fileSize(d);
          },
        },
      ],
    });
    var c = {
      title: this.helper.T("container_detail", "process"),
      store: this.store,
      enableHdMenu: false,
      colModel: a,
      autoExpandColumn: true,
      listeners: {
        scope: this,
        infochange: this.onInfoChange,
        procdata: this.onProcData,
        procexception: this.onProcException,
        activate: this.onActivate,
      },
    };
    Ext.apply(c, b);
    return c;
  },
  createStore: function (a) {
    return new Ext.data.JsonStore({
      autoDestroy: true,
      fields: [
        { name: "pid" },
        { name: "command" },
        { name: "cpu" },
        { name: "memory" },
      ],
      root: "processes",
      sortInfo: { field: "cpu", direction: "DESC" },
    });
  },
  detectMaskGrid: function () {
    if (!this.owner.isRunning()) {
      this.helper.mask(
        this,
        this.helper.T("container_detail", "container_stopped")
      );
      this.store.removeAll();
    } else {
      this.helper.unmask(this);
    }
  },
  onInfoChange: function () {
    this.detectMaskGrid();
  },
  onProcData: function (a) {
    this.store.loadData(a);
  },
  onProcException: function (a) {
    this.helper.logError(a.code);
  },
  onActivate: function () {
    this.detectMaskGrid();
    if (this.owner.isRunning() && null !== this.owner.getProcData()) {
      this.onProcData(this.owner.getProcData());
    }
  },
});
Ext.define("SYNO.SDS.Docker.ContainerDetail.Term", {
  extend: "SYNO.ux.Panel",
  helper: SYNO.SDS.Docker.Utils.Helper,
  constructor: function (a) {
    this.callParent([this.fillConfig(a)]);
  },
  fillConfig: function (a) {
    this.socket = this.createSocket(a);
    this.term = this.createTerm();
    var b = {
      cls: "syno-sds-docker-term",
      layout: "fit",
      items: [
        {
          xtype: "container",
          cls: "syno-sds-docker-term-outline",
          layout: "fit",
          items: [
            {
              type: "box",
              cls: "syno-sds-docker-term-wrapper selectabletext",
              listeners: { scope: this, afterrender: this.onAfterRender },
            },
          ],
        },
      ],
      listeners: {
        scope: this,
        activate: this.onActivate,
        beforedestroy: this.onBeforeDestroy,
      },
    };
    Ext.apply(b, a);
    return b;
  },
  createSocket: function (b) {
    var a = new SYNO.SDS.Docker.ContainerDetail.TermSocket();
    a.on(
      "connect",
      function (c) {
        a.enter(b.container);
      }.bind(this)
    );
    a.on(
      "enter",
      function (c) {
        if (c) {
          a.attach(b.tty_id);
        } else {
          b.appWin
            .getMsgBox()
            .alert("error", this.helper.T("error", "term_enter_fail"));
        }
      }.bind(this)
    );
    a.on(
      "attach",
      function (c) {
        switch (c) {
          case SYNO.SDS.Docker.Utils.Helper.errorMapping.WS_ATTACH_SUCC:
            this.attached = true;
            a.emit("resize", this.term.rows, this.term.cols);
            break;
          case SYNO.SDS.Docker.Utils.Helper.errorMapping.WS_ATTACH_CLIENT:
            if (!b.appWin._isVue) {
              b.appWin.getMsgBox().confirm(
                "attach",
                this.helper.getError(c),
                function (d) {
                  if (d === "yes") {
                    a.attach(b.tty_id, true);
                  } else {
                    this.closeByDetached = true;
                    this.socketClosing = true;
                    this.socket.destroy();
                  }
                },
                this
              );
            } else {
              b.appWin
                .getMsgBox()
                .confirm("", this.helper.getError(c))
                .then(
                  function (d) {
                    if (d === "confirm") {
                      a.attach(b.tty_id, true);
                    } else {
                      this.closeByDetached = true;
                      this.socketClosing = true;
                      this.socket.destroy();
                    }
                  }.bind(this)
                );
            }
            break;
          case SYNO.SDS.Docker.Utils.Helper.errorMapping.WS_ATTACH_FAIL_TTY:
            b.appWin.getMsgBox().alert("error", this.helper.getError(c));
            this.socketClosing = true;
            this.socket.destroy();
            break;
        }
      }.bind(this)
    );
    a.on(
      "data",
      function (c) {
        this.term.write(c);
      }.bind(this)
    );
    a.on(
      "close",
      function (c) {
        if (
          c === SYNO.SDS.Docker.Utils.Helper.errorMapping.WS_ERR_CLIENT_ATTACH
        ) {
          this.closeByDetached = true;
        }
        if (c !== SYNO.SDS.Docker.Utils.Helper.errorMapping.WS_ERR_EXEC_END) {
          b.appWin
            .getMsgBox()
            .alert(
              "error",
              this.helper.getError(c, Ext.util.Format.htmlEncode(this.name))
            );
        }
        this.socketClosing = true;
      }.bind(this)
    );
    a.on(
      "disconnect",
      function (c) {
        if (!this.isDestroyed && !this.destroying && !this.socketClosing) {
          b.appWin
            .getMsgBox()
            .alert("error", this.helper.T("error", "ws_close"));
          this.helper.logError(c.code);
        }
        if (!this.isDestroyed && !this.destroying) {
          this.helper.mask(this);
        }
        this.socketClosing = false;
        this.attached = false;
        this.fireEvent("termclose", this);
      }.bind(this)
    );
    return a;
  },
  createTerm: function (a) {
    var b = new Terminal({
      cols: 80,
      rows: 24,
      screenKeys: true,
      useFocus: true,
      cursorBlink: true,
    });
    b.on(
      "data",
      function (c) {
        this.socket.emit("data", c);
      }.bind(this)
    );
    return b;
  },
  onAfterRender: function () {
    var a = this.items.items[0];
    var b = a.items.items[0];
    this.term.open(b.getEl().query(".x-panel-body")[0]);
    this.termOpened = true;
  },
  onBeforeDestroy: function () {
    this.socket.destroy();
    this.term.destroy();
  },
  onActivate: function () {
    if (this.termOpened) {
      this.term.element.focus();
    }
  },
  onResize: function (c, j) {
    this.callParent(arguments);
    var d = 5;
    var m = 8;
    var i = 16;
    var e = 6 + 1;
    var f = 1;
    var h = 16;
    var a = 16;
    var b = c - (d + e + f) * 2 - h;
    var k = j - (d + e + f) * 2 - a;
    var g = Math.floor(b / m);
    var l = Math.floor(k / i);
    this.term.resize(g, l);
    if (this.attached) {
      this.socket.emit("resize", l, g);
    }
  },
});
Ext.define("SYNO.SDS.Docker.ContainerDetail.HotKeys", {
  extend: "SYNO.SDS.AppWindow",
  helper: SYNO.SDS.Docker.Utils.Helper,
  constructor: function (a) {
    var b = this.fillConfig(a);
    this.callParent([b]);
  },
  fillConfig: function (a) {
    var b = {
      width: 520,
      height: 740,
      minWidth: 520,
      minHeight: 200,
      constrainHeader: true,
      showHelp: false,
      minimizable: false,
      maximizable: false,
      title: this.helper.T("hotkey", "title"),
      layout: "fit",
      items: [new SYNO.SDS.Docker.ContainerDetail.HotKeyForm({ dialog: this })],
      buttons: [
        {
          text: _T("common", "apply"),
          btnStyle: "blue",
          scope: this,
          handler: this.onClose,
        },
      ],
    };
    Ext.apply(b, a || {});
    return b;
  },
  onClose: function () {
    this.hide();
    return false;
  },
});
Ext.define("SYNO.SDS.Docker.ContainerDetail.HotKeyForm", {
  extend: "SYNO.SDS.Utils.FormPanel",
  helper: SYNO.SDS.Docker.Utils.Helper,
  constructor: function (b) {
    var a = { items: this.getItems() };
    this.callParent([Ext.apply(a, b)]);
  },
  getItems: function () {
    return [
      {
        xtype: "syno_fieldset",
        title: this.helper.T("hotkey", "prefix_mode"),
        items: [
          {
            xtype: "syno_displayfield",
            value: this.getPrefixTable(),
            htmlEncode: false,
          },
        ],
      },
      {
        xtype: "syno_fieldset",
        title: this.helper.T("hotkey", "selection_mode"),
        items: [
          {
            xtype: "syno_displayfield",
            value: this.getSelectionTable(),
            htmlEncode: false,
          },
        ],
      },
      {
        xtype: "syno_fieldset",
        title: this.helper.T("hotkey", "visual_mode"),
        items: [
          {
            xtype: "syno_displayfield",
            value: this.getVisualTable(),
            htmlEncode: false,
          },
        ],
      },
    ];
  },
  getPrefixTable: function () {
    var a = [
      '<table border="0" cellpadding="5" cellspacing="10" role="presentation">',
      '<tr><td valign="left"><b>Ctrl + A</b></td><td>',
      String.format(
        this.helper.T("hotkey", "cmd_ctrl_a"),
        "<b>" + this.helper.T("hotkey", "prefix_mode") + "</b>"
      ),
      "</td></tr>",
      '<tr><td valign="left"><b>Ctrl + C</b></td><td>',
      this.helper.T("hotkey", "cmd_ctrl_c"),
      "</td></tr>",
      '<tr><td valign="left"><b>Ctrl + V</b></td><td>',
      this.helper.T("hotkey", "cmd_ctrl_v"),
      "</td></tr>",
      "</table>",
    ];
    return a.join("");
  },
  getSelectionTable: function () {
    var a = [
      '<table border="0" cellpadding="5" cellspacing="10" role="presentation">',
      '<tr><td valign="left"><b>[</b></td><td>',
      String.format(
        this.helper.T("hotkey", "cmd_open_bracket"),
        "<b>" + this.helper.T("hotkey", "selection_mode") + "</b>",
        "<b>" + this.helper.T("hotkey", "prefix_mode") + "</b>"
      ),
      "</td></tr>",
      '<tr><td valign="left"><b>/</b></td><td>',
      this.helper.T("hotkey", "cmd_slash"),
      "</td></tr>",
      '<tr><td valign="left"><b>g</b></td><td>',
      this.helper.T("hotkey", "cmd_g"),
      "</td></tr>",
      '<tr><td valign="left"><b>G</b></td><td>',
      this.helper.T("hotkey", "cmd_capital_g"),
      "</td></tr>",
      '<tr><td valign="left"><b>0</b></td><td>',
      this.helper.T("hotkey", "cmd_zero"),
      "</td></tr>",
      '<tr><td valign="left"><b>$</b></td><td>',
      this.helper.T("hotkey", "cmd_dollar_sign"),
      "</td></tr>",
      '<tr><td valign="left"><b>w</b></td><td>',
      this.helper.T("hotkey", "cmd_w"),
      "</td></tr>",
      '<tr><td valign="left"><b>b</b></td><td>',
      this.helper.T("hotkey", "cmd_b"),
      "</td></tr>",
      "</table>",
    ];
    return a.join("");
  },
  getVisualTable: function () {
    var a = [
      '<table border="0" cellpadding="5" cellspacing="10" role="presentation">',
      '<tr><td valign="left"><b>v</b></td><td>',
      String.format(
        this.helper.T("hotkey", "cmd_v"),
        "<b>" + this.helper.T("hotkey", "visual_mode") + "</b>",
        "<b>" + this.helper.T("hotkey", "selection_mode") + "</b>"
      ),
      "</td></tr>",
      '<tr><td valign="left"><b>hjkl</b></td><td>',
      String.format(
        this.helper.T("hotkey", "cmd_hjkl"),
        "<b>" + this.helper.T("hotkey", "visual_mode") + "</b>"
      ),
      "</td></tr>",
      "</table>",
    ];
    return a.join("");
  },
});
Ext.define("SYNO.SDS.Docker.Utils.PromptDialog", {
  extend: "SYNO.SDS.ModalWindow",
  constructor: function (a) {
    this.callParent([this.fillConfig(a)]);
  },
  fillConfig: function (a) {
    this.panel = this.initPanel(a);
    this.scope = a.scope || this;
    this.closeHandler = a.closeHandler || Ext.emptyFn;
    this.okHandler = a.okHandler || Ext.emptyFn;
    var b = {
      owner: a.owner,
      width: 450,
      height: 180,
      shadow: true,
      minWidth: 500,
      minHeight: 150,
      collapsible: false,
      autoScroll: false,
      constrainHeader: true,
      title: a.title || "title",
      layout: "fit",
      items: [this.panel],
      buttons: [
        {
          text: _T("common", "common_cancel"),
          scope: this,
          handler: this._closeHandler,
        },
        {
          btnStyle: "blue",
          text: _T("common", "common_submit"),
          scope: this,
          handler: this._okHandler,
        },
      ],
    };
    Ext.apply(b, a);
    return b;
  },
  initPanel: function (a) {
    var b = {
      labelAlign: "top",
      border: false,
      items: [
        {
          xtype: "syno_textfield",
          itemId: "value",
          fieldLabel: a.textFieldLabel || "fieldLabel",
          name: "name",
          width: 400,
          maxlength: 255,
        },
      ],
    };
    return new Ext.form.FormPanel(b);
  },
  _okHandler: function () {
    this.okHandler.createDelegate(
      this.scope,
      [this.panel.form.findField("value").getValue()],
      false
    )();
    this.close();
  },
  _closeHandler: function () {
    this.closeHandler.createDelegate(this.scope)();
    this.close();
  },
});
Ext.define("SYNO.SDS.Docker.ContainerDetail.PanelTerm", {
  extend: "SYNO.ux.Panel",
  helper: SYNO.SDS.Docker.Utils.Helper,
  constructor: function (a) {
    this.callParent([this.fillConfig(a)]);
  },
  fillConfig: function (a) {
    this.ttyList = {};
    this.actionGroup = this.createActionGroup();
    this.toolBar = this.createTBar();
    this.termContainer = this.createTermContainer();
    this.treePanel = this.createTreePanel();
    this.socket = null;
    this.keyTable = null;
    var b = {
      title: this.helper.T("container_detail", "terminal"),
      tbar: this.toolBar,
      layout: "border",
      border: false,
      cls: "docker-container-term-panel",
      items: [this.treePanel, this.termContainer],
      listeners: {
        scope: this,
        containerchange: this.onContainerChange,
        infochange: this.onInfoChange,
        activate: this.onActivate,
        beforedestroy: this.onBeforeDestroy,
      },
    };
    Ext.apply(b, a);
    return b;
  },
  createTreePanel: function () {
    return new SYNO.ux.TreePanel({
      width: 200,
      region: "west",
      bodyStyle: "padding: 0px 20px 0px 0px",
      border: false,
      collapsable: true,
      split: true,
      useArrows: true,
      rootVisible: false,
      root: new Ext.tree.TreeNode(),
      selModel: new Ext.tree.DefaultSelectionModel({
        listeners: {
          scope: this,
          selectionchange: {
            fn: this.onTermSelectChange,
            scope: this,
            buffer: 100,
          },
        },
      }),
      listeners: { scope: this, click: this.onTermClick },
    });
  },
  createActionGroup: function () {
    var a = new SYNO.ux.Menu({
      items: [
        {
          text: this.helper.T("container_detail", "create_with_cmd"),
          scope: this,
          handler: this.onCreateTerm,
          itemId: "create_with_cmd",
        },
      ],
    });
    return new SYNO.ux.Utils.ActionGroup([
      new SYNO.ux.SplitButton({
        text: this.helper.T("common", "create"),
        scope: this,
        handler: this.doCreateTerm.bind(this, ""),
        itemId: "create",
        menu: a,
      }),
      new Ext.Action({
        itemId: "rename",
        text: this.helper.T("container_detail", "rename"),
        scope: this,
        handler: this.onRename,
        disabled: true,
      }),
      new Ext.Action({
        itemId: "delete",
        text: this.helper.T("common", "delete"),
        scope: this,
        handler: this.onDeleteTerm,
        disabled: true,
      }),
      "->",
      new Ext.Action({
        itemId: "hotkey",
        text: this.helper.T("hotkey", "title"),
        scope: this,
        handler: this.onHotKey,
      }),
    ]);
  },
  createTBar: function () {
    return new SYNO.ux.Toolbar({
      defaultType: "syno_button",
      items: [this.actionGroup.getArray()],
    });
  },
  createMonitorSocket: function () {
    var a = new SYNO.SDS.Docker.ContainerDetail.TermSocket(true);
    a.on(
      "connect",
      function (b) {
        a.enter(this.appWin.getContainerName());
      }.bind(this)
    );
    a.on(
      "enter",
      function (b) {
        if (!b) {
          if (!this.owner._isVue) {
            this.appWin
              .getMsgBox()
              .alert("error", this.helper.T("error", "term_enter_fail"));
          } else {
            this.owner
              .getMsgBox()
              .alert("error", this.helper.T("error", "term_enter_fail"));
          }
        }
      }.bind(this)
    );
    a.on(
      "list",
      function (d) {
        for (var c = 0; c < d.length; c += 2) {
          this.ttyList[d[c]] = d[c + 1];
        }
        var b = this.reloadTree();
        if (this.termContainer.items.length === 0 && b.length > 0) {
          this.doRename(b[0], this.appWin.getContainerName());
          this.selectTerm(b[0]);
        }
      }.bind(this)
    );
    a.on(
      "title",
      function (b, d) {
        if (this.ttyList[b]) {
          this.ttyList[b] = d;
          var c = this.termContainer.getComponent(b);
          if (c) {
            c.name = d;
          }
          this.reloadTree();
        }
      }.bind(this)
    );
    a.on(
      "disconnect",
      function (b) {
        if (!this.isDestroyed && !this.destroying && !this.socketClosing) {
          if (!this.owner._isVue) {
            this.appWin
              .getMsgBox()
              .alert("error", this.helper.T("error", "ws_close"));
          } else {
            this.owner
              .getMsgBox()
              .alert("error", this.helper.T("error", "ws_close"));
          }
          this.helper.logError(b.code);
        }
        this.socketClosing = false;
      }.bind(this)
    );
    return a;
  },
  createTermContainer: function () {
    return new SYNO.ux.Panel({
      region: "center",
      layout: "card",
      defaults: { border: false },
      listeners: { scope: this, afterrender: this.onTermAfterRender },
    });
  },
  resetPanel: function () {
    this.treePanel.setRootNode(new Ext.tree.TreeNode());
    this.ttyList = {};
    this.termContainer.removeAll();
    if (this.socket) {
      this.socketClosing = true;
      this.socket.destroy();
      this.socket = null;
    }
  },
  selectTerm: function (a) {
    var b = this.treePanel.root.findChild("id", a);
    if (!b) {
      return;
    }
    this.treePanel.selectPath(b.getPath());
  },
  openTerm: function (a) {
    var b = new SYNO.SDS.Docker.ContainerDetail.Term({
      appWin: !this.owner._isVue ? this.appWin : this.owner,
      container: this.appWin.getContainerName(),
      name: this.ttyList[a],
      tty_id: a,
      itemId: a,
    });
    this.mon(b, "termclose", this.updateActionGroup, this);
    return b;
  },
  reopenTerm: function (a) {
    var c = this.termContainer.layout.activeItem;
    var b = this.termContainer.getComponent(a);
    if (b) {
      this.termContainer.remove(b);
    }
    b = this.openTerm(a);
    this.termContainer.add(b);
    this.termContainer.doLayout();
    if (c) {
      this.termContainer.layout.setActiveItem(c.tty_id);
    }
  },
  switchTerm: function (a) {
    if (a === null) {
      if (this.termContainer.layout.activeItem) {
        this.termContainer.layout.activeItem.hide();
      }
      return;
    }
    var b = this.termContainer.getComponent(a);
    if (!b) {
      b = this.openTerm(a);
      this.termContainer.add(b);
      this.termContainer.doLayout();
    }
    this.termContainer.layout.setActiveItem(a);
    if (this.termContainer.layout.activeItem.hidden) {
      this.termContainer.layout.activeItem.show();
    }
  },
  closeTerm: function (a) {
    var b = this.termContainer.getComponent(a);
    if (!b) {
      return;
    }
    this.termContainer.remove(b);
    delete this.ttyList[a];
    this.reloadTree();
    this.selectTerm(this.appWin.getContainerName());
  },
  isNeedShowCloseConfirm: function () {
    if (!this.socket || this.treePanel.root.childNodes.length < 2) {
      return false;
    }
    return true;
  },
  closeAllTerm: function () {
    var a = this.appWin.getContainerName();
    Object.keys(this.ttyList).forEach(function (b) {
      if (b === a) {
        return;
      }
      this.socket.emit("delete", b);
    }, this);
  },
  reloadTree: function () {
    var e = this.treePanel.getSelectionModel().getSelectedNode();
    var b = this.appWin.getContainerName();
    var d = Object.keys(this.ttyList).sort(function (g, f) {
      if (g === b) {
        return -1;
      }
      if (f === b) {
        return 1;
      }
      if (g < f) {
        return -1;
      }
      if (g > f) {
        return 1;
      }
      return 0;
    });
    var c = d.map(function (f) {
      return new Ext.tree.TreeNode({
        id: f,
        text: Ext.util.Format.htmlEncode(this.ttyList[f]),
        leaf: true,
      });
    }, this);
    var a = new Ext.tree.TreeNode({ expanded: true });
    c.forEach(function (f) {
      a.appendChild(f);
    });
    this.treePanel.setRootNode(a);
    if (e) {
      this.selectTerm(e.id);
    }
    return d;
  },
  updateActionGroup: function () {
    this.actionGroup.disable("rename");
    this.actionGroup.disable("delete");
    if (!this.termContainer.layout.activeItem) {
      return;
    }
    var a = this.termContainer.layout.activeItem;
    if (a.tty_id !== this.appWin.getContainerName() && !a.closeByDetached) {
      this.actionGroup.enable("delete");
    }
    if (a.socket.connecting || a.socket.connected) {
      this.actionGroup.enable("rename");
    }
    if (!a.socket.connecting && !a.socket.connected) {
      this.actionGroup.enable("delete");
    }
  },
  isContainerChanged: function () {
    var a = this.containerName;
    this.containerName = this.appWin.getContainerName();
    return a !== this.containerName;
  },
  onCreateTerm: function () {
    var a = new SYNO.SDS.Docker.Utils.PromptDialog({
      owner: !this.owner._isVue ? this.appWin : this.owner,
      title: this.helper.T("container_detail", "create_with_cmd"),
      textFieldLabel: this.helper.T(
        "container_detail",
        "term_command_no_colon"
      ),
      scope: this,
      okHandler: this.doCreateTerm,
    });
    a.show();
  },
  doCreateTerm: function (a) {
    var b = "/bin/bash";
    a = a || b;
    this.socket.emit("create", a);
  },
  onRename: function () {
    var b = this.treePanel.getSelectionModel().getSelectedNode();
    if (!b) {
      return;
    }
    var a = new SYNO.SDS.Docker.Utils.PromptDialog({
      owner: !this.owner._isVue ? this.appWin : this.owner,
      title: this.helper.T("container_detail", "rename"),
      textFieldLabel: this.helper.T("container_detail", "terminal_title"),
      scope: this,
      okHandler: this.doRename.createDelegate(this, [b.id], 0),
    });
    a.show();
  },
  onHotKey: function () {
    if (!this.keyTable) {
      this.keyTable = new SYNO.SDS.Docker.ContainerDetail.HotKeys({
        appInstance: {
          getUserSettings: function () {},
          setUserSettings: function () {},
        },
      });
      this.keyTable.setTitle(this.helper.T("hotkey", "title"));
    }
    this.keyTable.show();
  },
  doRename: function (b, a) {
    this.socket.emit("title", b, a);
  },
  onDeleteTerm: function () {
    var b = this.treePanel.getSelectionModel().getSelectedNode();
    if (!b) {
      return;
    }
    var a = this.termContainer.getComponent(b.id);
    if (a && !a.attached && !a.closeByDetached) {
      this.doDeleteTerm(b.id, true);
      return;
    }
    var c = String.format(
      this.helper.T("container_detail", "term_delete_confirm"),
      b.text
    );
    if (!this.owner._isVue) {
      this.appWin.getMsgBox().confirm(
        "Delete",
        c,
        function (d) {
          if (d === "yes") {
            this.doDeleteTerm(b.id);
          }
        }.bind(this)
      );
    } else {
      this.owner
        .getMsgBox()
        .confirm("", c)
        .then(
          function (d) {
            if (d === "confirm") {
              this.doDeleteTerm(b.id);
            }
          }.bind(this)
        );
    }
  },
  doDeleteTerm: function (a, b) {
    if (!b) {
      this.socket.emit("delete", a);
    }
    this.closeTerm(a);
  },
  onTermClick: function (b) {
    var a = this.termContainer.getComponent(b.id);
    if (!a) {
      return;
    }
    if (a.closeByDetached) {
      if (!this.owner._iVue) {
        this.appWin.getMsgBox().confirm(
          "reopen",
          this.helper.T("container_detail", "term_reopen_confirm"),
          function (c) {
            if (c === "yes") {
              this.reopenTerm(b.id);
            }
          },
          this
        );
      } else {
        this.owner
          .getMsgBox()
          .confirm(
            "reopen",
            this.helper.T("container_detail", "term_reopen_confirm")
          )
          .then(function (c) {
            if (c === "confirm") {
              this.reopenTerm(b.id);
            }
          });
      }
    }
  },
  onTermSelectChange: function () {
    var a = this.treePanel.getSelectionModel().getSelectedNode();
    if (a === null) {
      this.switchTerm(null);
    } else {
      this.switchTerm(a.id);
    }
    this.updateActionGroup();
  },
  onContainerChange: function () {
    if (!SYNO.SDS.Docker.Utils.Socket.browserSupported()) {
      this.helper.mask(
        this,
        this.helper.T("container_detail", "browser_not_supported_ws")
      );
      return;
    }
    if (!this.owner.isRunning()) {
      this.helper.mask(
        this,
        this.helper.T("container_detail", "container_stopped")
      );
      return;
    }
    this.helper.unmask(this);
    this.resetPanel();
    this.socket = this.createMonitorSocket();
  },
  onInfoChange: function () {
    if (!SYNO.SDS.Docker.Utils.Socket.browserSupported()) {
      this.helper.mask(
        this,
        this.helper.T("container_detail", "browser_not_supported_ws")
      );
      return;
    }
    if (!this.owner.isRunning()) {
      this.helper.mask(
        this,
        this.helper.T("container_detail", "container_stopped")
      );
      this.resetPanel();
      return;
    }
    this.helper.unmask(this);
    if (!this.socket) {
      this.socket = this.createMonitorSocket();
    }
  },
  onActivate: function () {
    this.onInfoChange();
    if (this.isContainerChanged()) {
      this.onContainerChange();
    } else {
      if (this.termContainer.layout.activeItem) {
        this.termContainer.layout.activeItem.fireEvent("activate");
      }
    }
  },
  onBeforeDestroy: function () {
    if (this.socket) {
      this.socket.destroy();
    }
    if (this.keyTable) {
      this.keyTable.close();
    }
  },
  onTermAfterRender: function () {
    var a = this.termContainer.body.dom;
    a.addEventListener("keydown", function (b) {
      b.stopPropagation();
    });
  },
});
Ext.define("SYNO.SDS.Docker.ContainerDetail.Panel", {
  extend: "SYNO.ux.TabPanel",
  refreshIntervals: { proc: 3000, info: 5000 },
  helper: SYNO.SDS.Docker.Utils.Helper,
  statusUtil: SYNO.SDS.Docker.Container.StatusUtil,
  constructor: function (a) {
    this.callParent([this.fillConfig(a)]);
  },
  fillConfig: function (a) {
    this.dockerInfo = null;
    this.procData = null;
    this.procPollingTask = null;
    this.infoPollingTask = null;
    this.panels = this.createPanels(a);
    var b = {
      activeTab: "overview",
      items: Object.values(this.panels),
      listeners: {
        scope: this,
        containerchange: this.onContainerChange,
        infoready: this.onInfoReady,
        tabchange: this.onTabChange,
        winactivate: this.onActivate,
        windeactivate: this.onDeactivate,
      },
    };
    Ext.apply(b, a);
    return b;
  },
  createPanels: function (a) {
    var b = { owner: this, appWin: a.appWin };
    return {
      overview: new SYNO.SDS.Docker.ContainerDetail.PanelOverview(
        Ext.apply({ itemId: "overview" }, b)
      ),
      process: new SYNO.SDS.Docker.ContainerDetail.PanelProc(
        Ext.apply({ itemId: "process" }, b)
      ),
      logs: new SYNO.SDS.Docker.ContainerDetail.PanelLogs(
        Ext.apply({ itemId: "logs" }, b)
      ),
      term: new SYNO.SDS.Docker.ContainerDetail.PanelTerm(
        Ext.apply({ itemId: "term" }, b)
      ),
    };
  },
  isRunning: function () {
    return (
      this.getDockerInfo() &&
      this.getDockerInfo().details.status === this.statusUtil.status.run
    );
  },
  getDockerInfo: function () {
    return this.dockerInfo;
  },
  getProcData: function () {
    return this.procData;
  },
  startInfoPolling: function () {
    if (
      this.appWin.infoReady() &&
      this.infoPollingTask &&
      !this.infoPollingTask.running &&
      this.activeTab &&
      this.activeTab.itemId !== "logs"
    ) {
      this.infoPollingTask.start(true);
    }
  },
  stopInfoPolling: function () {
    if (!this.infoPollingTask) {
      return;
    }
    this.infoPollingTask.stop();
  },
  restartInfoPolling: function () {
    if (this.infoPollingTask) {
      this.stopInfoPolling();
    }
    this.infoPollingTask = this.createInfoPollingTask();
    this.startInfoPolling();
  },
  startProcPolling: function () {
    if (
      this.appWin.infoReady() &&
      this.procPollingTask &&
      !this.procPollingTask.running &&
      this.activeTab &&
      this.activeTab.itemId !== "logs"
    ) {
      this.procPollingTask.start(true);
    }
  },
  stopProcPolling: function () {
    if (!this.procPollingTask) {
      return;
    }
    this.procPollingTask.stop();
  },
  restartProcPolling: function () {
    if (this.procPollingTask) {
      this.stopProcPolling();
    }
    this.procPollingTask = this.createProcPollingTask();
    this.startProcPolling();
  },
  updateInfo: function () {
    this.stopInfoPolling();
    this.sendWebAPI(
      Ext.apply(this.fillInfoAPI(), {
        callback: function (d, b, c, a) {
          this.startInfoPolling();
          if (d) {
            this.onDockerInfo(arguments);
          } else {
            this.onDockerInfoException(arguments);
          }
        },
      })
    );
  },
  createProcPollingTask: function () {
    return this.addWebAPITask({
      scope: this,
      interval: this.refreshIntervals.proc,
      version: 1,
      api: "SYNO.Docker.Container",
      method: "get_process",
      params: { name: this.appWin.getContainerName() },
      callback: function (d, b, c, a) {
        if (d) {
          this.onProcData(arguments);
        } else {
          this.onProcException(b);
        }
      },
    });
  },
  createInfoPollingTask: function () {
    return this.addWebAPITask(
      Ext.apply({ interval: this.refreshIntervals.info }, this.fillInfoAPI())
    );
  },
  fillInfoAPI: function () {
    return {
      scope: this,
      api: "SYNO.Docker.Container",
      method: "get",
      version: 1,
      params: { name: this.appWin.getContainerName() },
      callback: function (d, b, c, a) {
        if (d) {
          this.onDockerInfo(arguments);
        } else {
          this.onDockerInfoException(b);
        }
      },
    };
  },
  statusHelper: {
    status: null,
    isStatusChanged: function (b) {
      var a = this.status !== null && b !== this.status;
      this.status = b;
      return a;
    },
  },
  isNeedShowCloseConfirm: function () {
    return this.panels.term.isNeedShowCloseConfirm();
  },
  closeAllTerm: function () {
    this.panels.term.closeAllTerm();
  },
  onTabChange: function () {
    if (this.activeTab && this.activeTab.itemId === "logs") {
      this.stopInfoPolling();
      this.stopProcPolling();
    } else {
      this.startInfoPolling();
      this.startProcPolling();
    }
  },
  onInfoReady: function () {
    this.restartInfoPolling();
    this.restartProcPolling();
  },
  onContainerChange: function () {
    this.onInfoReady();
    this.activate("overview");
    if (this.activeTab) {
      this.activeTab.fireEvent("containerchange");
    }
  },
  onActivate: function () {
    this.startProcPolling();
    this.startInfoPolling();
    if (this.activeTab) {
      this.activeTab.fireEvent("activate");
    }
  },
  onDeactivate: function () {
    this.stopProcPolling();
    this.stopInfoPolling();
    if (this.activeTab) {
      this.activeTab.fireEvent("deactivate");
    }
  },
  onDockerInfo: function (a) {
    this.dockerInfo = a[1];
    if (this.dockerInfo.profile === null) {
      var c = this.appWin.getContainerName();
      var b = this.helper.getError(
        this.helper.errorMapping.WEBAPI_ERR_CONTAINER_NOT_EXIST,
        c
      );
      this.appWin.getMsgBox().alert(
        "",
        b,
        function () {
          this.appWin.close();
        },
        this
      );
      return;
    }
    if (this.statusHelper.isStatusChanged(this.isRunning())) {
      if (this.isRunning()) {
        this.startProcPolling();
      } else {
        this.stopProcPolling();
      }
    }
    if (this.activeTab) {
      this.activeTab.fireEvent("infochange", a);
    }
  },
  onDockerInfoException: function (a) {
    if (this.activeTab) {
      this.activeTab.fireEvent("infoexception", a);
    }
  },
  onProcData: function (a) {
    this.procData = a[1];
    this.procData.processes = this.procData.processes.map(function (b) {
      b.cpu = Ext.util.Format.round(parseFloat(b.cpu), 2);
      b.memory = parseInt(b.memory, 10);
      b.memoryPercent = Ext.util.Format.round(parseFloat(b.memoryPercent), 2);
      return b;
    });
    if (this.activeTab) {
      this.activeTab.fireEvent("procdata", this.procData);
    }
  },
  onProcException: function (a) {
    if (
      a &&
      a.code === this.helper.errorMapping.WEBAPI_ERR_CONTAINER_NOT_EXIST
    ) {
      this.appWin.getMsgBox().alert(
        "",
        String.format(
          this.helper.errorMapping[a.code],
          this.appWin.getContainerName()
        ),
        function () {
          this.appWin.close();
        },
        this
      );
      return;
    }
    if (this.activeTab) {
      this.activeTab.fireEvent("procexception", a);
    }
  },
});
Ext.define("SYNO.SDS.Docker.ContainerDetail.Toolbar", {
  extend: "SYNO.ux.Toolbar",
  statusUtil: SYNO.SDS.Docker.Container.StatusUtil,
  helper: SYNO.SDS.Docker.Utils.Helper,
  constructor: function (a) {
    this.callParent([this.fillConfig(a)]);
  },
  fillConfig: function (a) {
    var c = this.statusUtil.statusCode;
    var d = {
      start: new Ext.Action({
        itemId: "start",
        text: this.helper.T("container", "start"),
        enableStatus: c.stop,
        disableStatus: c.synopackage,
        scope: this,
        handler: this.btnStart,
      }),
      stop: new Ext.Action({
        itemId: "stop",
        text: this.helper.T("container", "stop"),
        enableStatus: c.run,
        disableStatus: c.synopackage,
        scope: this,
        handler: this.btnStop,
      }),
      restart: new Ext.Action({
        itemId: "restart",
        text: this.helper.T("container", "restart"),
        enableStatus: c.run,
        disableStatus: c.synopackage,
        scope: this,
        handler: this.btnRestart,
      }),
      fstop: new Ext.Action({
        itemId: "fstop",
        text: this.helper.T("container", "force_stop"),
        enableStatus: c.run,
        disableStatus: c.synopackage,
        scope: this,
        handler: this.btnFstop,
      }),
    };
    this.actionGroup = new SYNO.ux.Utils.ActionGroup(Object.values(d));
    var b = { height: 40, items: Object.values(d) };
    Ext.apply(b, a);
    return b;
  },
  API: function (b) {
    b.params = b.params || {};
    b.params.name = this.appWin.getContainerName();
    this.helper.mask(this.panel);
    var a = {
      version: 1,
      api: "SYNO.Docker.Container",
      method: b.method,
      params: b.params,
      scope: this,
      callback: this.btnCallback,
    };
    this.sendWebAPI(a);
  },
  btnCallback: function (b, a) {
    this.helper.unmask(this.panel);
    if (!b) {
      this.appWin.getMsgBox().alert("alert", this.helper.getError(a.code));
    } else {
      this.panel.updateInfo();
    }
  },
  btnStart: function () {
    this.API({ method: "start" });
  },
  btnStop: function () {
    this.API({ method: "stop" });
  },
  btnFstop: function () {
    this.API({ method: "signal", params: { signal: 9 } });
  },
  btnRestart: function () {
    this.API({ method: "restart" });
  },
  getActionGroup: function () {
    return this.actionGroup;
  },
});
Ext.define("SYNO.SDS.Docker.ContainerDetail.Instance", {
  extend: "SYNO.SDS.AppInstance",
  appWindowName: "SYNO.SDS.Docker.ContainerDetail.Main",
});
Ext.define("SYNO.SDS.Docker.ContainerDetail.Main", {
  extend: "SYNO.SDS.AppWindow",
  helper: SYNO.SDS.Docker.Utils.Helper,
  defaultWinSize: { width: 930, height: 580 },
  constructor: function (a) {
    this.callParent([this.fillConfig(a)]);
  },
  fillConfig: function (a) {
    this.containerName = null;
    this.panel = new SYNO.SDS.Docker.ContainerDetail.Panel({
      owner: this,
      appWin: this,
    });
    var b = {
      cls: "syno-sds-docker-container-status",
      pinable: false,
      width: this.defaultWinSize.width,
      height: this.defaultWinSize.height,
      minWidth: this.defaultWinSize.width,
      minHeight: this.defaultWinSize.height,
      splitWindow: true,
      showHelp: false,
      layout: "fit",
      items: [this.panel],
      listeners: {
        scope: this,
        beforeclose: { single: true, fn: this.onBeforeClose },
      },
    };
    Ext.apply(b, a);
    return b;
  },
  infoReady: function () {
    return this.containerName !== null;
  },
  getContainerName: function () {
    return this.containerName;
  },
  onOpen: function (a) {
    this.callParent(arguments);
    this.openDetail(a.data);
  },
  onRequest: function (a) {
    this.callParent(arguments);
    this.openDetail(a.data);
  },
  onActivate: function () {
    this.callParent(arguments);
    this.panel.fireEvent("winactivate");
  },
  onDeactivate: function () {
    this.panel.fireEvent("beforedeactivate");
    this.callParent(arguments);
    this.panel.fireEvent("windeactivate");
  },
  openDetail: function (a) {
    var b = null !== this.containerName && this.containerName !== a.name;
    this.containerName = a.name;
    this.setTitle(this.containerName);
    this.panel.fireEvent("infoready");
    if (b) {
      this.panel.fireEvent("containerchange");
    }
  },
  onBeforeClose: function () {
    if (!this.panel.isNeedShowCloseConfirm()) {
      return;
    }
    this.getMsgBox().confirm(
      "comfirm",
      this.helper.T("container_detail", "term_close_all_confirm"),
      function (a) {
        if (a === "yes") {
          this.panel.closeAllTerm();
        }
        this.close();
      },
      this
    );
    return false;
  },
});
Ext.define("SYNO.SDS.Docker.Utils.APILoadingDialog", {
  extend: "SYNO.SDS.ModalWindow",
  constructor: function (a) {
    this.callParent([this.fillConfig(a)]);
  },
  fillConfig: function (a) {
    if (!a.APIRequest) {
      SYNO.Debug("APILoadingDialog should specify monitoring APIRequest");
    }
    this.progressBar = this.createProgressBar();
    var b = {
      title: "Loading",
      width: 450,
      height: 100,
      scope: this,
      fbar: new Ext.Toolbar({
        items: [
          {
            xtype: "syno_button",
            text: "Cancel",
            scope: this,
            handler: this.onCancel,
          },
        ],
        enableOverflow: false,
      }),
      items: [this.progressBar],
    };
    Ext.apply(b, a);
    return b;
  },
  createProgressBar: function () {
    return new Ext.ProgressBar({
      cls: "syno-sds-docker-waiting-progress",
      width: 440,
      value: 1,
    });
  },
  onCancel: function () {
    Ext.Ajax.abort(this.APIRequest);
    if (Ext.isFunction(this.abortHandler)) {
      this.abortHandler.call(this.scope, this.transaction);
    }
    this.close();
  },
});
