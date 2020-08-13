const EventListener = 'EventListener',
    proto = EventTarget.prototype;

proto.on = proto['add' + EventListener];
proto.off = proto['remove' + EventListener];
proto.once = function (type, func) {
    const cb = (e) => {
        func(e);
        this.off(type, cb);
    };
    return this.on(type, cb);
}