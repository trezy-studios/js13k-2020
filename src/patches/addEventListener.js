let proto = EventTarget.prototype;
proto.on = proto.addEventListener;
proto.off = proto.removeEventListener;
proto.once = function (type, func) {
    let cb = (e) => {
        func(e);
        this.off(type, cb);
    };
    return this.on(type, cb);
}
