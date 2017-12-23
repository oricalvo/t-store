export class Store<StateT> {
    _state: StateT;
    _log: ChangeLog[];

    constructor(state: StateT) {
        this._state = state;
        this._log = [];
    }

    get state() {
        return this._state;
    }

    update(changes: Partial<StateT>) {
        for(let key in changes) {
            const changeAction: ChangeAction = <any>changes[key];
            const changeLog: ChangeLog = this.createChangeLog(key, changeAction);
            changeLog.apply(this._state[key]);
            this._log.push(changeLog);
        }
    }

    private createChangeLog(key: string, changeAction: ChangeAction, changeLog: ChangeLog) {
        if(changeAction.type == "PUSH") {
            return new PushChangeLog()
        }
    }
}

abstract class ChangeAction {
    type: string;
    payload: any;
}

export abstract class ChangeLog {
    abstract apply(state);
    abstract undo(state);
}

function push(data) {
    return new PushChangeLog(data);
}

class PushChangeLog<T> implements ChangeLog {
    constructor(private data) {
    }

    apply(arr: T[]): T[] {
        arr.push(this.data);

        return arr;
    }

    undo(arr: T[]): T[] {
        arr.pop();

        return arr;
    }
}
