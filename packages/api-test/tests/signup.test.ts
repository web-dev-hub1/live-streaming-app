import {sum}  from '../../../apps/http/src/routes/v1/index'

describe('signup test',()=>{
    test("adds 1+2 to equal 3",()=>{
        expect(sum(1,2)).toBe(3);
    })
})