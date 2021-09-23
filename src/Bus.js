const eventObj = {}
class Bus {
    $on(name, callback) {
        eventObj[name] = callback
    }
    $emit(name, data) {
        eventObj[name] && eventObj[name](data)
    }
    $off(name) {
        eventObj[name] && delete eventObj[name]
    }
}

export const bus = new Bus();