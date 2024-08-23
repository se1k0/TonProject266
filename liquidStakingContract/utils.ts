import { Address, Tuple, TupleItem, TupleItemInt, TupleReader, toNano } from "ton";
import { Cell, Slice, Sender, SenderArguments, ContractProvider, Message, beginCell, Dictionary, MessageRelaxed, Transaction, fromNano } from "ton-core";
import { Blockchain, BlockchainTransaction, MessageParams, SendMessageResult, SmartContract, SmartContractTransaction } from "@ton-community/sandbox";
import { computeMessageForwardFees, MsgPrices } from "./fees";
import { Op } from "./PoolConstants";
import { MessageValue } from "ton-core/dist/types/Message";
import { compareTransaction, flattenTransaction, FlatTransactionComparable } from "@ton-community/test-utils";
import { extractEvents } from "@ton-community/sandbox/dist/event/Event";


const randomAddress = (wc: number = 0) => {
    const buf = Buffer.alloc(32);
    for (let i = 0; i < buf.length; i++) {
        buf[i] = Math.floor(Math.random() * 256);
    }
    return new Address(wc, buf);
};

const differentAddress = (oldAddr:Address) => {

    let newAddr = oldAddr;

    do {
        newAddr = randomAddress(newAddr.workChain);
    } while(newAddr.equals(oldAddr));

    return newAddr;
}

export function findCommon(s1: string, s2: string): number {
    let i = 0;
    while (i < s1.length && s1[i] === s2[i])
        i++;
    return i;
}

export const getRandom = (min:number, max:number) => {
    return Math.random() * (max - min) + min;
}

enum roundMode {floor, ceil, round};

export const getRandomInt = (min:number, max:number, mode: roundMode = roundMode.floor) => {
    let res = getRandom(min, max);

    if(mode == roundMode.floor) {
        res = Math.floor(res);
    }
    else if(mode == roundMode.ceil) {
        res = Math.ceil(res);
    }
    else {
        res = Math.round(res);
    }

    return res;
}

export const getRandomTon = (min:number | string | bigint, max:number | string | bigint): bigint => {
    let minVal: number;
    let maxVal: number;
    // Meh
    if(typeof min == 'number') {
        minVal = min;
    }
    else if(typeof min == 'string') {
        minVal = Number(min);
    }
    else {
        minVal = Number(fromNano(min));
    }
    if(typeof max == 'number') {
        maxVal = max;
    }
    else if(typeof max == 'string') {
        maxVal = Number(max.split('.')[0]);
    }
    else {
        maxVal = Number(fromNano(max).split('.')[0]);
    }

    return toNano(getRandom(minVal, maxVal).toFixed(9));
}

export const buff2bigint = (buff: Buffer) : bigint => {
    return BigInt("0x" + buff.toString("hex"));
}

export const bigint2buff = (num:bigint) : Buffer => {
    return Buffer.from(num.toString(16), 'hex')
}

export const computedGeneric = (trans:Transaction) => {
    if(trans.description.type !== "generic")
        throw("Expected generic transaction");
    if(trans.description.computePhase.type !== "vm")
        throw("Compute phase expected")
    return trans.description.computePhase;
};

export const getMsgExcess = (trans:Transaction, msg:Message, value:bigint, msgConf:MsgPrices) => {
  const fwdFees = computeMessageForwardFees(msgConf, msg);
  return value - computedGeneric(trans).gasFees - fwdFees.remaining - fwdFees.fees;
}

export const sendBulkMessage = async (msg: Message,
                                      smc:SmartContract,
                                      count:number,
                                      cb: (res:SmartContractTransaction,n:number) => Promise<void>,
                                      params?: MessageParams )=> {
    for ( let i = 0; i < count; i++ ) {
        await cb(await smc.receiveMessage(msg, params), i);
    }
}

interface IAny {}
interface TupleReaderConstructor <T extends IAny>{
    new (...args: any[]) : T
    fromReader(rdr: TupleReader) : T;
}

class TupleReaderFactory<T extends IAny>{
    private constructable: TupleReaderConstructor<T>;
    constructor(constructable: TupleReaderConstructor<T>) {
        this.constructable = constructable;
    }
    createObject(rdr: TupleReader) : T {
        return this.constructable.fromReader(rdr);
    }
}

class LispIterator <T extends IAny> implements Iterator <T> {

    private curItem:TupleReader | null;
    private done:boolean;
    private ctor: TupleReaderFactory<T>;

    constructor(tuple:TupleReader | null, ctor: TupleReaderFactory<T>) {
        this.done    = false; //tuple === null || tuple.remaining == 0;
        this.curItem = tuple;
        this.ctor    = ctor;
    }

    public next(): IteratorResult<T> {

        this.done = this.curItem === null || this.curItem.remaining  == 0;
        let value: TupleReader;
        if( ! this.done) {
            const head = this.curItem!.readTuple();
            const tail = this.curItem!.readTupleOpt();

            if(tail !== null) {
                this.curItem = tail;
            }

            value = head;
            return {done: this.done, value:  this.ctor.createObject(value)};
        }
        else {
            return {done: true, value: null}
        }
    }
}

export class LispList <T extends IAny> {
    private tuple: TupleReader | null;
    private ctor: TupleReaderFactory<T>;

    constructor(tuple: TupleReader | null, ctor: TupleReaderConstructor<T>) {
        this.tuple = tuple;
        this.ctor  = new TupleReaderFactory(ctor);
    }

    toArray() : T[] {
        return [...this];
    }

    [Symbol.iterator]() {
        return new LispIterator(this.tuple, this.ctor);
    }
}

export const muldivExtra  = (a: bigint, b: bigint, c: bigint) => {
    return b == c ? a : a * b / c
}
export const getExternals = (transactions: BlockchainTransaction[]) => {
    const externals:Message[] = [];
    return transactions.reduce((all, curExt) => [...all, ...curExt.externals], externals);
}
export const loadSigned = (ds: Slice) => {
    const neg = ds.loadBit();
    const value = ds.loadCoins();
    return neg ? - value : value;
}

export const testLog = (message: Message, from: Address, topic: number | bigint, matcher?:(body: Cell) => boolean) => {
    // Meh
    if(message.info.type !== "external-out") {
        console.log("Wrong from");
        return false;
    }
    if(!message.info.src.equals(from))
        return false;
    if(!message.info.dest)
        return false;
    if(message.info.dest!.value !== BigInt(topic))
        return false;
    if(matcher !== undefined) {
        if(!message.body)
            console.log("No body");
        return matcher(message.body);
    }
    return true;
};

type LoanParams = {
    lender: Address,
    amount: bigint,
}
type RepaymentParams = LoanParams & {
    profit: bigint
}
export const testLogRepayment = (message: Message, from: Address, match: Partial<RepaymentParams>) => {
    return testLog(message, from, 2,  x => {
        const bs = x.beginParse();
        const repayment: RepaymentParams = {
            lender: bs.loadAddress(),
            amount: bs.loadCoins(),
            profit: loadSigned(bs),
        };
        return testPartial(repayment, match);
    });
};

export const testLogLoan = (message: Message, from: Address, match: Partial<LoanParams>) => {
    return testLog(message, from, 1, x => {
        const bs = x.beginParse();
        const loan : LoanParams = {
            lender: bs.loadAddress(),
            amount: bs.loadCoins()
        }
        return testPartial(loan, match);
    });
}
type RoundCompletionParams = {
    round: number,
    borrowed: bigint,
    returned: bigint,
    profit: bigint
}
export const testLogRound = (message: Message, from: Address, match: Partial<RoundCompletionParams>) => {
    return testLog(message, from, 3, x => {
        const bs = x.beginParse();
        const roundStats : RoundCompletionParams = {
            round: bs.loadUint(32),
            borrowed: bs.loadCoins(),
            returned: bs.loadCoins(),
            profit: loadSigned(bs)
        };
        return testPartial(roundStats, match);
    });
}
export const testLogRotation = (message: Message, from: Address, roundId: number) => {
    return testLog(message, from, 4, x => {
        const testVal = x.beginParse().preloadUint(32);
        return testVal  == roundId;
    });
}
type Log = RoundCompletionParams | LoanParams | RepaymentParams | number;
type LogTypes = 1 | 2 | 3 | 4;
type LogMatch<T extends LogTypes> = T extends 1 ? Partial<LoanParams>
    : T extends 2 ? Partial<RepaymentParams>
    : T extends 3 ? Partial<RoundCompletionParams>
    : number;
export const assertLog = <T extends LogTypes>(transactions: BlockchainTransaction[], from: Address, type: T, match:LogMatch<T> ) => {
    expect(getExternals(transactions).some(x => {
        let res = false;
        switch(type) {
            case 1:
                res = testLogLoan(x, from, match as Partial<LoanParams>);
                break;
            case 2:
                res = testLogRepayment(x, from, match as Partial<RepaymentParams>);
                break;
            case 3:
                res = testLogRound(x, from, match as Partial<RoundCompletionParams>);
                break;
            case 4:
                res = testLogRotation(x, from, match as number);
                break;
        }
        return res;
    })).toBe(true);
}


export type InternalTransfer = {
    from: Address | null,
    to: Address | null,
    amount: bigint,
    forwardAmount: bigint,
    payload: Cell | null
};

export type ControllerStaticData = {
    id: number,
    validator: Address,
    pool: Address,
    governor: Address,
    approver: Address | null,
    halter: Address | null
}
export const parseControllerStatic = (meta: Cell) => {
    const ms = meta.beginParse();
    const hs = ms.preloadRef().beginParse(); // Halter appriver cell
    return {
        id: ms.loadUint(32),
        validator: ms.loadAddress(),
        pool: ms.loadAddress(),
        governor: ms.loadAddress(),
        approver: hs.loadAddressAny(),
        halter: hs.loadAddressAny()
    };
}
export const parseInternalTransfer = (body: Cell) => {
    const ts = body.beginParse();
    if(ts.loadUint(32) !== Op.jetton.internal_transfer)
        throw(Error("Internal transfer op expected!"));

    ts.skip(64);
    return {
        amount: ts.loadCoins(),
        from: ts.loadAddressAny(),
        to: ts.loadAddressAny(),
        forwardAmount: ts.loadCoins(),
        payload: ts.loadMaybeRef()
    };
};

type JettonTransferNotification = {
    amount: bigint,
    from: Address | null,
    payload: Cell | null
}
export const parseTransferNotification = (body: Cell) => {
    const bs = body.beginParse().skip(64 + 32);
    return {
        amount: bs.loadCoins(),
        from: bs.loadAddressAny(),
        payload: bs.loadMaybeRef()
    }
}

type JettonBurnNotification = {
    amount: bigint,
    from: Address,
    response_address: Address | null,
    request_immediate?: boolean,
    fill_or_kill?: boolean
}
export const parseBurnNotification = (body: Cell) => {
    const ds = body.beginParse().skip(64 + 32);
    let res ={
        amount: ds.loadCoins(),
        from: ds.loadAddress(),
        response_address: ds.loadAddressAny(),
    };
    if(ds.remainingBits >= 2) {
        return {...res,
            request_immediate: ds.loadBit(),
            fill_or_kill: ds.loadBit()
        };
    }
    return res;
}



// Some fuzzy logic here
export const approximatelyEqual = (a: bigint, b: bigint, threshold: bigint) => {
    let delta = a < b ? b - a : a - b;
    return delta <= threshold;
}
const testPartial = (cmp: any, match: any) => {
    for (let key in match) {
        if(!(key in cmp)) {
            throw Error(`Unknown key ${key} in ${cmp}`);
        }

        if(match[key] instanceof Address) {
            if(!(cmp[key] instanceof Address)) {
                return false
            }
            if(!(match[key] as Address).equals(cmp[key])) {
                return false
            }
        }
        else if(match[key] instanceof Cell) {
            if(!(cmp[key] instanceof Cell)) {
                return false;
            }
            if(!(match[key] as Cell).equals(cmp[key])) {
                return false;
            }
        }
        else if(match[key] !== cmp[key]){
            return false;
        }
    }
    return true;
}
export const testJettonBurnNotification = (body: Cell, match: Partial<JettonBurnNotification>) => {
    const res= parseBurnNotification(body);
    return testPartial(res, match);
}
export const testControllerMeta = (meta: Cell, match: Partial<ControllerStaticData>) => {
    const res = parseControllerStatic(meta);
    return testPartial(res, match);
}
export const testJettonTransfer = (body: Cell, match: Partial<InternalTransfer>) => {
    const res = parseInternalTransfer(body);
    return testPartial(res, match);
};

export const testJettonNotification = (body: Cell, match: Partial<JettonTransferNotification>) => {
    const res = parseTransferNotification(body);
    return testPartial(res, match);
}

type PayoutMint = {
    dest: Address,
    amount: bigint,
    notification: bigint,
    forward: bigint
    payload?: Cell | null
};
export const parsePayoutMint = (data: Cell) : PayoutMint => {
    const ds = data.beginParse().skip(32 + 64);
    return {
        dest: ds.loadAddress(),
        amount: ds.loadCoins(),
        notification: ds.loadCoins(),
        forward: ds.loadCoins(),
        // payload: ds.loadMaybeRef()
    };
}
export const testMintMsg = (body: Cell, match: Partial<PayoutMint>) => {
    const res = parsePayoutMint(body);
    return testPartial(res, match);
}

export const findTransaction = (txs: BlockchainTransaction[], match: FlatTransactionComparable) => {
    return txs.find(x => compareTransaction(flattenTransaction(x), match));
}
export const executeTill = async (txs: AsyncIterable<BlockchainTransaction> | AsyncIterator<BlockchainTransaction>, match: FlatTransactionComparable) => {
    let executed: BlockchainTransaction[] = [];
    let txIterable = txs as AsyncIterable<BlockchainTransaction>;
    let txIterator = txs as AsyncIterator<BlockchainTransaction>;
    if(txIterable[Symbol.asyncIterator]) {
        for await (const tx of txIterable) {
            executed.push(tx);
            if(compareTransaction(flattenTransaction(tx), match)) {
                return tx;
            }
        }
    }
    else {
        let iterResult = await txIterator.next();
        while(!iterResult.done){
            executed.push(iterResult.value);
            if(compareTransaction(flattenTransaction(iterResult.value), match)) {
                return iterResult.value;
            }
            iterResult = await txIterator.next();
        }
    }
    // Will fail with common error message format
    expect(executed).toHaveTransaction(match);
}
export const executeFrom = async (txs: AsyncIterator<BlockchainTransaction>) => {
    let executed: BlockchainTransaction[] = [];
    let iterResult = await txs.next();
    while(!iterResult.done){
        executed.push(iterResult.value);
        iterResult = await txs.next();
    }
    return executed;
}

export const filterTransaction = (txs: BlockchainTransaction[], match: FlatTransactionComparable) => {
    return txs.filter(x => compareTransaction(flattenTransaction(x), match));
}

type MsgQueued = {
    msg: Message,
    parent?: BlockchainTransaction
};

export class Txiterator implements AsyncIterator<BlockchainTransaction>  {
    private msqQueue: MsgQueued[];
    private blockchain: Blockchain;

    constructor(bc:Blockchain, msg: Message) {
        this.msqQueue = [{msg}];
        this.blockchain = bc;
    }

    public async next(): Promise<IteratorResult<BlockchainTransaction>> {
        if(this.msqQueue.length == 0) {
            return {done: true, value: undefined};
        }
        const curMsg = this.msqQueue.shift()!;
        const inMsg  = curMsg.msg;
        if(inMsg.info.type !== "internal")
            throw(Error("Internal only"));
        const smc = await this.blockchain.getContract(inMsg.info.dest);
        const res = smc.receiveMessage(inMsg, {now: this.blockchain.now});
        const bcRes = {
            ...res,
            events: extractEvents(res),
            parent: curMsg.parent,
            children: [],
            externals: []
        }
        for(let i = 0; i < res.outMessagesCount; i++) {
            const outMsg = res.outMessages.get(i)!;
            // Only add internal for now
            if(outMsg.info.type === "internal") {
                this.msqQueue.push({msg:outMsg, parent: bcRes})
            }
        }
        return {done: false, value: bcRes};
    }
};
export const stepByStep = (bc: Blockchain, msg: Message) => {
    // Returns AscyncIterable
    return {
        [Symbol.asyncIterator] () {
            return new Txiterator(bc, msg);
        }
    }
}

export {
    differentAddress,
};
