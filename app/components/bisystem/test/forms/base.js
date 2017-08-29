import Component from '../../../../lib/component';

class Base extends Component {

    constructor(config, data, event) {
        super(config, data, event)
    }
    setValue(){}
    getValue(){
        return this.data.value;
    }
    setLabel(){}
    setName(name){
        this.data.name = name;
    }
    getName(){
        return this.data.name;
    }
}

export {Base}