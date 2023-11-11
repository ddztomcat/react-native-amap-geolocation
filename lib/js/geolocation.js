"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PositionError = void 0;
var amap_geolocation_1 = require("./amap-geolocation");
/**
 * 定位错误信息
 *
 * @see https://developer.mozilla.org/zh-CN/docs/Web/API/PositionError
 */
var PositionError = /** @class */ (function () {
    function PositionError(code, message, location) {
        this.code = code;
        this.message = message;
        this.location = location;
    }
    return PositionError;
}());
exports.PositionError = PositionError;
var watchId = 0;
var watchMap = {};
/**
 * @see https://developer.mozilla.org/zh-CN/docs/Web/API/Geolocation
 */
var Geolocation = /** @class */ (function () {
    function Geolocation() {
    }
    /**
     * 获取当前位置信息
     *
     * 注意：使用该方法会停止持续定位
     *
     * @see https://developer.mozilla.org/zh-CN/docs/Web/API/Geolocation/getCurrentPosition
     */
    Geolocation.getCurrentPosition = function (success, error
    // options: PositionOptions = {}
    ) {
        var listener = (0, amap_geolocation_1.addLocationListener)(function (location) {
            var _a;
            if (location.errorCode) {
                error && error(new PositionError(location.errorCode, (_a = location.errorInfo) !== null && _a !== void 0 ? _a : "", location));
                (0, amap_geolocation_1.stop)();
                return listener.remove();
            }
            if (amap_geolocation_1._options.locatingWithReGeocode && typeof location.address !== "string") {
                return;
            }
            success(toPosition(location));
            (0, amap_geolocation_1.stop)();
            return listener.remove();
        });
        (0, amap_geolocation_1.start)();
    };
    /**
     * 注册监听器进行持续定位
     *
     * @see https://developer.mozilla.org/zh-CN/docs/Web/API/Geolocation/watchPosition
     */
    Geolocation.watchPosition = function (success, error
    // options?: PositionOptions
    ) {
        watchMap[++watchId] = (0, amap_geolocation_1.addLocationListener)(function (location) {
            var _a;
            if (location.errorCode) {
                error && error(new PositionError(location.errorCode, (_a = location.errorInfo) !== null && _a !== void 0 ? _a : "", location));
            }
            else {
                success(toPosition(location));
            }
        });
        (0, amap_geolocation_1.start)();
        return watchId;
    };
    /**
     * 移除位置监听
     *
     * @see https://developer.mozilla.org/zh-CN/docs/Web/API/Geolocation/clearWatch
     */
    Geolocation.clearWatch = function (id) {
        var listener = watchMap[id];
        if (listener) {
            listener.remove();
        }
    };
    return Geolocation;
}());
exports.default = Geolocation;
function toPosition(location) {
    var _a, _b, _c, _d;
    return {
        location: location,
        coords: {
            latitude: location.latitude,
            longitude: location.longitude,
            altitude: (_a = location.altitude) !== null && _a !== void 0 ? _a : 0,
            accuracy: location.accuracy,
            altitudeAccuracy: 0,
            heading: (_b = location.heading) !== null && _b !== void 0 ? _b : 0,
            speed: (_c = location.speed) !== null && _c !== void 0 ? _c : 0,
        },
        timestamp: (_d = location.timestamp) !== null && _d !== void 0 ? _d : 0,
    };
}
