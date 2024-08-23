import { 
    Cell,
    Slice, 
    Address, 
    Builder, 
    beginCell, 
    ComputeError, 
    TupleItem, 
    TupleReader, 
    Dictionary, 
    contractAddress, 
    ContractProvider, 
    Sender, 
    Contract, 
    ContractABI, 
    ABIType,
    ABIGetter,
    ABIReceiver,
    TupleBuilder,
    DictionaryValue
} from 'ton-core';

export type StateInit = {
    $$type: 'StateInit';
    code: Cell;
    data: Cell;
}

export function storeStateInit(src: StateInit) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeRef(src.code);
        b_0.storeRef(src.data);
    };
}

export function loadStateInit(slice: Slice) {
    let sc_0 = slice;
    let _code = sc_0.loadRef();
    let _data = sc_0.loadRef();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function loadTupleStateInit(source: TupleReader) {
    let _code = source.readCell();
    let _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function storeTupleStateInit(source: StateInit) {
    let builder = new TupleBuilder();
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

function dictValueParserStateInit(): DictionaryValue<StateInit> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeStateInit(src)).endCell());
        },
        parse: (src) => {
            return loadStateInit(src.loadRef().beginParse());
        }
    }
}

export type Context = {
    $$type: 'Context';
    bounced: boolean;
    sender: Address;
    value: bigint;
    raw: Cell;
}

export function storeContext(src: Context) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounced);
        b_0.storeAddress(src.sender);
        b_0.storeInt(src.value, 257);
        b_0.storeRef(src.raw);
    };
}

export function loadContext(slice: Slice) {
    let sc_0 = slice;
    let _bounced = sc_0.loadBit();
    let _sender = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _raw = sc_0.loadRef();
    return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function loadTupleContext(source: TupleReader) {
    let _bounced = source.readBoolean();
    let _sender = source.readAddress();
    let _value = source.readBigNumber();
    let _raw = source.readCell();
    return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function storeTupleContext(source: Context) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.bounced);
    builder.writeAddress(source.sender);
    builder.writeNumber(source.value);
    builder.writeSlice(source.raw);
    return builder.build();
}

function dictValueParserContext(): DictionaryValue<Context> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeContext(src)).endCell());
        },
        parse: (src) => {
            return loadContext(src.loadRef().beginParse());
        }
    }
}

export type SendParameters = {
    $$type: 'SendParameters';
    bounce: boolean;
    to: Address;
    value: bigint;
    mode: bigint;
    body: Cell | null;
    code: Cell | null;
    data: Cell | null;
}

export function storeSendParameters(src: SendParameters) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounce);
        b_0.storeAddress(src.to);
        b_0.storeInt(src.value, 257);
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        if (src.code !== null && src.code !== undefined) { b_0.storeBit(true).storeRef(src.code); } else { b_0.storeBit(false); }
        if (src.data !== null && src.data !== undefined) { b_0.storeBit(true).storeRef(src.data); } else { b_0.storeBit(false); }
    };
}

export function loadSendParameters(slice: Slice) {
    let sc_0 = slice;
    let _bounce = sc_0.loadBit();
    let _to = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _mode = sc_0.loadIntBig(257);
    let _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _code = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _data = sc_0.loadBit() ? sc_0.loadRef() : null;
    return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function loadTupleSendParameters(source: TupleReader) {
    let _bounce = source.readBoolean();
    let _to = source.readAddress();
    let _value = source.readBigNumber();
    let _mode = source.readBigNumber();
    let _body = source.readCellOpt();
    let _code = source.readCellOpt();
    let _data = source.readCellOpt();
    return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function storeTupleSendParameters(source: SendParameters) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.bounce);
    builder.writeAddress(source.to);
    builder.writeNumber(source.value);
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

function dictValueParserSendParameters(): DictionaryValue<SendParameters> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeSendParameters(src)).endCell());
        },
        parse: (src) => {
            return loadSendParameters(src.loadRef().beginParse());
        }
    }
}

export type PassScoreToRoundContract = {
    $$type: 'PassScoreToRoundContract';
    checked_address: Address;
    return_score: bigint;
}

export function storePassScoreToRoundContract(src: PassScoreToRoundContract) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3858595625, 32);
        b_0.storeAddress(src.checked_address);
        b_0.storeUint(src.return_score, 64);
    };
}

export function loadPassScoreToRoundContract(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3858595625) { throw Error('Invalid prefix'); }
    let _checked_address = sc_0.loadAddress();
    let _return_score = sc_0.loadUintBig(64);
    return { $$type: 'PassScoreToRoundContract' as const, checked_address: _checked_address, return_score: _return_score };
}

function loadTuplePassScoreToRoundContract(source: TupleReader) {
    let _checked_address = source.readAddress();
    let _return_score = source.readBigNumber();
    return { $$type: 'PassScoreToRoundContract' as const, checked_address: _checked_address, return_score: _return_score };
}

function storeTuplePassScoreToRoundContract(source: PassScoreToRoundContract) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.checked_address);
    builder.writeNumber(source.return_score);
    return builder.build();
}

function dictValueParserPassScoreToRoundContract(): DictionaryValue<PassScoreToRoundContract> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storePassScoreToRoundContract(src)).endCell());
        },
        parse: (src) => {
            return loadPassScoreToRoundContract(src.loadRef().beginParse());
        }
    }
}

export type StakingData = {
    $$type: 'StakingData';
    index: bigint;
    this_contract_jettonWallet: Address;
    total_score: bigint;
    parameter: bigint;
}

export function storeStakingData(src: StakingData) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(src.index, 64);
        b_0.storeAddress(src.this_contract_jettonWallet);
        b_0.storeCoins(src.total_score);
        b_0.storeUint(src.parameter, 16);
    };
}

export function loadStakingData(slice: Slice) {
    let sc_0 = slice;
    let _index = sc_0.loadUintBig(64);
    let _this_contract_jettonWallet = sc_0.loadAddress();
    let _total_score = sc_0.loadCoins();
    let _parameter = sc_0.loadUintBig(16);
    return { $$type: 'StakingData' as const, index: _index, this_contract_jettonWallet: _this_contract_jettonWallet, total_score: _total_score, parameter: _parameter };
}

function loadTupleStakingData(source: TupleReader) {
    let _index = source.readBigNumber();
    let _this_contract_jettonWallet = source.readAddress();
    let _total_score = source.readBigNumber();
    let _parameter = source.readBigNumber();
    return { $$type: 'StakingData' as const, index: _index, this_contract_jettonWallet: _this_contract_jettonWallet, total_score: _total_score, parameter: _parameter };
}

function storeTupleStakingData(source: StakingData) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.index);
    builder.writeAddress(source.this_contract_jettonWallet);
    builder.writeNumber(source.total_score);
    builder.writeNumber(source.parameter);
    return builder.build();
}

function dictValueParserStakingData(): DictionaryValue<StakingData> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeStakingData(src)).endCell());
        },
        parse: (src) => {
            return loadStakingData(src.loadRef().beginParse());
        }
    }
}

export type StakeRecord = {
    $$type: 'StakeRecord';
    stake_address: Address;
    jettonStakeAmount: bigint;
    score: bigint;
}

export function storeStakeRecord(src: StakeRecord) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.stake_address);
        b_0.storeCoins(src.jettonStakeAmount);
        b_0.storeUint(src.score, 128);
    };
}

export function loadStakeRecord(slice: Slice) {
    let sc_0 = slice;
    let _stake_address = sc_0.loadAddress();
    let _jettonStakeAmount = sc_0.loadCoins();
    let _score = sc_0.loadUintBig(128);
    return { $$type: 'StakeRecord' as const, stake_address: _stake_address, jettonStakeAmount: _jettonStakeAmount, score: _score };
}

function loadTupleStakeRecord(source: TupleReader) {
    let _stake_address = source.readAddress();
    let _jettonStakeAmount = source.readBigNumber();
    let _score = source.readBigNumber();
    return { $$type: 'StakeRecord' as const, stake_address: _stake_address, jettonStakeAmount: _jettonStakeAmount, score: _score };
}

function storeTupleStakeRecord(source: StakeRecord) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.stake_address);
    builder.writeNumber(source.jettonStakeAmount);
    builder.writeNumber(source.score);
    return builder.build();
}

function dictValueParserStakeRecord(): DictionaryValue<StakeRecord> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeStakeRecord(src)).endCell());
        },
        parse: (src) => {
            return loadStakeRecord(src.loadRef().beginParse());
        }
    }
}

export type TransferEvent = {
    $$type: 'TransferEvent';
    sender_address: Address;
    jetton_amount: bigint;
    score: bigint;
}

export function storeTransferEvent(src: TransferEvent) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1382804827, 32);
        b_0.storeAddress(src.sender_address);
        b_0.storeCoins(src.jetton_amount);
        b_0.storeUint(src.score, 128);
    };
}

export function loadTransferEvent(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1382804827) { throw Error('Invalid prefix'); }
    let _sender_address = sc_0.loadAddress();
    let _jetton_amount = sc_0.loadCoins();
    let _score = sc_0.loadUintBig(128);
    return { $$type: 'TransferEvent' as const, sender_address: _sender_address, jetton_amount: _jetton_amount, score: _score };
}

function loadTupleTransferEvent(source: TupleReader) {
    let _sender_address = source.readAddress();
    let _jetton_amount = source.readBigNumber();
    let _score = source.readBigNumber();
    return { $$type: 'TransferEvent' as const, sender_address: _sender_address, jetton_amount: _jetton_amount, score: _score };
}

function storeTupleTransferEvent(source: TransferEvent) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.sender_address);
    builder.writeNumber(source.jetton_amount);
    builder.writeNumber(source.score);
    return builder.build();
}

function dictValueParserTransferEvent(): DictionaryValue<TransferEvent> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeTransferEvent(src)).endCell());
        },
        parse: (src) => {
            return loadTransferEvent(src.loadRef().beginParse());
        }
    }
}

export type AddingJettonAddress = {
    $$type: 'AddingJettonAddress';
    this_contract_jettonWallet: Address;
}

export function storeAddingJettonAddress(src: AddingJettonAddress) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(36111069, 32);
        b_0.storeAddress(src.this_contract_jettonWallet);
    };
}

export function loadAddingJettonAddress(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 36111069) { throw Error('Invalid prefix'); }
    let _this_contract_jettonWallet = sc_0.loadAddress();
    return { $$type: 'AddingJettonAddress' as const, this_contract_jettonWallet: _this_contract_jettonWallet };
}

function loadTupleAddingJettonAddress(source: TupleReader) {
    let _this_contract_jettonWallet = source.readAddress();
    return { $$type: 'AddingJettonAddress' as const, this_contract_jettonWallet: _this_contract_jettonWallet };
}

function storeTupleAddingJettonAddress(source: AddingJettonAddress) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.this_contract_jettonWallet);
    return builder.build();
}

function dictValueParserAddingJettonAddress(): DictionaryValue<AddingJettonAddress> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeAddingJettonAddress(src)).endCell());
        },
        parse: (src) => {
            return loadAddingJettonAddress(src.loadRef().beginParse());
        }
    }
}

export type Unstake = {
    $$type: 'Unstake';
    index_id: bigint;
}

export function storeUnstake(src: Unstake) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2232775567, 32);
        b_0.storeUint(src.index_id, 32);
    };
}

export function loadUnstake(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2232775567) { throw Error('Invalid prefix'); }
    let _index_id = sc_0.loadUintBig(32);
    return { $$type: 'Unstake' as const, index_id: _index_id };
}

function loadTupleUnstake(source: TupleReader) {
    let _index_id = source.readBigNumber();
    return { $$type: 'Unstake' as const, index_id: _index_id };
}

function storeTupleUnstake(source: Unstake) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.index_id);
    return builder.build();
}

function dictValueParserUnstake(): DictionaryValue<Unstake> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeUnstake(src)).endCell());
        },
        parse: (src) => {
            return loadUnstake(src.loadRef().beginParse());
        }
    }
}

export type Redeem = {
    $$type: 'Redeem';
    queryId: bigint;
    project_id: bigint;
}

export function storeRedeem(src: Redeem) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1250976136, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeUint(src.project_id, 16);
    };
}

export function loadRedeem(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1250976136) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _project_id = sc_0.loadUintBig(16);
    return { $$type: 'Redeem' as const, queryId: _queryId, project_id: _project_id };
}

function loadTupleRedeem(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _project_id = source.readBigNumber();
    return { $$type: 'Redeem' as const, queryId: _queryId, project_id: _project_id };
}

function storeTupleRedeem(source: Redeem) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.project_id);
    return builder.build();
}

function dictValueParserRedeem(): DictionaryValue<Redeem> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeRedeem(src)).endCell());
        },
        parse: (src) => {
            return loadRedeem(src.loadRef().beginParse());
        }
    }
}

export type GetWeighted = {
    $$type: 'GetWeighted';
    applied_user_address: Address;
}

export function storeGetWeighted(src: GetWeighted) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(323774586, 32);
        b_0.storeAddress(src.applied_user_address);
    };
}

export function loadGetWeighted(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 323774586) { throw Error('Invalid prefix'); }
    let _applied_user_address = sc_0.loadAddress();
    return { $$type: 'GetWeighted' as const, applied_user_address: _applied_user_address };
}

function loadTupleGetWeighted(source: TupleReader) {
    let _applied_user_address = source.readAddress();
    return { $$type: 'GetWeighted' as const, applied_user_address: _applied_user_address };
}

function storeTupleGetWeighted(source: GetWeighted) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.applied_user_address);
    return builder.build();
}

function dictValueParserGetWeighted(): DictionaryValue<GetWeighted> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeGetWeighted(src)).endCell());
        },
        parse: (src) => {
            return loadGetWeighted(src.loadRef().beginParse());
        }
    }
}

export type Mint = {
    $$type: 'Mint';
    amount: bigint;
    receiver: Address;
}

export function storeMint(src: Mint) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(4235234258, 32);
        b_0.storeInt(src.amount, 257);
        b_0.storeAddress(src.receiver);
    };
}

export function loadMint(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 4235234258) { throw Error('Invalid prefix'); }
    let _amount = sc_0.loadIntBig(257);
    let _receiver = sc_0.loadAddress();
    return { $$type: 'Mint' as const, amount: _amount, receiver: _receiver };
}

function loadTupleMint(source: TupleReader) {
    let _amount = source.readBigNumber();
    let _receiver = source.readAddress();
    return { $$type: 'Mint' as const, amount: _amount, receiver: _receiver };
}

function storeTupleMint(source: Mint) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.amount);
    builder.writeAddress(source.receiver);
    return builder.build();
}

function dictValueParserMint(): DictionaryValue<Mint> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeMint(src)).endCell());
        },
        parse: (src) => {
            return loadMint(src.loadRef().beginParse());
        }
    }
}

export type JettonData = {
    $$type: 'JettonData';
    total_supply: bigint;
    mintable: boolean;
    owner: Address;
    content: Cell;
    wallet_code: Cell;
}

export function storeJettonData(src: JettonData) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeInt(src.total_supply, 257);
        b_0.storeBit(src.mintable);
        b_0.storeAddress(src.owner);
        b_0.storeRef(src.content);
        b_0.storeRef(src.wallet_code);
    };
}

export function loadJettonData(slice: Slice) {
    let sc_0 = slice;
    let _total_supply = sc_0.loadIntBig(257);
    let _mintable = sc_0.loadBit();
    let _owner = sc_0.loadAddress();
    let _content = sc_0.loadRef();
    let _wallet_code = sc_0.loadRef();
    return { $$type: 'JettonData' as const, total_supply: _total_supply, mintable: _mintable, owner: _owner, content: _content, wallet_code: _wallet_code };
}

function loadTupleJettonData(source: TupleReader) {
    let _total_supply = source.readBigNumber();
    let _mintable = source.readBoolean();
    let _owner = source.readAddress();
    let _content = source.readCell();
    let _wallet_code = source.readCell();
    return { $$type: 'JettonData' as const, total_supply: _total_supply, mintable: _mintable, owner: _owner, content: _content, wallet_code: _wallet_code };
}

function storeTupleJettonData(source: JettonData) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.total_supply);
    builder.writeBoolean(source.mintable);
    builder.writeAddress(source.owner);
    builder.writeCell(source.content);
    builder.writeCell(source.wallet_code);
    return builder.build();
}

function dictValueParserJettonData(): DictionaryValue<JettonData> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeJettonData(src)).endCell());
        },
        parse: (src) => {
            return loadJettonData(src.loadRef().beginParse());
        }
    }
}

export type JettonWalletData = {
    $$type: 'JettonWalletData';
    balance: bigint;
    owner: Address;
    master: Address;
    wallet_code: Cell;
}

export function storeJettonWalletData(src: JettonWalletData) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeInt(src.balance, 257);
        b_0.storeAddress(src.owner);
        b_0.storeAddress(src.master);
        b_0.storeRef(src.wallet_code);
    };
}

export function loadJettonWalletData(slice: Slice) {
    let sc_0 = slice;
    let _balance = sc_0.loadIntBig(257);
    let _owner = sc_0.loadAddress();
    let _master = sc_0.loadAddress();
    let _wallet_code = sc_0.loadRef();
    return { $$type: 'JettonWalletData' as const, balance: _balance, owner: _owner, master: _master, wallet_code: _wallet_code };
}

function loadTupleJettonWalletData(source: TupleReader) {
    let _balance = source.readBigNumber();
    let _owner = source.readAddress();
    let _master = source.readAddress();
    let _wallet_code = source.readCell();
    return { $$type: 'JettonWalletData' as const, balance: _balance, owner: _owner, master: _master, wallet_code: _wallet_code };
}

function storeTupleJettonWalletData(source: JettonWalletData) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.balance);
    builder.writeAddress(source.owner);
    builder.writeAddress(source.master);
    builder.writeCell(source.wallet_code);
    return builder.build();
}

function dictValueParserJettonWalletData(): DictionaryValue<JettonWalletData> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeJettonWalletData(src)).endCell());
        },
        parse: (src) => {
            return loadJettonWalletData(src.loadRef().beginParse());
        }
    }
}

export type TokenTransfer = {
    $$type: 'TokenTransfer';
    query_id: bigint;
    amount: bigint;
    destination: Address;
    response_destination: Address;
    custom_payload: Cell | null;
    forward_ton_amount: bigint;
    forward_payload: Cell;
}

export function storeTokenTransfer(src: TokenTransfer) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(260734629, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.destination);
        b_0.storeAddress(src.response_destination);
        if (src.custom_payload !== null && src.custom_payload !== undefined) { b_0.storeBit(true).storeRef(src.custom_payload); } else { b_0.storeBit(false); }
        b_0.storeCoins(src.forward_ton_amount);
        b_0.storeBuilder(src.forward_payload.asBuilder());
    };
}

export function loadTokenTransfer(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 260734629) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    let _amount = sc_0.loadCoins();
    let _destination = sc_0.loadAddress();
    let _response_destination = sc_0.loadAddress();
    let _custom_payload = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _forward_ton_amount = sc_0.loadCoins();
    let _forward_payload = sc_0.asCell();
    return { $$type: 'TokenTransfer' as const, query_id: _query_id, amount: _amount, destination: _destination, response_destination: _response_destination, custom_payload: _custom_payload, forward_ton_amount: _forward_ton_amount, forward_payload: _forward_payload };
}

function loadTupleTokenTransfer(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _destination = source.readAddress();
    let _response_destination = source.readAddress();
    let _custom_payload = source.readCellOpt();
    let _forward_ton_amount = source.readBigNumber();
    let _forward_payload = source.readCell();
    return { $$type: 'TokenTransfer' as const, query_id: _query_id, amount: _amount, destination: _destination, response_destination: _response_destination, custom_payload: _custom_payload, forward_ton_amount: _forward_ton_amount, forward_payload: _forward_payload };
}

function storeTupleTokenTransfer(source: TokenTransfer) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.destination);
    builder.writeAddress(source.response_destination);
    builder.writeCell(source.custom_payload);
    builder.writeNumber(source.forward_ton_amount);
    builder.writeSlice(source.forward_payload);
    return builder.build();
}

function dictValueParserTokenTransfer(): DictionaryValue<TokenTransfer> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeTokenTransfer(src)).endCell());
        },
        parse: (src) => {
            return loadTokenTransfer(src.loadRef().beginParse());
        }
    }
}

export type TokenTransferInternal = {
    $$type: 'TokenTransferInternal';
    query_id: bigint;
    amount: bigint;
    from: Address;
    response_destination: Address;
    forward_ton_amount: bigint;
    forward_payload: Cell;
}

export function storeTokenTransferInternal(src: TokenTransferInternal) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(395134233, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.from);
        b_0.storeAddress(src.response_destination);
        b_0.storeCoins(src.forward_ton_amount);
        b_0.storeBuilder(src.forward_payload.asBuilder());
    };
}

export function loadTokenTransferInternal(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 395134233) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    let _amount = sc_0.loadCoins();
    let _from = sc_0.loadAddress();
    let _response_destination = sc_0.loadAddress();
    let _forward_ton_amount = sc_0.loadCoins();
    let _forward_payload = sc_0.asCell();
    return { $$type: 'TokenTransferInternal' as const, query_id: _query_id, amount: _amount, from: _from, response_destination: _response_destination, forward_ton_amount: _forward_ton_amount, forward_payload: _forward_payload };
}

function loadTupleTokenTransferInternal(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _from = source.readAddress();
    let _response_destination = source.readAddress();
    let _forward_ton_amount = source.readBigNumber();
    let _forward_payload = source.readCell();
    return { $$type: 'TokenTransferInternal' as const, query_id: _query_id, amount: _amount, from: _from, response_destination: _response_destination, forward_ton_amount: _forward_ton_amount, forward_payload: _forward_payload };
}

function storeTupleTokenTransferInternal(source: TokenTransferInternal) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.from);
    builder.writeAddress(source.response_destination);
    builder.writeNumber(source.forward_ton_amount);
    builder.writeSlice(source.forward_payload);
    return builder.build();
}

function dictValueParserTokenTransferInternal(): DictionaryValue<TokenTransferInternal> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeTokenTransferInternal(src)).endCell());
        },
        parse: (src) => {
            return loadTokenTransferInternal(src.loadRef().beginParse());
        }
    }
}

export type TokenNotification = {
    $$type: 'TokenNotification';
    query_id: bigint;
    amount: bigint;
    from: Address;
    forward_payload: Cell;
}

export function storeTokenNotification(src: TokenNotification) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1935855772, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.from);
        b_0.storeBuilder(src.forward_payload.asBuilder());
    };
}

export function loadTokenNotification(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1935855772) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    let _amount = sc_0.loadCoins();
    let _from = sc_0.loadAddress();
    let _forward_payload = sc_0.asCell();
    return { $$type: 'TokenNotification' as const, query_id: _query_id, amount: _amount, from: _from, forward_payload: _forward_payload };
}

function loadTupleTokenNotification(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _from = source.readAddress();
    let _forward_payload = source.readCell();
    return { $$type: 'TokenNotification' as const, query_id: _query_id, amount: _amount, from: _from, forward_payload: _forward_payload };
}

function storeTupleTokenNotification(source: TokenNotification) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.from);
    builder.writeSlice(source.forward_payload);
    return builder.build();
}

function dictValueParserTokenNotification(): DictionaryValue<TokenNotification> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeTokenNotification(src)).endCell());
        },
        parse: (src) => {
            return loadTokenNotification(src.loadRef().beginParse());
        }
    }
}

export type TokenBurn = {
    $$type: 'TokenBurn';
    query_id: bigint;
    amount: bigint;
    response_destination: Address;
    custom_payload: Cell | null;
}

export function storeTokenBurn(src: TokenBurn) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1499400124, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.response_destination);
        if (src.custom_payload !== null && src.custom_payload !== undefined) { b_0.storeBit(true).storeRef(src.custom_payload); } else { b_0.storeBit(false); }
    };
}

export function loadTokenBurn(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1499400124) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    let _amount = sc_0.loadCoins();
    let _response_destination = sc_0.loadAddress();
    let _custom_payload = sc_0.loadBit() ? sc_0.loadRef() : null;
    return { $$type: 'TokenBurn' as const, query_id: _query_id, amount: _amount, response_destination: _response_destination, custom_payload: _custom_payload };
}

function loadTupleTokenBurn(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _response_destination = source.readAddress();
    let _custom_payload = source.readCellOpt();
    return { $$type: 'TokenBurn' as const, query_id: _query_id, amount: _amount, response_destination: _response_destination, custom_payload: _custom_payload };
}

function storeTupleTokenBurn(source: TokenBurn) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.response_destination);
    builder.writeCell(source.custom_payload);
    return builder.build();
}

function dictValueParserTokenBurn(): DictionaryValue<TokenBurn> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeTokenBurn(src)).endCell());
        },
        parse: (src) => {
            return loadTokenBurn(src.loadRef().beginParse());
        }
    }
}

export type TokenBurnNotification = {
    $$type: 'TokenBurnNotification';
    query_id: bigint;
    amount: bigint;
    response_destination: Address;
}

export function storeTokenBurnNotification(src: TokenBurnNotification) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2078119902, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.response_destination);
    };
}

export function loadTokenBurnNotification(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2078119902) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    let _amount = sc_0.loadCoins();
    let _response_destination = sc_0.loadAddress();
    return { $$type: 'TokenBurnNotification' as const, query_id: _query_id, amount: _amount, response_destination: _response_destination };
}

function loadTupleTokenBurnNotification(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _response_destination = source.readAddress();
    return { $$type: 'TokenBurnNotification' as const, query_id: _query_id, amount: _amount, response_destination: _response_destination };
}

function storeTupleTokenBurnNotification(source: TokenBurnNotification) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.response_destination);
    return builder.build();
}

function dictValueParserTokenBurnNotification(): DictionaryValue<TokenBurnNotification> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeTokenBurnNotification(src)).endCell());
        },
        parse: (src) => {
            return loadTokenBurnNotification(src.loadRef().beginParse());
        }
    }
}

export type TokenExcesses = {
    $$type: 'TokenExcesses';
    query_id: bigint;
}

export function storeTokenExcesses(src: TokenExcesses) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3576854235, 32);
        b_0.storeUint(src.query_id, 64);
    };
}

export function loadTokenExcesses(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3576854235) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    return { $$type: 'TokenExcesses' as const, query_id: _query_id };
}

function loadTupleTokenExcesses(source: TupleReader) {
    let _query_id = source.readBigNumber();
    return { $$type: 'TokenExcesses' as const, query_id: _query_id };
}

function storeTupleTokenExcesses(source: TokenExcesses) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    return builder.build();
}

function dictValueParserTokenExcesses(): DictionaryValue<TokenExcesses> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeTokenExcesses(src)).endCell());
        },
        parse: (src) => {
            return loadTokenExcesses(src.loadRef().beginParse());
        }
    }
}

export type TokenUpdateContent = {
    $$type: 'TokenUpdateContent';
    content: Cell;
}

export function storeTokenUpdateContent(src: TokenUpdateContent) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2937889386, 32);
        b_0.storeRef(src.content);
    };
}

export function loadTokenUpdateContent(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2937889386) { throw Error('Invalid prefix'); }
    let _content = sc_0.loadRef();
    return { $$type: 'TokenUpdateContent' as const, content: _content };
}

function loadTupleTokenUpdateContent(source: TupleReader) {
    let _content = source.readCell();
    return { $$type: 'TokenUpdateContent' as const, content: _content };
}

function storeTupleTokenUpdateContent(source: TokenUpdateContent) {
    let builder = new TupleBuilder();
    builder.writeCell(source.content);
    return builder.build();
}

function dictValueParserTokenUpdateContent(): DictionaryValue<TokenUpdateContent> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeTokenUpdateContent(src)).endCell());
        },
        parse: (src) => {
            return loadTokenUpdateContent(src.loadRef().beginParse());
        }
    }
}

export type ProvideWalletAddress = {
    $$type: 'ProvideWalletAddress';
    query_id: bigint;
    owner_address: Address;
    include_address: boolean;
}

export function storeProvideWalletAddress(src: ProvideWalletAddress) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(745978227, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeAddress(src.owner_address);
        b_0.storeBit(src.include_address);
    };
}

export function loadProvideWalletAddress(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 745978227) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    let _owner_address = sc_0.loadAddress();
    let _include_address = sc_0.loadBit();
    return { $$type: 'ProvideWalletAddress' as const, query_id: _query_id, owner_address: _owner_address, include_address: _include_address };
}

function loadTupleProvideWalletAddress(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _owner_address = source.readAddress();
    let _include_address = source.readBoolean();
    return { $$type: 'ProvideWalletAddress' as const, query_id: _query_id, owner_address: _owner_address, include_address: _include_address };
}

function storeTupleProvideWalletAddress(source: ProvideWalletAddress) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeAddress(source.owner_address);
    builder.writeBoolean(source.include_address);
    return builder.build();
}

function dictValueParserProvideWalletAddress(): DictionaryValue<ProvideWalletAddress> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeProvideWalletAddress(src)).endCell());
        },
        parse: (src) => {
            return loadProvideWalletAddress(src.loadRef().beginParse());
        }
    }
}

export type TakeWalletAddress = {
    $$type: 'TakeWalletAddress';
    query_id: bigint;
    wallet_address: Address;
    owner_address: Address | null;
}

export function storeTakeWalletAddress(src: TakeWalletAddress) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3513996288, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeAddress(src.wallet_address);
        b_0.storeAddress(src.owner_address);
    };
}

export function loadTakeWalletAddress(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3513996288) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    let _wallet_address = sc_0.loadAddress();
    let _owner_address = sc_0.loadMaybeAddress();
    return { $$type: 'TakeWalletAddress' as const, query_id: _query_id, wallet_address: _wallet_address, owner_address: _owner_address };
}

function loadTupleTakeWalletAddress(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _wallet_address = source.readAddress();
    let _owner_address = source.readAddressOpt();
    return { $$type: 'TakeWalletAddress' as const, query_id: _query_id, wallet_address: _wallet_address, owner_address: _owner_address };
}

function storeTupleTakeWalletAddress(source: TakeWalletAddress) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeAddress(source.wallet_address);
    builder.writeAddress(source.owner_address);
    return builder.build();
}

function dictValueParserTakeWalletAddress(): DictionaryValue<TakeWalletAddress> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeTakeWalletAddress(src)).endCell());
        },
        parse: (src) => {
            return loadTakeWalletAddress(src.loadRef().beginParse());
        }
    }
}

export type ChangeOwner = {
    $$type: 'ChangeOwner';
    queryId: bigint;
    newOwner: Address;
}

export function storeChangeOwner(src: ChangeOwner) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2174598809, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.newOwner);
    };
}

export function loadChangeOwner(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2174598809) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _newOwner = sc_0.loadAddress();
    return { $$type: 'ChangeOwner' as const, queryId: _queryId, newOwner: _newOwner };
}

function loadTupleChangeOwner(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _newOwner = source.readAddress();
    return { $$type: 'ChangeOwner' as const, queryId: _queryId, newOwner: _newOwner };
}

function storeTupleChangeOwner(source: ChangeOwner) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.newOwner);
    return builder.build();
}

function dictValueParserChangeOwner(): DictionaryValue<ChangeOwner> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeChangeOwner(src)).endCell());
        },
        parse: (src) => {
            return loadChangeOwner(src.loadRef().beginParse());
        }
    }
}

export type ChangeOwnerOk = {
    $$type: 'ChangeOwnerOk';
    queryId: bigint;
    newOwner: Address;
}

export function storeChangeOwnerOk(src: ChangeOwnerOk) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(846932810, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.newOwner);
    };
}

export function loadChangeOwnerOk(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 846932810) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _newOwner = sc_0.loadAddress();
    return { $$type: 'ChangeOwnerOk' as const, queryId: _queryId, newOwner: _newOwner };
}

function loadTupleChangeOwnerOk(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _newOwner = source.readAddress();
    return { $$type: 'ChangeOwnerOk' as const, queryId: _queryId, newOwner: _newOwner };
}

function storeTupleChangeOwnerOk(source: ChangeOwnerOk) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.newOwner);
    return builder.build();
}

function dictValueParserChangeOwnerOk(): DictionaryValue<ChangeOwnerOk> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeChangeOwnerOk(src)).endCell());
        },
        parse: (src) => {
            return loadChangeOwnerOk(src.loadRef().beginParse());
        }
    }
}

 type StakingContract_init_args = {
    $$type: 'StakingContract_init_args';
    _owner: Address;
    _parameter: bigint;
}

function initStakingContract_init_args(src: StakingContract_init_args) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeAddress(src._owner);
        b_0.storeInt(src._parameter, 257);
    };
}

async function StakingContract_init(_owner: Address, _parameter: bigint) {
    const __code = Cell.fromBase64('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');
    const __system = Cell.fromBase64('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');
    let builder = beginCell();
    builder.storeRef(__system);
    builder.storeUint(0, 1);
    initStakingContract_init_args({ $$type: 'StakingContract_init_args', _owner, _parameter })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}

const StakingContract_errors: { [key: number]: { message: string } } = {
    2: { message: `Stack undeflow` },
    3: { message: `Stack overflow` },
    4: { message: `Integer overflow` },
    5: { message: `Integer out of expected range` },
    6: { message: `Invalid opcode` },
    7: { message: `Type check error` },
    8: { message: `Cell overflow` },
    9: { message: `Cell underflow` },
    10: { message: `Dictionary error` },
    13: { message: `Out of gas error` },
    32: { message: `Method ID not found` },
    34: { message: `Action is invalid or not supported` },
    37: { message: `Not enough TON` },
    38: { message: `Not enough extra-currencies` },
    128: { message: `Null reference exception` },
    129: { message: `Invalid serialization prefix` },
    130: { message: `Invalid incoming message` },
    131: { message: `Constraints error` },
    132: { message: `Access denied` },
    133: { message: `Contract stopped` },
    134: { message: `Invalid argument` },
    135: { message: `Code of a contract was not found` },
    136: { message: `Invalid address` },
    137: { message: `Masterchain support is not enabled for this contract` },
    3688: { message: `Not mintable` },
    4159: { message: `Invalid value!!` },
    4429: { message: `Invalid sender` },
    6582: { message: `no Record` },
    7013: { message: `don't have value` },
    12241: { message: `Max supply exceeded` },
    14534: { message: `Not owner` },
    17054: { message: `not from one of any jetton wallet` },
    18668: { message: `Can't Mint Anymore` },
    23951: { message: `Insufficient gas` },
    42708: { message: `Invalid sender!` },
    43422: { message: `Invalid value - Burn` },
    57218: { message: `not enough value` },
    57660: { message: `not in the list` },
    62972: { message: `Invalid balance` },
}

const StakingContract_types: ABIType[] = [
    {"name":"StateInit","header":null,"fields":[{"name":"code","type":{"kind":"simple","type":"cell","optional":false}},{"name":"data","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"Context","header":null,"fields":[{"name":"bounced","type":{"kind":"simple","type":"bool","optional":false}},{"name":"sender","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"raw","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"SendParameters","header":null,"fields":[{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"code","type":{"kind":"simple","type":"cell","optional":true}},{"name":"data","type":{"kind":"simple","type":"cell","optional":true}}]},
    {"name":"PassScoreToRoundContract","header":3858595625,"fields":[{"name":"checked_address","type":{"kind":"simple","type":"address","optional":false}},{"name":"return_score","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"StakingData","header":null,"fields":[{"name":"index","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"this_contract_jettonWallet","type":{"kind":"simple","type":"address","optional":false}},{"name":"total_score","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"parameter","type":{"kind":"simple","type":"uint","optional":false,"format":16}}]},
    {"name":"StakeRecord","header":null,"fields":[{"name":"stake_address","type":{"kind":"simple","type":"address","optional":false}},{"name":"jettonStakeAmount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"score","type":{"kind":"simple","type":"uint","optional":false,"format":128}}]},
    {"name":"TransferEvent","header":1382804827,"fields":[{"name":"sender_address","type":{"kind":"simple","type":"address","optional":false}},{"name":"jetton_amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"score","type":{"kind":"simple","type":"uint","optional":false,"format":128}}]},
    {"name":"AddingJettonAddress","header":36111069,"fields":[{"name":"this_contract_jettonWallet","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"Unstake","header":2232775567,"fields":[{"name":"index_id","type":{"kind":"simple","type":"uint","optional":false,"format":32}}]},
    {"name":"Redeem","header":1250976136,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"project_id","type":{"kind":"simple","type":"uint","optional":false,"format":16}}]},
    {"name":"GetWeighted","header":323774586,"fields":[{"name":"applied_user_address","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"Mint","header":4235234258,"fields":[{"name":"amount","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"receiver","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"JettonData","header":null,"fields":[{"name":"total_supply","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"mintable","type":{"kind":"simple","type":"bool","optional":false}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"content","type":{"kind":"simple","type":"cell","optional":false}},{"name":"wallet_code","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"JettonWalletData","header":null,"fields":[{"name":"balance","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"master","type":{"kind":"simple","type":"address","optional":false}},{"name":"wallet_code","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"TokenTransfer","header":260734629,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"destination","type":{"kind":"simple","type":"address","optional":false}},{"name":"response_destination","type":{"kind":"simple","type":"address","optional":false}},{"name":"custom_payload","type":{"kind":"simple","type":"cell","optional":true}},{"name":"forward_ton_amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"forward_payload","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"TokenTransferInternal","header":395134233,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"from","type":{"kind":"simple","type":"address","optional":false}},{"name":"response_destination","type":{"kind":"simple","type":"address","optional":false}},{"name":"forward_ton_amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"forward_payload","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"TokenNotification","header":1935855772,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"from","type":{"kind":"simple","type":"address","optional":false}},{"name":"forward_payload","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"TokenBurn","header":1499400124,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"response_destination","type":{"kind":"simple","type":"address","optional":false}},{"name":"custom_payload","type":{"kind":"simple","type":"cell","optional":true}}]},
    {"name":"TokenBurnNotification","header":2078119902,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"response_destination","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"TokenExcesses","header":3576854235,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"TokenUpdateContent","header":2937889386,"fields":[{"name":"content","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"ProvideWalletAddress","header":745978227,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"owner_address","type":{"kind":"simple","type":"address","optional":false}},{"name":"include_address","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"TakeWalletAddress","header":3513996288,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"wallet_address","type":{"kind":"simple","type":"address","optional":false}},{"name":"owner_address","type":{"kind":"simple","type":"address","optional":true}}]},
    {"name":"ChangeOwner","header":2174598809,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"newOwner","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"ChangeOwnerOk","header":846932810,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"newOwner","type":{"kind":"simple","type":"address","optional":false}}]},
]

const StakingContract_getters: ABIGetter[] = [
    {"name":"get_user_stake_record","arguments":[],"returnType":{"kind":"dict","key":"int","value":"StakeRecord","valueFormat":"ref"}},
    {"name":"get_user_stake_amount","arguments":[],"returnType":{"kind":"dict","key":"address","value":"int"}},
    {"name":"get_return_staking_data","arguments":[],"returnType":{"kind":"simple","type":"StakingData","optional":false}},
]

const StakingContract_receivers: ABIReceiver[] = [
    {"receiver":"internal","message":{"kind":"typed","type":"TokenNotification"}},
    {"receiver":"internal","message":{"kind":"typed","type":"GetWeighted"}},
    {"receiver":"internal","message":{"kind":"typed","type":"Unstake"}},
    {"receiver":"internal","message":{"kind":"empty"}},
]

export class StakingContract implements Contract {
    
    static async init(_owner: Address, _parameter: bigint) {
        return await StakingContract_init(_owner, _parameter);
    }
    
    static async fromInit(_owner: Address, _parameter: bigint) {
        const init = await StakingContract_init(_owner, _parameter);
        const address = contractAddress(0, init);
        return new StakingContract(address, init);
    }
    
    static fromAddress(address: Address) {
        return new StakingContract(address);
    }
    
    readonly address: Address; 
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        types:  StakingContract_types,
        getters: StakingContract_getters,
        receivers: StakingContract_receivers,
        errors: StakingContract_errors,
    };
    
    private constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: TokenNotification | GetWeighted | Unstake | null) {
        
        let body: Cell | null = null;
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'TokenNotification') {
            body = beginCell().store(storeTokenNotification(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'GetWeighted') {
            body = beginCell().store(storeGetWeighted(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Unstake') {
            body = beginCell().store(storeUnstake(message)).endCell();
        }
        if (message === null) {
            body = new Cell();
        }
        if (body === null) { throw new Error('Invalid message type'); }
        
        await provider.internal(via, { ...args, body: body });
        
    }
    
    async getGetUserStakeRecord(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('get_user_stake_record', builder.build())).stack;
        let result = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserStakeRecord(), source.readCellOpt());
        return result;
    }
    
    async getGetUserStakeAmount(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('get_user_stake_amount', builder.build())).stack;
        let result = Dictionary.loadDirect(Dictionary.Keys.Address(), Dictionary.Values.BigInt(257), source.readCellOpt());
        return result;
    }
    
    async getGetReturnStakingData(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('get_return_staking_data', builder.build())).stack;
        const result = loadTupleStakingData(source);
        return result;
    }
    
}