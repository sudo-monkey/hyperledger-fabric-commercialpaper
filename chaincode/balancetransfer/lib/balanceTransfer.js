'use strict';

const { Contract } = require ('fabric-contract-api');
const accountObjType = "Account";

class BalanceTransfer extends Contract {
    //init ledger
    async initAccount(ctx, id, balance) {
        const accountBalance = parseFloat(balance);
    
        if (accountBalance < 0) {
            throw new Error(`account balance cannot be negative`);
        }
        const account = {
            id: id, 
            owner: this._getTxCreatorUID(ctx),
            balance: accountBalance
        }
        if (await this._accountExists(ctx, account.id)) {
            throw new Error(`the account ${account.id} already exists`);
        }
        await this._putAccount(ctx, account);
    }

    //set balance
    async setBalance(ctx, id, balance) {
        const accountBalance = parseFloat(balance);
        const account = {
            id: id, 
            owner: this._getTxCreatorUID(ctx),
            balance: accountBalance
        }

        if (await this._accountExists(ctx, account.id, account.balance)) {
            await this._putAccount(ctx, account);
        } else {
            throw new Error('Account ' + account.id + ' does not exists')
        }
        return ('Success: Balance for ' + account.id + ' updated successfully. New balance is: ' + '$' + account.balance);
    }

    // transfer amount / balance
    async transferBalance(ctx, id, idTo, amount) {
        const accountBalance = parseFloat(amount);
        const account = {
            id: id, 
            owner: this._getTxCreatorUID(ctx),
            balance: accountBalance
        }
        
        if (await this._accountExists(ctx, account.id)){
            const accountBalance = parseFloat(amount);
            const account = {
                id: id, 
                owner: this._getTxCreatorUID(ctx),
                balance: accountBalance + amount
            }
            done = false;
            if (await this._putAccount(ctx, account)){
                var done = true;
            }
            } else {
                throw new Error('Account ' + account.id + ' does not exists')
            }
            if (done == true){
                const accountBalance = parseFloat(amount);
                const account = {
                    id: idTo, 
                    owner: this._getTxCreatorUID(ctx),
                    balance: accountBalance - amount
                }
                await this._putAccount(ctx, account)
            } else {
                throw new Error('Account ' + account.id + ' does not exists')
            }
            return "Amount has been transferred successfully."
        }
    

    // get account
    async listAccounts (ctx, id) {
        return this._getAccount(ctx, id)
    }

    //################
    //helper functions
    async _accountExists(ctx, id) {
        const compositeKey = ctx.stub.createCompositeKey(accountObjType,[id]);
        const accountBytes = await ctx.stub.getState(compositeKey);
        return accountBytes && accountBytes.length > 0;
    }
    async _getAccount(ctx, id) {
        const compositeKey = ctx.stub.createCompositeKey(accountObjType, [id]);
        const accountBytes = await ctx.stub.getState(compositeKey);
        return JSON.parse(accountBytes.toString());
    }
    async _putAccount(ctx, account) {
        const compositeKey = ctx.stub.createCompositeKey(accountObjType,
        [account.id]);
    await ctx.stub.putState(compositeKey, Buffer.from(JSON.stringify(account)));
    }

    _getTxCreatorUID(ctx) {
        return JSON.stringify({
        mspid: ctx.clientIdentity.getMSPID(),
        id: ctx.clientIdentity.getID()
        });
    
    }

}


module.exports = BalanceTransfer;




