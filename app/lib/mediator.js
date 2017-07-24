import MediatorFactory from 'mediator-js';

let Mediator = new MediatorFactory();

Mediator.removeAll = function(channelName) {

    let channel = Mediator.getChannel(channelName);
    let sub = channel._channels;

    for(let name in sub) {
        Mediator.removeAll(sub[name].namespace);
    }

    Mediator.remove(channelName);

}

export default Mediator;