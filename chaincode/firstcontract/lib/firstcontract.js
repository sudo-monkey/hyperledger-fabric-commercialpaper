'use strict';

const { Contract } = require('fabric-contract-api');

class FirstContract extends Contract {
    //initLedger
    async initLedger(ctx) {
        await ctx.stub.putState("test", "data init successfully")
        return "success"
    }

    async writeData(ctx, key, value){
        await ctx.stub.putState(key,value)
        return value;
    }

    async readData(ctx, key){
        var response = await ctx.stub.getState(key)
        return response.toString()
    }
} 

module.exports = FirstContract;